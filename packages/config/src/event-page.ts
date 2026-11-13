import { normalizeEventCover, type EventItem } from "./events";

/**
 * Ficha permanente por edición (spec 2026-11-13, §4–§6): contrato administrativo (EventPage, con borradores y
 * derechos), proyección pública (PublicEventPage), validación con los límites de la spec y fase temporal.
 *
 * Todo el contenido es texto plano: React lo escapa al renderizar y aquí nunca se interpreta HTML ni Markdown.
 */

export const eventPagePublications = ["draft", "published"] as const;
export type EventPagePublication = (typeof eventPagePublications)[number];

export const eventModalities = ["presencial", "virtual", "hibrida"] as const;
export type EventModality = (typeof eventModalities)[number];

export type EventPageLink = { title: string; url: string };
export type EventPageParticipation = { label: string; url: string };
export type EventMemoryResult = { label: string; value: string; context: string; evidenceUrl?: string };
export type EventMemoryOutput = { title: string; description: string; url?: string };
export type EventMemoryImage = { url: string; alt: string; caption?: string; rightsConfirmed: true };

export type EventMemory = {
  publication: EventPagePublication;
  summary: string[];
  learnings: string[];
  results: EventMemoryResult[];
  outputs: EventMemoryOutput[];
  gallery: EventMemoryImage[];
};

export type EventPage = {
  slug: string;
  publication: EventPagePublication;
  overview: string[];
  audience?: string;
  requirements?: string[];
  modality?: EventModality;
  location?: string;
  participation?: EventPageParticipation;
  resources: EventPageLink[];
  memory?: EventMemory;
};

/** Imagen publicada: nunca lleva la confirmación de derechos (dato interno). */
export type PublicEventMemoryImage = Omit<EventMemoryImage, "rightsConfirmed">;

export type PublicEventMemory = Omit<EventMemory, "publication" | "gallery"> & {
  publication: "published";
  gallery: PublicEventMemoryImage[];
};

/** Lo que recibe el navegador: solo contenido publicado. */
export type PublicEventPage = Omit<EventPage, "publication" | "memory"> & {
  publication: "published";
  memory?: PublicEventMemory;
};

/** Límites de la spec §5. Los textos se cuentan en caracteres Unicode, no en unidades UTF-16. */
export const EVENT_PAGE_LIMITS = {
  slugMin: 3,
  slugMax: 120,
  paragraphs: 12,
  paragraphLength: 2000,
  shortText: 300,
  listItems: 20,
  listItemLength: 500,
  entries: 20,
  galleryItems: 12,
  label: 160,
  url: 2048,
  context: 1000,
  value: 80,
  documentBytes: 500 * 1024,
} as const;

export type EventPageErrors = Record<string, string>;

export type EventPageValidationContext = {
  event: Pick<EventItem, "status" | "eventDate" | "eventDateEnd">;
  /** Instante ISO con el que se evalúa si la edición terminó. */
  now: string;
};

export type EventPageValidationResult =
  | { ok: true; value: EventPage }
  | { ok: false; errors: EventPageErrors };

/** Error de una ficha inválida: conserva el detalle por campo para mostrarlo en el admin. */
export class EventPageValidationError extends Error {
  readonly errors: EventPageErrors;

