import { describe, expect, it } from "vitest";
import { buildAdminEventRecord, defaultEvents, type AdminEventRecord } from "@c3/config";
import {
  ApiError,
  createEventFromPayload,
  deleteEventWithPage,
  EVENT_PAGE_SLUGS_COLLECTION,
  EVENTS_COLLECTION,
  getStoredAdminEvent,
  listStoredAdminEvents,
  saveEventWithPage,
  toErrorBody,
  updateEventFromPayload,
  upsertEventsWithPages,
  type EventStore,
  type EventStoreDocRef,
  type EventStoreSnapshot,
  type EventStoreTransaction,
} from "@/lib/event-page-repository";

/**
 * T2 (plan eventos-memorias): persistencia transaccional de fichas con slug único y estable (spec §4–§5).
 *
 * Todo corre contra un Firestore simulado en memoria con concurrencia optimista: cada transacción anota la versión
 * de lo que lee y, al confirmar, si otra transacción cambió algo de eso, se anula y se reintenta (como el SDK de
 * Firebase con contención). Igual que Firestore, exige leer antes de escribir y rechaza valores undefined.
 * Nunca se usa un proyecto real (R3).
 */

// ---------------------------------------------------------------------------------------------------------
// Firestore simulado
// ---------------------------------------------------------------------------------------------------------

type Data = Record<string, unknown>;
type StoredDoc = { data: Data; version: number };
type Write = { type: "set"; path: string; data: Data } | { type: "delete"; path: string };
type CommitHook = (info: { transaction: number; attempt: number }) => Promise<void> | void;

const MAX_ATTEMPTS = 5;

class FakeDocRef implements EventStoreDocRef {
  constructor(
    private readonly db: FakeFirestore,
    readonly collectionPath: string,
    readonly id: string,
  ) {}

  get path() {
    return `${this.collectionPath}/${this.id}`;
  }

  /** Lectura suelta, fuera de transacción. */
  async get(): Promise<EventStoreSnapshot> {
    await Promise.resolve();
    return snapshotOf(this.id, this.db.peek(this.path));
  }
}

function assertNoUndefined(value: unknown, path: string): void {
  if (value === undefined) {
    throw new Error(`Firestore no admite undefined (${path}).`);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoUndefined(entry, `${path}.${index}`));
  } else if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      assertNoUndefined(entry, `${path}.${key}`);
    }
  }
}

function snapshotOf(id: string, doc: StoredDoc | undefined): EventStoreSnapshot {
  return {
    id,
    exists: doc !== undefined,
    data: () => (doc ? structuredClone(doc.data) : undefined),
  };
}

class FakeTransaction implements EventStoreTransaction {
  readonly reads = new Map<string, number>();
  readonly writes: Write[] = [];

  constructor(private readonly db: FakeFirestore) {}

  async get(ref: EventStoreDocRef): Promise<EventStoreSnapshot> {
    if (this.writes.length) {
      throw new Error("Firestore exige ejecutar todas las lecturas antes de las escrituras.");
    }
    const { path, id } = asFakeRef(ref);
    // Cede el turno: dos transacciones concurrentes intercalan sus lecturas como en la red.
    await Promise.resolve();
    if (!this.reads.has(path)) {
      this.reads.set(path, this.db.versionOf(path));
    }
    return snapshotOf(id, this.db.peek(path));
  }

  set(ref: EventStoreDocRef, data: Data) {
    assertNoUndefined(data, asFakeRef(ref).path);
    this.writes.push({ type: "set", path: asFakeRef(ref).path, data: structuredClone(data) });
    return this;
  }

  delete(ref: EventStoreDocRef) {
    this.writes.push({ type: "delete", path: asFakeRef(ref).path });
    return this;
  }

  isStale() {
    return [...this.reads].some(([path, version]) => this.db.versionOf(path) !== version);
  }
}

function asFakeRef(ref: EventStoreDocRef): FakeDocRef {
  if (!(ref instanceof FakeDocRef)) {
    throw new Error("Referencia ajena al Firestore simulado.");
  }
  return ref;
}

class FakeFirestore implements EventStore {
  private readonly docs = new Map<string, StoredDoc>();
  private readonly tombstones = new Map<string, number>();
  private clock = 0;
  private transactions = 0;
  /** Transacciones confirmadas que escribieron algo, con sus escrituras (cada una es atómica). */
  readonly commits: Array<{ transaction: number; writes: Array<Pick<Write, "type" | "path">> }> = [];
  /** Intentos anulados por conflicto (y reintentados). */
  aborts = 0;
  beforeCommit?: CommitHook;

