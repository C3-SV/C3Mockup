import type { ComponentType } from "react";
import type {
  AdminEventRecord,
  EventItem,
  EventModality,
  EventPagePublication,
  EventStatus,
  ExperienceKind,
  LineKey,
} from "@c3/config";

export type AdminSession = {
  email: string;
  name: string;
  picture?: string;
};

export type AdminFeedbackKind = "idle" | "success" | "error";

export type AdminFeedback = {
  kind: AdminFeedbackKind;
  text: string;
};

export type AdminNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

/**
 * Borrador de la ficha por edición. Misma forma que EventPage, con los campos opcionales como texto (vacío =
 * ausente) y la confirmación de derechos como booleano, porque un formulario necesita poder dejarla sin marcar.
 * buildEventPayload es el único paso de borrador a payload; el servidor sigue siendo la autoridad de validación.
 */
export type EventMemoryResultDraft = { label: string; value: string; context: string; evidenceUrl: string };
export type EventMemoryOutputDraft = { title: string; description: string; url: string };
export type EventMemoryImageDraft = { url: string; alt: string; caption: string; rightsConfirmed: boolean };

export type EventMemoryDraft = {
  publication: EventPagePublication;
  summary: string[];
  learnings: string[];
  results: EventMemoryResultDraft[];
  outputs: EventMemoryOutputDraft[];
  gallery: EventMemoryImageDraft[];
};

export type EventPageDraft = {
  slug: string;
  publication: EventPagePublication;
  overview: string[];
  audience: string;
  requirements: string[];
  modality: EventModality | "";
  location: string;
  participation: { label: string; url: string };
  resources: { title: string; url: string }[];
  /**
   * undefined: sin memoria (no se envía); objeto: se envía completa; null: el editor la quitó y el payload lleva
   * `memory: null`, la única forma de borrarla (omitirla la conserva).
   */
  memory?: EventMemoryDraft | null;
};

export type EventDraft = {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  external: boolean;
  featured: boolean;
  /** Orden en el destacado rotativo. Texto del campo: vacío = sin orden (se ordena por fecha). */
  featuredOrder: string;
  eventDate: string;
  eventDateEnd: string;
  status: EventStatus;
  /** Tipo de experiencia. Vacío = sin tipo (ícono genérico). */
  kind: ExperienceKind | "";
  lines: LineKey[];
  /** Portada y origen no se editan aquí: viajan intactos en la ida y vuelta. */
  cover?: EventItem["cover"];
  source?: string;
  /** Ficha por edición. undefined = el evento no tiene ficha y el formulario no la envía. */
  page?: EventPageDraft;
  createdAt?: string;
  updatedAt?: string;
};

export type EventFiltersState = {
  search: string;
  status: "all" | EventStatus;
  line: "all" | LineKey;
  featured: boolean;
};

export type AdminStats = {
  total: number;
  upcoming: number;
  openRegistrations: number;
  featured: number;
};

/** Registro del panel: la ficha lleva borradores y derechos (EventPage), no la proyección pública. */
export type { AdminEventRecord };
