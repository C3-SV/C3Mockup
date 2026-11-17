import {
  parseEventPage,
  validateEventPage,
  type AdminEventRecord,
  type EventPage,
} from "@c3/config";
import {
  EVENT_PAGE_SLUGS_COLLECTION,
  EVENTS_COLLECTION,
  UPSERT_BATCH_LIMIT,
  parseStoredAdminEvent,
  type EventStore,
  type EventStoreSnapshot,
  type SlugReservation,
} from "./event-page-repository";

/**
 * Migración revisable de ediciones existentes a fichas por edición (spec 2026-11-13, §9; ruling R28).
 *
 * - `planEventPageMigration` es PURO: recibe los eventos y las fichas aprobadas y devuelve el plan. No escribe, no
 *   lee Firestore y no deduce nada: una edición solo cambia si el responsable la aprobó con su id exacto.
 * - Todo conflicto (id desconocido o ambiguo, ficha ya existente distinta, slug que colisiona, ficha inválida)
 *   bloquea el lote completo: si hay un solo conflicto no se propone ningún cambio.
 * - Solo se añade `page`. El resto del documento queda idéntico (incluidos `updatedAt` y los campos que el modelo
 *   no conoce). La reserva del slug se crea en la misma transacción.
 * - `applyEventPageMigration` y `revertEventPageMigration` escriben, pero solo se alcanzan desde el script con
 *   `--apply` (aprobaciones y respaldo explícitos). Este módulo no importa el SDK de Firebase: recibe el adaptador
 *   mínimo `EventStore`, igual que el repositorio.
 */

export type ApprovedEventPage = { eventId: string; page: EventPage };

export type MigrationChange = { eventId: string; before: AdminEventRecord; after: AdminEventRecord };

export type MigrationPlan = { changes: MigrationChange[]; conflicts: string[] };

export type MigrationPlanOptions = {
  /** Instante ISO con el que se evalúan las reglas de publicación. El script siempre lo pasa. */
  now?: string;
  /** Reservas de slug existentes. `null` es una reserva con forma inválida (se trata como ocupada). */
  reservations?: Record<string, SlugReservation | null>;
  /** Eventos cuya ficha guardada no se pudo leer: nunca se sobrescriben. */
  unreadablePages?: readonly string[];
  /** Documentos de eventos que no se pudieron interpretar. */
  unreadableEvents?: readonly string[];
};

type Json = Record<string, unknown>;

