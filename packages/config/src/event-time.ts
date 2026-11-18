/**
 * Regla única de tiempo de los eventos (auditoría 2026-11-17, H2 y H3).
 *
 * Base: el día civil de El Salvador, UTC−6 fijo (El Salvador no tiene horario de verano). Un evento sigue vigente o
 * próximo hasta las 24:00 del último día en El Salvador. El último día es la fecha de fin, o la de inicio si no hay
 * fin o si el fin es anterior.
 *
 * Todas las superficies (catálogo, pastilla, ficha, admin, orden de listas) usan estas funciones. Ninguna depende de
 * la zona horaria del proceso ni del navegador: se calcula con aritmética UTC sobre el instante recibido.
 */

export const EL_SALVADOR_UTC_OFFSET_HOURS = -6;

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

/** Día civil AAAA-MM-DD, o undefined si falta, no tiene ese formato o no existe (p. ej. 2026-02-30). */
export function readCivilDay(value: string | undefined | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (!DAY_PATTERN.test(trimmed)) {
    return undefined;
  }
  const parsed = new Date(`${trimmed}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed ? undefined : trimmed;
}

/** Día civil de El Salvador (AAAA-MM-DD) en el instante dado, o undefined si el instante es inválido. */
export function elSalvadorDay(now: Date): string | undefined {
  const time = now.getTime();
  if (Number.isNaN(time)) {
    return undefined;
  }
  return new Date(time + EL_SALVADOR_UTC_OFFSET_HOURS * HOUR_MS).toISOString().slice(0, 10);
}

/** Último día del evento (AAAA-MM-DD): el fin si es válido y no es anterior al inicio; si no, el inicio. */
export function eventLastDay(event: { eventDate?: string; eventDateEnd?: string }): string | undefined {
  const start = readCivilDay(event.eventDate);
  const end = readCivilDay(event.eventDateEnd);
  if (end && (!start || end >= start)) {
    return end;
  }
  return start;
}

/**
 * Vigente o próximo: no es «Histórico» y su último día no ha terminado en El Salvador. Sin fecha válida cuenta como
 * próximo, para no esconder un evento por un dato incompleto.
 */
export function isEventCurrentOrUpcoming(
  event: { eventDate?: string; eventDateEnd?: string; status: string },
  now: Date,
): boolean {
  if (event.status === "Histórico") {
    return false;
  }
  const last = eventLastDay(event);
  if (!last) {
    return true;
  }
  const today = elSalvadorDay(now);
  return today === undefined ? true : last >= today;
}

/** Instante en que el evento deja de contar como vigente (medianoche de El Salvador al terminar su último día). */
export function eventCutoffMs(event: { eventDate?: string; eventDateEnd?: string }): number | null {
  const last = eventLastDay(event);
  if (!last) {
    return null;
  }
  const [year, month, day] = last.split("-").map(Number);
  // 00:00 de El Salvador del día siguiente = 06:00 UTC de ese día.
  return Date.UTC(year, month - 1, day) + DAY_MS - EL_SALVADOR_UTC_OFFSET_HOURS * HOUR_MS;
}
