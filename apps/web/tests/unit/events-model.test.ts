import { describe, expect, it } from "vitest";
import {
  defaultEvents,
  experienceKinds,
  normalizeEventCover,
  normalizeExperienceKind,
} from "@c3/config";
import { parseEventDocument } from "@/lib/events-parse";

/** Modelo de eventos (Tarea 3.1): campos opcionales kind, cover y source; sin campo demo. */

const base = {
  title: "Taller de prueba",
  description: "Descripción del taller",
  lines: ["crea"],
  status: "Próximamente",
  cta: "Ver evento",
  href: "/eventos",
  eventDate: "2026-12-01",
};

describe("parseEventDocument", () => {
  it("un documento sin campos nuevos parsea igual que antes", () => {
    expect(parseEventDocument("doc-1", base)).toEqual({
      id: "doc-1",
      title: "Taller de prueba",
      description: "Descripción del taller",
      lines: ["crea"],
      status: "Próximamente",
      cta: "Ver evento",
      href: "/eventos",
      external: false,
      featured: false,
      eventDate: "2026-12-01",
    });
  });

  it("descarta el documento sin título, sin líneas o sin enlace", () => {
    expect(parseEventDocument("doc-x", { ...base, title: "" })).toBeNull();
    expect(parseEventDocument("doc-x", { ...base, lines: [] })).toBeNull();
    expect(parseEventDocument("doc-x", { ...base, href: "" })).toBeNull();
  });

  it("conserva una portada de un host de C3 con alt", () => {
    const event = parseEventDocument("doc-2", {
      ...base,
      cover: { url: "https://copa.c3.com.sv/portada.png", alt: "Portada de la Copa" },
    });
    expect(event?.cover).toEqual({ url: "https://copa.c3.com.sv/portada.png", alt: "Portada de la Copa" });
  });

  it("descarta una portada de un host ajeno", () => {
    const event = parseEventDocument("doc-3", {
      ...base,
      cover: { url: "https://evil.example/x.png", alt: "Algo" },
    });
    expect(event?.cover).toBeUndefined();
  });

  it("descarta una portada sin texto alternativo", () => {
    const event = parseEventDocument("doc-4", {
      ...base,
      cover: { url: "https://c3.com.sv/x.png", alt: "   " },
    });
    expect(event?.cover).toBeUndefined();
  });

  it("descarta una portada que no es https", () => {
    const event = parseEventDocument("doc-5", {
      ...base,
      cover: { url: "http://c3.com.sv/x.png", alt: "Portada" },
    });
    expect(event?.cover).toBeUndefined();
  });

  it("conserva un tipo de experiencia válido y descarta uno inválido", () => {
    expect(parseEventDocument("doc-6", { ...base, kind: "hackathon" })?.kind).toBe("hackathon");
    expect(parseEventDocument("doc-7", { ...base, kind: "otro" })?.kind).toBeUndefined();
  });

  it("ignora una clave demo: el sitio no tiene datos de demostración", () => {
    const event = parseEventDocument("doc-8", { ...base, demo: true });
    expect(event).not.toHaveProperty("demo");
  });

  it("recorta la fuente y la omite si está vacía", () => {
    expect(parseEventDocument("doc-9", { ...base, source: "  Fuente X  " })?.source).toBe("Fuente X");
    expect(parseEventDocument("doc-10", { ...base, source: "   " })?.source).toBeUndefined();
  });
});

describe("normalizadores de la configuración compartida", () => {
  it("normalizeExperienceKind acepta solo los tipos conocidos", () => {
    for (const kind of experienceKinds) {
      expect(normalizeExperienceKind(kind)).toBe(kind);
    }
    expect(normalizeExperienceKind("challenge")).toBeUndefined();
    expect(normalizeExperienceKind(42)).toBeUndefined();
  });

  it("normalizeEventCover exige https, host de C3 y alt no vacío", () => {
    expect(normalizeEventCover({ url: "https://c3.com.sv/a.png", alt: "A" })).toEqual({
      url: "https://c3.com.sv/a.png",
      alt: "A",
    });
    expect(normalizeEventCover({ url: "https://c3.com.sv.evil.example/a.png", alt: "A" })).toBeUndefined();
    expect(normalizeEventCover(null)).toBeUndefined();
  });

  it("los eventos por defecto declaran un tipo conocido", () => {
    for (const event of defaultEvents) {
      expect(experienceKinds).toContain(event.kind);
    }
  });
});

