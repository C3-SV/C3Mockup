"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCalendar, FiPlus, FiRefreshCw } from "react-icons/fi";
import { Button, Card } from "@c3/ui";
import { compareEventsBySchedule } from "@c3/config";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import {
  createDefaultFilters,
  filterEvents,
  EventFilters,
  EventList,
  LoadingEventList,
  hasActiveFilters,
} from "./admin-events";

export function AdminEventsPage() {
  const { events, eventsLoading, reloadEvents } = useAdminData();
  const [filters, setFilters] = useState(createDefaultFilters());

  const sortedEvents = [...events].sort(compareEventsBySchedule);
  const visibleEvents = filterEvents(sortedEvents, filters);

  return (
    <AdminMain>
      <div className="mx-auto grid w-full max-w-[1440px] gap-5">
        <AdminTopbar
          breadcrumbs={[{ label: "Eventos" }]}
          eyebrow="Módulo de eventos"
          title="Eventos"
          description="Administra iniciativas, fechas, estados y contenido público."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/admin/events/new"
                className="gap-2 rounded-full bg-[#33beac] px-5 py-3 text-[#0f203e]"
              >
                <FiPlus />
                Agregar evento
              </Button>
              <Button
                variant="ghost"
                onClick={reloadEvents}
                disabled={eventsLoading}
                className="gap-2 rounded-full border border-[#d5deea] bg-white px-5 py-3 text-[#0f203e]"
              >
                <FiRefreshCw className={eventsLoading ? "animate-spin" : ""} />
                Recargar
              </Button>
            </div>
          }
          subtitle={
            <span>
              {visibleEvents.length} de {events.length} eventos visibles
              {hasActiveFilters(filters) ? " con filtros aplicados" : ""}
            </span>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                <FiCalendar className="text-[#205298]" />
                Catálogo
              </div>
              <h2 className="text-2xl font-bold text-[#0f203e]">Lista de resultados</h2>
              <p className="text-sm leading-7 text-[#5c6a82]">
                Conserva la información actual y mejora la navegación con búsqueda y filtros.
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.5rem] border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Total</p>
                    <p className="mt-1 text-3xl font-bold text-[#0f203e]">{events.length}</p>
                  </div>
                  <Link
                    href="/admin/events/new"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d5deea] bg-white px-4 py-2 text-sm font-semibold text-[#0f203e] transition hover:border-[#205298] hover:bg-[#f4f7fb]"
                  >
                    <FiPlus />
                    Nuevo
                  </Link>
                </div>
              </div>

              <EventFilters
                filters={filters}
                totalCount={events.length}
                visibleCount={visibleEvents.length}
                onChange={setFilters}
                onClear={() => setFilters(createDefaultFilters())}
              />

              {eventsLoading && !events.length ? (
                <LoadingEventList />
              ) : visibleEvents.length ? (
                <EventList events={visibleEvents} />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[#d5deea] bg-[#f8fbfe] p-6 text-sm leading-7 text-[#5c6a82]">
                  No hay coincidencias con los filtros actuales.
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-5">
            <Card className="p-5 sm:p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiCalendar className="text-[#205298]" />
                  Acceso rápido
                </div>
                <h3 className="text-xl font-bold text-[#0f203e]">Crear o retomar edición</h3>
                <p className="text-sm leading-7 text-[#5c6a82]">
                  Agrega un evento nuevo o abre uno existente para editarlo sin duplicar formularios.
                </p>
              </div>
              <div className="mt-5 grid gap-3">
                <Button href="/admin/events/new" className="justify-start gap-3 rounded-2xl bg-[#33beac] px-4 py-3.5 text-[#0f203e]">
                  <FiPlus />
                  Agregar evento
                </Button>
                <Button href="/admin" variant="ghost" className="justify-start gap-3 rounded-2xl border border-[#d5deea] bg-white px-4 py-3.5 text-[#0f203e]">
                  <FiCalendar />
                  Ir al dashboard
                </Button>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiRefreshCw className="text-[#205298]" />
                  Actualización
                </div>
                <h3 className="text-xl font-bold text-[#0f203e]">Carga y filtrado</h3>
                <p className="text-sm leading-7 text-[#5c6a82]">
                  La lista se puede recargar sin perder el estado de filtros actuales.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminMain>
  );
}
