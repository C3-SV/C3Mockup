import type { ComponentType } from "react";
import type { EventItem, EventStatus, ExperienceKind, LineKey } from "@c3/config";

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

export type AdminEventRecord = EventItem;
