import {
  buildAdminEventRecord,
  compareEventsBySchedule,
  EVENT_PAGE_LIMITS,
  EventPageValidationError,
  omitUndefinedDeep,
  parseEventPage,
  slugifyEventId,
  validateEventPage,
  type AdminEventRecord,
  type EventPage,
  type EventPageErrors,
} from "@c3/config";

/**
 * Persistencia de eventos y fichas por edición (spec 2026-11-13, §4 y §5).
 *
 * - events/{id} guarda el registro; eventPageSlugs/{slug} = { eventId, retired } reserva la dirección pública.
 *   Ambos se escriben en una sola transacción: nunca se guarda una ficha sin su reserva.
 * - El primer slug guardado es inmutable. Despublicar conserva la reserva activa. Borrar retira la reserva
 *   (retired: true) y elimina el evento en la misma transacción; un slug retirado no se reutiliza nunca, ni
 *   siquiera recreando el mismo id.
 * - El registro guardado manda sobre el payload en id y createdAt; updatedAt lo pone el servidor.
 * - Sin `page` se conserva la ficha guardada (clientes antiguos, carga masiva y seed). `page: null` es un 400.
 *   `memory: null` elimina la memoria de forma expresa; omitir `memory` dentro de `page` la conserva.
 * - Las lecturas del admin son tolerantes (parseEventPage): nunca descartan ni alteran un evento según el reloj.
 *   La validación completa (validateEventPage con `now`) corre solo al guardar.
 *
 * Este módulo no importa "server-only" ni el SDK de Firebase: recibe un adaptador con la forma mínima de Firestore
 * (EventStore), así lo usan las rutas del admin, el seed (tsx) y las pruebas con un Firestore simulado.
 */

export const EVENTS_COLLECTION = "events";
export const EVENT_PAGE_SLUGS_COLLECTION = "eventPageSlugs";

export type SlugReservation = { eventId: string; retired: boolean };

/** Error con estado HTTP. `errors` lleva el detalle por campo (p. ej. «memory.results.0.value») para el formulario. */
export class ApiError extends Error {
  readonly status: number;
  readonly errors?: EventPageErrors;

  constructor(status: number, message: string, errors?: EventPageErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (errors && Object.keys(errors).length) {
      this.errors = { ...errors };
    }
  }
}

export type ApiErrorBody = { ok: false; message: string; errors?: EventPageErrors };

/** Cuerpo JSON de una respuesta de error: conserva los errores por campo cuando existen. */
export function toErrorBody(error: ApiError): ApiErrorBody {
  return error.errors
    ? { ok: false, message: error.message, errors: { ...error.errors } }
    : { ok: false, message: error.message };
}

// ---------------------------------------------------------------------------------------------------------
// Adaptador mínimo de Firestore (lo cumple el Firestore de firebase-admin y el simulado de las pruebas)
// ---------------------------------------------------------------------------------------------------------

export interface EventStoreSnapshot {
  readonly id: string;
  readonly exists: boolean;
  data(): unknown;
}

export interface EventStoreDocRef {
  readonly id: string;
  get(): Promise<EventStoreSnapshot>;
}

export interface EventStoreTransaction {
  get(ref: EventStoreDocRef): Promise<EventStoreSnapshot>;
  set(ref: EventStoreDocRef, data: Record<string, unknown>): unknown;
  delete(ref: EventStoreDocRef): unknown;
}

export interface EventStoreCollection {
  doc(id: string): EventStoreDocRef;
  get(): Promise<{ readonly empty: boolean; readonly docs: readonly EventStoreSnapshot[] }>;
}

export interface EventStore {
  collection(path: string): EventStoreCollection;
  /** Puede ejecutar el callback más de una vez (reintentos por contención): no debe tener efectos fuera de `tx`. */
  runTransaction<T>(fn: (tx: EventStoreTransaction) => Promise<T>): Promise<T>;
}

export type RepositoryOptions = {
  /** Instante ISO del guardado (updatedAt y validación de la memoria). Por defecto, ahora. */
  now?: string;
};

// ---------------------------------------------------------------------------------------------------------
// Utilidades internas
// ---------------------------------------------------------------------------------------------------------

type StoredEvent = Record<string, unknown>;

type PlannedWrite =
  | { kind: "set"; ref: EventStoreDocRef; data: Record<string, unknown> }
  | { kind: "delete"; ref: EventStoreDocRef };

