import { describe, expect, it } from "vitest";
import {
  compareEventsBySchedule,
  elSalvadorDay,
  eventLastDay,
  isEventCurrentOrUpcoming,
} from "@c3/config";

/**
 * Regla única de tiempo (auditoría 2026-11-17, H2 y H3). Base: día civil de El Salvador (UTC−6 fijo, sin horario de
 * verano). Un evento sigue vigente o próximo hasta el final de su último día (fin, o inicio si no hay fin), a las
 * 24:00 hora de El Salvador. Equivale a: last day ≥ día local de El Salvador. Estos casos fijan los cortes de
 * medianoche; se ejecutan con TZ=UTC y con TZ=America/El_Salvador.
 *
 * Referencia de conversión: 23:59 El Salvador del día D = 05:59 UTC del día D+1; 00:00 El Salvador del día D+1 =
 * 06:00 UTC del día D+1.
 */

const base = { title: "E", status: "Próximamente" as const };

describe("elSalvadorDay", () => {
  it("usa el día local de El Salvador, no el UTC", () => {
    expect(elSalvadorDay(new Date("2026-03-06T05:59:59Z"))).toBe("2026-03-05");
    expect(elSalvadorDay(new Date("2026-03-06T06:00:00Z"))).toBe("2026-03-06");
  });

  it("devuelve undefined con una fecha inválida", () => {
    expect(elSalvadorDay(new Date("no-es-fecha"))).toBeUndefined();
  });
});

describe("eventLastDay", () => {
  it("usa el fin si es válido y no es anterior al inicio", () => {
    expect(eventLastDay({ eventDate: "2026-03-05", eventDateEnd: "2026-03-07" })).toBe("2026-03-07");
  });

  it("usa el inicio si no hay fin o el fin es anterior", () => {
    expect(eventLastDay({ eventDate: "2026-03-05" })).toBe("2026-03-05");
    expect(eventLastDay({ eventDate: "2026-03-05", eventDateEnd: "2026-03-01" })).toBe("2026-03-05");
  });

  it("ignora fechas inexistentes como 2026-02-30", () => {
    expect(eventLastDay({ eventDate: "2026-02-30" })).toBeUndefined();
  });
});

describe("isEventCurrentOrUpcoming: cortes de medianoche", () => {
  const sameDay = { ...base, eventDate: "2026-03-05" };

  it("un evento de un día sigue vigente durante todo su día en El Salvador", () => {
    // 2026-03-05 00:00 El Salvador = 06:00 UTC del 5
    expect(isEventCurrentOrUpcoming(sameDay, new Date("2026-03-05T06:00:00Z"))).toBe(true);
    // 2026-03-05 23:59:59 El Salvador = 05:59:59 UTC del 6
    expect(isEventCurrentOrUpcoming(sameDay, new Date("2026-03-06T05:59:59Z"))).toBe(true);
  });

  it("deja de ser vigente a las 24:00 de El Salvador del último día", () => {
    expect(isEventCurrentOrUpcoming(sameDay, new Date("2026-03-06T06:00:00Z"))).toBe(false);
  });

  it("un evento de varios días cuenta hasta el último día completo", () => {
    const multi = { ...base, eventDate: "2026-03-05", eventDateEnd: "2026-03-07" };
    expect(isEventCurrentOrUpcoming(multi, new Date("2026-03-08T05:59:59Z"))).toBe(true);
    expect(isEventCurrentOrUpcoming(multi, new Date("2026-03-08T06:00:00Z"))).toBe(false);
  });

  it("no depende de la zona del proceso: el mismo instante da la misma respuesta", () => {
    expect(isEventCurrentOrUpcoming(sameDay, new Date("2026-03-06T05:59:59Z"))).toBe(true);
    expect(isEventCurrentOrUpcoming(sameDay, new Date("2026-03-06T06:00:01Z"))).toBe(false);
  });

  it("Histórico nunca es vigente", () => {
    expect(
      isEventCurrentOrUpcoming({ ...sameDay, status: "Histórico" }, new Date("2026-03-05T12:00:00Z")),
    ).toBe(false);
  });

  it("sin fecha válida se trata como próximo, para no esconder un dato incompleto", () => {
    expect(isEventCurrentOrUpcoming({ ...base }, new Date("2026-03-05T12:00:00Z"))).toBe(true);
  });
});

describe("compareEventsBySchedule con un solo now", () => {
  const now = new Date("2026-03-06T05:59:59Z"); // 5 de marzo, 23:59 El Salvador

  it("un evento que empieza hoy y termina mañana queda antes que uno pasado", () => {
    const ongoing = { ...base, title: "A", eventDate: "2026-03-05", eventDateEnd: "2026-03-07", featured: false };
    const past = { ...base, title: "B", eventDate: "2026-02-01", featured: false };
    expect([past, ongoing].sort((a, b) => compareEventsBySchedule(a, b, now))[0]).toBe(ongoing);
  });

  it("los próximos van por inicio ascendente y los pasados por inicio descendente", () => {
    const later = { ...base, title: "L", eventDate: "2026-04-01", featured: false };
    const sooner = { ...base, title: "S", eventDate: "2026-03-20", featured: false };
    expect([later, sooner].sort((a, b) => compareEventsBySchedule(a, b, now))[0]).toBe(sooner);
  });
});
