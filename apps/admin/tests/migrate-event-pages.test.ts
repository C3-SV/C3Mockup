import { describe, expect, it } from "vitest";
import type { AdminEventRecord, EventPage } from "@c3/config";
import {
  EVENT_PAGE_SLUGS_COLLECTION,
  EVENTS_COLLECTION,
  type EventStore,
  type EventStoreDocRef,
  type EventStoreSnapshot,
  type EventStoreTransaction,
} from "@/lib/event-page-repository";
import {
  applyEventPageMigration,
  buildMigrationBackup,
  formatMigrationPlan,
  parseApprovedPages,
  parseMigrationArgs,
  planEventPageMigration,
  readMigrationSnapshot,
  revertEventPageMigration,
  snapshotFromExport,
  MIGRATION_BACKUP_SUFFIX,
  type MigrationSnapshot,
} from "@/lib/event-page-migration";
import { makeAdminEvent } from "./fixtures/event-page-fixtures";

/**
 * T6 (plan eventos-memorias): migración revisable de ediciones existentes (spec §9, ruling R28).
 *
 * El planificador es puro: nunca escribe. Todo lo que aquí se aplica se aplica sobre un Firestore simulado en
 * memoria; nunca hay conexión con un proyecto real. Los datos son de prueba, no contenido real de C3.
 */

const NOW = "2026-11-13T12:00:00.000Z";

/** Registro sin ficha (una edición que todavía no migró). */
function bare(overrides: Partial<AdminEventRecord> = {}): AdminEventRecord {
  const { page: _page, ...record } = makeAdminEvent(overrides);
  void _page;
  return record as AdminEventRecord;
}

