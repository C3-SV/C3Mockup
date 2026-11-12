import type { EventItem } from "@c3/config";
import { isUpcomingEvent } from "@/lib/ds/event-state";

/** Máximo de eventos en el destacado rotativo del home. */
export const ROTATION_MAX = 5;

/** Tiempo entre diapositivas, en milisegundos. Con movimiento reducido no rota. */
export const ROTATION_INTERVAL_MS = 8000;

function compareRotation(a: EventItem, b: EventItem) {
  const aOrder = a.featuredOrder ?? Number.POSITIVE_INFINITY;
  const bOrder = b.featuredOrder ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return (a.eventDate ?? "").localeCompare(b.eventDate ?? "") || a.title.localeCompare(b.title);
}

/**
 * Eventos del destacado rotativo: marcados como destacados, vigentes (isUpcomingEvent) y con fecha.
 * Los que tienen orden (featuredOrder) van primero, de menor a mayor; el resto por fecha.
 * Los pasados nunca entran.
 */
export function selectRotation(events: EventItem[], now: Date): EventItem[] {
  return events
    .filter((event) => Boolean(event.featured) && Boolean(event.eventDate) && isUpcomingEvent(event, now))
    .sort(compareRotation)
    .slice(0, ROTATION_MAX);
}

/**
 * Reparte el catálogo del home: el destacado rotativo y el resto. Ningún evento aparece en los dos lugares.
 * El resto conserva el orden con el que llegó (el del catálogo).
 */
export function splitForHome(events: EventItem[], now: Date) {
  const rotation = selectRotation(events, now);
  const shown = new Set(rotation.map((event) => event.id));

  return {
    rotation,
    rest: events.filter((event) => !shown.has(event.id)),
  };
}