type SaveIntent = {
  record: AdminEventRecord;
  /** El payload envió `page.memory: null`: eliminar la memoria guardada. */
  removeMemory: boolean;
};

type SaveContext = {
  now: string;
  /** Slugs ya reservados por registros anteriores del mismo lote (carga masiva), slug → eventId. */
  claims: Map<string, string>;
};

/** Patrón de la spec §4 (el mismo que valida event-page.ts). Solo ASCII: length cuenta caracteres. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function isReservableSlug(value: string) {
  return (
    value.length >= EVENT_PAGE_LIMITS.slugMin && value.length <= EVENT_PAGE_LIMITS.slugMax && SLUG_PATTERN.test(value)
  );
}

function resolveNow(options?: RepositoryOptions) {
  return options?.now ?? new Date().toISOString();
}

function requirePayload(payload: unknown): Record<string, unknown> {
  if (!isRecord(payload)) {
    throw new ApiError(400, "El evento debe enviarse como un objeto JSON.");
  }
  return payload;
}

/** Slug de la ficha guardada, tal como está (puede ser inválido si alguien escribió a mano). */
function storedPageSlug(stored: StoredEvent | undefined): string | undefined {
  const page = stored?.page;
  return isRecord(page) && typeof page.slug === "string" ? page.slug.trim() : undefined;
}

/** undefined: no hay reserva; null: hay un documento pero no tiene la forma esperada (se trata como ocupado). */
function readReservation(snapshot: EventStoreSnapshot): SlugReservation | null | undefined {
  if (!snapshot.exists) {
    return undefined;
  }
  const data = snapshot.data();
  if (!isRecord(data) || typeof data.eventId !== "string" || typeof data.retired !== "boolean") {
    return null;
  }
  return { eventId: data.eventId, retired: data.retired };
}

function slugConflict(message: string) {
  return new ApiError(409, message, { slug: message });
}

/** Registro normalizado a partir de un payload. Datos inválidos → 400 con el detalle por campo de la ficha. */
function buildRecord(input: unknown, now: string, fallbackId?: string): AdminEventRecord {
  try {
    return buildAdminEventRecord(input, { fallbackId, now });
  } catch (error) {
    if (error instanceof EventPageValidationError) {
      throw new ApiError(400, error.message, error.errors);
    }
    throw new ApiError(400, error instanceof Error ? error.message : "Invalid event payload.");
  }
}

async function readStoredEvent(
  tx: EventStoreTransaction,
  db: EventStore,
  id: string,
): Promise<StoredEvent | undefined> {
  const snapshot = await tx.get(db.collection(EVENTS_COLLECTION).doc(id));
  if (!snapshot.exists) {
    return undefined;
  }
  const data = snapshot.data();
  return isRecord(data) ? data : {};
}

/**
 * Decide qué se escribe para un registro, solo con lecturas (Firestore exige leer todo antes de escribir).
 * Lanza ApiError 400/409 sin escribir nada; la transacción se anula entera.
 */
async function planSave(
  tx: EventStoreTransaction,
  db: EventStore,
  intent: SaveIntent,
  stored: StoredEvent | undefined,
  context: SaveContext,
): Promise<{ writes: PlannedWrite[]; saved: AdminEventRecord }> {
  const { record } = intent;
  const id = record.id;
  const storedPage = stored?.page;
  const storedSlug = storedPageSlug(stored);

  // 1. Ficha final: la enviada (completa) o, si no se envió, la guardada. Omitir memory no la borra.
  let pageInput: unknown;
  if (record.page !== undefined) {
    pageInput = record.page;
    if (
      record.page.memory === undefined &&
      !intent.removeMemory &&
      isRecord(storedPage) &&
      storedPage.memory !== undefined &&
      storedPage.memory !== null
    ) {
      pageInput = { ...record.page, memory: storedPage.memory };
    }
  } else if (storedPage !== undefined && storedPage !== null) {
    pageInput = storedPage;
  }

  let page: EventPage | undefined;
  if (pageInput !== undefined) {
    const result = validateEventPage(pageInput, { event: record, now: context.now });
    if (!result.ok) {
      const invalid = new EventPageValidationError(result.errors);
      throw new ApiError(400, invalid.message, invalid.errors);
    }
    page = result.value;
  }

  // 2. Slug estable y reservado para este evento.
  const writes: PlannedWrite[] = [];
  if (page) {
    if (storedSlug !== undefined && page.slug !== storedSlug) {
      throw slugConflict(`El slug de la ficha no se puede cambiar después del primer guardado: es «${storedSlug}».`);
    }

    const claimedBy = context.claims.get(page.slug);
    if (claimedBy !== undefined && claimedBy !== id) {
      throw slugConflict(`El slug «${page.slug}» ya está reservado por otro evento.`);
    }

    const reservationRef = db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(page.slug);
    const reservation = readReservation(await tx.get(reservationRef));
    if (reservation === undefined) {
      if (claimedBy === undefined) {
        writes.push({ kind: "set", ref: reservationRef, data: { eventId: id, retired: false } });
      }
    } else if (reservation === null || reservation.eventId !== id) {
      throw slugConflict(`El slug «${page.slug}» ya está reservado por otro evento.`);
    } else if (reservation.retired) {
      throw slugConflict(`El slug «${page.slug}» perteneció a una ficha borrada y no se reutiliza. Elige otro.`);
    }
    context.claims.set(page.slug, id);
  }

  // 3. Identidad: el registro guardado manda en createdAt; updatedAt es el instante de este guardado.
  const createdAt =
    typeof stored?.createdAt === "string" && stored.createdAt.trim() ? stored.createdAt : record.createdAt;
  const saved = omitUndefinedDeep({ ...record, id, page, createdAt, updatedAt: context.now }) as AdminEventRecord;
  writes.push({ kind: "set", ref: db.collection(EVENTS_COLLECTION).doc(id), data: saved });

  return { writes, saved };
}