  collection(collectionPath: string) {
    return {
      doc: (id: string) => new FakeDocRef(this, collectionPath, id),
      get: async () => {
        await Promise.resolve();
        const prefix = `${collectionPath}/`;
        const docs = [...this.docs.entries()]
          .filter(([path]) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
          .map(([path, doc]) => snapshotOf(path.slice(prefix.length), doc));
        return { empty: docs.length === 0, docs };
      },
    };
  }

  async runTransaction<T>(fn: (tx: EventStoreTransaction) => Promise<T>): Promise<T> {
    const transaction = ++this.transactions;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const tx = new FakeTransaction(this);
      // Si el callback lanza, la transacción se anula: no se aplica ninguna de sus escrituras.
      const result = await fn(tx);
      await this.beforeCommit?.({ transaction, attempt });
      if (tx.isStale()) {
        this.aborts += 1;
        continue;
      }
      this.apply(transaction, tx.writes);
      return result;
    }
    throw new Error("ABORTED: demasiada contención.");
  }

  versionOf(path: string) {
    return this.docs.get(path)?.version ?? this.tombstones.get(path) ?? 0;
  }

  peek(path: string) {
    return this.docs.get(path);
  }

  /** Escritura directa, fuera de transacción, para preparar escenarios (datos ya guardados). */
  put(collectionPath: string, id: string, data: Data) {
    this.docs.set(`${collectionPath}/${id}`, { data: structuredClone(data), version: ++this.clock });
  }

  read(collectionPath: string, id: string): Data | undefined {
    const doc = this.docs.get(`${collectionPath}/${id}`);
    return doc ? structuredClone(doc.data) : undefined;
  }

  ids(collectionPath: string) {
    const prefix = `${collectionPath}/`;
    return [...this.docs.keys()].filter((path) => path.startsWith(prefix)).map((path) => path.slice(prefix.length));
  }

  private apply(transaction: number, writes: Write[]) {
    for (const write of writes) {
      if (write.type === "set") {
        this.docs.set(write.path, { data: write.data, version: ++this.clock });
      } else {
        this.docs.delete(write.path);
        this.tombstones.set(write.path, ++this.clock);
      }
    }
    // Una transacción de solo lectura no escribe nada: no cuenta como escritura efectiva.
    if (writes.length) {
      this.commits.push({ transaction, writes: writes.map(({ type, path }) => ({ type, path })) });
    }
  }
}

/** Retiene a `parties` transacciones justo antes de confirmar (primer intento) para forzar el choque. */
function holdFirstAttempts(db: FakeFirestore, parties: number) {
  let arrived = 0;
  let release!: () => void;
  const opened = new Promise<void>((resolve) => {
    release = resolve;
  });
  db.beforeCommit = async ({ attempt }) => {
    if (attempt !== 1) {
      return;
    }
    arrived += 1;
    if (arrived >= parties) {
      release();
    }
    await opened;
  };
}

// ---------------------------------------------------------------------------------------------------------
// Datos de prueba (no son contenido del sitio)
// ---------------------------------------------------------------------------------------------------------

const NOW = "2026-11-20T18:00:00.000Z";
const LATER = "2026-11-21T18:00:00.000Z";
const SLUG = "edicion-de-prueba-2026";
const OTHER_SLUG = "otra-edicion-de-prueba-2026";

function memory(over: Data = {}): Data {
  return {
    publication: "published",
    summary: ["Resumen de prueba de la edición."],
    learnings: ["Aprendizaje de prueba."],
    results: [{ label: "Etiqueta de prueba", value: "1", context: "Contexto de prueba." }],
    outputs: [{ title: "Proyecto de prueba", description: "Descripción de prueba.", url: "/proyectos/prueba" }],
    gallery: [{ url: "https://media.c3.com.sv/prueba/foto.webp", alt: "Foto de prueba", rightsConfirmed: true }],
    ...over,
  };
}

function page(over: Data = {}): Data {
  return {
    slug: SLUG,
    publication: "published",
    overview: ["Párrafo de prueba de la ficha."],
    audience: "Público de prueba.",
    resources: [{ title: "Recurso de prueba", url: "/recursos/prueba.pdf" }],
    memory: memory(),
    ...over,
  };
}

function payload(over: Data = {}): Data {
  return {
    id: "edicion-a",
    title: "Edición de prueba A",
    description: "Descripción de prueba.",
    lines: ["compite"],
    status: "Histórico",
    cta: "Ir al sitio",
    href: "https://copa.c3.com.sv",
    external: true,
    eventDate: "2026-11-10",
    eventDateEnd: "2026-11-12",
    kind: "competencia",
    cover: { url: "https://media.c3.com.sv/prueba/portada.webp", alt: "Portada de prueba" },
    featured: true,
    featuredOrder: 2,
    source: "admin",
    ...over,
  };
}

const at = { now: NOW };
const later = { now: LATER };

function storedEvent(db: FakeFirestore, id: string) {
  return db.read(EVENTS_COLLECTION, id);
}

function reservation(db: FakeFirestore, slug: string) {
  return db.read(EVENT_PAGE_SLUGS_COLLECTION, slug);
}

