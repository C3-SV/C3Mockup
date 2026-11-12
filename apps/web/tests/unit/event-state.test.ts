import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import { isUpcomingEvent, toPillState } from "@/lib/ds/event-state";

/** Estados de evento (Tarea 3.2): la pastilla muestra el texto actual del sitio; solo cambia el tono. */

describe("toPillState", () => {
  it("mapea cada estado conocido a su tono y conserva el texto", () => {
    expect(toPillState("Inscripciones abiertas")).toEqual({ label: "Inscripciones abiertas", tone: "exito" });
    expect(toPillState("Próximamente")).toEqual({ label: "Próximamente", tone: "neutro" });
    expect(toPillState("Histórico")).toEqual({ label: "Histórico", tone: "neutro" });
    expect(toPillState("Apoyo institucional")).toEqual({ label: "Apoyo institucional", tone: "info" });
  });

  it("un estado desconocido queda neutro con su texto original", () => {
    expect(toPillState("Algo nuevo")).toEqual({ label: "Algo nuevo", tone: "neutro" });
  });

  it("un nombre de propiedad de JavaScript no se confunde con un estado", () => {
    expect(toPillState("constructor")).toEqual({ label: "constructor", tone: "neutro" });
  });
});

describe("isUpcomingEvent", () => {
  const now = new Date("2026-06-01T12:00:00Z");

  it("un evento con fecha futura es próximo", () => {
    expect(isUpcomingEvent(defaultEvents[0], now)).toBe(true);
  });

  it("un evento con fecha pasada no es próximo", () => {
    expect(isUpcomingEvent(defaultEvents[4], now)).toBe(false);
  });

  it("un evento histórico no es próximo aunque tenga fecha futura", () => {
    const event: Pick<EventItem, "eventDate" | "eventDateEnd" | "status"> = {
      eventDate: "2027-01-01",
      status: "Histórico",
    };
    expect(isUpcomingEvent(event, now)).toBe(false);
  });

  it("sin fecha, o con una fecha que no existe, se trata como próximo", () => {
    expect(isUpcomingEvent({ status: "Próximamente" }, now)).toBe(true);
    expect(isUpcomingEvent({ eventDate: "no-es-fecha", status: "Próximamente" }, now)).toBe(true);
  });

  it("un evento de varios días sigue próximo mientras no termine el último día", () => {
    const event = { eventDate: "2026-07-11", eventDateEnd: "2026-07-12", status: "Inscripciones abiertas" as const };
    expect(isUpcomingEvent(event, new Date("2026-07-12T10:00:00Z"))).toBe(true);
    expect(isUpcomingEvent(event, new Date("2026-07-14T10:00:00Z"))).toBe(false);
  });

  it("si la fecha de fin es anterior a la de inicio, cuenta la más tardía", () => {
    const event = { eventDate: "2026-07-12", eventDateEnd: "2026-07-11", status: "Próximamente" as const };
    expect(isUpcomingEvent(event, new Date("2026-07-12T12:00:00Z"))).toBe(true);
  });
});