function applyWrites(tx: EventStoreTransaction, writes: PlannedWrite[]) {
  for (const write of writes) {
    if (write.kind === "set") {
      tx.set(write.ref, write.data);
    } else {
      tx.delete(write.ref);
    }
  }
}

function requestsMemoryRemoval(payload: Record<string, unknown>) {
  return isRecord(payload.page) && payload.page.memory === null;
}

// ---------------------------------------------------------------------------------------------------------
// Escrituras (transaccionales)
// ---------------------------------------------------------------------------------------------------------

/**
 * Guarda (crea o reemplaza) un registro con su ficha y la reserva de slug en una transacción. Si el registro no
 * trae `page`, conserva la ficha guardada; createdAt guardado manda.
 */
export async function saveEventWithPage(
  db: EventStore,
  record: AdminEventRecord,
  options?: RepositoryOptions,
): Promise<AdminEventRecord> {
  const [saved] = await upsertEventsWithPages(db, [record], options);
  return saved;
}

/**
 * Carga masiva (y seed) con las mismas invariantes que un guardado individual, en una sola transacción: o se
 * guarda todo el lote o nada. Nunca sobrescribe la ficha ni createdAt de un registro existente si el registro
 * entrante no trae ficha.
 */
export async function upsertEventsWithPages(
  db: EventStore,
  records: readonly AdminEventRecord[],
  options?: RepositoryOptions,
): Promise<AdminEventRecord[]> {
  const now = resolveNow(options);
  const intents: SaveIntent[] = records.map((record) => ({
    record: buildRecord(record, now, typeof record?.id === "string" ? record.id : undefined),
    removeMemory: false,
  }));

  const ids = new Set<string>();
  for (const { record } of intents) {
    if (ids.has(record.id)) {
      throw new ApiError(400, `El lote repite el id «${record.id}».`);
    }
    ids.add(record.id);
  }
  if (!intents.length) {
    return [];
  }

  return db.runTransaction(async (tx) => {
    const context: SaveContext = { now, claims: new Map() };
    const plans = [];
    for (const intent of intents) {
      const stored = await readStoredEvent(tx, db, intent.record.id);
      plans.push(await planSave(tx, db, intent, stored, context));
    }
    for (const plan of plans) {
      applyWrites(tx, plan.writes);
    }
    return plans.map((plan) => plan.saved);
  });
}

/** POST del admin: crea un evento nuevo. Si el id ya existe es un 409: crear nunca reemplaza otra edición. */
export async function createEventFromPayload(
  db: EventStore,
  payload: unknown,
  options?: RepositoryOptions,
): Promise<AdminEventRecord> {
  const input = requirePayload(payload);
  const now = resolveNow(options);
  const intent: SaveIntent = { record: buildRecord(input, now), removeMemory: requestsMemoryRemoval(input) };
  const id = intent.record.id;

  return db.runTransaction(async (tx) => {
    const stored = await readStoredEvent(tx, db, id);
    if (stored) {
      const message = `Ya existe un evento con el id «${id}». Edítalo en lugar de crear otro.`;
      throw new ApiError(409, message, { id: message });
    }
    const plan = await planSave(tx, db, intent, undefined, { now, claims: new Map() });
    applyWrites(tx, plan.writes);
    return plan.saved;
  });
}

