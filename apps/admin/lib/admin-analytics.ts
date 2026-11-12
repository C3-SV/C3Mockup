import {
  compareEventsBySchedule,
  eventStatuses,
  formatEventSchedule,
  lineKeys,
  type EventItem,
  type EventStatus,
  type LineKey,
} from "@c3/config";
import type { BadgeTone } from "@c3/ui";
import type { AdminStats } from "./admin-types";

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

function isUpcoming(event: EventItem, now: Date) {
  if (event.status === "Histórico") {
    return false;
  }

  const start = parseEventDate(event.eventDate);
  const end = parseEventDate(event.eventDateEnd);
  const reference = end ?? start;

  if (!reference) {
    return true;
  }

  return reference.getTime() >= now.getTime();
}

export function getSortedUpcomingEvents(events: ReadonlyArray<EventItem>) {
  const now = new Date();

  return [...events].filter((event) => isUpcoming(event, now)).sort(compareEventsBySchedule);
}

export function getDashboardStats(events: ReadonlyArray<EventItem>): AdminStats {
  const now = new Date();

  return {
    total: events.length,
    upcoming: events.filter((event) => isUpcoming(event, now)).length,
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

export function getEventScheduleLabel(event: EventItem) {
  return formatEventSchedule(event);
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
