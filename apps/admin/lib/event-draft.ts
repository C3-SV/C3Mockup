import {
  normalizeEventCover,
  validateEventPage,
  type AdminEventRecord,
  type EventMemory,
  type EventPage,
  type EventPageErrors,
  type LineKey,
} from "@c3/config";
import type { EventDraft, EventLogisticsDraft, EventMemoryDraft, EventPageDraft } from "./admin-types";

export function createEmptyDraft(): EventDraft {
  return normalizeDraft(null);
}

/**
 * Errores de la portada por enlace. La URL pasa por la misma regla que el servidor (https completo, sin credenciales);
 * con URL, el texto alternativo es obligatorio. Sin URL no hay portada y no hay errores.
 */
export function coverDraftErrors(draft: Pick<EventDraft, "coverUrl" | "coverAlt">): {
  coverUrl?: string;
  coverAlt?: string;
} {
  const url = draft.coverUrl.trim();
  const alt = draft.coverAlt.trim();
  const errors: { coverUrl?: string; coverAlt?: string } = {};
  if (!url) {
    // Texto alternativo sin enlace: no hay portada que describir; se avisa en vez de descartarlo en silencio.
    if (alt) {
      errors.coverUrl = "Escribe el enlace de la portada o borra el texto alternativo.";
    }
    return errors;
  }
  // normalizeEventCover exige alt; se usa un texto de prueba para comprobar solo la URL.
  if (!normalizeEventCover({ url, alt: alt || "prueba" })) {
    errors.coverUrl = "Usa un enlace https completo, sin credenciales.";
  }
  if (!alt) {
    errors.coverAlt = "Escribe el texto alternativo de la portada.";
  }
  return errors;
}

function createEmptyLogistics(): EventLogisticsDraft {
  return {
    venue: "",
    street: "",
    locality: "",
    region: "",
    country: "",
    startTime: "",
    endTime: "",
    organizerName: "",
    organizerUrl: "",
    speakers: "",
    offerPrice: "",
    offerUrl: "",
    registrationOpensOn: "",
    agendaStatus: "",
  };
}

function normalizeLogistics(page: EventPage): EventLogisticsDraft {
  return {
    venue: page.address?.venue ?? "",
    street: page.address?.street ?? "",
    locality: page.address?.locality ?? "",
    region: page.address?.region ?? "",
    country: page.address?.country ?? "",
    startTime: page.schedule?.startTime ?? "",
    endTime: page.schedule?.endTime ?? "",
    organizerName: page.organizer?.name ?? "",
    organizerUrl: page.organizer?.url ?? "",
    speakers: (page.speakers ?? []).join("\n"),
    offerPrice: page.offer ? String(page.offer.price) : "",
    offerUrl: page.offer?.url ?? "",
    registrationOpensOn: page.registrationOpensOn ?? "",
    agendaStatus: page.agendaStatus ?? "",
  };
}

/** Añade al payload solo los grupos con algún dato; un grupo a medias se envía para que el servidor lo señale. */
function putLogistics(payload: Record<string, unknown>, logistics: EventLogisticsDraft) {
  const address: Record<string, unknown> = {};
  putText(address, "venue", logistics.venue);
  putText(address, "street", logistics.street);
  putText(address, "locality", logistics.locality);
  putText(address, "region", logistics.region);
  // El país solo no es una dirección: sin ningún otro dato, no se envía (así se puede vaciar la dirección guardada).
  putText(address, "country", logistics.country);
  if (["venue", "street", "locality", "region"].some((key) => key in address)) {
    payload.address = address;
  }

  const schedule: Record<string, unknown> = {};
  putText(schedule, "startTime", logistics.startTime);
  putText(schedule, "endTime", logistics.endTime);
  if (Object.keys(schedule).length) {
    payload.schedule = schedule;
  }

  const organizer: Record<string, unknown> = {};
  putText(organizer, "name", logistics.organizerName);
  putText(organizer, "url", logistics.organizerUrl);
  if (Object.keys(organizer).length) {
    payload.organizer = organizer;
  }

  const speakers = logistics.speakers
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (speakers.length) {
    payload.speakers = speakers;
  }

  if (!isBlank(logistics.offerPrice) || !isBlank(logistics.offerUrl)) {
    const priceText = logistics.offerPrice.trim();
    const numeric = Number(priceText);
    const offer: Record<string, unknown> = {
      price: priceText === "" || Number.isNaN(numeric) ? priceText : numeric,
      currency: "USD",
    };
    putText(offer, "url", logistics.offerUrl);
    payload.offer = offer;
  }

  putText(payload, "registrationOpensOn", logistics.registrationOpensOn);
  if (logistics.agendaStatus) {
    payload.agendaStatus = logistics.agendaStatus;
  }
}