/**
 * PATCH del admin: aplica el payload sobre lo guardado (leído dentro de la transacción). El id de la ruta manda
 * sobre el del payload; sin `page` se conserva la ficha; `page: null` es un 400.
 */
export async function updateEventFromPayload(
  db: EventStore,
  id: string,
  payload: unknown,
  options?: RepositoryOptions,
): Promise<AdminEventRecord> {
  const input = requirePayload(payload);
  if (!id || slugifyEventId(id) !== id) {
    throw new ApiError(400, `«${id}» no es un id de evento válido.`);
  }
  const now = resolveNow(options);
  const removeMemory = requestsMemoryRemoval(input);

  return db.runTransaction(async (tx) => {
    const stored = await readStoredEvent(tx, db, id);
    const record = buildRecord({ ...(stored ?? {}), ...input, id }, now, id);
    const plan = await planSave(tx, db, { record, removeMemory }, stored, { now, claims: new Map() });
    applyWrites(tx, plan.writes);
    return plan.saved;
  });
}

/**
 * Borra un evento. Si tiene ficha, su reserva queda retirada (retired: true) en la misma transacción, así el slug
 * no se reutiliza. Borrar un evento inexistente no escribe nada.
 */
export async function deleteEventWithPage(db: EventStore, id: string): Promise<void> {
  if (!id || id.includes("/")) {
    throw new ApiError(400, `«${id}» no es un id de evento válido.`);
  }

  await db.runTransaction(async (tx) => {
    const eventRef = db.collection(EVENTS_COLLECTION).doc(id);
    const snapshot = await tx.get(eventRef);
    if (!snapshot.exists) {
      return;
    }

    const data = snapshot.data();
    const slug = storedPageSlug(isRecord(data) ? data : undefined);
    if (slug !== undefined && isReservableSlug(slug)) {
      const reservationRef = db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(slug);
      const reservation = readReservation(await tx.get(reservationRef));
      // Una reserva de otro evento no se toca: solo se retira la propia (o se crea retirada si faltaba).
      if (reservation === undefined || (reservation !== null && reservation.eventId === id)) {
        tx.set(reservationRef, { eventId: id, retired: true });
      }
    }
    tx.delete(eventRef);
  });
}

// ---------------------------------------------------------------------------------------------------------
// Lecturas (tolerantes)
// ---------------------------------------------------------------------------------------------------------

/**
 * Documento guardado → registro del admin. La ficha se lee con parseEventPage (estructural, sin reloj): una memoria
 * publicada sigue visible aunque la fecha del evento haya cambiado. Si la ficha no tiene una estructura válida, el
 * evento se devuelve sin ficha (no se descarta), y guardarlo exige corregirla: nunca se borra en silencio.
 */
export function parseStoredAdminEvent(
  id: string,
  data: unknown,
  options?: RepositoryOptions,
): AdminEventRecord | null {
  if (!isRecord(data)) {
    return null;
  }

  const { page, ...base } = data;
  let record: AdminEventRecord;
  try {
    record = { ...buildAdminEventRecord({ ...base, id }, { fallbackId: id, now: resolveNow(options) }), id };
  } catch {
    return null;
  }

  if (page !== undefined && page !== null) {
    const parsed = parseEventPage(page);
    if (parsed) {
      record.page = parsed;
    }
  }
  return record;
}

export async function listStoredAdminEvents(
  db: EventStore,
  options?: RepositoryOptions,
): Promise<{ empty: boolean; events: AdminEventRecord[] }> {
  const snapshot = await db.collection(EVENTS_COLLECTION).get();
  const events = snapshot.docs
    .map((doc) => parseStoredAdminEvent(doc.id, doc.data(), options))
    .filter((event): event is AdminEventRecord => event !== null)
    .sort(compareEventsBySchedule);
  return { empty: snapshot.empty, events };
}

export async function getStoredAdminEvent(
  db: EventStore,
  id: string,
  options?: RepositoryOptions,
): Promise<AdminEventRecord | null> {
  const snapshot = await db.collection(EVENTS_COLLECTION).doc(id).get();
  return snapshot.exists ? parseStoredAdminEvent(snapshot.id, snapshot.data(), options) : null;
}
