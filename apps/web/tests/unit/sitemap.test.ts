import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Sitemap (T5, spec §8): solo fichas publicadas de documentos reales, con reserva activa y updatedAt real. Ni
 * borradores, ni reservas huérfanas o retiradas, ni defaultEvents como fichas.
 */

type Doc = Record<string, unknown>;
const store = vi.hoisted(() => ({
  reservations: new Map<string, unknown>(),
  events: new Map<string, unknown>(),
  failEvents: false,
}));

vi.mock("@/lib/events", () => ({
  // Las rutas generales usan getPublicEvents (con su respaldo); las fichas nunca salen de ahí.
  getPublicEvents: async () => [],
  getAdminFirestore: () => ({
    collection: (name: string) => ({
      get: async () => {
        if (store.failEvents) throw new Error("Firestore no disponible");
        return { docs: [...store.events].map(([id, data]) => ({ id, data: () => data })) };
      },
      doc: (id: string) => ({
        get: async () => {
          const data = (name === "eventPageSlugs" ? store.reservations : store.events).get(id);
          return { exists: data !== undefined, id, data: () => data };
        },
      }),
    }),
  }),
}));

import sitemap from "@/app/sitemap";
import { getPublishedEventPages } from "@/lib/event-detail";
import { publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";

function eventDoc(slug: string, over: Doc = {}, pageOver: Doc = {}): Doc {
  return {
    title: `Evento ${slug}`,
    description: "Descripción del evento.",
    lines: ["compite"],
    status: "Histórico",
    cta: "Ver",
    href: "https://copa.c3.com.sv",
    external: true,
    updatedAt: "2026-11-10T15:30:00.000Z",
    page: { slug, publication: "published", overview: ["Texto."], resources: [], ...pageOver },
    ...over,
  };
}

function publish(slug: string, eventId: string, over: Doc = {}, pageOver: Doc = {}) {
  store.reservations.set(slug, { eventId, retired: false });
  store.events.set(eventId, eventDoc(slug, over, pageOver));
}

const pageUrl = (slug: string) => `${siteConfig.domain}/eventos/${slug}`;
const generalRoutes = publicRoutes.map((path) => `${siteConfig.domain}${path}`);

beforeEach(() => {
  store.reservations.clear();
  store.events.clear();
  store.failEvents = false;
});

describe("getPublishedEventPages", () => {
  it("devuelve solo eventos con ficha publicada y reserva activa de su propio slug", async () => {
    publish("copa-2026", "e1");
    // Borrador: la proyección pública lo descarta.
    store.reservations.set("borrador-2026", { eventId: "e2", retired: false });
    store.events.set("e2", eventDoc("borrador-2026", {}, { publication: "draft" }));
    // Sin ficha.
    store.events.set("e3", { ...eventDoc("x"), page: undefined });
    // Publicada, pero sin reserva (huérfana).
    store.events.set("e4", eventDoc("huerfana-2026"));
    // Reserva retirada.
    store.reservations.set("retirada-2026", { eventId: "e5", retired: true });
    store.events.set("e5", eventDoc("retirada-2026"));
    // Reserva a nombre de otro evento.
    store.reservations.set("ajena-2026", { eventId: "otro", retired: false });
    store.events.set("e6", eventDoc("ajena-2026"));

    const pages = await getPublishedEventPages();

    expect(pages.map((event) => event.page?.slug)).toEqual(["copa-2026"]);
  });

  it("un fallo de Firestore se propaga: no hay respaldo a defaultEvents", async () => {
    store.failEvents = true;
    await expect(getPublishedEventPages()).rejects.toThrow("Firestore no disponible");
  });
});

describe("sitemap", () => {
  it("agrega las fichas publicadas con su URL canónica y su updatedAt real", async () => {
    publish("copa-2026", "e1", { updatedAt: "2026-11-10T15:30:00.000Z" });
    publish("hackathon-2025", "e2", { updatedAt: "2026-02-01T08:00:00.000Z" });

    const entries = await sitemap();
    const pages = entries.filter((entry) => entry.url.startsWith(`${siteConfig.domain}/eventos/`));

    expect(pages.map((entry) => entry.url).sort()).toEqual([pageUrl("copa-2026"), pageUrl("hackathon-2025")]);
    expect(pages.find((entry) => entry.url === pageUrl("copa-2026"))?.lastModified).toEqual(
      new Date("2026-11-10T15:30:00.000Z"),
    );
    expect(pages.find((entry) => entry.url === pageUrl("hackathon-2025"))?.lastModified).toEqual(
      new Date("2026-02-01T08:00:00.000Z"),
    );
  });

  it("sin fecha del documento no inventa ninguna: la entrada no lleva lastModified", async () => {
    publish("sin-fecha-2026", "e1", { updatedAt: undefined, createdAt: undefined });

    const entries = await sitemap();
    const page = entries.find((entry) => entry.url === pageUrl("sin-fecha-2026"));

    expect(page).toBeDefined();
    expect(page && "lastModified" in page).toBe(false);
  });

  it("borradores, reservas huérfanas o retiradas y defaultEvents no aparecen", async () => {
    store.reservations.set("borrador-2026", { eventId: "e2", retired: false });
    store.events.set("e2", eventDoc("borrador-2026", {}, { publication: "draft" }));
    store.events.set("e4", eventDoc("huerfana-2026"));
    store.reservations.set("retirada-2026", { eventId: "e5", retired: true });
    store.events.set("e5", eventDoc("retirada-2026"));

    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual(generalRoutes);
    const text = JSON.stringify(entries);
    for (const slug of ["borrador-2026", "huerfana-2026", "retirada-2026", "copa-salvadorena-programacion"]) {
      expect(text).not.toContain(slug);
    }
  });

  it("si Firestore falla, el sitemap falla (y se reintenta): no devuelve un sitemap sin fichas", async () => {
    store.failEvents = true;

    await expect(sitemap()).rejects.toThrow("Firestore no disponible");
  });
});
