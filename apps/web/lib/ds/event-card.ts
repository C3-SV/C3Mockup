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

/**
 * Destino de la tarjeta de un evento: con ficha publicada, la ficha interna (/eventos/{slug}); sin ficha, el
 * cta/href/external de siempre. Es la única fuente: tarjetas y listas JSON-LD enlazan lo mismo. El borrador nunca
 * llega aquí (la proyección pública lo descarta), pero se exige «published» por si acaso.
 */
export function getEventCardLink(event: EventItem): { href: string; external: boolean; action: string } {
  const pageHref = event.page?.publication === "published" ? getEventPageHref(event) : undefined;
  if (pageHref) {
    return { href: pageHref, external: false, action: event.page?.memory ? "Ver memoria" : "Ver evento" };
  }
  return { href: event.href, external: Boolean(event.external), action: event.cta };
}

/**
 * Reduce un evento a lo que necesita la tarjeta del catálogo para pasarlo a un componente cliente (/eventos). De la
 * ficha solo viajan el slug y la marca de que hay memoria publicada; el contenido (resumen, memoria, resultados,
 * galería, materiales) se queda en el servidor. toCatalogCard devuelve lo mismo con el evento completo o con este.
 */
export function toCatalogEvent(event: EventItem): EventItem {
  const { id, title, description, lines, status, cta, href, external, featured, featuredOrder, eventDate, eventDateEnd, kind, cover, page } = event;
  return {
    id,
    title,
    description,
    lines,
    status,
    cta,
    href,
    external,
    featured,
    featuredOrder,
    eventDate,
    eventDateEnd,
    kind,
    cover,
    ...(page
      ? {
          page: {
            slug: page.slug,
            publication: "published" as const,
            overview: [],
            resources: [],
            ...(page.memory
              ? { memory: { publication: "published" as const, summary: [], learnings: [], results: [], outputs: [], gallery: [] } }
              : {}),
          },
        }
      : {}),
  };
}

/** La primera línea es la principal; el resto se muestra como texto. Un evento sin líneas no llega aquí (lo descarta el parseo). */
export function toCatalogCard(event: EventItem, now: Date = new Date()): CatalogCardData {
  const [line, ...otherLines] = event.lines;
  if (!line) {
    throw new Error(`El evento ${event.id} no tiene líneas`);
  }

  const link = getEventCardLink(event);

  return {
    id: event.id,
    line,
    otherLines,
    kind: event.kind,
    title: event.title,
    summary: event.description,
    detail: formatEventSchedule(event) || undefined,
    state: toPillState(pillStatusFor(event, now)),
    action: link.action,
    href: link.href,
    external: link.external,
    cover: event.cover,
    status: event.status,
    eventDate: event.eventDate,
    eventDateEnd: event.eventDateEnd,
  };
}
