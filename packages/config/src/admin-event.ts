import {
  EventPageValidationError,
  validateEventPage,
  type EventPage,
} from "./event-page";
import { readCivilDay } from "./event-time";
import {
  normalizeEventCover,
  normalizeEventLines,
  normalizeEventStatus,
  normalizeExperienceKind,
  normalizeFeaturedOrder,
  type EventItem,
} from "./events";

/**
 * Enlace principal del evento (H10): https absoluto sin espacios, o ruta local de una sola «/» (no «//» ni barras
 * invertidas). Bloquea javascript:, http:, ftp: y redirecciones de protocolo relativo.
 */
export function isAllowedEventHref(href: string): boolean {
  if (/\s/.test(href)) {
    return false;
  }
  if (href.startsWith("/")) {
    return !href.startsWith("//") && !href.includes("\\");
  }
  if (!/^https:\/\/[^/]/.test(href)) {
    return false;
  }
  // Sin credenciales (user@host): el host es lo que va después de «https://» y antes de la primera «/».
  return !href.slice("https://".length).split("/")[0].includes("@");
}

/** Identificador de evento a partir de un texto: minúsculas, sin acentos, guiones. */
export function slugifyEventId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Registro administrativo: la ficha lleva borradores y derechos (EventPage), no la proyección pública. */
export type AdminEventRecord = Omit<EventItem, "page"> & {
  page?: EventPage;
  createdAt: string;
  updatedAt: string;
};

/**
 * Quita `undefined` en todos los niveles (objetos y arrays): Firestore rechaza escribirlos. No toca null, false,
 * 0 ni cadenas vacías. Solo recorre objetos planos y arrays.
 */
export function omitUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((entry) => entry !== undefined).map((entry) => omitUndefinedDeep(entry)) as T;
  }

  if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, omitUndefinedDeep(entry)]),
    ) as T;
  }

  return value;
}

/**
 * Construye el registro que se guarda en Firestore a partir de lo que envía el admin.
 * Conserva todos los campos del modelo (tipo, portada, origen, orden de destacado, ficha). Los campos
 * vacíos o inválidos se omiten, así que nunca se escribe `undefined`, en ningún nivel. Lanza Error si falta lo
 * obligatorio y EventPageValidationError (con el detalle por campo) si la ficha es inválida.
 *
 * Sin `page` en el payload no hay clave `page` en el resultado (el registro queda como antes). Un `page` presente
 * debe ser completo; `page: null` se rechaza (para despublicar: publication: "draft").
 */
export function buildAdminEventRecord(
  input: unknown,
  options: { fallbackId?: string; now: string },
): AdminEventRecord {
  const payload = (input ?? {}) as Record<string, unknown>;
  const text = (key: string) => (typeof payload[key] === "string" ? (payload[key] as string).trim() : "");

  const title = text("title");
  const description = text("description");
  const href = text("href");
  const cta = text("cta");
  const id = text("id") ? slugifyEventId(text("id")) : options.fallbackId || slugifyEventId(title);

  if (!title || !description || !href || !cta || !id) {
    throw new Error("Title, description, href, cta and id are required.");
  }
  if (!isAllowedEventHref(href)) {
    throw new Error('The href must be an https URL without spaces, or a local path that starts with a single "/".');
  }

  const lines = normalizeEventLines(payload.lines);
  if (!lines.length) {
    throw new Error("At least one line must be selected.");
  }

  const featured = Boolean(payload.featured);
  const status = normalizeEventStatus(payload.status);
  const eventDate = text("eventDate") || undefined;
  const eventDateEnd = text("eventDateEnd") || undefined;
  // Fechas civiles reales (AAAA-MM-DD): una fecha inexistente como 2026-02-30 no se guarda.
  if ((eventDate && !readCivilDay(eventDate)) || (eventDateEnd && !readCivilDay(eventDateEnd))) {
    throw new Error("eventDate and eventDateEnd must be real dates in the form YYYY-MM-DD.");
  }

  let page: EventPage | undefined;
  if (payload.page !== undefined) {
    const result = validateEventPage(payload.page, { event: { status, eventDate, eventDateEnd }, now: options.now });
    if (!result.ok) {
      throw new EventPageValidationError(result.errors);
    }
    page = result.value;
  }

  return omitUndefinedDeep({
    id,
    title,
    description,
    lines,
    status,
    cta,
    href,
    external: Boolean(payload.external),
    featured,
    featuredOrder: featured ? normalizeFeaturedOrder(payload.featuredOrder) : undefined,
    eventDate,
    eventDateEnd,
    kind: normalizeExperienceKind(payload.kind),
    cover: normalizeEventCover(payload.cover),
    page,
    source: text("source") || undefined,
    createdAt: text("createdAt") || options.now,
    updatedAt: text("updatedAt") || options.now,
  }) as AdminEventRecord;
}
