import type { EventItem } from "@c3/config";
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

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(value?: string): number | null {
  if (!value) {
    return null;
  }
  const time = new Date(`${value}T00:00:00Z`).getTime();
  return Number.isNaN(time) ? null : time;
}

/**
 * Un evento es próximo mientras no termine su último día (la fecha de fin, o la de inicio si no hay
 * fin; si la de fin es anterior, cuenta la más tardía). Histórico nunca es próximo. Sin fecha válida
 * se trata como próximo, para no esconder un evento por un dato incompleto.
 */
export function isUpcomingEvent(
  event: Pick<EventItem, "eventDate" | "eventDateEnd" | "status">,
  now: Date,
): boolean {
  if (event.status === "Histórico") {
    return false;
  }

  const days = [parseDay(event.eventDate), parseDay(event.eventDateEnd)].filter(
    (day): day is number => day !== null,
  );
  if (!days.length) {
    return true;
  }

  return Math.max(...days) + DAY_MS > now.getTime();
}