async function expectApiError(promise: Promise<unknown>, status: number): Promise<ApiError> {
  const error = await promise.then(
    () => {
      throw new Error(`Se esperaba ApiError ${status}`);
    },
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(status);
  return error as ApiError;
}

// ---------------------------------------------------------------------------------------------------------
// Identidad y reservas
// ---------------------------------------------------------------------------------------------------------

describe("saveEventWithPage: reserva de slug e identidad estable", () => {
  it("crear una ficha escribe el evento y su reserva en una sola transacción", async () => {
    const db = new FakeFirestore();
    const record = buildAdminEventRecord(payload({ page: page() }), at);

    const saved = await saveEventWithPage(db, record, at);

    expect(saved.page?.slug).toBe(SLUG);
    expect(storedEvent(db, "edicion-a")?.page).toEqual(saved.page);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
    expect(db.commits).toHaveLength(1);
    expect(db.commits[0].writes.map((write) => write.path).sort()).toEqual([
      `${EVENT_PAGE_SLUGS_COLLECTION}/${SLUG}`,
      `${EVENTS_COLLECTION}/edicion-a`,
    ]);
  });

  it("la API de creación hace lo mismo y devuelve el registro guardado", async () => {
    const db = new FakeFirestore();
    const saved = await createEventFromPayload(db, payload({ page: page() }), at);

    expect(saved).toEqual(storedEvent(db, "edicion-a"));
    expect(saved.createdAt).toBe(NOW);
    expect(saved.updatedAt).toBe(NOW);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("el mismo propietario vuelve a guardar y despublica su ficha sin perder la reserva", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);

    const edited = await updateEventFromPayload(
      db,
      "edicion-a",
      payload({ page: page({ overview: ["Texto nuevo."], memory: memory({ publication: "draft" }) }) }),
      later,
    );
    expect(edited.page?.overview).toEqual(["Texto nuevo."]);

    const unpublished = await updateEventFromPayload(
      db,
      "edicion-a",
      payload({ page: page({ publication: "draft", memory: memory({ publication: "draft" }) }) }),
      later,
    );
    expect(unpublished.page?.publication).toBe("draft");
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });

    // La reserva sigue activa: otro evento no puede tomar el slug despublicado.
    await expectApiError(
      createEventFromPayload(db, payload({ id: "edicion-b", title: "Edición de prueba B", page: page() }), later),
      409,
    );
  });

  it("colisión: otro evento no puede reservar un slug ocupado (409, sin escritura parcial)", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    await createEventFromPayload(db, payload({ id: "edicion-b", title: "Edición de prueba B" }), at);
    const commits = db.commits.length;
    const before = storedEvent(db, "edicion-b");

    const created = await expectApiError(
      createEventFromPayload(db, payload({ id: "edicion-c", title: "Edición de prueba C", page: page() }), later),
      409,
    );
    expect(created.errors?.slug).toBeTruthy();
    expect(storedEvent(db, "edicion-c")).toBeUndefined();

    await expectApiError(
      updateEventFromPayload(db, "edicion-b", payload({ id: "edicion-b", title: "Edición B", page: page() }), later),
      409,
    );
    expect(storedEvent(db, "edicion-b")).toEqual(before);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
    expect(db.commits).toHaveLength(commits);
  });

  it("el primer slug guardado es inmutable: cambiarlo da 409 y no reserva el nuevo", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);

    const error = await expectApiError(
      updateEventFromPayload(db, "edicion-a", payload({ page: page({ slug: OTHER_SLUG }) }), later),
      409,
    );
    expect(error.errors?.slug).toBeTruthy();
    expect((storedEvent(db, "edicion-a")?.page as Data).slug).toBe(SLUG);
    expect(reservation(db, OTHER_SLUG)).toBeUndefined();
  });

  it("un slug mal formado es un 400 con error por campo y no escribe nada", async () => {
    const db = new FakeFirestore();
    const error = await expectApiError(
      createEventFromPayload(db, payload({ page: page({ slug: "Edición 2026" }) }), at),
      400,
    );
    expect(error.errors?.slug).toBeTruthy();
    expect(db.commits).toHaveLength(0);
  });

  it("payload malicioso: un PATCH con otro id o createdAt no cambia la identidad guardada", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    await createEventFromPayload(db, payload({ id: "edicion-b", title: "Edición de prueba B" }), at);
    const otherBefore = storedEvent(db, "edicion-b");

    const saved = await updateEventFromPayload(
      db,
      "edicion-a",
      payload({
        id: "edicion-b",
        title: "Título editado",
        createdAt: "1999-01-01T00:00:00.000Z",
        updatedAt: "2099-01-01T00:00:00.000Z",
      }),
      later,
    );

    expect(saved.id).toBe("edicion-a");
    expect(saved.title).toBe("Título editado");
    expect(saved.createdAt).toBe(NOW);
    expect(saved.updatedAt).toBe(LATER);
    expect(storedEvent(db, "edicion-a")).toEqual(saved);
    expect(storedEvent(db, "edicion-b")).toEqual(otherBefore);
  });

  it("crear con un id que ya existe es un 409: el registro existente manda y no cambia", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    const before = storedEvent(db, "edicion-a");

    await expectApiError(
      createEventFromPayload(db, payload({ title: "Otra edición", createdAt: "1999-01-01T00:00:00.000Z" }), later),
      409,
    );
    expect(storedEvent(db, "edicion-a")).toEqual(before);
  });

  it("I5: el id de la ruta es el id de Firestore tal cual (no tiene que ser slug): se edita y borra en su sitio", async () => {
    const db = new FakeFirestore();
    // Ids heredados sin forma de slug: mayúsculas y guion bajo, y un id automático de la consola de Firebase.
    const legacyIds = ["Copa-SV_2024", "x7Kp2QaZ9mB4cD1eF0gH"];
    for (const id of legacyIds) {
      db.put(EVENTS_COLLECTION, id, { ...(buildAdminEventRecord(payload(), at) as unknown as Data), id });
    }

    for (const id of legacyIds) {
      const saved = await updateEventFromPayload(db, id, payload({ id, title: `Editado ${id}` }), later);
      expect(saved.id).toBe(id);
      expect(storedEvent(db, id)?.title).toBe(`Editado ${id}`);
      expect(storedEvent(db, id)?.id).toBe(id);
    }
    // Nunca se escribe en el id convertido a slug: sería otro documento (renombrar viola la spec §4).
    expect(db.ids(EVENTS_COLLECTION).sort()).toEqual([...legacyIds].sort());

    // Con ficha: la reserva apunta al id heredado y borrar la retira. Solo el slug de la ficha sigue el patrón.
    await updateEventFromPayload(db, legacyIds[0], payload({ id: legacyIds[0], page: page() }), later);
    expect(reservation(db, SLUG)).toEqual({ eventId: legacyIds[0], retired: false });
    await deleteEventWithPage(db, legacyIds[0]);
    expect(storedEvent(db, legacyIds[0])).toBeUndefined();
    expect(reservation(db, SLUG)).toEqual({ eventId: legacyIds[0], retired: true });
  });

  it("I5: los ids de defaultEvents se editan en su sitio", async () => {
    const db = new FakeFirestore();
    await upsertEventsWithPages(
      db,
      defaultEvents.map((event) => ({ ...event, page: undefined, createdAt: NOW, updatedAt: NOW })),
      at,
    );

    for (const event of defaultEvents) {
      const saved = await updateEventFromPayload(db, event.id, { title: `Editado ${event.id}` }, later);
      expect(saved.id).toBe(event.id);
      expect(storedEvent(db, event.id)?.title).toBe(`Editado ${event.id}`);
    }
    expect(db.ids(EVENTS_COLLECTION).sort()).toEqual(defaultEvents.map((event) => event.id).sort());
  });

  it("un id que Firestore no puede direccionar es un 400 y no escribe", async () => {
    const db = new FakeFirestore();
    for (const id of ["", "a/b", ".", ".."]) {
      await expectApiError(updateEventFromPayload(db, id, payload(), at), 400);
      await expectApiError(deleteEventWithPage(db, id), 400);
    }
    expect(db.commits).toHaveLength(0);
  });

  it("borrar retira la reserva y elimina el evento en la misma transacción", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    const commits = db.commits.length;

    await deleteEventWithPage(db, "edicion-a");

    expect(storedEvent(db, "edicion-a")).toBeUndefined();
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: true });
    expect(db.commits).toHaveLength(commits + 1);
    expect(db.commits.at(-1)?.writes).toEqual(
      expect.arrayContaining([
        { type: "set", path: `${EVENT_PAGE_SLUGS_COLLECTION}/${SLUG}` },
        { type: "delete", path: `${EVENTS_COLLECTION}/edicion-a` },
      ]),
    );
  });

  it("un slug retirado no se reutiliza, ni siquiera recreando el mismo id", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    await deleteEventWithPage(db, "edicion-a");

    await expectApiError(createEventFromPayload(db, payload({ page: page() }), later), 409);
    await expectApiError(updateEventFromPayload(db, "edicion-a", payload({ page: page() }), later), 409);
    await expectApiError(
      createEventFromPayload(db, payload({ id: "edicion-c", title: "Edición C", page: page() }), later),
      409,
    );
    expect(storedEvent(db, "edicion-a")).toBeUndefined();
    expect(storedEvent(db, "edicion-c")).toBeUndefined();
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: true });

    // El id puede volver con otro slug (otra dirección) o sin ficha.
    const recreated = await createEventFromPayload(db, payload({ page: page({ slug: OTHER_SLUG }) }), later);
    expect(recreated.page?.slug).toBe(OTHER_SLUG);
    expect(reservation(db, OTHER_SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("borrar un evento sin ficha solo elimina el evento; borrar uno inexistente no escribe", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload(), at);

    await deleteEventWithPage(db, "edicion-a");
    expect(storedEvent(db, "edicion-a")).toBeUndefined();
    expect(db.ids(EVENT_PAGE_SLUGS_COLLECTION)).toEqual([]);

    const commits = db.commits.length;
    await deleteEventWithPage(db, "no-existe");
    expect(db.commits).toHaveLength(commits);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Compatibilidad: clientes antiguos, memoria explícita, carga masiva y seed
// ---------------------------------------------------------------------------------------------------------

describe("compatibilidad con clientes antiguos y cargas masivas", () => {
  it("un cliente antiguo (sin page) conserva la ficha completa, la reserva y createdAt", async () => {
    const db = new FakeFirestore();
    const created = await createEventFromPayload(db, payload({ page: page() }), at);

    const legacy = payload({ title: "Título desde un cliente antiguo" });
    const saved = await updateEventFromPayload(db, "edicion-a", legacy, later);

    expect(saved.title).toBe("Título desde un cliente antiguo");
    expect(saved.page).toEqual(created.page);
    expect(saved.page?.memory?.gallery).toHaveLength(1);
    expect(saved.createdAt).toBe(NOW);
    expect(storedEvent(db, "edicion-a")).toEqual(saved);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("page: null se rechaza con 400 y error por campo; lo guardado no cambia", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    const before = storedEvent(db, "edicion-a");

    const error = await expectApiError(updateEventFromPayload(db, "edicion-a", payload({ page: null }), later), 400);
    expect(error.errors?.page).toBeTruthy();
    expect(storedEvent(db, "edicion-a")).toEqual(before);
  });

  it("memory: null elimina la memoria de forma explícita y conserva el resto de la ficha", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);

    const saved = await updateEventFromPayload(db, "edicion-a", payload({ page: page({ memory: null }) }), later);

    expect(saved.page?.memory).toBeUndefined();
    expect(saved.page?.overview).toEqual(["Párrafo de prueba de la ficha."]);
    expect((storedEvent(db, "edicion-a")?.page as Data).memory).toBeUndefined();
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("omitir memory dentro de page no la borra: quitar una sección es explícito", async () => {
    const db = new FakeFirestore();
    const created = await createEventFromPayload(db, payload({ page: page() }), at);
    const withoutMemory = page({ overview: ["Texto editado."] });
    delete withoutMemory.memory;

    const saved = await updateEventFromPayload(db, "edicion-a", payload({ page: withoutMemory }), later);

    expect(saved.page?.overview).toEqual(["Texto editado."]);
    expect(saved.page?.memory).toEqual(created.page?.memory);
  });

  it("guardado legado sin ficha: no crea reservas y no pierde kind, cover, source ni featuredOrder", async () => {
    const db = new FakeFirestore();
    const created = await createEventFromPayload(db, payload(), at);

    expect(created).not.toHaveProperty("page");
    expect(created).toMatchObject({
      kind: "competencia",
      cover: { url: "https://media.c3.com.sv/prueba/portada.webp", alt: "Portada de prueba" },
      source: "admin",
      featuredOrder: 2,
    });

    const updated = await updateEventFromPayload(db, "edicion-a", payload({ title: "Otro título" }), later);
    expect(updated).toEqual({ ...created, title: "Otro título", updatedAt: LATER });
    expect(db.ids(EVENT_PAGE_SLUGS_COLLECTION)).toEqual([]);
  });

  it("la carga masiva usa las mismas invariantes: conserva ficha y createdAt de lo existente", async () => {
    const db = new FakeFirestore();
    const created = await createEventFromPayload(db, payload({ page: page() }), at);
    const commits = db.commits.length;

    const incoming = [
      { ...buildAdminEventRecord(payload({ title: "Título masivo" }), later), createdAt: LATER },
      buildAdminEventRecord(payload({ id: "edicion-b", title: "Edición B" }), later),
    ];
    const saved = await upsertEventsWithPages(db, incoming, later);

    const a = saved.find((event) => event.id === "edicion-a");
    expect(a?.title).toBe("Título masivo");
    expect(a?.page).toEqual(created.page);
    expect(a?.createdAt).toBe(NOW);
    expect(storedEvent(db, "edicion-b")?.title).toBe("Edición B");
    // Una sola transacción para todo el lote.
    expect(db.commits).toHaveLength(commits + 1);
  });

  it("la carga masiva es atómica: una colisión de slug no deja escrituras parciales", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    const commits = db.commits.length;

    const incoming = [
      buildAdminEventRecord(payload({ id: "edicion-b", title: "Edición B" }), later),
      buildAdminEventRecord(payload({ id: "edicion-c", title: "Edición C", page: page() }), later),
    ];
    await expectApiError(upsertEventsWithPages(db, incoming, later), 409);

    expect(storedEvent(db, "edicion-b")).toBeUndefined();
    expect(storedEvent(db, "edicion-c")).toBeUndefined();
    expect(db.commits).toHaveLength(commits);
  });

  it("dos registros del mismo lote no pueden reservar el mismo slug nuevo", async () => {
    const db = new FakeFirestore();
    const incoming = [
      buildAdminEventRecord(payload({ id: "edicion-b", title: "Edición B", page: page() }), at),
      buildAdminEventRecord(payload({ id: "edicion-c", title: "Edición C", page: page() }), at),
    ];
    await expectApiError(upsertEventsWithPages(db, incoming, at), 409);
    expect(db.commits).toHaveLength(0);
  });

  it("el seed (eventos incluidos, sin page) no sobrescribe la ficha ni createdAt de lo existente", async () => {
    const db = new FakeFirestore();
    const [first] = defaultEvents;
    // Ficha en borrador con memoria en borrador: válida con cualquier fecha del evento incluido.
    const draftPage = page({ publication: "draft", memory: memory({ publication: "draft" }) });
    const created = await createEventFromPayload(db, { ...first, page: draftPage }, at);

    const seed: AdminEventRecord[] = defaultEvents.map((event) => ({
      ...event,
      page: undefined,
      createdAt: LATER,
      updatedAt: LATER,
    }));
    await upsertEventsWithPages(db, seed, later);

    const stored = storedEvent(db, first.id);
    expect(stored?.page).toEqual(created.page);
    expect(stored?.createdAt).toBe(NOW);
    expect(db.ids(EVENTS_COLLECTION).sort()).toEqual(defaultEvents.map((event) => event.id).sort());
    expect(reservation(db, SLUG)).toEqual({ eventId: first.id, retired: false });
  });
});

// ---------------------------------------------------------------------------------------------------------
// Lecturas tolerantes del admin (ruling T2): leer nunca descarta ni altera un evento por el reloj
// ---------------------------------------------------------------------------------------------------------

describe("lecturas del admin", () => {
  function storedWithPublishedMemoryInFuture(): Data {
    // Se guardó cuando la edición había terminado; después su fecha se movió al futuro (p. ej. desde la consola).
    const record = buildAdminEventRecord(payload({ page: page() }), at) as unknown as Data;
    return { ...record, status: "Próximamente", eventDate: "2099-03-01", eventDateEnd: "2099-03-02" };
  }

  it("un evento con memoria publicada cuya fecha pasó al futuro sigue listado y se lee tal como está guardado", async () => {
    const db = new FakeFirestore();
    const stored = storedWithPublishedMemoryInFuture();
    db.put(EVENTS_COLLECTION, "edicion-a", stored);

    const { empty, events } = await listStoredAdminEvents(db);
    expect(empty).toBe(false);
    expect(events.map((event) => event.id)).toEqual(["edicion-a"]);
    expect(events[0].page).toEqual(stored.page);
    expect(events[0].page?.memory?.publication).toBe("published");
    expect(events[0].eventDate).toBe("2099-03-01");

    const one = await getStoredAdminEvent(db, "edicion-a");
    expect(one).toEqual(events[0]);
  });

  it("R11: un cliente antiguo (sin page) guarda ese evento: la ficha se conserva tal cual, sin validarla con el reloj", async () => {
    const db = new FakeFirestore();
    const stored = storedWithPublishedMemoryInFuture();
    // Texto sin normalizar: se escribe lo guardado, no una versión re-normalizada.
    stored.page = { ...(stored.page as Data), overview: ["  Párrafo guardado a mano, con espacios.  "] };
    db.put(EVENTS_COLLECTION, "edicion-a", stored);
    const legacy: Data = { ...stored, title: "Título desde un cliente antiguo" };
    delete legacy.page;

    const saved = await updateEventFromPayload(db, "edicion-a", legacy, later);

    expect(saved.title).toBe("Título desde un cliente antiguo");
    expect(saved.page?.memory?.publication).toBe("published");
    expect(storedEvent(db, "edicion-a")?.page).toStrictEqual(stored.page);
    expect(JSON.stringify(storedEvent(db, "edicion-a")?.page)).toBe(JSON.stringify(stored.page));
    // La ficha conservada queda con su reserva (se crea si faltaba).
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("R11: la carga masiva y el seed tampoco fallan por una ficha que ya no valida por fecha", async () => {
    const db = new FakeFirestore();
    const stored = storedWithPublishedMemoryInFuture();
    db.put(EVENTS_COLLECTION, "edicion-a", stored);

    // Evento incluido con memoria publicada: con sus datos del seed (sin fecha final) ya no se podría publicar.
    const [first] = defaultEvents;
    const publishedPage = buildAdminEventRecord(payload({ page: page({ slug: OTHER_SLUG }) }), at).page;
    const firstStored: Data = { ...(buildAdminEventRecord(first, at) as unknown as Data), page: publishedPage };
    db.put(EVENTS_COLLECTION, first.id, firstStored);

    const upserted: Data = { ...stored, title: "Título masivo" };
    delete upserted.page;
    await upsertEventsWithPages(db, [upserted as unknown as AdminEventRecord], later);
    expect(storedEvent(db, "edicion-a")?.title).toBe("Título masivo");
    expect(storedEvent(db, "edicion-a")?.page).toStrictEqual(stored.page);

    const seed: AdminEventRecord[] = defaultEvents.map((event) => ({
      ...event,
      page: undefined,
      createdAt: LATER,
      updatedAt: LATER,
    }));
    await upsertEventsWithPages(db, seed, later);
    expect(storedEvent(db, first.id)?.page).toStrictEqual(firstStored.page);
    expect(storedEvent(db, first.id)?.createdAt).toBe(firstStored.createdAt);
  });

  it("una ficha guardada con estructura inválida no tumba el evento: se lista sin ficha y un guardado sin page la conserva", async () => {
    const db = new FakeFirestore();
    const base = buildAdminEventRecord(payload(), at) as unknown as Data;
    db.put(EVENTS_COLLECTION, "edicion-a", { ...base, page: { slug: "No Válido", publication: "published" } });

    const event = await getStoredAdminEvent(db, "edicion-a");
    expect(event?.id).toBe("edicion-a");
    expect(event?.page).toBeUndefined();

    const saved = await updateEventFromPayload(db, "edicion-a", payload({ title: "Otro título" }), later);
    expect(saved.title).toBe("Otro título");
    expect(saved.page).toBeUndefined();
    expect(storedEvent(db, "edicion-a")?.page).toStrictEqual({ slug: "No Válido", publication: "published" });
    // Un slug inválido nunca se usa como id de reserva.
    expect(db.ids(EVENT_PAGE_SLUGS_COLLECTION)).toEqual([]);
  });

  it("distingue una colección vacía y un documento inexistente", async () => {
    const db = new FakeFirestore();
    expect(await listStoredAdminEvents(db)).toEqual({ empty: true, events: [] });
    expect(await getStoredAdminEvent(db, "no-existe")).toBeNull();
  });
});

// ---------------------------------------------------------------------------------------------------------
// Errores HTTP
// ---------------------------------------------------------------------------------------------------------

describe("errores para la API", () => {
  it("el cuerpo de error lleva los errores por campo cuando existen", () => {
    expect(toErrorBody(new ApiError(400, "Ficha inválida.", { "page.overview": "Es obligatorio." }))).toEqual({
      ok: false,
      message: "Ficha inválida.",
      errors: { "page.overview": "Es obligatorio." },
    });
    expect(toErrorBody(new ApiError(401, "Missing authorization token."))).toEqual({
      ok: false,
      message: "Missing authorization token.",
    });
  });

  it("un payload que no es un objeto o al que le faltan datos obligatorios es un 400", async () => {
    const db = new FakeFirestore();
    await expectApiError(createEventFromPayload(db, null, at), 400);
    await expectApiError(updateEventFromPayload(db, "edicion-a", null, at), 400);
    await expectApiError(updateEventFromPayload(db, "edicion-a", "texto", at), 400);
    await expectApiError(createEventFromPayload(db, payload({ title: "" }), at), 400);
    expect(db.commits).toHaveLength(0);
  });

  it("una ficha inválida devuelve todos los errores por campo de la validación", async () => {
    const db = new FakeFirestore();
    const error = await expectApiError(
      createEventFromPayload(
        db,
        payload({ page: page({ overview: [], resources: [{ title: "Sin enlace", url: "javascript:alert(1)" }] }) }),
        at,
      ),
      400,
    );
    expect(Object.keys(error.errors ?? {})).toEqual(expect.arrayContaining(["overview", "resources.0.url"]));
  });
});

// ---------------------------------------------------------------------------------------------------------
// Concurrencia simulada: conflicto y reintento
// ---------------------------------------------------------------------------------------------------------

describe("transacciones concurrentes (adaptador simulado)", () => {
  it("dos administradores reservan el mismo slug a la vez: uno gana y el otro recibe 409 sin escritura parcial", async () => {
    const db = new FakeFirestore();
    holdFirstAttempts(db, 2);

    const results = await Promise.allSettled([
      createEventFromPayload(db, payload({ id: "edicion-a", page: page() }), at),
      createEventFromPayload(db, payload({ id: "edicion-b", title: "Edición B", page: page() }), at),
    ]);

    const won = results.filter((result) => result.status === "fulfilled");
    const lost = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    expect(won).toHaveLength(1);
    expect(lost).toHaveLength(1);
    expect(lost[0].reason).toBeInstanceOf(ApiError);
    expect((lost[0].reason as ApiError).status).toBe(409);

    const winner = (won[0] as PromiseFulfilledResult<AdminEventRecord>).value.id;
    const loser = winner === "edicion-a" ? "edicion-b" : "edicion-a";
    // Hubo conflicto real: el perdedor reintentó y entonces vio la reserva del ganador.
    expect(db.aborts).toBe(1);
    expect(db.commits).toHaveLength(1);
    expect(reservation(db, SLUG)).toEqual({ eventId: winner, retired: false });
    expect(storedEvent(db, winner)?.page).toMatchObject({ slug: SLUG });
    expect(storedEvent(db, loser)).toBeUndefined();
  });

  it("dos guardados del mismo propietario a la vez: el segundo reintenta y ninguno pierde la reserva", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    const commits = db.commits.length;
    holdFirstAttempts(db, 2);

    const results = await Promise.allSettled([
      updateEventFromPayload(db, "edicion-a", payload({ title: "Primero", page: page() }), later),
      updateEventFromPayload(db, "edicion-a", payload({ title: "Segundo", page: page() }), later),
    ]);

    expect(results.every((result) => result.status === "fulfilled")).toBe(true);
    expect(db.aborts).toBe(1);
    expect(db.commits).toHaveLength(commits + 2);
    expect(["Primero", "Segundo"]).toContain(storedEvent(db, "edicion-a")?.title);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: false });
  });

  it("borrar mientras otro guarda: la reserva queda retirada y el guardado no la reactiva", async () => {
    const db = new FakeFirestore();
    await createEventFromPayload(db, payload({ page: page() }), at);
    holdFirstAttempts(db, 2);

    const [deleted, updated] = await Promise.allSettled([
      deleteEventWithPage(db, "edicion-a"),
      updateEventFromPayload(db, "edicion-a", payload({ title: "Editado", page: page() }), later),
    ]);

    expect(deleted.status).toBe("fulfilled");
    expect(db.aborts).toBe(1);
    expect(reservation(db, SLUG)).toEqual({ eventId: "edicion-a", retired: true });
    if (updated.status === "rejected") {
      // El guardado reintentó después del borrado: el slug ya estaba retirado.
      expect((updated.reason as ApiError).status).toBe(409);
    }
    expect(storedEvent(db, "edicion-a")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------------------------------------
// Puerta de integración con Firestore real (emulador local). BLOQUEADA por defecto.
//
// No hay proyecto de prueba autorizado ni credenciales (R3), así que esta prueba se salta salvo que se ejecute
// explícitamente contra el emulador local con un proyecto «demo-» (Firebase reserva ese prefijo para emuladores
// y nunca toca producción):
//
//   java -jar cloud-firestore-emulator-*.jar --host=127.0.0.1 --port=8085      (o firebase emulators:start)
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 C3_EMULATOR_PROJECT_ID=demo-c3-eventos pnpm --filter @c3/admin test
//
// La confirmación en un proyecto Firebase de prueba autorizado (plan T2) sigue pendiente.
// ---------------------------------------------------------------------------------------------------------

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST ?? "";
const emulatorProject = process.env.C3_EMULATOR_PROJECT_ID ?? "";
const emulatorGate =
  /^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(emulatorHost) && /^demo-[a-z0-9-]+$/.test(emulatorProject);

describe.skipIf(!emulatorGate)("puerta de integración: emulador local de Firestore", () => {
  it("dos reservas concurrentes del mismo slug: una gana, la otra recibe 409 y no queda escritura parcial", async () => {
    const { deleteApp, initializeApp } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");
    const app = initializeApp({ projectId: emulatorProject }, `t2-gate-${Date.now()}`);
    const db = getFirestore(app);
    const run = Date.now().toString(36);
    const slug = `gate-${run}`;
    const ids = [`gate-a-${run}`, `gate-b-${run}`];

    try {
      const results = await Promise.allSettled(
        ids.map((id) => createEventFromPayload(db, payload({ id, title: `Gate ${id}`, page: page({ slug }) }), at)),
      );
      const won = results.filter((result) => result.status === "fulfilled");
      const lost = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      expect(won).toHaveLength(1);
      expect(lost).toHaveLength(1);
      expect((lost[0].reason as ApiError).status).toBe(409);

      const winner = (won[0] as PromiseFulfilledResult<AdminEventRecord>).value.id;
      const loser = ids.find((id) => id !== winner) as string;
      const reservationDoc = await db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(slug).get();
      expect(reservationDoc.data()).toEqual({ eventId: winner, retired: false });
      expect((await db.collection(EVENTS_COLLECTION).doc(loser).get()).exists).toBe(false);

      await deleteEventWithPage(db, winner);
      expect((await db.collection(EVENTS_COLLECTION).doc(winner).get()).exists).toBe(false);
      expect((await db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(slug).get()).data()).toEqual({
        eventId: winner,
        retired: true,
      });
      await expectApiError(createEventFromPayload(db, payload({ id: winner, page: page({ slug }) }), at), 409);
    } finally {
      await db.collection(EVENT_PAGE_SLUGS_COLLECTION).doc(slug).delete();
      await Promise.all(ids.map((id) => db.collection(EVENTS_COLLECTION).doc(id).delete()));
      await deleteApp(app);
    }
    // Conexión real y reintentos con espera exponencial ante la contención: más que los 5 s por defecto.
  }, 60_000);
});