const isRecord = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Igualdad profunda de datos JSON, sin importar el orden de las claves. */
export function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((entry, index) => sameValue(entry, b[index]));
  }
  if (isRecord(a) && isRecord(b)) {
    const keysA = Object.keys(a).filter((key) => a[key] !== undefined);
    const keysB = Object.keys(b).filter((key) => b[key] !== undefined);
    return keysA.length === keysB.length && keysA.every((key) => key in b && sameValue(a[key], b[key]));
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------
// Planificador puro
// ---------------------------------------------------------------------------------------------------------

export function planEventPageMigration(
  events: readonly AdminEventRecord[],
  approved: ReadonlyArray<ApprovedEventPage>,
  options: MigrationPlanOptions = {},
): MigrationPlan {
  const now = options.now ?? new Date().toISOString();
  const reservations = options.reservations ?? {};
  const unreadablePages = new Set(options.unreadablePages ?? []);
  const unreadableEvents = new Set(options.unreadableEvents ?? []);
  const conflicts: string[] = [];

  // Ids de evento: un id repetido en los datos reales es ambiguo y no se resuelve.
  const byId = new Map<string, AdminEventRecord>();
  const duplicatedIds = new Set<string>();
  for (const event of events) {
    if (byId.has(event.id)) {
      duplicatedIds.add(event.id);
    }
    byId.set(event.id, event);
  }

  const approvedCount = new Map<string, number>();
  for (const entry of approved) {
    approvedCount.set(entry.eventId, (approvedCount.get(entry.eventId) ?? 0) + 1);
  }

  type Candidate = { record: AdminEventRecord; page: EventPage };
  const candidates: Candidate[] = [];

  for (const entry of approved) {
    const { eventId } = entry;
    const record = byId.get(eventId);

    if ((approvedCount.get(eventId) ?? 0) > 1) {
      if (!conflicts.some((message) => message.startsWith(`«${eventId}»: aprobada más de una vez`))) {
        conflicts.push(`«${eventId}»: aprobada más de una vez; es ambiguo cuál ficha corresponde. Deja una sola.`);
      }
      continue;
    }
    if (duplicatedIds.has(eventId)) {
      conflicts.push(`«${eventId}»: hay más de un evento con ese id; es ambiguo y no se decide solo.`);
      continue;
    }
    if (unreadableEvents.has(eventId)) {
      conflicts.push(`«${eventId}»: el documento del evento no se pudo leer; no se migra.`);
      continue;
    }
    if (!record) {
      conflicts.push(`«${eventId}»: no existe un evento con ese id exacto. No se busca uno parecido.`);
      continue;
    }
    if (unreadablePages.has(eventId)) {
      conflicts.push(`«${eventId}»: ya tiene una ficha guardada que no se puede leer; no se sobrescribe. Revísala a mano.`);
      continue;
    }

    const validation = validateEventPage(entry.page, { event: record, now });
    if (!validation.ok) {
      const detail = Object.entries(validation.errors)
        .map(([path, message]) => `${path}: ${message}`)
        .join("; ");
      conflicts.push(`«${eventId}»: la ficha aprobada no es válida (${detail}).`);
      continue;
    }
    const page = validation.value;

    if (record.page) {
      if (sameValue(record.page, page)) {
        // Ya migrada con ese mismo contenido: no hay cambio (idempotencia).
        continue;
      }
      if (record.page.slug !== page.slug) {
        conflicts.push(
          `«${eventId}»: ya tiene la ficha «${record.page.slug}» y se aprobó «${page.slug}». El slug es inmutable y la edición ambigua no se decide sola.`,
        );
      } else {
        conflicts.push(
          `«${eventId}»: la ficha «${page.slug}» ya existe con otro contenido. La migración no sobrescribe textos; edítala desde el admin.`,
        );
      }
      continue;
    }

    candidates.push({ record, page });
  }

  // Colisiones de slug: entre aprobaciones, con fichas de otros eventos y con reservas.
  const owners = new Map<string, Set<string>>();
  const claim = (slug: string, eventId: string) => {
    const set = owners.get(slug) ?? new Set<string>();
    set.add(eventId);
    owners.set(slug, set);
  };
  for (const event of events) {
    if (event.page) {
      claim(event.page.slug, event.id);
    }
  }
  for (const { record, page } of candidates) {
    claim(page.slug, record.id);
  }
  for (const [slug, set] of [...owners.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (set.size > 1) {
      conflicts.push(`El slug «${slug}» lo usarían varios eventos: ${[...set].sort().join(", ")}. Un slug es de un solo evento.`);
    }
  }
  for (const { record, page } of candidates) {
    if (!(page.slug in reservations)) {
      continue;
    }
    const reservation = reservations[page.slug];
    if (reservation === null) {
      conflicts.push(`«${record.id}»: el slug «${page.slug}» tiene una reserva con forma inválida; se trata como ocupado.`);
    } else if (reservation.retired) {
      conflicts.push(`«${record.id}»: el slug «${page.slug}» pertenece a una ficha borrada y no se reutiliza.`);
    } else if (reservation.eventId !== record.id) {
      conflicts.push(`«${record.id}»: el slug «${page.slug}» ya está reservado por «${reservation.eventId}».`);
    }
  }

  // Un solo conflicto bloquea todo el lote: no se propone ningún cambio.
  if (conflicts.length) {
    return { changes: [], conflicts };
  }

  const changes = candidates
    .map(({ record, page }): MigrationChange => ({
      eventId: record.id,
      before: structuredClone(record),
      after: { ...structuredClone(record), page: structuredClone(page) },
    }))
    .sort((a, b) => a.eventId.localeCompare(b.eventId));

  return { changes, conflicts: [] };
}

// ---------------------------------------------------------------------------------------------------------
// Entrada aprobada y argumentos del script
// ---------------------------------------------------------------------------------------------------------

export type ParsedApproved = { ok: true; approved: ApprovedEventPage[] } | { ok: false; errors: string[] };

/** El archivo de aprobaciones es una lista de { eventId, page }. La ficha se valida después, contra el evento. */
export function parseApprovedPages(input: unknown): ParsedApproved {
  if (!Array.isArray(input)) {
    return { ok: false, errors: ["El archivo de aprobaciones debe ser una lista de { eventId, page }."] };
  }

  const errors: string[] = [];
  const approved: ApprovedEventPage[] = [];
  input.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`Entrada ${index}: debe ser un objeto { eventId, page }.`);
      return;
    }
    if (typeof entry.eventId !== "string" || !entry.eventId.trim()) {
      errors.push(`Entrada ${index}: falta eventId.`);
      return;
    }
    if (!isRecord(entry.page)) {
      errors.push(`Entrada ${index} («${entry.eventId}»): falta page (objeto).`);
      return;
    }
    approved.push({ eventId: entry.eventId, page: entry.page as unknown as EventPage });
  });

  return errors.length ? { ok: false, errors } : { ok: true, approved };
}

