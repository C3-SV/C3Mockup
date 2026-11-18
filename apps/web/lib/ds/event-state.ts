import { isEventCurrentOrUpcoming, type EventItem } from "@c3/config";
import type { PillTone } from "@/components/ui/StatePill";

export type PillState = { label: string; tone: PillTone };

// El texto de la pastilla es el del evento (contenido conservado); el DS solo define el tono.
const TONE_BY_STATUS = new Map<string, PillTone>([
  ["Inscripciones abiertas", "exito"],
  ["Próximamente", "neutro"],
  ["Histórico", "neutro"],
  ["Apoyo institucional", "info"],
]);

export function toPillState(status: string): PillState {
  return { label: status, tone: TONE_BY_STATUS.get(status) ?? "neutro" };
}

/**
 * Vigente o próximo según la regla única de @c3/config (event-time.ts): cuenta hasta las 24:00 de El Salvador
 * del último día. Histórico nunca es próximo. Sin fecha válida se trata como próximo.
 */
export function isUpcomingEvent(
  event: Pick<EventItem, "eventDate" | "eventDateEnd" | "status">,
  now: Date,
): boolean {
  return isEventCurrentOrUpcoming(event, now);
}

/** Estados que hablan de un evento por venir. Un evento que ya terminó no los muestra. */
const TEMPORAL_STATUSES: ReadonlySet<string> = new Set(["Inscripciones abiertas", "Próximamente"]);

/**
 * Estado que se muestra en la pastilla. Un evento que ya terminó no dice «Inscripciones abiertas» ni
 * «Próximamente», aunque el dato siga así: muestra «Histórico». Los demás estados se conservan.
 */
export function pillStatusFor(
  event: Pick<EventItem, "eventDate" | "eventDateEnd" | "status">,
  now: Date,
): EventItem["status"] {
  if (isUpcomingEvent(event, now) || !TEMPORAL_STATUSES.has(event.status)) {
    return event.status;
  }
  return "Histórico";
}
