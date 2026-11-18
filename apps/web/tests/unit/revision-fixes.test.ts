import { describe, expect, it } from "vitest";
import { compareEventsBySchedule, formatEventSchedule, type EventItem, type PublicEventPage } from "@c3/config";
import { getEventJsonLd } from "@/lib/event-jsonld";
import { getEventItemListEntry } from "@/lib/structured-data";

/**
 * Correcciones de la revisión independiente (2026-11-17): orden total, rango de fechas invertido, JSON-LD con país y
 * modalidad correctos, y enlace de listas sin dominio duplicado.
 */

const now = new Date("2026-11-17T12:00:00Z");
const ev = (over: Partial<EventItem>): EventItem =>
  ({ id: "x", title: "X", description: "d", lines: ["compite"], status: "Próximamente", cta: "c", href: "/eventos/x", ...over }) as EventItem;

describe("orden de eventos: un orden total con eventos sin fecha", () => {
  it("un evento sin fecha no rompe la transitividad con pasados y próximos", () => {
    const p1 = ev({ id: "p1", title: "Z", eventDate: "2025-09-12", status: "Histórico" });
    const p2 = ev({ id: "p2", title: "A", eventDate: "2024-03-01", status: "Histórico" });
    const u = ev({ id: "u", title: "M", status: "Próximamente" });
    const cmp = (a: EventItem, b: EventItem) => compareEventsBySchedule(a, b, now);
    const ordenes = [
      [p1, p2, u],
      [p1, u, p2],
      [u, p2, p1],
    ].map((list) => [...list].sort(cmp).map((e) => e.id));
    expect(new Set(ordenes.map((o) => o.join(","))).size).toBe(1);
  });

  it("un evento sin fecha no queda debajo de un evento histórico", () => {
    const a = ev({ id: "a", title: "Beta", eventDate: "2026-12-05", status: "Próximamente" });
    const n = ev({ id: "n", title: "Alfa", status: "Próximamente" });
    const q = ev({ id: "q", title: "Aaa", eventDate: "2026-01-10", status: "Histórico" });
    const orden = [a, n, q].sort((x, y) => compareEventsBySchedule(x, y, now)).map((e) => e.id);
    expect(orden.indexOf("n")).toBeLessThan(orden.indexOf("q"));
  });
});

describe("formatEventSchedule con fin anterior al inicio", () => {
  it("muestra solo el inicio, sin rango invertido", () => {
    expect(formatEventSchedule(ev({ eventDate: "2026-03-07", eventDateEnd: "2026-03-05" }))).toBe("7 mar 2026");
  });
});

const page = (over: Partial<PublicEventPage> = {}): PublicEventPage =>
  ({ slug: "copa", publication: "published", overview: ["r"], resources: [], ...over }) as PublicEventPage;

describe("Event JSON-LD: país y modalidad", () => {
  it("usa el país guardado de la dirección, no SV fijo", () => {
    const json = getEventJsonLd(
      ev({
        eventDate: "2026-12-01",
        page: page({
          modality: "presencial",
          location: "Sede",
          address: { street: "Calle", locality: "Ciudad", country: "Guatemala" },
        }),
      }),
    );
    expect((json?.location as { address: { addressCountry: string } }).address.addressCountry).toBe("Guatemala");
  });

  it("una modalidad híbrida con un solo lugar emitido no declara modo mixto", () => {
    const json = getEventJsonLd(
      ev({
        eventDate: "2026-12-01",
        page: page({
          modality: "hibrida",
          location: "Sede",
          address: { street: "Calle", locality: "Ciudad" },
        }),
      }),
    );
    expect(json?.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
  });
});

describe("enlace de listas de eventos", () => {
  it("un evento sin ficha con enlace https absoluto conserva su URL sin dominio duplicado", () => {
    const entry = getEventItemListEntry(ev({ href: "https://copa.c3.com.sv", external: false }));
    expect(entry.url).toBe("https://copa.c3.com.sv");
  });
});
