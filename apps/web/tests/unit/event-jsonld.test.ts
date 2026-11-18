import { describe, expect, it } from "vitest";
import type { EventItem, PublicEventPage } from "@c3/config";
import { getEventJsonLd } from "@/lib/event-jsonld";

/**
 * JSON-LD Event de la ficha (auditoría 2026-11-17, H7). Solo se emite con datos verificados: nombre, fecha de inicio,
 * lugar (presencial con dirección, o virtual con enlace) y la URL de la ficha. Nada se inventa: sin hora, la fecha
 * va sola; sin dirección presencial, no hay Event.
 */

const page = (overrides: Partial<PublicEventPage> = {}): PublicEventPage => ({
  slug: "copa-2026",
  publication: "published",
  overview: ["Resumen."],
  resources: [],
  ...overrides,
});

const makeEvent = (overrides: Partial<EventItem> = {}, pageOverrides: Partial<PublicEventPage> = {}): EventItem => ({
  id: "copa-2026",
  title: "Copa Salvadoreña de Programación 2026",
  description: "Competencia de programación.",
  lines: ["compite"],
  status: "Próximamente",
  cta: "Ver evento",
  href: "/eventos/copa-2026",
  eventDate: "2026-12-01",
  eventDateEnd: "2026-12-02",
  page: page(pageOverrides),
  ...overrides,
});

const presencial = {
  modality: "presencial" as const,
  location: "ESEN",
  address: { venue: "ESEN", street: "Calle Principal", locality: "Antiguo Cuscatlán", region: "La Libertad" },
};

describe("getEventJsonLd", () => {
  it("no emite nada sin ficha publicada", () => {
    expect(getEventJsonLd(makeEvent({ page: undefined }))).toBeNull();
  });

  it("presencial con dirección: Event con Place y PostalAddress, URL de la ficha y fechas", () => {
    const json = getEventJsonLd(makeEvent({}, presencial));
    expect(json).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Copa Salvadoreña de Programación 2026",
      url: "https://c3.com.sv/eventos/copa-2026",
      startDate: "2026-12-01",
      endDate: "2026-12-02",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "ESEN",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Calle Principal",
          addressLocality: "Antiguo Cuscatlán",
          addressRegion: "La Libertad",
          addressCountry: "SV",
        },
      },
    });
  });

  it("presencial sin dirección no emite Event (no se inventa el lugar)", () => {
    expect(getEventJsonLd(makeEvent({}, { modality: "presencial", location: "ESEN" }))).toBeNull();
  });

  it("con hora de inicio la fecha lleva el desfase fijo de El Salvador (-06:00)", () => {
    const json = getEventJsonLd(makeEvent({}, { ...presencial, schedule: { startTime: "08:30", endTime: "17:00" } }));
    expect(json?.startDate).toBe("2026-12-01T08:30:00-06:00");
    expect(json?.endDate).toBe("2026-12-02T17:00:00-06:00");
  });

  it("virtual: VirtualLocation con el enlace de participación o el de la ficha", () => {
    const json = getEventJsonLd(
      makeEvent({}, { modality: "virtual", participation: { label: "Unirse", url: "https://meet.example.org/x" } }),
    );
    expect(json?.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(json?.location).toEqual({ "@type": "VirtualLocation", url: "https://meet.example.org/x" });
  });

  it("estados de agenda: cancelado, pospuesto y reprogramado", () => {
    expect(getEventJsonLd(makeEvent({}, { ...presencial, agendaStatus: "cancelado" }))?.eventStatus).toBe(
      "https://schema.org/EventCancelled",
    );
    expect(getEventJsonLd(makeEvent({}, { ...presencial, agendaStatus: "pospuesto" }))?.eventStatus).toBe(
      "https://schema.org/EventPostponed",
    );
    expect(getEventJsonLd(makeEvent({}, { ...presencial, agendaStatus: "reprogramado" }))?.eventStatus).toBe(
      "https://schema.org/EventRescheduled",
    );
  });

  it("organizador, ponentes, oferta y apertura de inscripción solo si existen", () => {
    const json = getEventJsonLd(
      makeEvent(
        {},
        {
          ...presencial,
          organizer: { name: "C3", url: "https://c3.com.sv" },
          speakers: ["Ana Pérez"],
          offer: { price: 0, currency: "USD" },
          registrationOpensOn: "2026-10-01",
        },
      ),
    );
    expect(json?.organizer).toEqual({ "@type": "Organization", name: "C3", url: "https://c3.com.sv" });
    expect(json?.performer).toEqual([{ "@type": "Person", name: "Ana Pérez" }]);
    expect(json?.offers).toMatchObject({ "@type": "Offer", price: 0, priceCurrency: "USD", validFrom: "2026-10-01" });
  });

  it("sin organizador, ponentes ni oferta no aparecen esos campos", () => {
    const json = getEventJsonLd(makeEvent({}, presencial));
    expect(json).not.toHaveProperty("organizer");
    expect(json).not.toHaveProperty("performer");
    expect(json).not.toHaveProperty("offers");
  });

  it("sin fecha de inicio válida no emite Event", () => {
    expect(getEventJsonLd(makeEvent({ eventDate: undefined }, presencial))).toBeNull();
  });
});