function draftPage(slug: string, overrides: Partial<EventPage> = {}): EventPage {
  return { slug, publication: "draft", overview: ["Resumen de prueba."], resources: [], ...overrides };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const withoutPage = (record: AdminEventRecord) => {
  const { page: _page, ...rest } = record;
  void _page;
  return rest;
};

// ---------------------------------------------------------------------------------------------------------
// Planificador puro
// ---------------------------------------------------------------------------------------------------------

describe("planEventPageMigration", () => {
  const copa = bare({ id: "copa-prueba", title: "Copa de prueba" });
  const hack = bare({ id: "hack-prueba", title: "Hackathon de prueba" });

  it("solo propone el cambio de las ediciones aprobadas y no decide ninguna otra", () => {
    const plan = planEventPageMigration(
      [copa, hack],
      [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }],
      { now: NOW },
    );

    expect(plan.conflicts).toEqual([]);
    expect(plan.changes.map((change) => change.eventId)).toEqual(["copa-prueba"]);
    expect(plan.changes[0].before).toEqual(copa);
    expect(plan.changes[0].after.page?.slug).toBe("copa-prueba-2025");
  });

  it("sin aprobaciones no hay cambios ni conflictos (nada se deduce de los títulos)", () => {
    expect(planEventPageMigration([copa, hack], [], { now: NOW })).toEqual({ changes: [], conflicts: [] });
  });

  it("una edición ambigua no se decide sola: un id parecido no se toma como el aprobado", () => {
    const plan = planEventPageMigration(
      [copa],
      [{ eventId: "copa-prueba-2025", page: draftPage("copa-prueba-2025") }],
      { now: NOW },
    );

    expect(plan.changes).toEqual([]);
    expect(plan.conflicts).toHaveLength(1);
    expect(plan.conflicts[0]).toContain("copa-prueba-2025");
  });

  it("dos aprobaciones para el mismo evento son ambiguas y no se resuelven en silencio", () => {
    const plan = planEventPageMigration(
      [copa],
      [
        { eventId: "copa-prueba", page: draftPage("copa-prueba-2024") },
        { eventId: "copa-prueba", page: draftPage("copa-prueba-2025") },
      ],
      { now: NOW },
    );

    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("copa-prueba");
  });

  it("dos eventos reales con el mismo id son ambiguos", () => {
    const plan = planEventPageMigration(
      [copa, { ...copa }],
      [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }],
      { now: NOW },
    );

    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("copa-prueba");
  });

  it("una colisión de slug entre dos aprobaciones bloquea todo el lote, también el cambio sin conflicto", () => {
    const tercero = bare({ id: "icpc-prueba" });
    const plan = planEventPageMigration(
      [copa, hack, tercero],
      [
        { eventId: "copa-prueba", page: draftPage("mismo-slug") },
        { eventId: "hack-prueba", page: draftPage("mismo-slug") },
        { eventId: "icpc-prueba", page: draftPage("icpc-prueba-2025") },
      ],
      { now: NOW },
    );

    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("mismo-slug");
  });

  it("un slug que ya usa la ficha de otro evento es una colisión que bloquea el lote", () => {
    const ocupado = makeAdminEvent({ id: "otro-evento", page: draftPage("slug-ocupado") });
    const plan = planEventPageMigration(
      [copa, hack, ocupado],
      [
        { eventId: "copa-prueba", page: draftPage("slug-ocupado") },
        { eventId: "hack-prueba", page: draftPage("hack-prueba-2025") },
      ],
      { now: NOW },
    );

    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("slug-ocupado");
  });

  it("una reserva de otro evento, o una retirada, también colisiona", () => {
    const reservations = {
      "reservado-ajeno": { eventId: "otro-evento", retired: false },
      "slug-retirado": { eventId: "copa-prueba", retired: true },
    };

    const ajeno = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("reservado-ajeno") }], {
      now: NOW,
      reservations,
    });
    expect(ajeno.changes).toEqual([]);
    expect(ajeno.conflicts.join(" ")).toContain("reservado-ajeno");

    // Ni siquiera el mismo evento reutiliza un slug retirado (spec §4).
    const retirado = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("slug-retirado") }], {
      now: NOW,
      reservations,
    });
    expect(retirado.changes).toEqual([]);
    expect(retirado.conflicts.join(" ")).toContain("slug-retirado");
  });

  it("una reserva activa del propio evento no es colisión", () => {
    const plan = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }], {
      now: NOW,
      reservations: { "copa-prueba-2025": { eventId: "copa-prueba", retired: false } },
    });
    expect(plan.conflicts).toEqual([]);
    expect(plan.changes).toHaveLength(1);
  });

  it("una reserva con forma inválida se trata como ocupada", () => {
    const plan = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }], {
      now: NOW,
      reservations: { "copa-prueba-2025": null },
    });
    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("copa-prueba-2025");
  });

  it("no sobrescribe una ficha existente: otro slug o distinto contenido son conflicto", () => {
    const migrada = makeAdminEvent({ id: "copa-prueba", page: draftPage("copa-prueba-2025") });

    const otroSlug = planEventPageMigration([migrada], [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2026") }], {
      now: NOW,
    });
    expect(otroSlug.changes).toEqual([]);
    expect(otroSlug.conflicts.join(" ")).toContain("copa-prueba-2025");

    const otroTexto = planEventPageMigration(
      [migrada],
      [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025", { overview: ["Otro texto."] }) }],
      { now: NOW },
    );
    expect(otroTexto.changes).toEqual([]);
    expect(otroTexto.conflicts).toHaveLength(1);
  });

  it("una ficha aprobada inválida es un conflicto con el detalle del campo", () => {
    const plan = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("Slug Inválido") }], {
      now: NOW,
    });
    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("slug");
  });

  it("una memoria publicada en una edición que no terminó es un conflicto (reglas de publicación)", () => {
    const vigente = bare({ id: "copa-prueba", status: "Inscripciones abiertas", eventDate: "2027-01-10", eventDateEnd: "2027-01-11" });
    const page = draftPage("copa-prueba-2027", {
      publication: "published",
      memory: { publication: "published", summary: ["Texto."], learnings: [], results: [], outputs: [], gallery: [] },
    });
    const plan = planEventPageMigration([vigente], [{ eventId: "copa-prueba", page }], { now: NOW });
    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("memory.publication");
  });

  it("un evento cuya ficha guardada no se pudo leer no se sobrescribe", () => {
    const plan = planEventPageMigration([copa], [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }], {
      now: NOW,
      unreadablePages: ["copa-prueba"],
    });
    expect(plan.changes).toEqual([]);
    expect(plan.conflicts.join(" ")).toContain("copa-prueba");
  });

  it("una segunda ejecución sobre el resultado de la primera no duplica ni cambia nada", () => {
    const approved = [
      { eventId: "copa-prueba", page: draftPage("copa-prueba-2025") },
      { eventId: "hack-prueba", page: draftPage("hack-prueba-2025") },
    ];
    const first = planEventPageMigration([copa, hack], approved, { now: NOW });
    expect(first.changes).toHaveLength(2);

    const afterFirst = first.changes.map((change) => change.after);
    const reservations = Object.fromEntries(
      first.changes.map((change) => [change.after.page?.slug as string, { eventId: change.eventId, retired: false }]),
    );
    const second = planEventPageMigration(afterFirst, approved, { now: NOW, reservations });

    expect(second).toEqual({ changes: [], conflicts: [] });
  });

  it("los datos fuera de page quedan idénticos byte a byte y las entradas no se mutan", () => {
    const events = deepFreeze([structuredClone(copa), structuredClone(hack)]);
    const approved = deepFreeze([{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }]);

    const plan = planEventPageMigration(events, approved, { now: NOW });

    expect(plan.changes).toHaveLength(1);
    const { before, after } = plan.changes[0];
    expect(JSON.stringify(withoutPage(after))).toBe(JSON.stringify(withoutPage(before)));
    expect(JSON.stringify(before)).toBe(JSON.stringify(copa));
    expect(after.updatedAt).toBe(copa.updatedAt);
    expect(after).not.toBe(before);
  });

  it("las ediciones con ficha ya idéntica no generan cambio (idempotencia por contenido)", () => {
    const hecha = makeAdminEvent({ id: "copa-prueba", page: draftPage("copa-prueba-2025") });
    const plan = planEventPageMigration([hecha], [{ eventId: "copa-prueba", page: draftPage("copa-prueba-2025") }], {
      now: NOW,
    });
    expect(plan).toEqual({ changes: [], conflicts: [] });
  });
});

