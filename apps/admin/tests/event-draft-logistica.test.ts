import { describe, expect, it } from "vitest";
import { buildPagePayload, createEmptyPageDraft, normalizePageDraft, isPageErrorPath } from "@/lib/event-draft";

/**
 * Logística de la ficha en el admin (auditoría 2026-11-17, H9): el borrador guarda los campos como texto de formulario
 * y el payload los envía con la forma que valida @c3/config. Campos vacíos no se envían.
 */

describe("borrador de logística", () => {
  it("el borrador vacío no envía ninguno de los campos de logística", () => {
    const payload = buildPagePayload({ ...createEmptyPageDraft(), slug: "copa-2026" });
    for (const key of ["address", "schedule", "organizer", "speakers", "offer", "registrationOpensOn", "agendaStatus"]) {
      expect(payload).not.toHaveProperty(key);
    }
  });

  it("convierte el formulario en la forma del contrato", () => {
    const draft = createEmptyPageDraft();
    const payload = buildPagePayload({
      ...draft,
      slug: "copa-2026",
      logistics: {
        ...draft.logistics,
        venue: "ESEN",
        street: "Calle Principal",
        locality: "Antiguo Cuscatlán",
        startTime: "08:30",
        organizerName: "C3",
        organizerUrl: "https://c3.com.sv",
        speakers: "Ana Pérez\n\n  Luis Gómez  \n",
        offerPrice: "0",
        registrationOpensOn: "2026-10-01",
        agendaStatus: "reprogramado",
      },
    });
    expect(payload.address).toEqual({ venue: "ESEN", street: "Calle Principal", locality: "Antiguo Cuscatlán" });
    expect(payload.schedule).toEqual({ startTime: "08:30" });
    expect(payload.organizer).toEqual({ name: "C3", url: "https://c3.com.sv" });
    expect(payload.speakers).toEqual(["Ana Pérez", "Luis Gómez"]);
    expect(payload.offer).toEqual({ price: 0, currency: "USD" });
    expect(payload.registrationOpensOn).toBe("2026-10-01");
    expect(payload.agendaStatus).toBe("reprogramado");
  });

  it("un precio que no es número llega tal cual para que el servidor lo rechace con su mensaje", () => {
    const draft = createEmptyPageDraft();
    const payload = buildPagePayload({ ...draft, slug: "copa-2026", logistics: { ...draft.logistics, offerPrice: "gratis" } });
    expect(payload.offer).toEqual({ price: "gratis", currency: "USD" });
  });

  it("lee una ficha guardada con logística en el borrador", () => {
    const draft = normalizePageDraft({
      slug: "copa-2026",
      publication: "published",
      overview: ["Resumen."],
      resources: [],
      address: { venue: "ESEN", street: "Calle", locality: "Antiguo Cuscatlán", country: "El Salvador" },
      schedule: { startTime: "08:30", endTime: "17:00" },
      speakers: ["Ana"],
      offer: { price: 5, currency: "USD", url: "https://pago.example.org" },
      agendaStatus: "cancelado",
    });
    expect(draft?.logistics).toMatchObject({
      venue: "ESEN",
      street: "Calle",
      locality: "Antiguo Cuscatlán",
      startTime: "08:30",
      endTime: "17:00",
      speakers: "Ana",
      offerPrice: "5",
      offerUrl: "https://pago.example.org",
      agendaStatus: "cancelado",
    });
  });

  it("reconoce las rutas de error de logística como campos de la ficha", () => {
    expect(isPageErrorPath("address.street")).toBe(true);
    expect(isPageErrorPath("schedule.startTime")).toBe(true);
    expect(isPageErrorPath("offer.price")).toBe(true);
    expect(isPageErrorPath("speakers.0")).toBe(true);
    expect(isPageErrorPath("agendaStatus")).toBe(true);
  });
});
