"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiEdit3, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { Badge, Button, Card, Field, Input, Select, Table, Td, Th, Tr, cn } from "@c3/ui";
import { eventStatuses, lineKeys, type AdminEventRecord, type EventStatus, type LineKey } from "@c3/config";
import { getEventScheduleLabel, lineLabels, lineTone, statusTone } from "@/lib/admin-analytics";
import type { EventFiltersState } from "@/lib/admin-types";
import { EmptyState, LoadingSkeleton } from "./admin-primitives";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <Badge tone={statusTone[status] ?? "neutral"}>{status}</Badge>;
}

export function EventLineChip({ line }: { line: LineKey }) {
  return <Badge tone={lineTone[line].badge}>{lineLabels[line]}</Badge>;
}

/** Tabla de eventos: una fila por evento, con su línea, fecha, estado y acceso a la edición. */
export function EventList({
  events,
  emptyTitle = "No hay eventos para mostrar",
  emptyDescription = "Aún no hay eventos que coincidan con estos filtros.",
}: {
  events: AdminEventRecord[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!events.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Evento</Th>
          <Th>Línea</Th>
          <Th>Fecha</Th>
          <Th>Estado</Th>
          <Th>
            <span className="sr-only">Acciones</span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const editHref = `/admin/events/${encodeURIComponent(event.id)}`;

          return (
            <Tr key={event.id}>
              <Td>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={editHref} className="font-medium text-ink hover:text-brand hover:underline">
                    {event.title}
                  </Link>
                  {event.featured ? (
                    <Badge tone="warning">
                      <FiStar aria-hidden="true" />
                      Destacado
                    </Badge>
                  ) : null}
                </div>
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  {event.lines.map((line) => (
                    <EventLineChip key={`${event.id}-${line}`} line={line} />
                  ))}
                </div>
              </Td>
              <Td className="whitespace-nowrap text-muted">{getEventScheduleLabel(event) || "Sin fecha"}</Td>
              <Td>
                <EventStatusBadge status={event.status} />
              </Td>
              <Td className="text-right">
                <Link
                  href={editHref}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                >
                  <FiEdit3 aria-hidden="true" />
                  Editar
                </Link>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export function UpcomingEventsList({ events }: { events: AdminEventRecord[] }) {
  return (
    <EventList
      events={events}
      emptyTitle="No hay próximos eventos"
      emptyDescription="Cuando existan eventos no históricos, aparecerán aquí ordenados por fecha."
    />
  );
}

export function EventFilters({
  filters,
  totalCount,
  visibleCount,
  onChange,
  onClear,
}: {
  filters: EventFiltersState;
  totalCount: number;
  visibleCount: number;
  onChange: (next: EventFiltersState) => void;
  onClear: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="grid flex-1 gap-4 md:grid-cols-3">
        <Field label="Buscar por nombre">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden="true" />
            <Input
              type="search"
              value={filters.search}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="Nombre del evento"
              className="pl-9"
            />
          </div>
        </Field>

        <Field label="Estado">
          <Select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as EventFiltersState["status"] })}
          >
            <option value="all">Todos los estados</option>
            {eventStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Línea">
          <Select
            value={filters.line}
            onChange={(event) => onChange({ ...filters, line: event.target.value as EventFiltersState["line"] })}
          >
            <option value="all">Todas las líneas</option>
            {lineKeys.map((line) => (
              <option key={line} value={line}>
                {lineLabels[line]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 xl:justify-end">
        <Button
          variant="secondary"
          aria-pressed={filters.featured}
          onClick={() => onChange({ ...filters, featured: !filters.featured })}
          className={cn(filters.featured && "border-warning/40 bg-warning-soft text-warning")}
        >
          <FiStar aria-hidden="true" />
          Solo destacados
        </Button>
        <Button variant="ghost" onClick={onClear}>
          Limpiar filtros
        </Button>
        <p className="text-sm text-muted" aria-live="polite">
          {visibleCount} de {totalCount}
        </p>
      </div>
    </Card>
  );
}

export function LoadingEventList({ count = 3 }: { count?: number }) {
  return (
    <Card className="grid gap-3 p-5">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={index} className="h-10" />
      ))}
    </Card>
  );
}

function fieldHasValue(value: string) {
  return Boolean(value.trim());
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function filterEvents(events: AdminEventRecord[], filters: EventFiltersState) {
  const search = normalizeText(filters.search);

  return events.filter((event) => {
    if (search && !normalizeText(event.title).includes(search)) {
      return false;
    }

    if (filters.status !== "all" && event.status !== filters.status) {
      return false;
    }

    if (filters.line !== "all" && !event.lines.includes(filters.line)) {
      return false;
    }

    if (filters.featured && !event.featured) {
      return false;
    }

    return true;
  });
}

export function createDefaultFilters(): EventFiltersState {
  return {
    search: "",
    status: "all",
    line: "all",
    featured: false,
  };
}

export function hasActiveFilters(filters: EventFiltersState) {
  return Boolean(
    fieldHasValue(filters.search) ||
      filters.status !== "all" ||
      filters.line !== "all" ||
      filters.featured,
  );
}

export function DeleteEventDialog({
  open,
  eventTitle,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  eventTitle: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-4"
      role="presentation"
      onMouseDown={onCancel}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
        aria-describedby="delete-event-description"
        className="w-full max-w-md space-y-4 p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="space-y-2">
          <h3 id="delete-event-title" className="text-base font-semibold text-ink">
            Eliminar evento
          </h3>
          <p id="delete-event-description" className="text-sm text-muted">
            Vas a eliminar <strong className="text-ink">{eventTitle}</strong>. Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" ref={cancelRef} onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              void onConfirm();
            }}
            disabled={busy}
          >
            <FiTrash2 aria-hidden="true" />
            {busy ? "Eliminando…" : "Eliminar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
