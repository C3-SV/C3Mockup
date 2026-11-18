import type { PublicEventPage } from "./event-page";
import { isEventCurrentOrUpcoming, readCivilDay } from "./event-time";

export const lineKeys = ["compite", "crea", "conecta"] as const;

export type LineKey = (typeof lineKeys)[number];

export const eventStatuses = [
  "Inscripciones abiertas",
  "Próximamente",
  "Histórico",
  "Apoyo institucional",
] as const;

export type EventStatus = (typeof eventStatuses)[number];

/** Tipo de experiencia: solo cambia el ícono de la tarjeta. «reto» es lo que hoy se llama challenge (ADR-0006). */
export const experienceKinds = [
  "competencia",
  "hackathon",
  "taller",
  "charla",
  "encuentro",
  "reto",
] as const;

export type ExperienceKind = (typeof experienceKinds)[number];

/** Nombre visible de cada tipo, igual en el sitio y en el admin. */
export const experienceKindLabels: Record<ExperienceKind, string> = {
  competencia: "Competencia",
  hackathon: "Hackathon",
  taller: "Taller",
  charla: "Charla",
  encuentro: "Encuentro",
  reto: "Reto",
};

export type EventCover = {
  url: string;
  alt: string;
};

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
  /** Orden entre los destacados del bloque rotativo (1 a 99). Vacío: se ordena por fecha. */
  featuredOrder?: number;
  eventDate?: string;
  eventDateEnd?: string;
  kind?: ExperienceKind;
  cover?: EventCover;
  /** Ficha permanente de la edición. Solo contenido publicado (sin borradores ni derechos); ver event-page.ts. */
  page?: PublicEventPage;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const defaultEvents: EventItem[] = [
  {
    id: "copa-salvadorena-programacion",
    kind: "competencia",
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    lines: ["compite"],
    status: "Histórico",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: true,
    // Edición 2026 realizada en la ESEN, del 15 de agosto al 5 de septiembre de 2026 (dato del responsable, 2026-11-17).
    eventDate: "2026-08-15",
    eventDateEnd: "2026-09-05",
  },
  {
    id: "hackathon-turismo-creativo-i",
    kind: "hackathon",
    title: "Hackathon de Turismo Creativo Vol. 1",
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
    kind: "competencia",
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
    kind: "hackathon",
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
    kind: "competencia",
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

export function normalizeExperienceKind(input: unknown): ExperienceKind | undefined {
  return typeof input === "string" && (experienceKinds as readonly string[]).includes(input)
    ? (input as ExperienceKind)
    : undefined;
}

/** Orden de un destacado: entero de 1 a 99, como número o como texto. Cualquier otra cosa es «sin orden». */
export function normalizeFeaturedOrder(input: unknown): number | undefined {
  const value = typeof input === "string" && input.trim() !== "" ? Number(input.trim()) : input;
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 99 ? value : undefined;
}

/**
 * La clave privada de servicio llega con saltos de línea escritos como «\n» (texto) en las variables de entorno.
 * Se convierten en saltos reales antes de usarla.
 */
export function normalizeFirebasePrivateKey(value: string): string {
  return value.replace(/\\n/g, "\n");
}

// Portadas e imágenes: https absoluto de cualquier host, sin credenciales, con texto alternativo (ADR-0018;
// antes solo hosts de C3, ADR-0005).
export function normalizeEventCover(input: unknown): EventCover | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }

  const { url, alt } = input as { url?: unknown; alt?: unknown };
  if (typeof url !== "string" || typeof alt !== "string" || !alt.trim()) {
    return undefined;
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return undefined;
  }

  if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
    return undefined;
  }

  return { url: parsed.toString(), alt: alt.trim() };
}

export function toFirestoreEventDocument(event: EventItem): FirestoreEventDocument {
  return {
    ...event,
    featured: Boolean(event.featured),
  };
}

function parseEventDate(value?: string) {
  // Solo fechas civiles reales (2026-02-30 no existe): misma regla que event-time.ts.
  const day = readCivilDay(value);
  return day ? new Date(`${day}T00:00:00Z`) : null;
}

export function getEventSortDate(event: Pick<EventItem, "eventDate">) {
  return parseEventDate(event.eventDate);
}

/**
 * Orden del catálogo con un solo «ahora» para toda la lista. Primero los vigentes o próximos (regla única de
 * event-time.ts: cuentan hasta las 24:00 de El Salvador del último día), por inicio ascendente; luego el resto, por
 * inicio descendente. Solo necesita fecha, estado, destacado y título, así que sirve para EventItem y AdminEventRecord.
 */
export function compareEventsBySchedule<
  T extends Pick<EventItem, "eventDate" | "eventDateEnd" | "status" | "featured" | "title">,
>(a: T, b: T, now: Date) {
  // Orden total: 0 = vigente o próximo con fecha; 1 = vigente o próximo sin fecha; 2 = pasado.
  // Así un evento sin fecha nunca queda en un grupo distinto según con quién se compare (no hay ciclos).
  const rank = (event: T) => (!isEventCurrentOrUpcoming(event, now) ? 2 : getEventSortDate(event) ? 0 : 1);
  const aRank = rank(a);
  const bRank = rank(b);
  if (aRank !== bRank) {
    return aRank - bRank;
  }

  const aDate = getEventSortDate(a);
  const bDate = getEventSortDate(b);
  if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
    return aRank === 2 ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
  }

  if (Boolean(a.featured) !== Boolean(b.featured)) {
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  }

  return a.title.localeCompare(b.title);
}

/** Comparador de orden con un solo «ahora» para toda la lista: `list.sort(scheduleComparator(now))`. */
export function scheduleComparator<
  T extends Pick<EventItem, "eventDate" | "eventDateEnd" | "status" | "featured" | "title">,
>(now: Date) {
  return (a: T, b: T) => compareEventsBySchedule(a, b, now);
}

// Las fechas civiles se parsean como medianoche UTC (parseEventDate), así que se formatean en UTC para no
// desplazar el día según la zona del navegador o del servidor (H1, auditoría 2026-11-17).
const eventDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
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
  // Un fin anterior al inicio no forma rango: se muestra solo el inicio (la regla de vigencia usa el inicio).
  if (!end || end.getTime() <= start.getTime()) {
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
