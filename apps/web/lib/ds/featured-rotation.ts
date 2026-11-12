import type { EventItem } from "@c3/config";
import { isUpcomingEvent } from "@/lib/ds/event-state";

/** Máximo de eventos en el destacado rotativo del home. */
export const ROTATION_MAX = 5;

/** Tiempo entre diapositivas, en milisegundos. Con movimiento reducido no rota. */
export const ROTATION_INTERVAL_MS = 8000;

/**
 * Orden de rotación: primero los que tienen featuredOrder (menor número primero). Después, por fecha: los
 * vigentes de la más cercana a la más lejana; los históricos, de la más reciente a la más antigua.
 */
function compareRotation(a: EventItem, b: EventItem, newestFirst: boolean) {
  const aOrder = a.featuredOrder ?? Number.POSITIVE_INFINITY;
  const bOrder = b.featuredOrder ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  const byDate = (a.eventDate ?? "").localeCompare(b.eventDate ?? "");
  return (newestFirst ? -byDate : byDate) || a.title.localeCompare(b.title);
}

/**
 * Eventos del destacado rotativo. Si hay destacados vigentes (isUpcomingEvent y con fecha), rotan esos.
 * Si no hay ninguno, rotan los destacados aunque ya hayan terminado (decisión del responsable, 12-nov-2026):
 * así el home muestra los eventos más importantes mientras no haya próximos. Máximo ROTATION_MAX.
 */
export function selectRotation(events: EventItem[], now: Date): EventItem[] {
  const featured = events.filter((event) => Boolean(event.featured));
  const upcoming = featured.filter((event) => Boolean(event.eventDate) && isUpcomingEvent(event, now));

  if (upcoming.length) {
    return [...upcoming].sort((a, b) => compareRotation(a, b, false)).slice(0, ROTATION_MAX);
  }

  return [...featured].sort((a, b) => compareRotation(a, b, true)).slice(0, ROTATION_MAX);
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
