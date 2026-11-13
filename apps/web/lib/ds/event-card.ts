import { formatEventSchedule, getEventPageHref, type EventCover, type EventItem, type EventStatus, type ExperienceKind, type LineKey } from "@c3/config";
import { pillStatusFor, toPillState, type PillState } from "@/lib/ds/event-state";

/** Datos de una tarjeta de experiencia (DS §7.9). Solo texto y enlaces del evento; sin DEMO. */
export type CatalogCardData = {
  id: string;
  line: LineKey;
  otherLines: LineKey[];
  kind?: ExperienceKind;
  title: string;
  summary: string;
  detail?: string;
  state: PillState;
  action: string;
  href: string;
  external: boolean;
  cover?: EventCover;
  /** Estado y fechas del evento: el catálogo filtra por ellos (isUpcomingEvent), no por el texto de la pastilla. */
  status: EventStatus;
  eventDate?: string;
  eventDateEnd?: string;
};

/** La primera línea es la principal; el resto se muestra como texto. Un evento sin líneas no llega aquí (lo descarta el parseo). */
export function toCatalogCard(event: EventItem, now: Date = new Date()): CatalogCardData {
  const [line, ...otherLines] = event.lines;
  if (!line) {
    throw new Error(`El evento ${event.id} no tiene líneas`);
  }

  // Con ficha publicada la tarjeta lleva a /eventos/{slug}; el enlace original vive dentro de la ficha. Sin ficha,
  // cta/href/external quedan como estaban. El borrador nunca llega aquí, pero se exige «published» por si acaso.
  const pageHref = event.page?.publication === "published" ? getEventPageHref(event) : undefined;

  return {
    id: event.id,
    line,
    otherLines,
    kind: event.kind,
    title: event.title,
    summary: event.description,
    detail: formatEventSchedule(event) || undefined,
    state: toPillState(pillStatusFor(event, now)),
    action: pageHref ? (event.page?.memory ? "Ver memoria" : "Ver evento") : event.cta,
    href: pageHref ?? event.href,
    external: pageHref ? false : Boolean(event.external),
    cover: event.cover,
    status: event.status,
    eventDate: event.eventDate,
    eventDateEnd: event.eventDateEnd,
  };
}
