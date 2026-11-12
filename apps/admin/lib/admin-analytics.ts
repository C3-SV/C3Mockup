import {
  compareEventsBySchedule,
  eventStatuses,
  formatEventSchedule,
  lineKeys,
  type EventItem,
  type EventStatus,
  type LineKey,
} from "@c3/config";
import type { AdminStats } from "./admin-types";

export const lineLabels: Record<LineKey, string> = {
  compite: "Compite",
  crea: "Crea",
  conecta: "Conecta",
};

export const lineToneClasses: Record<LineKey, { chip: string; bar: string; border: string }> = {
  compite: {
    chip: "border-[#cfe0f6] bg-[#eef4ff] text-[#205298]",
    bar: "bg-[#205298]",
    border: "border-[#cfe0f6]",
  },
  crea: {
    chip: "border-[#c8f0ea] bg-[#ecfdf5] text-[#0f7a5f]",
    bar: "bg-[#33beac]",
    border: "border-[#c8f0ea]",
  },
  conecta: {
    chip: "border-[#e2d8f5] bg-[#f8f3ff] text-[#6b3fd4]",
    bar: "bg-[#4f5ba9]",
    border: "border-[#e2d8f5]",
  },
};

type StatusTone = {
  chip: string;
  bar: string;
  border: string;
};

export const statusToneByLabel: Partial<Record<EventStatus, StatusTone>> = {
  "Inscripciones abiertas": {
    chip: "border-[#c8f0ea] bg-[#ecfdf5] text-[#0f7a5f]",
    bar: "bg-[#33beac]",
    border: "border-[#c8f0ea]",
  },
  "Próximamente": {
    chip: "border-[#dce7f4] bg-[#f4f7fb] text-[#42526b]",
    bar: "bg-[#205298]",
    border: "border-[#dce7f4]",
  },
  Histórico: {
    chip: "border-[#e7e0f7] bg-[#f8f3ff] text-[#6b3fd4]",
    bar: "bg-[#4f5ba9]",
    border: "border-[#e7e0f7]",
  },
  "Apoyo institucional": {
    chip: "border-[#d4e1f5] bg-[#eef4ff] text-[#205298]",
    bar: "bg-[#205298]",
    border: "border-[#d4e1f5]",
  },
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
