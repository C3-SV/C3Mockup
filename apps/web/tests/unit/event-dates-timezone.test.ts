import { describe, expect, it } from "vitest";
import { formatEventSchedule, type EventItem } from "@c3/config";

/**
 * H1 (auditoría SEO 2026-11-17): las fechas civiles AAAA-MM-DD se parsean como medianoche UTC. Formatearlas
 * con la zona del proceso o del navegador desplaza el día en El Salvador (UTC-6). La fecha debe mostrarse
 * igual en cualquier zona horaria: se ejecuta con TZ=UTC y con TZ=America/El_Salvador.
 */

const base = {
  id: "t",
  title: "Evento",
  status: "Próximamente",
  eventDate: "2026-03-05",
} as unknown as EventItem;

describe("formatEventSchedule: fecha civil independiente de la zona horaria", () => {
  it("muestra el día civil de un evento de un solo día", () => {
    expect(formatEventSchedule({ ...base, eventDate: "2026-03-05" })).toBe("5 mar 2026");
  });

  it("muestra el primer día de mes sin retroceder al mes anterior", () => {
    expect(formatEventSchedule({ ...base, eventDate: "2026-04-01" })).toBe("1 abr 2026");
  });

  it("muestra un rango de fechas con los días civiles correctos", () => {
    expect(formatEventSchedule({ ...base, eventDate: "2026-03-05", eventDateEnd: "2026-03-07" })).toBe(
      "5–7 mar 2026",
    );
  });
});
