import { describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import type { EventItem, PublicEventMemory, PublicEventPage } from "@c3/config";

/**
 * F1: /eventos pasa al componente cliente EventsCatalog solo lo que la tarjeta necesita. Nada del contenido de la
 * ficha (resumen, memoria, resultados, galería, materiales) viaja serializado al navegador, y la tarjeta es idéntica.
 */

const SECRET_OVERVIEW = "PARRAFO-DE-LA-FICHA-NO-VA-AL-CLIENTE";
const SECRET_SUMMARY = "RESUMEN-DE-MEMORIA-NO-VA-AL-CLIENTE";

const memory: PublicEventMemory = {
  publication: "published",
  summary: [SECRET_SUMMARY],
  learnings: ["APRENDIZAJE-PRIVADO"],
  results: [{ label: "Equipos", value: "120", context: "CONTEXTO-RESULTADO" }],
  outputs: [{ title: "SALIDA-PRIVADA", description: "descripción" }],
  gallery: [{ url: "https://cdn.c3.com.sv/foto.jpg", alt: "GALERIA-ALT" }],
};

function page(withMemory: boolean): PublicEventPage {
  return {
    slug: "copa-2026",
    publication: "published",
    overview: [SECRET_OVERVIEW],
    audience: "AUDIENCIA-PRIVADA",
    requirements: ["REQUISITO-PRIVADO"],
    participation: { label: "PARTICIPACION-PRIVADA", url: "https://copa.c3.com.sv/inscripcion" },
    resources: [{ title: "MATERIAL-PRIVADO", url: "https://c3.com.sv/m.pdf" }],
    ...(withMemory ? { memory } : {}),
  };
}

function makeEvent(over: Partial<EventItem> = {}): EventItem {
  return {
    id: "copa-2026",
    title: "Copa 2026",
    description: "Competencia nacional.",
    lines: ["compite"],
    status: "Histórico",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: false,
    eventDate: "2026-05-01",
    updatedAt: "2026-11-10T00:00:00.000Z",
    source: "admin",
    ...over,
  };
}

const events: EventItem[] = [
  makeEvent({ page: page(true) }),
  makeEvent({ id: "b", page: page(false) }),
  makeEvent({ id: "c" }),
];

vi.mock("@/lib/events", () => ({ getPublicEvents: async () => events }));

import EventosPage from "@/app/eventos/page";
import EventsCatalog from "@/components/EventsCatalog";
import { toCatalogCard, toCatalogEvent } from "@/lib/ds/event-card";

function findCatalogProps(node: ReactNode): { initialEvents: EventItem[] } | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findCatalogProps(child);
      if (found) return found;
    }
    return null;
  }
  const el = node as ReactElement<{ children?: ReactNode; initialEvents?: EventItem[] }>;
  if (el.type === EventsCatalog) return el.props as { initialEvents: EventItem[] };
  return findCatalogProps(el.props?.children);
}

describe("/eventos → EventsCatalog (componente cliente)", () => {
  it("las props serializadas no contienen contenido de la ficha ni de la memoria", async () => {
    const props = findCatalogProps((await EventosPage()) as ReactElement);
    expect(props).not.toBeNull();

    const serialized = JSON.stringify(props);
    for (const leaked of [
      SECRET_OVERVIEW,
      SECRET_SUMMARY,
      "APRENDIZAJE-PRIVADO",
      "CONTEXTO-RESULTADO",
      "SALIDA-PRIVADA",
      "GALERIA-ALT",
      "foto.jpg",
      "MATERIAL-PRIVADO",
      "AUDIENCIA-PRIVADA",
      "REQUISITO-PRIVADO",
      "PARTICIPACION-PRIVADA",
    ]) {
      expect(serialized).not.toContain(leaked);
    }
    expect(props?.initialEvents).toHaveLength(3);
  });

  it("la tarjeta es idéntica con el evento completo o reducido (con memoria, sin memoria y sin ficha)", () => {
    const now = new Date("2026-11-13T12:00:00Z");
    for (const event of events) {
      expect(toCatalogCard(toCatalogEvent(event), now)).toEqual(toCatalogCard(event, now));
    }
    expect(toCatalogCard(toCatalogEvent(events[0]), now).action).toBe("Ver memoria");
    expect(toCatalogCard(toCatalogEvent(events[1]), now).action).toBe("Ver evento");
    expect(toCatalogCard(toCatalogEvent(events[2]), now).action).toBe("Ir a la Copa");
  });
});