  constructor(errors: EventPageErrors) {
    super(`Invalid event page: ${Object.entries(errors).map(([path, message]) => `${path}: ${message}`).join("; ")}`);
    this.name = "EventPageValidationError";
    this.errors = errors;
  }
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTROL_OR_SPACE = /[\s\u0000-\u001f\u007f]/;

const length = (value: string) => Array.from(value).length;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isBlank = (value: unknown) => value === undefined || value === null || (typeof value === "string" && !value.trim());

// ---------------------------------------------------------------------------------------------------------
// Lectores con error por campo (nunca borran un valor en silencio: un texto largo es un error, no se recorta)
// ---------------------------------------------------------------------------------------------------------

function readText(value: unknown, path: string, max: number, errors: EventPageErrors): string | undefined {
  if (isBlank(value)) {
    return undefined;
  }
  if (typeof value !== "string") {
    errors[path] = "Debe ser texto.";
    return undefined;
  }
  const trimmed = value.trim();
  if (length(trimmed) > max) {
    errors[path] = `Máximo ${max} caracteres.`;
    return undefined;
  }
  return trimmed;
}

function readRequiredText(value: unknown, path: string, max: number, errors: EventPageErrors): string {
  const text = readText(value, path, max, errors);
  if (text === undefined && !errors[path]) {
    errors[path] = "Es obligatorio.";
  }
  return text ?? "";
}

function readTextList(
  value: unknown,
  path: string,
  limits: { items: number; length: number },
  errors: EventPageErrors,
): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    errors[path] = "Debe ser una lista de textos.";
    return [];
  }

  const items: string[] = [];
  value.forEach((entry, index) => {
    if (isBlank(entry)) {
      return;
    }
    if (typeof entry !== "string") {
      errors[`${path}.${index}`] = "Debe ser texto.";
      return;
    }
    const trimmed = entry.trim();
    if (length(trimmed) > limits.length) {
      errors[`${path}.${index}`] = `Máximo ${limits.length} caracteres.`;
      return;
    }
    items.push(trimmed);
  });

  if (items.length > limits.items) {
    errors[path] = `Máximo ${limits.items} elementos.`;
  }
  return items;
}

/** Filas de objetos: las completamente vacías se descartan (no hay contenido que perder); el resto se valida. */
function readRows(
  value: unknown,
  path: string,
  maxItems: number,
  errors: EventPageErrors,
  readRow: (row: Record<string, unknown>, rowPath: string) => void,
): void {
  if (value === undefined || value === null) {
    return;
  }
  if (!Array.isArray(value)) {
    errors[path] = "Debe ser una lista.";
    return;
  }

  let kept = 0;
  value.forEach((row, index) => {
    const rowPath = `${path}.${index}`;
    if (isBlank(row)) {
      return;
    }
    if (!isRecord(row)) {
      errors[rowPath] = "Debe ser un objeto.";
      return;
    }
    // `false` cuenta como vacío: una fila de galería sin nada más y con rightsConfirmed:false es una fila vacía.
    if (Object.values(row).every((entry) => isBlank(entry) || entry === false)) {
      return;
    }
    kept += 1;
    readRow(row, rowPath);
  });

  if (kept > maxItems) {
    errors[path] = `Máximo ${maxItems} elementos.`;
  }
}

/**
 * URL de destino: https absoluto sin credenciales, o ruta local que empieza con «/» (no «//» ni «/\»).
 * Rechaza javascript:, data:, http:, espacios y caracteres de control.
 */
