import { describe, expect, it } from "vitest";
import { projectPublicEventPage, validateEventPage, type EventPageValidationContext } from "@c3/config";

/**
 * Campos de logística de la ficha (auditoría 2026-11-17, H9): dirección estructurada, horario con zona fija de El
 * Salvador, organizador, ponentes, oferta, apertura de inscripción y estado de agenda. Todos opcionales: nunca se
 * inventan, y su ausencia no bloquea publicar. Solo se validan cuando llegan.
 */

const context: EventPageValidationContext = {
  event: { status: "Próximamente", eventDate: "2026-12-01" },
  now: "2026-11-17T12:00:00Z",
};

const base = {
  slug: "copa-2026",
  publication: "published",
  overview: ["Resumen de la edición."],
  resources: [],
};

const complete = {
  ...base,
  address: { venue: "ESEN", street: "Calle Principal", locality: "Antiguo Cuscatlán", region: "La Libertad", country: "El Salvador" },
  schedule: { startTime: "08:30", endTime: "17:00" },
  organizer: { name: "C3 Competitive Coding Club", url: "https://c3.com.sv" },
  speakers: ["Ana Pérez", "Luis Gómez"],
  offer: { price: 0, currency: "USD" },
  registrationOpensOn: "2026-10-01",
  agendaStatus: "programado",
};

describe("ficha: logística opcional", () => {
  it("una ficha sin logística sigue siendo válida (todo es opcional)", () => {
    expect(validateEventPage(base, context).ok).toBe(true);
  });

  it("acepta toda la logística bien formada", () => {
    const result = validateEventPage(complete, context);
    expect(result.ok).toBe(true);
  });

  it("la dirección exige calle y localidad", () => {
    const result = validateEventPage({ ...base, address: { venue: "ESEN", locality: "Antiguo Cuscatlán" } }, context);
    expect(result.ok).toBe(false);
    expect(result.ok ? {} : result.errors).toHaveProperty("address.street");
  });

  it("el horario usa HH:MM y el fin no puede ser anterior al inicio", () => {
    const badFormat = validateEventPage({ ...base, schedule: { startTime: "25:00" } }, context);
    expect(badFormat.ok ? {} : badFormat.errors).toHaveProperty("schedule.startTime");

    const reversed = validateEventPage({ ...base, schedule: { startTime: "17:00", endTime: "08:30" } }, context);
    expect(reversed.ok ? {} : reversed.errors).toHaveProperty("schedule.endTime");
  });

  it("la oferta exige precio no negativo y moneda USD", () => {
    const negative = validateEventPage({ ...base, offer: { price: -5, currency: "USD" } }, context);
    expect(negative.ok ? {} : negative.errors).toHaveProperty("offer.price");

    const currency = validateEventPage({ ...base, offer: { price: 10, currency: "EUR" } }, context);
    expect(currency.ok ? {} : currency.errors).toHaveProperty("offer.currency");
  });

  it("el organizador y la oferta solo aceptan enlaces https", () => {
    const result = validateEventPage({ ...base, organizer: { name: "C3", url: "http://c3.com.sv" } }, context);
    expect(result.ok ? {} : result.errors).toHaveProperty("organizer.url");
  });

  it("el estado de agenda solo acepta valores conocidos", () => {
    const result = validateEventPage({ ...base, agendaStatus: "suspendido" }, context);
    expect(result.ok ? {} : result.errors).toHaveProperty("agendaStatus");
  });

  it("la apertura de inscripción es un día civil real", () => {
    const result = validateEventPage({ ...base, registrationOpensOn: "2026-02-30" }, context);
    expect(result.ok ? {} : result.errors).toHaveProperty("registrationOpensOn");
  });

  it("la proyección pública conserva la logística publicada", () => {
    const result = validateEventPage(complete, context);
    if (!result.ok) throw new Error("la ficha completa debe validar");
    const projected = projectPublicEventPage(result.value);
    expect(projected?.address?.street).toBe("Calle Principal");
    expect(projected?.schedule).toEqual({ startTime: "08:30", endTime: "17:00" });
    expect(projected?.speakers).toEqual(["Ana Pérez", "Luis Gómez"]);
    expect(projected?.offer).toEqual({ price: 0, currency: "USD" });
    expect(projected?.agendaStatus).toBe("programado");
  });
});