describe("parseEventDocument: ficha por edición (page)", () => {
  const publishedPage = {
    slug: "copa-2026",
    publication: "published",
    overview: ["Qué es la Copa."],
    resources: [{ title: "Bases", url: "/bases" }],
  };
  const gallery = [{ url: "https://media.c3.com.sv/a.webp", alt: "Equipo", rightsConfirmed: true }];

  it("sin page, la salida conserva exactamente las claves de antes (sin clave page)", () => {
    const event = parseEventDocument("doc-p0", base);
    expect(event).not.toBeNull();
    expect(Object.keys(event ?? {}).sort()).toEqual(
      [
        "cover",
        "createdAt",
        "cta",
        "description",
        "eventDate",
        "eventDateEnd",
        "external",
        "featured",
        "featuredOrder",
        "href",
        "id",
        "kind",
        "lines",
        "source",
        "status",
        "title",
        "updatedAt",
      ].sort(),
    );
  });

  it("los eventos por defecto no tienen ficha", () => {
    for (const event of defaultEvents) {
      expect(event.page).toBeUndefined();
    }
  });

  it("una ficha en borrador se omite y el evento base sigue", () => {
    const event = parseEventDocument("doc-p1", { ...base, page: { ...publishedPage, publication: "draft" } });
    expect(event).not.toBeNull();
    expect(event).not.toHaveProperty("page");
    expect(JSON.stringify(event)).not.toContain("Qué es la Copa");
  });

  it("una ficha publicada se proyecta como contenido público", () => {
    const event = parseEventDocument("doc-p2", { ...base, page: publishedPage });
    expect(event?.page).toEqual({
      slug: "copa-2026",
      publication: "published",
      overview: ["Qué es la Copa."],
      resources: [{ title: "Bases", url: "/bases" }],
    });
  });

  it("una ficha inválida (slug, tipos, no objeto) se omite sin perder el evento", () => {
    for (const page of [{ ...publishedPage, slug: "MAL SLUG" }, "texto", 12, [], { publication: "published" }]) {
      const event = parseEventDocument("doc-p3", { ...base, page });
      expect(event?.title).toBe("Taller de prueba");
      expect(event).not.toHaveProperty("page");
    }
  });

  it("la memoria en borrador no llega al público; la publicada sí y sin rightsConfirmed", () => {
    const draftMemory = { publication: "draft", summary: ["Texto interno"], gallery };
    const withDraft = parseEventDocument("doc-p4", { ...base, page: { ...publishedPage, memory: draftMemory } });
    expect(withDraft?.page).toBeDefined();
    expect(withDraft?.page).not.toHaveProperty("memory");
    expect(JSON.stringify(withDraft)).not.toContain("Texto interno");

    const withPublished = parseEventDocument("doc-p5", {
      ...base,
      page: { ...publishedPage, memory: { publication: "published", summary: ["Resumen público"], gallery } },
    });
    expect(withPublished?.page?.memory?.summary).toEqual(["Resumen público"]);
    expect(withPublished?.page?.memory?.gallery).toEqual([{ url: "https://media.c3.com.sv/a.webp", alt: "Equipo" }]);
    expect(JSON.stringify(withPublished)).not.toContain("rightsConfirmed");
  });

  it("una memoria inválida se omite y la ficha publicada se conserva", () => {
    const event = parseEventDocument("doc-p6", {
      ...base,
      page: {
        ...publishedPage,
        memory: {
          publication: "published",
          summary: ["x"],
          gallery: [{ url: "https://evil.example/x.png", alt: "a", rightsConfirmed: true }],
        },
      },
    });
    expect(event?.page?.slug).toBe("copa-2026");
    expect(event?.page).not.toHaveProperty("memory");
  });
});
