import {
  eventStatuses,
  formatEventSchedule,
  isEventCurrentOrUpcoming,
  lineKeys,
  scheduleComparator,
  type EventItem as BaseEventItem,
  type EventStatus,
  type LineKey,
} from "@c3/config";
import type { BadgeTone } from "@c3/ui";
import type { AdminStats } from "./admin-types";

/** Evento sin su ficha: las estadísticas y los listados del panel solo usan los campos del evento. */
type EventItem = Omit<BaseEventItem, "page">;

export const lineLabels: Record<LineKey, string> = {
  compite: "Compite",
  crea: "Crea",
  conecta: "Conecta",
};

/** Color de cada línea en el panel: el tono de la etiqueta y la barra del gráfico. */
export const lineTone: Record<LineKey, { badge: BadgeTone; bar: string }> = {
  compite: { badge: "info", bar: "bg-line-compite" },
  crea: { badge: "success", bar: "bg-line-crea" },
  conecta: { badge: "brand", bar: "bg-line-conecta" },
};

/** Tono de la etiqueta de estado. El texto del estado es el del evento (contenido conservado). */
export const statusTone: Partial<Record<EventStatus, BadgeTone>> = {
  "Inscripciones abiertas": "success",
  "Próximamente": "info",
  Histórico: "neutral",
  "Apoyo institucional": "brand",
};

function parseEventDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Vigencia con la regla única de @c3/config (hasta las 24:00 de El Salvador del último día). */
export function getSortedUpcomingEvents<T extends EventItem>(events: ReadonlyArray<T>, now: Date = new Date()): T[] {
  return [...events]
    .filter((event) => isEventCurrentOrUpcoming(event, now))
    .sort(scheduleComparator<T>(now));
}

export function getDashboardStats(events: ReadonlyArray<EventItem>, now: Date = new Date()): AdminStats {
  return {
    total: events.length,
    upcoming: events.filter((event) => isEventCurrentOrUpcoming(event, now)).length,
    openRegistrations: events.filter((event) => event.status === "Inscripciones abiertas").length,
    featured: events.filter((event) => Boolean(event.featured)).length,
  };
}

export function getLineCounts(events: ReadonlyArray<EventItem>) {
  return lineKeys.reduce<Record<LineKey, number>>((counts, line) => {
    counts[line] = events.reduce((accumulator, event) => {
      return accumulator + Number(event.lines.includes(line));
    }, 0);
    return counts;
  }, {} as Record<LineKey, number>);
}

export function getStatusCounts(events: ReadonlyArray<EventItem>) {
  const counts = eventStatuses.reduce<Record<string, number>>((accumulator, status) => {
    accumulator[status] = 0;
    return accumulator;
  }, {});

  let otherCount = 0;

  for (const event of events) {
    if (event.status in counts) {
      counts[event.status] += 1;
    } else {
      otherCount += 1;
    }
  }

  return {
    ...counts,
    ...(otherCount > 0 ? { Otros: otherCount } : {}),
  } as Record<string, number>;
}

export function getEventScheduleLabel(event: Pick<EventItem, "eventDate" | "eventDateEnd">) {
  return formatEventSchedule(event as EventItem);
}

export function getCompactDateLabel(value?: string) {
  const date = parseEventDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // fecha civil: sin zona, el día se desplaza en UTC−6
  })
    .format(date)
    .replace(/\./g, "");
}

export function getEventSortKey(event: EventItem) {
  const start = parseEventDate(event.eventDate);
  return start?.getTime() ?? Number.POSITIVE_INFINITY;
}

export function getSortLabel(event: EventItem) {
  return getEventScheduleLabel(event) || "Sin fecha";
}