// ---------------------------------------------------------------------------------------------------------
// Entrada aprobada y argumentos del script
// ---------------------------------------------------------------------------------------------------------

describe("parseApprovedPages", () => {
  it("acepta una lista de {eventId, page}", () => {
    const parsed = parseApprovedPages([{ eventId: "a", page: draftPage("aaa") }]);
    expect(parsed).toEqual({ ok: true, approved: [{ eventId: "a", page: draftPage("aaa") }] });
  });

  it("rechaza lo que no es una lista, entradas sin eventId o sin ficha", () => {
    for (const input of [null, {}, "x", [{ page: draftPage("aaa") }], [{ eventId: "a" }], [{ eventId: "a", page: null }], [7]]) {
      const parsed = parseApprovedPages(input);
      expect(parsed.ok).toBe(false);
    }
  });
});

describe("parseMigrationArgs", () => {
  it("por defecto es un ensayo (dry-run) y exige el archivo de aprobaciones", () => {
    expect(parseMigrationArgs(["--approved", "aprobadas.json"])).toEqual({
      ok: true,
      options: { mode: "dry-run", approvedPath: "aprobadas.json" },
    });
    expect(parseMigrationArgs([]).ok).toBe(false);
  });

  it("--apply se niega sin archivo aprobado y sin ruta de respaldo", () => {
    const sinNada = parseMigrationArgs(["--apply"]);
    expect(sinNada.ok).toBe(false);

    const sinRespaldo = parseMigrationArgs(["--apply", "--approved", "aprobadas.json"]);
    expect(sinRespaldo.ok).toBe(false);
    if (!sinRespaldo.ok) {
      expect(sinRespaldo.errors.join(" ")).toContain("--backup");
    }

    const sinAprobadas = parseMigrationArgs(["--apply", "--backup", `x${MIGRATION_BACKUP_SUFFIX}`]);
    expect(sinAprobadas.ok).toBe(false);
  });

  it("--apply con aprobaciones y respaldo válido pasa a modo apply", () => {
    const backup = `copia${MIGRATION_BACKUP_SUFFIX}`;
    expect(parseMigrationArgs(["--apply", "--approved", "aprobadas.json", "--backup", backup])).toEqual({
      ok: true,
      options: { mode: "apply", approvedPath: "aprobadas.json", backupPath: backup },
    });
  });

  it("el respaldo debe tener el sufijo ignorado por git", () => {
    const parsed = parseMigrationArgs(["--apply", "--approved", "aprobadas.json", "--backup", "copia.json"]);
    expect(parsed.ok).toBe(false);
  });

  it("nunca se aplica un export local: --from-file solo vale para el ensayo", () => {
    const parsed = parseMigrationArgs([
      "--apply",
      "--approved",
      "aprobadas.json",
      "--backup",
      `copia${MIGRATION_BACKUP_SUFFIX}`,
      "--from-file",
      "export.json",
    ]);
    expect(parsed.ok).toBe(false);

    expect(parseMigrationArgs(["--approved", "aprobadas.json", "--from-file", "export.json"])).toEqual({
      ok: true,
      options: { mode: "dry-run", approvedPath: "aprobadas.json", fromFile: "export.json" },
    });
  });

  it("--revert escribe, así que exige --apply; y rechaza opciones desconocidas", () => {
    const backup = `copia${MIGRATION_BACKUP_SUFFIX}`;
    expect(parseMigrationArgs(["--revert", backup]).ok).toBe(false);
    expect(parseMigrationArgs(["--apply", "--revert", backup])).toEqual({
      ok: true,
      options: { mode: "revert", revertPath: backup },
    });
    expect(parseMigrationArgs(["--approved", "a.json", "--force"]).ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Firestore simulado en memoria (solo lo que usa el módulo)
// ---------------------------------------------------------------------------------------------------------

type Data = Record<string, unknown>;

class MemRef implements EventStoreDocRef {
  constructor(
    private readonly store: MemStore,
    readonly path: string,
    readonly id: string,
  ) {}

  async get(): Promise<EventStoreSnapshot> {
    return this.store.snapshot(this.path, this.id);
  }
}

class MemStore implements EventStore {
  readonly docs = new Map<string, Data>();
  commits = 0;

  seed(path: string, data: Data) {
    this.docs.set(path, structuredClone(data));
  }

  snapshot(path: string, id: string): EventStoreSnapshot {
    const data = this.docs.get(path);
    return { id, exists: data !== undefined, data: () => (data === undefined ? undefined : structuredClone(data)) };
  }

  collection(path: string) {
    return {
      doc: (id: string) => new MemRef(this, `${path}/${id}`, id) as EventStoreDocRef,
      get: async () => {
        const docs = [...this.docs.keys()]
          .filter((key) => key.startsWith(`${path}/`))
          .map((key) => this.snapshot(key, key.slice(path.length + 1)));
        return { empty: docs.length === 0, docs };
      },
    };
  }

  async runTransaction<T>(fn: (tx: EventStoreTransaction) => Promise<T>): Promise<T> {
    const writes: Array<{ path: string; data?: Data }> = [];
    let wrote = false;
    const tx: EventStoreTransaction = {
      get: async (ref) => {
        if (wrote) {
          throw new Error("Firestore exige leer antes de escribir.");
        }
        const memRef = ref as MemRef;
        return this.snapshot(memRef.path, memRef.id);
      },
      set: (ref, data) => {
        wrote = true;
        writes.push({ path: (ref as MemRef).path, data: structuredClone(data) });
      },
      delete: (ref) => {
        wrote = true;
        writes.push({ path: (ref as MemRef).path });
      },
    };
    const result = await fn(tx);
    for (const write of writes) {
      if (write.data) {
        this.docs.set(write.path, write.data);
      } else {
        this.docs.delete(write.path);
      }
    }
    this.commits += 1;
    return result;
  }

  dump(): Record<string, Data> {
    return Object.fromEntries([...this.docs.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }
}

/** Documento tal como está guardado en Firestore, con un campo extra que el modelo no conoce. */
function storedDoc(record: AdminEventRecord, extra: Data = {}): Data {
  const { id: _id, ...data } = record;
  void _id;
  return { ...data, ...extra };
}

function seededStore() {
  const db = new MemStore();
  const copa = bare({ id: "copa-prueba", title: "Copa de prueba" });
  const hack = bare({ id: "hack-prueba", title: "Hackathon de prueba" });
  db.seed(`${EVENTS_COLLECTION}/copa-prueba`, storedDoc(copa, { campoHeredado: { nota: "no se toca", n: 3 } }));
  db.seed(`${EVENTS_COLLECTION}/hack-prueba`, storedDoc(hack));
  return db;
}

const APPROVED = [
  { eventId: "copa-prueba", page: draftPage("copa-prueba-2025") },
  { eventId: "hack-prueba", page: draftPage("hack-prueba-2025", { audience: "Estudiantes de prueba" }) },
];

async function planFrom(db: MemStore, approved = APPROVED): Promise<{ snapshot: MigrationSnapshot; plan: ReturnType<typeof planEventPageMigration> }> {
  const snapshot = await readMigrationSnapshot(db);
  const plan = planEventPageMigration(snapshot.events, approved, {
    now: NOW,
    reservations: snapshot.reservations,
    unreadablePages: snapshot.unreadablePages,
  });
  return { snapshot, plan };
}

// ---------------------------------------------------------------------------------------------------------
// Lectura, respaldo, aplicación y reversión
// ---------------------------------------------------------------------------------------------------------

describe("readMigrationSnapshot", () => {
  it("lee eventos y reservas sin escribir, y marca las fichas guardadas ilegibles", async () => {
    const db = seededStore();
    db.seed(`${EVENTS_COLLECTION}/rota`, { ...storedDoc(bare({ id: "rota" })), page: { slug: 7 } });
    db.seed(`${EVENT_PAGE_SLUGS_COLLECTION}/mal-formada`, { eventId: 3 });
    db.seed(`${EVENT_PAGE_SLUGS_COLLECTION}/bien`, { eventId: "x", retired: true });
    const before = JSON.stringify(db.dump());

    const snapshot = await readMigrationSnapshot(db);

    expect(JSON.stringify(db.dump())).toBe(before);
    expect(db.commits).toBe(0);
    expect(snapshot.events.map((event) => event.id).sort()).toEqual(["copa-prueba", "hack-prueba", "rota"]);
    expect(snapshot.unreadablePages).toEqual(["rota"]);
    expect(snapshot.reservations["mal-formada"]).toBeNull();
    expect(snapshot.reservations.bien).toEqual({ eventId: "x", retired: true });
    expect(snapshot.rawEvents["copa-prueba"].campoHeredado).toEqual({ nota: "no se toca", n: 3 });
  });
});

describe("snapshotFromExport", () => {
  it("construye la misma foto a partir de un export local sin tocar Firestore", () => {
    const snapshot = snapshotFromExport({
      events: [{ id: "copa-prueba", data: storedDoc(bare({ id: "copa-prueba" })) }],
      reservations: [{ slug: "otro-slug", eventId: "otro", retired: false }],
    });
    expect(snapshot.events.map((event) => event.id)).toEqual(["copa-prueba"]);
    expect(snapshot.reservations).toEqual({ "otro-slug": { eventId: "otro", retired: false } });
  });

  it("rechaza un export con forma inválida", () => {
    expect(() => snapshotFromExport({ events: "nada" })).toThrow();
  });
});

describe("applyEventPageMigration", () => {
  it("escribe solo page y la reserva; el resto del documento queda idéntico, incluidos los campos desconocidos", async () => {
    const db = seededStore();
    const original = db.dump();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);

    await applyEventPageMigration(db, backup);

    const after = db.dump();
    for (const id of ["copa-prueba", "hack-prueba"]) {
      const path = `${EVENTS_COLLECTION}/${id}`;
      const { page, ...rest } = after[path];
      const { page: _p, ...expected } = original[path] as Data;
      void _p;
      expect(JSON.stringify(rest)).toBe(JSON.stringify(expected));
      expect((page as EventPage).slug).toBe(`${id}-2025`);
    }
    expect(after[`${EVENT_PAGE_SLUGS_COLLECTION}/copa-prueba-2025`]).toEqual({ eventId: "copa-prueba", retired: false });
    expect(after[`${EVENT_PAGE_SLUGS_COLLECTION}/hack-prueba-2025`]).toEqual({ eventId: "hack-prueba", retired: false });
    // Una sola transacción: o todo o nada.
    expect(db.commits).toBe(1);
  });

  it("una segunda ejecución no duplica: no hay nada que migrar y la primera no se repite", async () => {
    const db = seededStore();
    const first = await planFrom(db);
    await applyEventPageMigration(db, buildMigrationBackup(first.plan.changes, first.snapshot, NOW));
    const afterFirst = JSON.stringify(db.dump());

    const second = await planFrom(db);
    expect(second.plan).toEqual({ changes: [], conflicts: [] });

    // Repetir el mismo respaldo (plan viejo) tampoco escribe: el estado cambió desde que se planeó.
    await expect(
      applyEventPageMigration(db, buildMigrationBackup(first.plan.changes, first.snapshot, NOW)),
    ).rejects.toThrow();
    expect(JSON.stringify(db.dump())).toBe(afterFirst);
  });

  it("si algo cambió desde el plan, no escribe nada (tampoco los demás eventos del lote)", async () => {
    const db = seededStore();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);

    // Alguien edita un evento del lote entre el plan y la aplicación.
    const path = `${EVENTS_COLLECTION}/hack-prueba`;
    db.seed(path, { ...(db.docs.get(path) as Data), title: "Editado a mano" });
    const before = JSON.stringify(db.dump());

    await expect(applyEventPageMigration(db, backup)).rejects.toThrow(/cambi/i);
    expect(JSON.stringify(db.dump())).toBe(before);
  });

  it("si una reserva apareció desde el plan, no escribe nada", async () => {
    const db = seededStore();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);
    db.seed(`${EVENT_PAGE_SLUGS_COLLECTION}/copa-prueba-2025`, { eventId: "otro", retired: false });
    const before = JSON.stringify(db.dump());

    await expect(applyEventPageMigration(db, backup)).rejects.toThrow();
    expect(JSON.stringify(db.dump())).toBe(before);
  });
});

describe("buildMigrationBackup", () => {
  it("contiene el documento original completo y el estado previo de cada reserva", async () => {
    const db = seededStore();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);

    expect(backup.createdAt).toBe(NOW);
    expect(backup.entries.map((entry) => entry.eventId)).toEqual(["copa-prueba", "hack-prueba"]);
    const copa = backup.entries[0];
    expect(copa.slug).toBe("copa-prueba-2025");
    expect(copa.eventBefore).toEqual(db.docs.get(`${EVENTS_COLLECTION}/copa-prueba`));
    expect(copa.reservationBefore).toBeNull();
    // Es JSON puro: sobrevive a guardarse en un archivo.
    expect(JSON.parse(JSON.stringify(backup))).toEqual(backup);
  });

  it("se niega a respaldar documentos que no sobreviven a JSON (no sería recuperable)", async () => {
    const db = seededStore();
    db.seed(`${EVENTS_COLLECTION}/copa-prueba`, { ...(db.docs.get(`${EVENTS_COLLECTION}/copa-prueba`) as Data), cuando: new Date(0) });
    const { snapshot, plan } = await planFrom(db);

    expect(() => buildMigrationBackup(plan.changes, snapshot, NOW)).toThrow(/JSON/);
  });

  it("no se construye si el plan trae conflictos", async () => {
    const db = seededStore();
    const { snapshot } = await planFrom(db, [{ eventId: "no-existe", page: draftPage("no-existe-2025") }]);
    expect(() => buildMigrationBackup([], snapshot, NOW)).toThrow(/nada/i);
  });
});

describe("revertEventPageMigration", () => {
  it("el respaldo basta para volver exactamente al estado anterior (eventos y reservas)", async () => {
    const db = seededStore();
    const original = JSON.stringify(db.dump());
    const { snapshot, plan } = await planFrom(db);
    const backup = JSON.parse(JSON.stringify(buildMigrationBackup(plan.changes, snapshot, NOW)));

    await applyEventPageMigration(db, backup);
    expect(JSON.stringify(db.dump())).not.toBe(original);

    await revertEventPageMigration(db, backup);
    expect(JSON.stringify(db.dump())).toBe(original);
  });

  it("no revierte si el evento se editó después de migrar: perdería esos cambios", async () => {
    const db = seededStore();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);
    await applyEventPageMigration(db, backup);

    const path = `${EVENTS_COLLECTION}/copa-prueba`;
    db.seed(path, { ...(db.docs.get(path) as Data), title: "Editado después" });
    const before = JSON.stringify(db.dump());

    await expect(revertEventPageMigration(db, backup)).rejects.toThrow(/cambi/i);
    expect(JSON.stringify(db.dump())).toBe(before);
  });

  it("no revierte un lote que nunca se aplicó", async () => {
    const db = seededStore();
    const { snapshot, plan } = await planFrom(db);
    const backup = buildMigrationBackup(plan.changes, snapshot, NOW);
    const before = JSON.stringify(db.dump());

    await expect(revertEventPageMigration(db, backup)).rejects.toThrow();
    expect(JSON.stringify(db.dump())).toBe(before);
  });
});

describe("formatMigrationPlan", () => {
  it("con conflictos solo informa el bloqueo; con cambios lista el diff y aclara que solo se agrega page", async () => {
    const db = seededStore();
    const ok = await planFrom(db);
    const text = formatMigrationPlan(ok.plan).join("\n");
    expect(text).toContain("copa-prueba");
    expect(text).toContain("/eventos/copa-prueba-2025");
    expect(text).toContain("solo se agrega el campo");

    const bad = await planFrom(db, [{ eventId: "no-existe", page: draftPage("no-existe-2025") }]);
    const blocked = formatMigrationPlan(bad.plan).join("\n");
    expect(blocked).toContain("CONFLICTOS");
    expect(blocked).not.toContain("CAMBIOS");

    expect(formatMigrationPlan({ changes: [], conflicts: [] }).join("")).toContain("Nada que migrar");
  });
});
