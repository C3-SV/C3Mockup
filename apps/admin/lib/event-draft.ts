import {
  validateEventPage,
  type AdminEventRecord,
  type EventMemory,
  type EventPage,
  type EventPageErrors,
  type LineKey,
} from "@c3/config";
import type { EventDraft, EventMemoryDraft, EventPageDraft } from "./admin-types";

/**
 * Normalización del borrador del formulario (plan eventos-memorias, T3).
 *
 * Un solo camino en cada sentido: normalizeDraft (registro guardado → borrador) y buildEventPayload (borrador →
 * payload). Ambos conservan todo lo que el formulario no edita (portada, origen, campos legados) y la ficha completa.
 * El servidor valida todo otra vez: este módulo no es la autoridad de seguridad ni de límites.
 */

export function createEmptyMemoryDraft(): EventMemoryDraft {
  return { publication: "draft", summary: [""], learnings: [], results: [], outputs: [], gallery: [] };
}

export function createEmptyPageDraft(): EventPageDraft {
  return {
    slug: "",
    publication: "draft",
    overview: [""],
    audience: "",
    requirements: [],
    modality: "",
    location: "",
    participation: { label: "", url: "" },
    resources: [],
  };
}

function normalizeMemoryDraft(memory: EventMemory): EventMemoryDraft {
  return {
    publication: memory.publication,
    summary: [...memory.summary],
    learnings: [...memory.learnings],
    results: memory.results.map((result) => ({
      label: result.label,
      value: result.value,
      context: result.context,
      evidenceUrl: result.evidenceUrl ?? "",
    })),
    outputs: memory.outputs.map((output) => ({
      title: output.title,
      description: output.description,
      url: output.url ?? "",
    })),
    gallery: memory.gallery.map((image) => ({
      url: image.url,
      alt: image.alt,
      caption: image.caption ?? "",
      rightsConfirmed: image.rightsConfirmed === true,
    })),
  };
}

export function normalizePageDraft(page: EventPage | undefined | null): EventPageDraft | undefined {
  if (!page) {
    return undefined;
  }

  const draft: EventPageDraft = {
    slug: page.slug,
    publication: page.publication,
    overview: [...page.overview],
    audience: page.audience ?? "",
    requirements: [...(page.requirements ?? [])],
    modality: page.modality ?? "",
    location: page.location ?? "",
    participation: { label: page.participation?.label ?? "", url: page.participation?.url ?? "" },
    resources: page.resources.map((resource) => ({ title: resource.title, url: resource.url })),
  };
  if (page.memory) {
    draft.memory = normalizeMemoryDraft(page.memory);
  }
  return draft;
}

/** Registro guardado (o nada, para un evento nuevo) → borrador del formulario. Conserva todas las secciones. */
export function normalizeDraft(event?: AdminEventRecord | null): EventDraft {
  const draft: EventDraft = {
    id: event?.id ?? "",
    title: event?.title ?? "",
    description: event?.description ?? "",
    cta: event?.cta ?? "",
    href: event?.href ?? "",
    external: Boolean(event?.external),
    featured: Boolean(event?.featured),
    featuredOrder: event?.featuredOrder ? String(event.featuredOrder) : "",
    eventDate: event?.eventDate ?? "",
    eventDateEnd: event?.eventDateEnd ?? "",
    status: event?.status ?? "Próximamente",
    kind: event?.kind ?? "",
    lines: event?.lines?.length ? ([...event.lines] as LineKey[]) : ["compite"],
    createdAt: event?.createdAt,
    updatedAt: event?.updatedAt,
  };

  if (event?.cover) {
    draft.cover = event.cover;
  }
  if (event?.source) {
    draft.source = event.source;
  }
  const page = normalizePageDraft(event?.page);
  if (page) {
    draft.page = page;
  }
  return draft;
}

const isBlank = (value: string) => !value.trim();

/** Añade la clave solo si el texto no está vacío: así una vuelta sin cambios no inventa campos vacíos. */
function putText(target: Record<string, unknown>, key: string, value: string) {
  if (!isBlank(value)) {
    target[key] = value;
  }
}