function checkLinkUrl(raw: string): string | undefined {
  if (length(raw) > EVENT_PAGE_LIMITS.url) {
    return `Máximo ${EVENT_PAGE_LIMITS.url} caracteres.`;
  }
  if (CONTROL_OR_SPACE.test(raw)) {
    return "No puede contener espacios ni caracteres de control.";
  }

  if (raw.startsWith("/")) {
    if (raw.startsWith("//") || raw.includes("\\")) {
      return "Usa una ruta local que empiece con una sola «/».";
    }
    return undefined;
  }

  if (!/^https:\/\//i.test(raw)) {
    return "Usa un enlace https completo o una ruta local que empiece con «/».";
  }

  const authority = raw.slice(raw.indexOf("//") + 2).split(/[/?#]/, 1)[0];
  if (authority.includes("@")) {
    return "El enlace no puede incluir credenciales.";
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
      return "Usa un enlace https válido sin credenciales.";
    }
  } catch {
    return "El enlace no es válido.";
  }
  return undefined;
}

function readUrl(value: unknown, path: string, errors: EventPageErrors, required: boolean): string | undefined {
  if (isBlank(value)) {
    if (required) {
      errors[path] = "Es obligatorio.";
    }
    return undefined;
  }
  if (typeof value !== "string") {
    errors[path] = "Debe ser texto.";
    return undefined;
  }
  const url = value.trim();
  const problem = checkLinkUrl(url);
  if (problem) {
    errors[path] = problem;
    return undefined;
  }
  return url;
}

/** Imagen de la galería: mismo criterio que las portadas (https y host de C3, ADR-0005); sin hosts nuevos. */
function readImageUrl(value: unknown, path: string, errors: EventPageErrors): string | undefined {
  if (isBlank(value)) {
    errors[path] = "Es obligatorio.";
    return undefined;
  }
  if (typeof value !== "string") {
    errors[path] = "Debe ser texto.";
    return undefined;
  }
  const url = value.trim();
  const problem = checkLinkUrl(url);
  if (problem || url.startsWith("/")) {
    errors[path] = problem ?? "La imagen debe estar en un host de C3 por https.";
    return undefined;
  }
  const cover = normalizeEventCover({ url, alt: "x" });
  if (!cover) {
    errors[path] = "La imagen debe estar en un host de C3 por https.";
    return undefined;
  }
  return cover.url;
}

// ---------------------------------------------------------------------------------------------------------
// Normalización estructural (sin contexto del evento)
// ---------------------------------------------------------------------------------------------------------

function normalizeMemory(input: unknown, errors: EventPageErrors): EventMemory | undefined {
  if (!isRecord(input)) {
    errors.memory = "La memoria debe ser un objeto (o null para eliminarla).";
    return undefined;
  }

  const publication = input.publication;
  if (!(eventPagePublications as readonly unknown[]).includes(publication)) {
    errors["memory.publication"] = "Usa draft o published.";
  }

  const memory: EventMemory = {
    publication: publication === "published" ? "published" : "draft",
    summary: readTextList(
      input.summary,
      "memory.summary",
      { items: EVENT_PAGE_LIMITS.paragraphs, length: EVENT_PAGE_LIMITS.paragraphLength },
      errors,
    ),
    learnings: readTextList(
      input.learnings,
      "memory.learnings",
      { items: EVENT_PAGE_LIMITS.listItems, length: EVENT_PAGE_LIMITS.listItemLength },
      errors,
    ),
    results: [],
    outputs: [],
    gallery: [],
  };

  readRows(input.results, "memory.results", EVENT_PAGE_LIMITS.entries, errors, (row, path) => {
    const result: EventMemoryResult = {
      label: readRequiredText(row.label, `${path}.label`, EVENT_PAGE_LIMITS.label, errors),
      value: readRequiredText(row.value, `${path}.value`, EVENT_PAGE_LIMITS.value, errors),
      context: readRequiredText(row.context, `${path}.context`, EVENT_PAGE_LIMITS.context, errors),
    };
    const evidenceUrl = readUrl(row.evidenceUrl, `${path}.evidenceUrl`, errors, false);
    if (evidenceUrl) {
      result.evidenceUrl = evidenceUrl;
    }
    memory.results.push(result);
  });

  readRows(input.outputs, "memory.outputs", EVENT_PAGE_LIMITS.entries, errors, (row, path) => {
    const output: EventMemoryOutput = {
      title: readRequiredText(row.title, `${path}.title`, EVENT_PAGE_LIMITS.label, errors),
      description: readRequiredText(row.description, `${path}.description`, EVENT_PAGE_LIMITS.context, errors),
    };
    const url = readUrl(row.url, `${path}.url`, errors, false);
    if (url) {
      output.url = url;
    }
    memory.outputs.push(output);
  });

  readRows(input.gallery, "memory.gallery", EVENT_PAGE_LIMITS.galleryItems, errors, (row, path) => {
    const url = readImageUrl(row.url, `${path}.url`, errors);
    const alt = readRequiredText(row.alt, `${path}.alt`, EVENT_PAGE_LIMITS.label, errors);
    const caption = readText(row.caption, `${path}.caption`, EVENT_PAGE_LIMITS.context, errors);
    if (row.rightsConfirmed !== true) {
      errors[`${path}.rightsConfirmed`] = "Confirma que tienes los derechos de uso de la imagen.";
    }
    if (url) {
      const image: EventMemoryImage = { url, alt, rightsConfirmed: true };
      if (caption) {
        image.caption = caption;
      }
      memory.gallery.push(image);
    }
  });

  if (memory.publication === "published" && !memory.summary.length && !errors["memory.summary"]) {
    errors["memory.summary"] = "Para publicar la memoria escribe al menos un párrafo de resumen.";
  }

  return memory;
}

function normalizePage(input: unknown, errors: EventPageErrors): EventPage | undefined {
  if (!isRecord(input)) {
    errors.page = "La ficha debe ser un objeto. Para despublicarla usa publication: draft.";
    return undefined;
  }

  const rawSlug = typeof input.slug === "string" ? input.slug.trim() : undefined;
  if (rawSlug === undefined) {
    errors.slug = "El slug es obligatorio.";
  } else if (
    length(rawSlug) < EVENT_PAGE_LIMITS.slugMin ||
    length(rawSlug) > EVENT_PAGE_LIMITS.slugMax ||
    !SLUG_PATTERN.test(rawSlug)
  ) {
    errors.slug = `Usa de ${EVENT_PAGE_LIMITS.slugMin} a ${EVENT_PAGE_LIMITS.slugMax} caracteres: minúsculas sin acentos, números y guiones.`;
  }

  if (!(eventPagePublications as readonly unknown[]).includes(input.publication)) {
    errors.publication = "Usa draft o published.";
  }

  const page: EventPage = {
    slug: rawSlug ?? "",
    publication: input.publication === "published" ? "published" : "draft",
    overview: readTextList(
      input.overview,
      "overview",
      { items: EVENT_PAGE_LIMITS.paragraphs, length: EVENT_PAGE_LIMITS.paragraphLength },
      errors,
    ),
    resources: [],
  };

  const audience = readText(input.audience, "audience", EVENT_PAGE_LIMITS.shortText, errors);
  if (audience) {
    page.audience = audience;
  }

  const requirements = readTextList(
    input.requirements,
    "requirements",
    { items: EVENT_PAGE_LIMITS.listItems, length: EVENT_PAGE_LIMITS.listItemLength },
    errors,
  );
  if (requirements.length) {
    page.requirements = requirements;
  }

  if (!isBlank(input.modality)) {
    if ((eventModalities as readonly unknown[]).includes(input.modality)) {
      page.modality = input.modality as EventModality;
    } else {
      errors.modality = "Usa presencial, virtual o hibrida.";
    }
  }

  const location = readText(input.location, "location", EVENT_PAGE_LIMITS.shortText, errors);
  if (location) {
    page.location = location;
  }

  if (input.participation !== undefined && input.participation !== null) {
    if (!isRecord(input.participation)) {
      errors.participation = "Debe ser un objeto con etiqueta y enlace.";
    } else if (!Object.values(input.participation).every(isBlank)) {
      const label = readRequiredText(input.participation.label, "participation.label", EVENT_PAGE_LIMITS.label, errors);
      const url = readUrl(input.participation.url, "participation.url", errors, true);
      if (url && label) {
        page.participation = { label, url };
      }
    }
  }

  readRows(input.resources, "resources", EVENT_PAGE_LIMITS.entries, errors, (row, path) => {
    const title = readRequiredText(row.title, `${path}.title`, EVENT_PAGE_LIMITS.label, errors);
    const url = readUrl(row.url, `${path}.url`, errors, true);
    if (url) {
      page.resources.push({ title, url });
    }
  });

  if (page.publication === "published" && !page.overview.length && !errors.overview) {
    errors.overview = "Para publicar la ficha escribe al menos un párrafo de resumen.";
  }

  if (input.memory !== undefined && input.memory !== null) {
    const memory = normalizeMemory(input.memory, errors);
    if (memory) {
      if (memory.publication === "published" && page.publication !== "published") {
        errors["memory.publication"] = "La memoria solo se publica con la ficha publicada.";
      }
      page.memory = memory;
    }
  }
  // memory: null elimina la memoria de forma expresa: simplemente no se copia.

  return page;
}

// ---------------------------------------------------------------------------------------------------------
// Fase temporal (día local de El Salvador, UTC-6 sin horario de verano)
// ---------------------------------------------------------------------------------------------------------

export type EventPagePhase = "upcoming" | "ongoing" | "ended" | "unknown";

const EL_SALVADOR_UTC_OFFSET_HOURS = -6;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Día calendario real en formato AAAA-MM-DD, o undefined si falta o no existe (p. ej. 2026-02-30). */
function readDay(value: string | undefined): string | undefined {
  if (typeof value !== "string" || !DAY_PATTERN.test(value)) {
    return undefined;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value ? undefined : value;
}

function localDay(now: Date): string | undefined {
  if (Number.isNaN(now.getTime())) {
    return undefined;
  }
  return new Date(now.getTime() + EL_SALVADOR_UTC_OFFSET_HOURS * 3_600_000).toISOString().slice(0, 10);
}

/**
 * En qué punto está la edición. Estado «Histórico» → ended. Si no, se compara el día local de El Salvador con
 * eventDate y eventDateEnd (el día final cuenta como en curso).
 *
 * «ended» exige una fecha final confirmada (eventDateEnd) ya pasada: un eventDate suelto nunca se toma como día
 * final (spec §5 y §6; ruling R9). Sin eventDateEnd solo se sabe que la edición no ha terminado antes y durante su
 * día de inicio; después es unknown. Fechas ausentes, inválidas o incoherentes tampoco permiten inferir nada.
 */
export function getEventPagePhase(
  event: Pick<EventItem, "status" | "eventDate" | "eventDateEnd">,
  now: Date,
): EventPagePhase {
  if (event.status === "Histórico") {
    return "ended";
  }

  const start = readDay(event.eventDate);
  const today = localDay(now);
  if (!start || !today) {
    return "unknown";
  }

  const rawEnd = typeof event.eventDateEnd === "string" ? event.eventDateEnd.trim() : "";
  if (!rawEnd) {
    // Sin fecha final confirmada no se puede afirmar que terminó.
    if (today < start) {
      return "upcoming";
    }
    return today === start ? "ongoing" : "unknown";
  }

  const end = readDay(rawEnd);
  if (!end || end < start) {
    return "unknown";
  }

  if (today < start) {
    return "upcoming";
  }
  return today <= end ? "ongoing" : "ended";
}

// ---------------------------------------------------------------------------------------------------------
// API pública del módulo
// ---------------------------------------------------------------------------------------------------------

function documentBytes(page: EventPage) {
  return new TextEncoder().encode(JSON.stringify(page)).length;
}

/**
 * Valida y normaliza la ficha administrativa. Un payload `page` presente debe ser completo; `memory: null`
 * elimina la memoria. Los errores son por campo (p. ej. «memory.results.0.value») y nunca se descarta contenido
 * en silencio. Reglas de publicación: ficha con resumen; memoria con ficha publicada, resumen y edición terminada.
 */
export function validateEventPage(input: unknown, context: EventPageValidationContext): EventPageValidationResult {
  const errors: EventPageErrors = {};
  const value = normalizePage(input, errors);

  if (value?.memory?.publication === "published" && !errors["memory.publication"]) {
    if (getEventPagePhase(context.event, new Date(context.now)) !== "ended") {
      errors["memory.publication"] =
        "La memoria solo se publica cuando la edición terminó: confirma una fecha final pasada o usa el estado Histórico.";
    }
  }

  if (value && documentBytes(value) > EVENT_PAGE_LIMITS.documentBytes) {
    errors.page = "La ficha supera el máximo de 500 KiB.";
  }

  if (!value || Object.keys(errors).length) {
    return { ok: false, errors };
  }
  return { ok: true, value };
}

/**
 * Lectura tolerante de un documento guardado (sin contexto del evento). Una ficha inválida → undefined; una memoria
 * inválida se omite y la ficha se conserva. Mantiene la ficha administrativa completa: para el público usar
 * projectPublicEventPage.
 */
export function parseEventPage(input: unknown): EventPage | undefined {
  const errors: EventPageErrors = {};
  const value = normalizePage(input, errors);
  if (!value) {
    return undefined;
  }

  const pageErrors = Object.keys(errors).filter((path) => path !== "memory" && !path.startsWith("memory."));
  if (pageErrors.length) {
    return undefined;
  }
  if (Object.keys(errors).length) {
    delete value.memory;
  }
  return value;
}

function projectMemory(memory: EventMemory): PublicEventMemory {
  const projected: PublicEventMemory = {
    publication: "published",
    summary: [...memory.summary],
    learnings: [...memory.learnings],
    results: memory.results.map((result) => {
      const item: EventMemoryResult = { label: result.label, value: result.value, context: result.context };
      if (result.evidenceUrl) {
        item.evidenceUrl = result.evidenceUrl;
      }
      return item;
    }),
    outputs: memory.outputs.map((output) => {
      const item: EventMemoryOutput = { title: output.title, description: output.description };
      if (output.url) {
        item.url = output.url;
      }
      return item;
    }),
    gallery: memory.gallery.map((image) => {
      const item: PublicEventMemoryImage = { url: image.url, alt: image.alt };
      if (image.caption) {
        item.caption = image.caption;
      }
      return item;
    }),
  };
  return projected;
}

/**
 * Proyección que sale hacia el navegador, JSON-LD, metadata y catálogos. Un borrador (o ausencia) → undefined.
 * La memoria en borrador se elimina y la galería nunca incluye rightsConfirmed. Se construye campo a campo:
 * lo que no esté en el contrato no se filtra.
 */
export function projectPublicEventPage(page: EventPage | undefined): PublicEventPage | undefined {
  if (!page || page.publication !== "published") {
    return undefined;
  }

  const projected: PublicEventPage = {
    slug: page.slug,
    publication: "published",
    overview: [...page.overview],
    resources: page.resources.map((resource) => ({ title: resource.title, url: resource.url })),
  };

  if (page.audience) {
    projected.audience = page.audience;
  }
  if (page.requirements?.length) {
    projected.requirements = [...page.requirements];
  }
  if (page.modality) {
    projected.modality = page.modality;
  }
  if (page.location) {
    projected.location = page.location;
  }
  if (page.participation) {
    projected.participation = { label: page.participation.label, url: page.participation.url };
  }
  if (page.memory?.publication === "published") {
    projected.memory = projectMemory(page.memory);
  }
  return projected;
}

/** Atajo para el parser público: documento de Firestore → proyección pública o undefined. */
export function parsePublicEventPage(input: unknown): PublicEventPage | undefined {
  return projectPublicEventPage(parseEventPage(input));
}

/** Dirección interna de la ficha publicada: /eventos/{slug}. Sin ficha (o con slug inválido) no hay dirección. */
export function getEventPageHref(event: Pick<EventItem, "page">): string | undefined {
  const slug = event.page?.slug;
  return typeof slug === "string" && SLUG_PATTERN.test(slug) ? `/eventos/${slug}` : undefined;
}