/** Los respaldos tienen este sufijo para que `.gitignore` los excluya: contienen documentos completos. */
export const MIGRATION_BACKUP_SUFFIX = ".event-pages-backup.json";

export type MigrationOptions =
  | { mode: "dry-run"; approvedPath: string; fromFile?: string }
  | { mode: "apply"; approvedPath: string; backupPath: string }
  | { mode: "revert"; revertPath: string };

export type ParsedMigrationArgs = { ok: true; options: MigrationOptions } | { ok: false; errors: string[] };

/**
 * Argumentos del script. El valor por defecto es el ensayo (dry-run): solo `--apply` escribe, y exige las
 * aprobaciones y una ruta de respaldo explícitas. Un export local (`--from-file`) nunca se aplica.
 */
export function parseMigrationArgs(argv: readonly string[]): ParsedMigrationArgs {
  const errors: string[] = [];
  const values: Record<string, string> = {};
  let apply = false;
  const valueFlags = new Set(["--approved", "--backup", "--from-file", "--revert"]);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--apply") {
      apply = true;
    } else if (valueFlags.has(arg)) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith("--")) {
        errors.push(`${arg} necesita un valor.`);
      } else {
        values[arg] = value;
        index += 1;
      }
    } else {
      errors.push(`Opción desconocida: ${arg}.`);
    }
  }

  const backupName = (path: string) => path.endsWith(MIGRATION_BACKUP_SUFFIX);
  const suffixError = (flag: string) => `${flag} debe terminar en «${MIGRATION_BACKUP_SUFFIX}» (así git lo ignora).`;

  if ("--revert" in values) {
    if (!apply) {
      errors.push("--revert escribe en Firestore: agrega --apply de forma explícita.");
    }
    for (const flag of ["--approved", "--backup", "--from-file"]) {
      if (flag in values) {
        errors.push(`${flag} no se combina con --revert.`);
      }
    }
    if (!backupName(values["--revert"])) {
      errors.push(suffixError("--revert"));
    }
    return errors.length ? { ok: false, errors } : { ok: true, options: { mode: "revert", revertPath: values["--revert"] } };
  }

  if (!("--approved" in values)) {
    errors.push("Falta --approved <archivo>: la lista de fichas aprobadas por el responsable.");
  }

  if (apply) {
    if (!("--backup" in values)) {
      errors.push("--apply exige --backup <ruta> para guardar el respaldo antes de escribir.");
    } else if (!backupName(values["--backup"])) {
      errors.push(suffixError("--backup"));
    }
    if ("--from-file" in values) {
      errors.push("--from-file solo vale para el ensayo: un export local nunca se aplica.");
    }
    return errors.length
      ? { ok: false, errors }
      : { ok: true, options: { mode: "apply", approvedPath: values["--approved"], backupPath: values["--backup"] } };
  }

  if ("--backup" in values) {
    errors.push("--backup solo se usa con --apply.");
  }
  if (errors.length) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    options: {
      mode: "dry-run",
      approvedPath: values["--approved"],
      ...("--from-file" in values ? { fromFile: values["--from-file"] } : {}),
    },
  };
}

