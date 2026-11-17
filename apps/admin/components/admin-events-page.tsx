"use client";

import { useState } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { Button } from "@c3/ui";
import { compareEventsBySchedule } from "@c3/config";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import {
  createDefaultFilters,
  EventFilters,
  EventList,
  filterEvents,
  hasActiveFilters,
  LoadingEventList,
} from "./admin-events";

export function AdminEventsPage() {
  const { events, eventsLoading, reloadEvents } = useAdminData();
  const [filters, setFilters] = useState(createDefaultFilters());

  const sortedEvents = [...events].sort(compareEventsBySchedule);
  const visibleEvents = filterEvents(sortedEvents, filters);

  return (
    <AdminMain>
      <AdminTopbar
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Eventos" }]}
        title="Eventos"
        description={
          hasActiveFilters(filters)
            ? "Mostrando solo los eventos que cumplen los filtros."
            : "Crea, edita y revisa los eventos que aparecen en el sitio."
        }
        actions={
          <>
            <Button variant="secondary" onClick={reloadEvents} disabled={eventsLoading}>
              <FiRefreshCw className={eventsLoading ? "animate-spin" : undefined} aria-hidden="true" />
              {eventsLoading ? "Recargando…" : "Recargar"}
            </Button>
            <Button href="/admin/events/new">
              <FiPlus aria-hidden="true" />
              Nuevo evento
            </Button>
          </>
        }
      />

      <EventFilters
        filters={filters}
        totalCount={events.length}
        visibleCount={visibleEvents.length}
        onChange={setFilters}
        onClear={() => setFilters(createDefaultFilters())}
      />

      {eventsLoading && !events.length ? (
        <LoadingEventList />
      ) : (
        <EventList
          events={visibleEvents}
          emptyTitle={events.length ? "Ningún evento coincide con los filtros" : "Todavía no hay eventos"}
          emptyDescription={
            events.length
              ? "Cambia o limpia los filtros para ver más eventos."
              : "Crea el primer evento para que aparezca en el sitio."
          }
        />
      )}
    </AdminMain>
  );
}
