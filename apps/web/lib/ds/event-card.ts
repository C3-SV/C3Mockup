import { formatEventSchedule, type EventCover, type EventItem, type ExperienceKind, type LineKey } from "@c3/config";
import { toPillState, type PillState } from "@/lib/ds/event-state";

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
};

/** La primera línea es la principal; el resto se muestra como texto. Un evento sin líneas no llega aquí (lo descarta el parseo). */
export function toCatalogCard(event: EventItem): CatalogCardData {
  const [line, ...otherLines] = event.lines;
  if (!line) {
    throw new Error(`El evento ${event.id} no tiene líneas`);
  }

  return {
    id: event.id,
    line,
    otherLines,
    kind: event.kind,
    title: event.title,
    summary: event.description,
    detail: formatEventSchedule(event) || undefined,
    state: toPillState(event.status),
    action: event.cta,
    href: event.href,
    external: Boolean(event.external),
    cover: event.cover,
  };
}
