import { describe, expect, it } from "vitest";
import { buildAdminEventRecord } from "@c3/config";
import { buildEventPayload, coverDraftErrors, normalizeDraft, createEmptyDraft } from "@/lib/event-draft";

/**
 * Portada del evento por enlace (como las fotos de la galería): URL https y texto alternativo. No hay subida de
 * archivos. Sin URL no se envía portada; con URL exige texto alternativo.
 */

const NOW = "2026-11-17T12:00:00.000Z";
const base = {
  id: "evento-portada",
  title: "Evento con portada",
  description: "Descripción.",
  cta: "Ver evento",
  href: "https://c3.com.sv/evento",
  lines: ["compite"],
  status: "Próximamente",
};

describe("portada por enlace", () => {
  it("el formulario muestra la portada guardada", () => {
    const event = buildAdminEventRecord(
      { ...base, cover: { url: "https://cdn.example.org/p.jpg", alt: "Podio" } },
      { now: NOW },
    );
    const draft = normalizeDraft(event);
    expect(draft.coverUrl).toBe("https://cdn.example.org/p.jpg");
    expect(draft.coverAlt).toBe("Podio");
  });

  it("con URL y texto alternativo, el payload lleva la portada", () => {
    const draft = { ...createEmptyDraft(), coverUrl: "https://cdn.example.org/p.jpg", coverAlt: "Podio" };
    expect(buildEventPayload(draft).cover).toEqual({ url: "https://cdn.example.org/p.jpg", alt: "Podio" });
  });

  it("sin URL se envía cover: null para que el servidor borre la portada guardada", () => {
    expect(buildEventPayload(createEmptyDraft()).cover).toBeNull();
  });

  it("texto alternativo sin enlace avisa en vez de descartarse", () => {
    const draft = { ...createEmptyDraft(), coverAlt: "Podio" };
    expect(coverDraftErrors(draft)).toHaveProperty("coverUrl");
  });

  it("la URL debe ser https completa", () => {
    const draft = { ...createEmptyDraft(), coverUrl: "http://cdn.example.org/p.jpg", coverAlt: "Podio" };
    expect(coverDraftErrors(draft)).toHaveProperty("coverUrl");
    const local = { ...createEmptyDraft(), coverUrl: "/portada.jpg", coverAlt: "Podio" };
    expect(coverDraftErrors(local)).toHaveProperty("coverUrl");
  });

  it("con URL, el texto alternativo es obligatorio", () => {
    const draft = { ...createEmptyDraft(), coverUrl: "https://cdn.example.org/p.jpg", coverAlt: "  " };
    expect(coverDraftErrors(draft)).toHaveProperty("coverAlt");
  });

  it("una portada válida o vacía no genera errores", () => {
    expect(coverDraftErrors(createEmptyDraft())).toEqual({});
    const valid = { ...createEmptyDraft(), coverUrl: "https://cdn.example.org/p.jpg", coverAlt: "Podio" };
    expect(coverDraftErrors(valid)).toEqual({});
  });
});
