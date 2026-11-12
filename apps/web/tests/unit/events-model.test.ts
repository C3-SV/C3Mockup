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