// ---------------------------------------------------------------------------------------------------------
// Foto de los datos (solo lectura)
// ---------------------------------------------------------------------------------------------------------

export type MigrationSnapshot = {
  /** Eventos interpretados (lectura tolerante del repositorio). */
  events: AdminEventRecord[];
  /** Documentos tal como están guardados, por id; son la base del respaldo y de la comprobación previa a escribir. */
  rawEvents: Record<string, Json>;
  reservations: Record<string, SlugReservation | null>;
  unreadablePages: string[];
  unreadableEvents: string[];
};

function readReservationData(data: unknown): SlugReservation | null {
  if (!isRecord(data) || typeof data.eventId !== "string" || typeof data.retired !== "boolean") {
    return null;
  }
  return { eventId: data.eventId, retired: data.retired };
}

function buildSnapshot(
  rawDocs: ReadonlyArray<{ id: string; data: unknown }>,
  reservationDocs: ReadonlyArray<{ slug: string; data: unknown }>,
  now: string | undefined,
): MigrationSnapshot {
  const snapshot: MigrationSnapshot = {
    events: [],
    rawEvents: {},
    reservations: {},
    unreadablePages: [],
    unreadableEvents: [],
  };

  for (const { id, data } of [...rawDocs].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!isRecord(data)) {
      snapshot.unreadableEvents.push(id);
      continue;
    }
    snapshot.rawEvents[id] = data;
    const record = parseStoredAdminEvent(id, data, { now });
    if (!record) {
      snapshot.unreadableEvents.push(id);
      continue;
    }
    snapshot.events.push(record);
    if (data.page !== undefined && data.page !== null && parseEventPage(data.page) === undefined) {
      snapshot.unreadablePages.push(id);
    }
  }

  for (const { slug, data } of reservationDocs) {
    snapshot.reservations[slug] = readReservationData(data);
  }
  return snapshot;
}

/** Lee eventos y reservas. Solo lecturas: no abre transacciones ni escribe. */
export async function readMigrationSnapshot(db: EventStore, options?: { now?: string }): Promise<MigrationSnapshot> {
  const [events, reservations] = await Promise.all([
    db.collection(EVENTS_COLLECTION).get(),
    db.collection(EVENT_PAGE_SLUGS_COLLECTION).get(),
  ]);
  return buildSnapshot(
    events.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
    reservations.docs.map((doc) => ({ slug: doc.id, data: doc.data() })),
    options?.now,
  );
}

/** Foto a partir de un export local ({ events: [{id, data}], reservations: [{slug, eventId, retired}] }). Solo para ensayos. */
export function snapshotFromExport(input: unknown, options?: { now?: string }): MigrationSnapshot {
  if (!isRecord(input) || !Array.isArray(input.events)) {
    throw new Error("El export debe ser { events: [{ id, data }], reservations?: [{ slug, eventId, retired }] }.");
  }
  const rawDocs = input.events.map((entry, index) => {
    if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id) {
      throw new Error(`Export: el evento ${index} no tiene id.`);
    }
    return { id: entry.id, data: entry.data };
  });
  const reservationList = input.reservations === undefined ? [] : input.reservations;
  if (!Array.isArray(reservationList)) {
    throw new Error("Export: reservations debe ser una lista.");
  }
  const reservationDocs = reservationList.map((entry, index) => {
    if (!isRecord(entry) || typeof entry.slug !== "string" || !entry.slug) {
      throw new Error(`Export: la reserva ${index} no tiene slug.`);
    }
    return { slug: entry.slug, data: { eventId: entry.eventId, retired: entry.retired } };
  });
  return buildSnapshot(rawDocs, reservationDocs, options?.now);
}

// ---------------------------------------------------------------------------------------------------------
// Respaldo, aplicación y reversión
// ---------------------------------------------------------------------------------------------------------