function buildMemoryPayload(memory: EventMemoryDraft): Record<string, unknown> {
  return {
    publication: memory.publication,
    summary: [...memory.summary],
    learnings: [...memory.learnings],
    results: memory.results.map((result) => {
      const row: Record<string, unknown> = { label: result.label, value: result.value, context: result.context };
      putText(row, "evidenceUrl", result.evidenceUrl);
      return row;
    }),
    outputs: memory.outputs.map((output) => {
      const row: Record<string, unknown> = { title: output.title, description: output.description };
      putText(row, "url", output.url);
      return row;
    }),
    gallery: memory.gallery.map((image) => {
      const row: Record<string, unknown> = { url: image.url, alt: image.alt };
      putText(row, "caption", image.caption);
      row.rightsConfirmed = image.rightsConfirmed;
      return row;
    }),
  };
}

/**
 * Borrador de la ficha → `page` del payload, completo. Las filas y los textos en blanco se envían tal cual (el
 * servidor los descarta con la misma regla): así el índice de un error del servidor, p. ej.
 * «memory.results.2.value», es el de la fila que el editor ve. Solo se omiten los opcionales vacíos.
 */
export function buildPagePayload(page: EventPageDraft): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    slug: page.slug.trim(),
    publication: page.publication,
    overview: [...page.overview],
    resources: page.resources.map((resource) => ({ title: resource.title, url: resource.url })),
  };

  putText(payload, "audience", page.audience);
  if (page.requirements.length) {
    payload.requirements = [...page.requirements];
  }
  if (page.modality) {
    payload.modality = page.modality;
  }
  putText(payload, "location", page.location);
  if (!isBlank(page.participation.label) || !isBlank(page.participation.url)) {
    payload.participation = { label: page.participation.label, url: page.participation.url };
  }

  if (page.memory === null) {
    // Quitar la memoria es explícito: omitir `memory` la conservaría en el servidor.
    payload.memory = null;
  } else if (page.memory) {
    payload.memory = buildMemoryPayload(page.memory);
  }
  return payload;
}

/**
 * Borrador → payload de create/update. Sin ficha en el borrador no hay clave `page` (el servidor conserva la
 * guardada); con ficha se envía completa. Nunca se envía `page: null` (el servidor lo rechaza).
 */
export function buildEventPayload(draft: EventDraft): Record<string, unknown> {
  const { page, ...rest } = draft;
  return page ? { ...rest, page: buildPagePayload(page) } : { ...rest };
}

/**
 * Validación previa al envío con el validador compartido (mismos límites y reglas de publicación que el servidor).
 * Devuelve errores por campo con las mismas claves que el servidor («overview», «memory.publication»,
 * «resources.0.url»…). Sin ficha no hay nada que validar.
 */
export function validatePageDraft(draft: EventDraft, now: string = new Date().toISOString()): EventPageErrors {
  if (!draft.page) {
    return {};
  }

  const result = validateEventPage(buildPagePayload(draft.page), {
    event: {
      status: draft.status,
      eventDate: draft.eventDate.trim() || undefined,
      eventDateEnd: draft.eventDateEnd.trim() || undefined,
    },
    now,
  });
  return result.ok ? {} : result.errors;
}

const PAGE_ERROR_PATH =
  /^(slug|publication|overview(\.\d+)?|audience|requirements(\.\d+)?|modality|location|page|participation(\.(label|url))?|resources(\.\d+(\.(title|url))?)?|memory(\.(publication|summary(\.\d+)?|learnings(\.\d+)?|results(\.\d+(\.(label|value|context|evidenceUrl))?)?|outputs(\.\d+(\.(title|description|url))?)?|gallery(\.\d+(\.(url|alt|caption|rightsConfirmed))?)?))?)$/;

/** ¿Hay un control de la ficha para este error? Los que no (p. ej. «id») van al resumen del formulario. */
export function isPageErrorPath(path: string) {
  return PAGE_ERROR_PATH.test(path);
}
