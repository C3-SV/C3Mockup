export const lineKeys = ["compite", "crea", "conecta"] as const;

export type LineKey = (typeof lineKeys)[number];

export const eventStatuses = [
  "Inscripciones abiertas",
  "Próximamente",
  "Histórico",
  "Apoyo institucional",
] as const;

export type EventStatus = (typeof eventStatuses)[number];

export type EventItem = {
  id: string;
  title: string;
  description: string;
  lines: LineKey[];
  status: EventStatus;
  cta: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  eventDate?: string;
  eventDateEnd?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const defaultEvents: EventItem[] = [
  {
    id: "copa-salvadorena-programacion",
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: true,
    eventDate: "2026-08-01",
  },
  {
    id: "hackathon-turismo-creativo-i",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde tecnología, turismo y cultura.",
    lines: ["crea"],
    status: "Inscripciones abiertas",
    cta: "Ver hackathon",
    href: "https://hackathon.c3.com.sv",
    external: true,
    featured: true,
    eventDate: "2026-07-11",
    eventDateEnd: "2026-07-12",
  },
  {
    id: "icpc-centroamerica-el-salvador",
    title: "ICPC Centroamérica · sede El Salvador",
    description:
      "C3 apoya la articulación de comunidad, visibilidad y conexiones alrededor de la sede salvadoreña.",
    lines: ["compite", "conecta"],
    status: "Apoyo institucional",
    cta: "Explorar eventos",
    href: "/eventos",
    eventDate: "2026-08-29",
  },
  {
    id: "hackatlatam-fiesta-el-salvador",
    title: "Hack@Latam · Fiesta El Salvador",
    description:
      "Participación y apoyo en experiencias de creación tecnológica con enfoque regional.",
    lines: ["crea", "conecta"],
    status: "Histórico",
    cta: "Explorar eventos",
    href: "/eventos",
    eventDate: "2026-05-15",
  },
  {
    id: "duelo-programacion-c3-software-week-esen-2025",
    title: "Duelo de Programación C3 · Software Week ESEN 2025",
    description:
      "Actividad técnica orientada a resolver problemas en formato competitivo dentro del ecosistema universitario.",
    lines: ["compite"],
    status: "Histórico",
    cta: "Explorar eventos",
    href: "/eventos",
    eventDate: "2025-09-12",
  },
];

export type FirestoreEventDocument = EventItem & {
  createdAt?: string;
  updatedAt?: string;
};

export function normalizeEventLines(input: unknown): LineKey[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((line): line is LineKey => lineKeys.includes(line as LineKey));
}

export function normalizeEventStatus(input: unknown): EventStatus {
  return eventStatuses.includes(input as EventStatus) ? (input as EventStatus) : "Próximamente";
}

export function toFirestoreEventDocument(event: EventItem): FirestoreEventDocument {
  return {
    ...event,
    featured: Boolean(event.featured),
  };
}

function parseEventDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseEventTimestamp(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getEventSortDate(event: EventItem) {
  return parseEventDate(event.eventDate);
}

export function getEventLastModified(event: Pick<EventItem, "createdAt" | "eventDate" | "eventDateEnd" | "updatedAt">) {
  return (
    parseEventTimestamp(event.updatedAt) ??
    parseEventTimestamp(event.createdAt) ??
    parseEventDate(event.eventDateEnd) ??
    parseEventDate(event.eventDate)
  );
}

export function getLatestEventLastModified(
  events: ReadonlyArray<Pick<EventItem, "createdAt" | "eventDate" | "eventDateEnd" | "updatedAt">>,
) {
  return events.reduce<Date | null>((latest, event) => {
    const current = getEventLastModified(event);

    if (!current) {
      return latest;
    }

    if (!latest || current.getTime() > latest.getTime()) {
      return current;
    }

    return latest;
  }, null);
}

function isUpcoming(eventDate: Date | null, now: Date) {
  if (!eventDate) {
    return false;
  }

  return eventDate.getTime() >= now.getTime();
}

export function compareEventsBySchedule(a: EventItem, b: EventItem) {
  const now = new Date();
  const aDate = getEventSortDate(a);
  const bDate = getEventSortDate(b);
  const aUpcoming = isUpcoming(aDate, now);
  const bUpcoming = isUpcoming(bDate, now);

  if (aUpcoming !== bUpcoming) {
    return Number(bUpcoming) - Number(aUpcoming);
  }

  if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
    return aUpcoming
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime();
  }

  if (Boolean(a.featured) !== Boolean(b.featured)) {
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  }

  return a.title.localeCompare(b.title);
}

const eventDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(date: Date) {
  return eventDateFormatter.format(date).replace(/\./g, "");
}

export function formatEventSchedule(event: EventItem) {
  const start = getEventSortDate(event);
  if (!start) {
    return "";
  }

  const end = parseEventDate(event.eventDateEnd);
  if (!end || end.getTime() === start.getTime()) {
    return formatDate(start);
  }

  const startParts = formatDate(start).split(" ");
  const endParts = formatDate(end).split(" ");

  if (startParts.length === 3 && endParts.length === 3) {
    const [startDay, startMonth, startYear] = startParts;
    const [endDay, endMonth, endYear] = endParts;

    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay}–${endDay} ${startMonth} ${startYear}`;
    }
  }

  return `${formatDate(start)} — ${formatDate(end)}`;
}
