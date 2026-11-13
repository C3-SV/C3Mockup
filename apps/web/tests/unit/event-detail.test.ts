import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Repositorio de detalle (T4, spec §6): slug → reserva activa → documento real → proyección pública.
 * Sin reserva, documento, ficha publicada o dato válido → null (404). Un fallo de infraestructura se propaga:
 * nunca se simula un 404 ni se recurre a defaultEvents.
 */

type Doc = Record<string, unknown>;
const store = vi.hoisted(() => ({
  reservations: new Map<string, unknown>(),
  events: new Map<string, unknown>(),
  failOn: null as null | "reservations" | "events",
  reads: [] as string[],
}));

vi.mock("@/lib/events", () => ({
  getAdminFirestore: () => ({
    collection: (name: string) => ({
      doc: (id: string) => ({
        get: async () => {
          store.reads.push(`${name}/${id}`);
          if (store.failOn === (name === "eventPageSlugs" ? "reservations" : "events")) {
            throw new Error("Firestore no disponible");
          }
          const source = name === "eventPageSlugs" ? store.reservations : store.events;
          const data = source.get(id);
          return { exists: data !== undefined, id, data: () => data };
        },
      }),
    }),
  }),
}));

import { getPublicEventBySlug } from "@/lib/event-detail";

const SLUG = "copa-salvadorena-programacion-2026";

function eventDoc(over: Doc = {}): Doc {
  return {
    title: "Copa Salvadoreña de Programación 2026",
    description: "Competencia nacional de programación.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    eventDate: "2026-08-01",
    page: { slug: SLUG, publication: "published", overview: ["Primer párrafo."], resources: [] },
    ...over,
  };
}

beforeEach(() => {
  store.reservations.clear();
  store.events.clear();
  store.failOn = null;
  store.reads.length = 0;
});

describe("getPublicEventBySlug", () => {
  it("devuelve el evento con su ficha pública cuando hay reserva activa y ficha publicada", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set("copa-2026", eventDoc());

    const event = await getPublicEventBySlug(SLUG);

    expect(event?.id).toBe("copa-2026");
    expect(event?.page?.slug).toBe(SLUG);
    expect(event?.page?.publication).toBe("published");
  });

  it("sin reserva para el slug → null", async () => {
    store.events.set("copa-2026", eventDoc());
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("reserva retirada → null, aunque el documento exista con ficha publicada", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: true });
    store.events.set("copa-2026", eventDoc());
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("reserva con forma inválida → null", async () => {
    store.reservations.set(SLUG, { eventId: 7 });
    store.events.set("copa-2026", eventDoc());
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("evento borrado (reserva sin documento) → null", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("ficha en borrador → null", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set("copa-2026", eventDoc({ page: { slug: SLUG, publication: "draft", overview: ["Texto."], resources: [] } }));
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("documento sin ficha o con ficha inválida → null", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set("copa-2026", eventDoc({ page: undefined }));
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();

    store.events.set("copa-2026", eventDoc({ page: { slug: SLUG, publication: "published", overview: [] } }));
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("evento base inválido (sin título) → null", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set("copa-2026", eventDoc({ title: "" }));
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("el documento reservado debe llevar el mismo slug: otro slug en la ficha → null", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set(
      "copa-2026",
      eventDoc({ page: { slug: "otra-edicion-2027", publication: "published", overview: ["Texto."], resources: [] } }),
    );
    await expect(getPublicEventBySlug(SLUG)).resolves.toBeNull();
  });

  it("un slug con forma inválida es null y no consulta Firestore", async () => {
    for (const slug of ["", "ab", "Mayusculas", "con espacio", "../events", "a/b", "x".repeat(121), "doble--guion"]) {
      await expect(getPublicEventBySlug(slug)).resolves.toBeNull();
    }
    expect(store.reads).toEqual([]);
  });

  it("la memoria en borrador y los derechos de la galería no salen de la proyección", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set(
      "copa-2026",
      eventDoc({
        page: {
          slug: SLUG,
          publication: "published",
          overview: ["Texto."],
          resources: [],
          memory: { publication: "draft", summary: ["Borrador secreto."], learnings: [], results: [], outputs: [], gallery: [] },
        },
      }),
    );

    const event = await getPublicEventBySlug(SLUG);

    expect(event?.page?.memory).toBeUndefined();
    expect(JSON.stringify(event)).not.toContain("Borrador secreto");
  });

  it("la memoria publicada se muestra aunque el reloj no coincida con las fechas guardadas (R13)", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.events.set(
      "copa-2026",
      eventDoc({
        eventDate: "2099-01-01",
        page: {
          slug: SLUG,
          publication: "published",
          overview: ["Texto."],
          resources: [],
          memory: { publication: "published", summary: ["Lo que pasó."], learnings: [], results: [], outputs: [], gallery: [] },
        },
      }),
    );

    const event = await getPublicEventBySlug(SLUG);
    expect(event?.page?.memory?.summary).toEqual(["Lo que pasó."]);
  });

  it("si Firestore falla al leer la reserva, rechaza: ni null ni defaultEvents", async () => {
    store.failOn = "reservations";
    await expect(getPublicEventBySlug(SLUG)).rejects.toThrow("Firestore no disponible");
    await expect(getPublicEventBySlug("copa-salvadorena-programacion")).rejects.toThrow("Firestore no disponible");
  });

  it("si Firestore falla al leer el documento, rechaza", async () => {
    store.reservations.set(SLUG, { eventId: "copa-2026", retired: false });
    store.failOn = "events";
    await expect(getPublicEventBySlug(SLUG)).rejects.toThrow("Firestore no disponible");
  });

  it("los eventos por defecto nunca habilitan una ficha", async () => {
    // Con Firestore vacío, ni el id ni el slug de un evento por defecto resuelven.
    await expect(getPublicEventBySlug("copa-salvadorena-programacion")).resolves.toBeNull();
    await expect(getPublicEventBySlug("hackathon-c3")).resolves.toBeNull();
  });
});