/**
 * Normalización del borrador del formulario (plan eventos-memorias, T3).
 *
 * Un solo camino en cada sentido: normalizeDraft (registro guardado → borrador) y buildEventPayload (borrador →
 * payload). Ambos conservan todo lo que el formulario no edita (portada, origen, campos legados) y la ficha completa.
 * El servidor valida todo otra vez: este módulo no es la autoridad de seguridad ni de límites.
 */

export function createEmptyMemoryDraft(): EventMemoryDraft {
  return { publication: "draft", summary: [""], learnings: [], results: [], outputs: [] };
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
    logistics: createEmptyLogistics(),
    participation: { label: "", url: "" },
    resources: [],
    gallery: [],
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
    logistics: normalizeLogistics(page),
    participation: { label: page.participation?.label ?? "", url: page.participation?.url ?? "" },
    resources: page.resources.map((resource) => ({ title: resource.title, url: resource.url })),
    gallery: (page.gallery ?? []).map((image) => ({
      url: image.url,
      alt: image.alt,
      caption: image.caption ?? "",
      rightsConfirmed: image.rightsConfirmed === true,
    })),
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
    coverUrl: event?.cover?.url ?? "",
    coverAlt: event?.cover?.alt ?? "",
    createdAt: event?.createdAt,
    updatedAt: event?.updatedAt,
  };

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

  // Sin fotos no hay clave: una ficha sin galería guardada vuelve igual (como requirements y modality).
  if (page.gallery.length) {
    payload.gallery = page.gallery.map((image) => {
      const row: Record<string, unknown> = { url: image.url, alt: image.alt };
      putText(row, "caption", image.caption);
      row.rightsConfirmed = image.rightsConfirmed;
      return row;
    });
  }

  putText(payload, "audience", page.audience);
  if (page.requirements.length) {
    payload.requirements = [...page.requirements];
  }
  if (page.modality) {
    payload.modality = page.modality;
  }
  putText(payload, "location", page.location);
  putLogistics(payload, page.logistics);
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
  const { page, coverUrl, coverAlt, ...rest } = draft;
  const payload: Record<string, unknown> = { ...rest };
  // Sin enlace se envía `cover: null`: el servidor fusiona con el registro guardado, así que omitirla conservaría la
  // portada anterior y no se podría borrar.
  payload.cover = coverUrl.trim() ? { url: coverUrl.trim(), alt: coverAlt.trim() } : null;
  if (page) {
    payload.page = buildPagePayload(page);
  }
  return payload;
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
  /^(slug|publication|overview(\.\d+)?|audience|requirements(\.\d+)?|modality|location|address(\.(venue|street|locality|region|country))?|schedule(\.(startTime|endTime))?|organizer(\.(name|url))?|speakers(\.\d+)?|offer(\.(price|currency|url))?|registrationOpensOn|agendaStatus|page|participation(\.(label|url))?|resources(\.\d+(\.(title|url))?)?|gallery(\.\d+(\.(url|alt|caption|rightsConfirmed))?)?|memory(\.(publication|summary(\.\d+)?|learnings(\.\d+)?|results(\.\d+(\.(label|value|context|evidenceUrl))?)?|outputs(\.\d+(\.(title|description|url))?)?))?)$/;

/** ¿Hay un control de la ficha para este error? Los que no (p. ej. «id») van al resumen del formulario. */
export function isPageErrorPath(path: string) {
  return PAGE_ERROR_PATH.test(path);
}
