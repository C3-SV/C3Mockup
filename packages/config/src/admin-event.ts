import {
  normalizeEventCover,
  normalizeEventLines,
  normalizeEventStatus,
  normalizeExperienceKind,
  normalizeFeaturedOrder,
  type EventItem,
} from "./events";

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

export type AdminEventRecord = EventItem & {
  createdAt: string;
  updatedAt: string;
};

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

/**
 * Construye el registro que se guarda en Firestore a partir de lo que envía el admin.
 * Conserva todos los campos del modelo (tipo, portada, origen, orden de destacado). Los campos
 * vacíos o inválidos se omiten, así que nunca se escribe `undefined`. Lanza Error si falta lo obligatorio.
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

  const lines = normalizeEventLines(payload.lines);
  if (!lines.length) {
    throw new Error("At least one line must be selected.");
  }

  const featured = Boolean(payload.featured);

  return withoutUndefined({
    id,
    title,
    description,
    lines,
    status: normalizeEventStatus(payload.status),
    cta,
    href,
    external: Boolean(payload.external),
    featured,
    featuredOrder: featured ? normalizeFeaturedOrder(payload.featuredOrder) : undefined,
    eventDate: text("eventDate") || undefined,
    eventDateEnd: text("eventDateEnd") || undefined,
    kind: normalizeExperienceKind(payload.kind),
    cover: normalizeEventCover(payload.cover),
    source: text("source") || undefined,
    createdAt: text("createdAt") || options.now,
    updatedAt: text("updatedAt") || options.now,
  }) as AdminEventRecord;
}