export type MigrationBackupEntry = {
  eventId: string;
  slug: string;
  /** Documento completo tal como estaba guardado antes de migrar. */
  eventBefore: Json;
  /** Reserva previa del slug: `null` si no existía (la migración la crea y la reversión la borra). */
  reservationBefore: SlugReservation | null;
  /** Ficha que escribió la migración; sirve para comprobar que nada cambió antes de revertir. */
  pageAfter: EventPage;
};

export type MigrationBackup = {
  version: 1;
  kind: "event-page-migration-backup";
  createdAt: string;
  entries: MigrationBackupEntry[];
};

/**
 * Respaldo de lo que va a cambiar: el documento completo de cada evento y el estado previo de su reserva. Es JSON
 * puro; si algún documento no sobrevive a JSON (por ejemplo, una fecha de Firestore) no sería recuperable y se
 * rechaza antes de escribir nada.
 */
export function buildMigrationBackup(
  changes: readonly MigrationChange[],
  snapshot: Pick<MigrationSnapshot, "rawEvents" | "reservations">,
  createdAt: string,
): MigrationBackup {
  if (!changes.length) {
    throw new Error("No hay nada que respaldar: el plan no trae cambios.");
  }

  const entries = changes.map((change): MigrationBackupEntry => {
    const raw = snapshot.rawEvents[change.eventId];
    const page = change.after.page;
    if (!raw || !page) {
      throw new Error(`«${change.eventId}»: falta el documento original o la ficha; no se puede respaldar.`);
    }
    if (!sameValue(JSON.parse(JSON.stringify(raw)), raw)) {
      throw new Error(`«${change.eventId}»: el documento no sobrevive a JSON, así que el respaldo no sería recuperable.`);
    }
    const reservation = snapshot.reservations[page.slug];
    return {
      eventId: change.eventId,
      slug: page.slug,
      eventBefore: structuredClone(raw),
      reservationBefore: reservation ? { ...reservation } : null,
      pageAfter: structuredClone(page),
    };
  });

  return { version: 1, kind: "event-page-migration-backup", createdAt, entries };
}

/** Comprueba la forma de un respaldo leído de un archivo antes de usarlo para escribir. */
export function assertMigrationBackup(value: unknown): MigrationBackup {
  if (!isRecord(value) || value.version !== 1 || value.kind !== "event-page-migration-backup" || !Array.isArray(value.entries)) {
    throw new Error("El archivo no es un respaldo de migración de fichas válido.");
  }
  for (const [index, entry] of value.entries.entries()) {
    if (
      !isRecord(entry) ||
      typeof entry.eventId !== "string" ||
      typeof entry.slug !== "string" ||
      !isRecord(entry.eventBefore) ||
      !isRecord(entry.pageAfter) ||
      (entry.reservationBefore !== null && readReservationData(entry.reservationBefore) === null)
    ) {
      throw new Error(`Respaldo inválido: la entrada ${index} está incompleta.`);
    }
  }
  return value as unknown as MigrationBackup;
}

function assertDistinct(backup: MigrationBackup) {
  if (!backup.entries.length) {
    throw new Error("El respaldo no trae entradas.");
  }
  if (backup.entries.length > UPSERT_BATCH_LIMIT) {
    throw new Error(`El lote supera ${UPSERT_BATCH_LIMIT} eventos; divídelo.`);
  }
  const ids = new Set(backup.entries.map((entry) => entry.eventId));
  const slugs = new Set(backup.entries.map((entry) => entry.slug));
  if (ids.size !== backup.entries.length || slugs.size !== backup.entries.length) {
    throw new Error("El lote repite un evento o un slug.");
  }
}

function stored(snapshot: EventStoreSnapshot): Json | undefined {
  if (!snapshot.exists) {
    return undefined;
  }
  const data = snapshot.data();
  return isRecord(data) ? data : undefined;
}

function reservationState(snapshot: EventStoreSnapshot): SlugReservation | null | undefined {
  return snapshot.exists ? readReservationData(snapshot.data()) : undefined;
}

/**
 * Escribe las fichas del respaldo: por cada evento, `{...documentoOriginal, page}` y la reserva del slug, todo en
 * una sola transacción (o todo o nada). Antes de escribir comprueba que el documento y la reserva siguen como
 * cuando se respaldaron; si algo cambió, no escribe nada. Solo se llama desde el script con `--apply`.
 */
