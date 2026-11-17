import { describe, expect, it } from "vitest";
import { buildAdminEventRecord } from "@c3/config";
import {
  buildEventPayload,
  buildPagePayload,
  createEmptyMemoryDraft,
  createEmptyPageDraft,
  isPageErrorPath,
  normalizeDraft,
  validatePageDraft,
} from "@/lib/event-draft";
import { makeAdminEvent } from "./fixtures/event-page-fixtures";

const NOW = "2026-11-13T12:00:00.000Z";

describe("normalizeDraft / buildEventPayload (una sola normalización)", () => {
  it("conserva ficha, memoria, portada, origen y campos legados en la ida y vuelta sin cambios", () => {
    const event = makeAdminEvent();
    const payload = buildEventPayload(normalizeDraft(event));

    expect(payload.page).toEqual(event.page);
    expect(payload.cover).toEqual(event.cover);
    expect(payload.source).toBe("seed:prueba");
    expect(payload).toMatchObject({
      id: "evento-prueba",
      title: "Evento de prueba",
      cta: "Ver evento",
      href: "https://hackathon.c3.com.sv",
      external: true,
      featured: true,
      featuredOrder: "3",
      eventDate: "2025-05-10",
      eventDateEnd: "2025-05-11",
      status: "Histórico",
      kind: "hackathon",
      lines: ["compite", "crea"],
    });
  });

  it("el payload de una vuelta sin cambios sobrevive al constructor del servidor igual que el registro guardado", () => {
    const event = makeAdminEvent();
    const rebuilt = buildAdminEventRecord(buildEventPayload(normalizeDraft(event)), { now: NOW });

    expect(rebuilt.page).toEqual(event.page);
    expect(rebuilt.cover).toEqual(event.cover);
    expect(rebuilt.source).toBe(event.source);
  });

  it("un evento sin ficha no envía la clave page (el servidor conserva la guardada)", () => {
    const event = makeAdminEvent({ page: undefined });
    const draft = normalizeDraft(event);

    expect(draft.page).toBeUndefined();
    expect("page" in buildEventPayload(draft)).toBe(false);
    expect("page" in buildEventPayload(normalizeDraft(null))).toBe(false);
  });

  it("omite los opcionales vacíos pero envía las filas en blanco tal cual (los índices de error coinciden)", () => {
    const page = createEmptyPageDraft();
    page.slug = "  mi-edicion ";
    page.resources = [
      { title: "", url: "" },
      { title: "Guía", url: "https://c3.com.sv/guia" },
    ];

    const payload = buildPagePayload(page);

    expect(payload).toEqual({
      slug: "mi-edicion",
      publication: "draft",
      overview: [""],
      resources: [
        { title: "", url: "" },
        { title: "Guía", url: "https://c3.com.sv/guia" },
      ],
    });
  });

  it("memory: null se envía de forma explícita; memory undefined se omite", () => {
    const base = normalizeDraft(makeAdminEvent()).page!;

    expect(buildPagePayload({ ...base, memory: null }).memory).toBeNull();
    expect("memory" in buildPagePayload({ ...base, memory: undefined })).toBe(false);
    expect(buildPagePayload({ ...base, memory: createEmptyMemoryDraft() }).memory).toMatchObject({
      publication: "draft",
      summary: [""],
    });
  });

  it("la confirmación de derechos viaja como booleano y la galería sin confirmar no se oculta", () => {
    const base = normalizeDraft(makeAdminEvent()).page!;
    const memory = { ...base.memory!, gallery: [{ url: "https://c3.com.sv/a.jpg", alt: "A", caption: "", rightsConfirmed: false }] };

    const payload = buildPagePayload({ ...base, memory });

    expect((payload.memory as { gallery: unknown[] }).gallery).toEqual([
      { url: "https://c3.com.sv/a.jpg", alt: "A", rightsConfirmed: false },
    ]);
  });
});

describe("validatePageDraft (validador compartido, mismas claves que el servidor)", () => {
  it("una ficha completa y terminada no tiene errores", () => {
    expect(validatePageDraft(normalizeDraft(makeAdminEvent()), NOW)).toEqual({});
  });

  it("sin ficha no hay nada que validar", () => {
    expect(validatePageDraft(normalizeDraft(makeAdminEvent({ page: undefined })), NOW)).toEqual({});
  });

  it("publicar sin resumen produce overview; la memoria sin resumen produce memory.summary", () => {
    const draft = normalizeDraft(makeAdminEvent());
    draft.page!.overview = [""];
    draft.page!.memory!.summary = [];

    const errors = validatePageDraft(draft, NOW);

    expect(errors.overview).toMatch(/resumen/i);
    expect(errors["memory.summary"]).toMatch(/resumen/i);
  });

  it("R9: sin fecha final confirmada la memoria no se publica y el error dice por qué", () => {
    const draft = normalizeDraft(makeAdminEvent({ status: "Próximamente", eventDate: "2025-05-10", eventDateEnd: undefined }));

    const errors = validatePageDraft(draft, NOW);

    expect(errors["memory.publication"]).toMatch(/fecha final/i);
    expect(errors["memory.publication"]).toMatch(/Histórico/);
  });

  it("la lista de un slug con mayúsculas o cortísimo se rechaza con el patrón compartido", () => {
    const draft = normalizeDraft(null);
    draft.page = { ...createEmptyPageDraft(), slug: "AB" };

    expect(validatePageDraft(draft, NOW).slug).toBeDefined();
  });

  it("cuenta puntos de código Unicode, no unidades UTF-16 (sin depender de maxLength)", () => {
    const draft = normalizeDraft(makeAdminEvent());
    // 300 emojis = 600 unidades UTF-16 pero 300 puntos de código: el límite de ubicación es 300.
    draft.page!.location = "😀".repeat(300);
    expect(validatePageDraft(draft, NOW).location).toBeUndefined();

    draft.page!.location = "😀".repeat(301);
    expect(validatePageDraft(draft, NOW).location).toBeDefined();
  });
});

describe("isPageErrorPath", () => {
  it("reconoce las claves que tienen control en la ficha y deja fuera las demás", () => {
    for (const path of ["slug", "overview", "overview.2", "memory.results.0.value", "memory.gallery.1.rightsConfirmed", "participation.url", "page"]) {
      expect(isPageErrorPath(path)).toBe(true);
    }
    for (const path of ["id", "title", "memory.nope", "resources.x"]) {
      expect(isPageErrorPath(path)).toBe(false);
    }
  });
});
