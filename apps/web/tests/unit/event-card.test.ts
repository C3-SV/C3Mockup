import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem, type PublicEventPage } from "@c3/config";
import { toCatalogCard } from "@/lib/ds/event-card";

/** Tarjeta de experiencia (Tarea 3.2): conserva el texto del evento; «DEMO» nunca aparece. */

describe("toCatalogCard", () => {
  // Fecha de referencia fija: antes de la Copa (2026-08-01), para que el estado no dependa del día en que se corra.
  const ANTES_DE_LA_COPA = new Date("2026-06-01T12:00:00Z");

  it("un evento que ya terminó muestra «Histórico», no un estado abierto", () => {
    const card = toCatalogCard(defaultEvents[0], new Date("2026-11-12T12:00:00Z"));
    expect(card.state).toEqual({ label: "Histórico", tone: "neutro" });
  });

  it("la Copa: línea Compite, estado con tono exito, enlace externo y acción del evento", () => {
    const card = toCatalogCard(defaultEvents[0], ANTES_DE_LA_COPA);
    expect(card.line).toBe("compite");
    expect(card.otherLines).toEqual([]);
    expect(card.state).toEqual({ label: "Inscripciones abiertas", tone: "exito" });
    expect(card.external).toBe(true);
    expect(card.action).toBe("Ir a la Copa");
    expect(card.href).toBe("https://copa.c3.com.sv");
    expect(card.detail).toContain("2026");
  });

  it("varias líneas: la primera es la principal y el resto van aparte", () => {
    const card = toCatalogCard(defaultEvents[2]);
    expect(card.line).toBe("compite");
    expect(card.otherLines).toEqual(["conecta"]);
    expect(card.state).toEqual({ label: "Apoyo institucional", tone: "info" });
  });

  it("un evento histórico conserva su texto «Histórico»", () => {
    const card = toCatalogCard(defaultEvents[3]);
    expect(card.state).toEqual({ label: "Histórico", tone: "neutro" });
    expect(card.external).toBe(false);
  });

  it("sin fecha, el detalle queda vacío y no rompe la tarjeta", () => {
    const event: EventItem = { ...defaultEvents[0], eventDate: undefined, eventDateEnd: undefined };
    expect(toCatalogCard(event).detail).toBeUndefined();
  });

  it("con una fecha que no existe, el detalle queda vacío", () => {
    expect(toCatalogCard({ ...defaultEvents[0], eventDate: "no-es-fecha" }).detail).toBeUndefined();
  });

  it("con fin anterior al inicio no rompe el detalle", () => {
    const card = toCatalogCard({ ...defaultEvents[1], eventDate: "2026-07-12", eventDateEnd: "2026-07-11" });
    expect(typeof card.detail).toBe("string");
  });

  it("un estado desconocido se muestra con su texto original y tono neutro", () => {
    const card = toCatalogCard({ ...defaultEvents[0], status: "Algo nuevo" as EventItem["status"] });
    expect(card.state).toEqual({ label: "Algo nuevo", tone: "neutro" });
  });

  it("pasa el tipo de experiencia y la portada solo si existen", () => {
    const plain = toCatalogCard({ ...defaultEvents[0], kind: undefined, cover: undefined });
    expect(plain.kind).toBeUndefined();
    expect(plain.cover).toBeUndefined();

    const withCover = toCatalogCard({
      ...defaultEvents[0],
      kind: "hackathon",
      cover: { url: "https://copa.c3.com.sv/p.png", alt: "Portada" },
    });
    expect(withCover.kind).toBe("hackathon");
    expect(withCover.cover).toEqual({ url: "https://copa.c3.com.sv/p.png", alt: "Portada" });
  });

  it("nunca produce la palabra DEMO ni una propiedad demo", () => {
    const card = toCatalogCard(defaultEvents[0]);
    expect(card).not.toHaveProperty("demo");
    expect(JSON.stringify(card)).not.toMatch(/DEMO/);
  });
});

describe("toCatalogCard con ficha publicada (T4)", () => {
  const publishedPage: PublicEventPage = {
    slug: "copa-salvadorena-programacion-2026",
    publication: "published",
    overview: ["Descripción de la edición."],
    resources: [],
  };

  it("con ficha publicada apunta a /eventos/{slug}, es interna y dice «Ver evento»", () => {
    const card = toCatalogCard({ ...defaultEvents[0], page: publishedPage }, new Date("2026-06-01T12:00:00Z"));
    expect(card.href).toBe("/eventos/copa-salvadorena-programacion-2026");
    expect(card.external).toBe(false);
    expect(card.action).toBe("Ver evento");
  });

  it("con memoria publicada la acción es «Ver memoria»", () => {
    const page: PublicEventPage = {
      ...publishedPage,
      memory: { publication: "published", summary: ["Lo que pasó."], learnings: [], results: [], outputs: [], gallery: [] },
    };
    const card = toCatalogCard({ ...defaultEvents[0], page });
    expect(card.href).toBe("/eventos/copa-salvadorena-programacion-2026");
    expect(card.action).toBe("Ver memoria");
  });

  it("un borrador que llegara por error no cambia cta, href ni external", () => {
    const draft = { ...publishedPage, publication: "draft" } as unknown as PublicEventPage;
    const card = toCatalogCard({ ...defaultEvents[0], page: draft });
    expect(card.href).toBe("https://copa.c3.com.sv");
    expect(card.external).toBe(true);
    expect(card.action).toBe("Ir a la Copa");
  });

  it("sin ficha conserva exactamente cta, href y external de cada evento por defecto", () => {
    for (const event of defaultEvents) {
      const card = toCatalogCard(event);
      expect(card.action).toBe(event.cta);
      expect(card.href).toBe(event.href);
      expect(card.external).toBe(Boolean(event.external));
    }
  });

  it("una ficha con slug inválido no genera un enlace roto", () => {
    const bad = { ...publishedPage, slug: "../admin" };
    const card = toCatalogCard({ ...defaultEvents[0], page: bad });
    expect(card.href).toBe("https://copa.c3.com.sv");
    expect(card.action).toBe("Ir a la Copa");
  });
});