export async function applyEventPageMigration(db: EventStore, input: MigrationBackup): Promise<void> {
  const backup = assertMigrationBackup(input);
  assertDistinct(backup);

  await db.runTransaction(async (tx) => {
    for (const entry of backup.entries) {
      const event = stored(await tx.get(db.collection(EVENTS_COLLECTION).doc(entry.eventId)));
      if (!event || !sameValue(event, entry.eventBefore)) {
        throw new Error(`«${entry.eventId}» cambió desde que se planeó la migración; no se escribió nada. Vuelve a ensayar.`);
      }
      const reservation = reservationState(await tx.get(db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(entry.slug)));
      const expected = entry.reservationBefore;
      const unchanged = expected === null ? reservation === undefined : reservation !== undefined && sameValue(reservation, expected);
      if (!unchanged) {
        throw new Error(`La reserva «${entry.slug}» cambió desde que se planeó la migración; no se escribió nada.`);
      }
    }

    for (const entry of backup.entries) {
      tx.set(db.collection(EVENTS_COLLECTION).doc(entry.eventId), { ...entry.eventBefore, page: structuredClone(entry.pageAfter) });
      if (entry.reservationBefore === null) {
        tx.set(db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(entry.slug), { eventId: entry.eventId, retired: false });
      }
    }
  });
}

/**
 * Deshace una migración aplicada con su respaldo: restaura el documento original y borra las reservas que la
 * migración creó. Solo actúa si nada cambió después (el documento sigue siendo el original más la ficha migrada);
 * si alguien editó el evento, se niega para no perder esos cambios.
 */
export async function revertEventPageMigration(db: EventStore, input: MigrationBackup): Promise<void> {
  const backup = assertMigrationBackup(input);
  assertDistinct(backup);

  await db.runTransaction(async (tx) => {
    for (const entry of backup.entries) {
      const event = stored(await tx.get(db.collection(EVENTS_COLLECTION).doc(entry.eventId)));
      if (!event || !sameValue(event, { ...entry.eventBefore, page: entry.pageAfter })) {
        throw new Error(`«${entry.eventId}» cambió después de migrar (o no se migró); no se revirtió nada.`);
      }
      const reservation = reservationState(await tx.get(db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(entry.slug)));
      const expected = entry.reservationBefore ?? { eventId: entry.eventId, retired: false };
      if (reservation === undefined || reservation === null || !sameValue(reservation, expected)) {
        throw new Error(`La reserva «${entry.slug}» cambió después de migrar; no se revirtió nada.`);
      }
    }

    for (const entry of backup.entries) {
      tx.set(db.collection(EVENTS_COLLECTION).doc(entry.eventId), structuredClone(entry.eventBefore));
      if (entry.reservationBefore === null) {
        tx.delete(db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(entry.slug));
      }
    }
  });
}

// ---------------------------------------------------------------------------------------------------------
// Resumen para revisión humana (lo que imprime el ensayo)
// ---------------------------------------------------------------------------------------------------------

/** Líneas de texto con el diff que revisa el responsable. No escribe ni lee nada. */
export function formatMigrationPlan(plan: MigrationPlan): string[] {
  const lines: string[] = [];
  if (plan.conflicts.length) {
    lines.push(`CONFLICTOS (${plan.conflicts.length}): el lote completo queda bloqueado; no se aplicaría nada.`);
    for (const conflict of plan.conflicts) {
      lines.push(`  ! ${conflict}`);
    }
    return lines;
  }
  if (!plan.changes.length) {
    lines.push("Nada que migrar: no hay fichas aprobadas pendientes (o ya están migradas).");
    return lines;
  }

  lines.push(`CAMBIOS (${plan.changes.length}): solo se agrega el campo «page»; el resto del documento no cambia.`);
  for (const change of plan.changes) {
    const page = change.after.page as EventPage;
    lines.push(`  + ${change.eventId}  →  /eventos/${page.slug}  (${page.publication})`);
    lines.push(`      page: ${JSON.stringify(page)}`);
  }
  return lines;
}
