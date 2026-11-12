import {
  normalizeEventCover,
  normalizeEventLines,
  normalizeEventStatus,
  normalizeExperienceKind,
  type EventItem,
} from "@c3/config";

/** Texto recortado; vacío o no textual → undefined. */
function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Lee un documento del catálogo de eventos de Firestore. Sin dependencias de servidor, para probarlo.
 * Se descarta si falta título, descripción, enlace, texto de acción o alguna línea válida.
 * Los campos nuevos (kind, cover, source) son opcionales: si no son válidos se omiten y el evento sigue.
 * La clave `demo` no se lee: el sitio no tiene datos de demostración (PRODUCT.md, regla 1).
 */
export function parseEventDocument(docId: string, data: Record<string, unknown>): EventItem | null {
  const title = text(data.title) ?? "";
  const description = text(data.description) ?? "";
  const href = text(data.href) ?? "";
  const cta = text(data.cta) ?? "";

  if (!title || !description || !href || !cta) {
    return null;
  }

  const lines = normalizeEventLines(data.lines);
  if (!lines.length) {
    return null;
  }

  return {
    id: text(data.id) ?? docId,
    title,
    description,
    lines,
    status: normalizeEventStatus(data.status),
    cta,
    href,
    external: Boolean(data.external),
    featured: Boolean(data.featured),
    createdAt: text(data.createdAt),
    updatedAt: text(data.updatedAt),
    eventDate: text(data.eventDate),
    eventDateEnd: text(data.eventDateEnd),
    kind: normalizeExperienceKind(data.kind),
    cover: normalizeEventCover(data.cover),
    source: text(data.source),
  };
}
