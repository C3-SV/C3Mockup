import type { LineKey } from "@c3/config";
import type { CatalogCardData } from "@/lib/ds/event-card";
import { isUpcomingEvent } from "@/lib/ds/event-state";

export type AreaFilter = "todas" | LineKey;
export type EstadoFilter = "todos" | "proximos" | "concluidos";
export type EventFilters = { area: AreaFilter; estado: EstadoFilter };

/**
 * Filtra las tarjetas del catálogo (Tarea 6.1). El área cuenta la línea principal y las secundarias. El estado
 * sale de isUpcomingEvent (fecha y estado del evento), no del texto de la pastilla. Conserva el orden de entrada.
 */
export function filterEvents(cards: CatalogCardData[], filters: EventFilters, now: Date): CatalogCardData[] {
  return cards.filter((card) => {
    if (filters.area !== "todas" && ![card.line, ...card.otherLines].includes(filters.area)) {
      return false;
    }
    if (filters.estado === "todos") {
      return true;
    }
    const upcoming = isUpcomingEvent(
      { eventDate: card.eventDate, eventDateEnd: card.eventDateEnd, status: card.status },
      now,
    );
    return filters.estado === "proximos" ? upcoming : !upcoming;
  });
}
