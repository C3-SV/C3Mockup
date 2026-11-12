"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiEdit3, FiFilter, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { Badge, Button, Card, cn } from "@c3/ui";
import { eventStatuses, lineKeys, type EventItem, type EventStatus, type LineKey } from "@c3/config";
import {
  getCompactDateLabel,
  getEventScheduleLabel,
  lineLabels,
  lineToneClasses,
  statusToneByLabel,
} from "@/lib/admin-analytics";
import type { EventDraft, EventFiltersState } from "@/lib/admin-types";
import { EmptyState, LoadingSkeleton } from "./admin-primitives";

const defaultStatusTone = {
  chip: "border-[#d5deea] bg-[#f4f7fb] text-[#42526b]",
  bar: "bg-[#205298]",
  border: "border-[#d5deea]",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const tone = statusToneByLabel[status] ?? defaultStatusTone;

  return <Badge className={cn("border", tone.chip)}>{status}</Badge>;
}

export function EventLineChip({ line }: { line: LineKey }) {
  const tone = lineToneClasses[line];

  return <Badge className={cn("border", tone.chip)}>{lineLabels[line]}</Badge>;
}

export function EventListItem({
  event,
  compact = false,
  editHref,
  selected = false,
}: {
  event: EventItem;
  compact?: boolean;
  editHref: string;
  selected?: boolean;
}) {
  const statusTone = statusToneByLabel[event.status] ?? defaultStatusTone;

  return (
    <article
      className={cn(
        "rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_24px_rgba(15,32,62,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,32,62,0.1)]",
        selected ? "border-[#205298] bg-[#eef4ff]" : "border-[#d5deea]",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#0f203e]">{event.title}</h3>
            {event.featured ? (
              <Badge className="border-[#f2d58c] bg-[#fff9e8] text-[#9b6b00]">
                <FiStar className="mr-1" />
                Destacado
              </Badge>
            ) : null}
          </div>

          {!compact ? (
            <p className="max-w-3xl text-sm leading-7 text-[#5c6a82]">{event.description}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {event.lines.map((line) => (
              <EventLineChip key={`${event.id}-${line}`} line={line} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <EventStatusBadge status={event.status} />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
            {getEventScheduleLabel(event) || "Sin fecha"}
          </p>
        </div>
      </div>

      {compact ? null : (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">CTA</p>
            <p className="mt-1 text-sm font-medium text-[#0f203e]">{event.cta}</p>
          </div>
          <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">URL</p>
            <p className="mt-1 truncate text-sm font-medium text-[#0f203e]">{event.href}</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {!compact ? (
          <div className="grid gap-1 text-xs text-[#5c6a82]">
            <span className="font-semibold uppercase tracking-[0.14em]">Fechas</span>
            <span>{event.eventDate ? getCompactDateLabel(event.eventDate) : "Sin fecha principal"}</span>
            {event.eventDateEnd ? <span>Fin: {getCompactDateLabel(event.eventDateEnd)}</span> : null}
          </div>
        ) : (
          <div className="text-xs text-[#5c6a82]">
            {event.eventDate ? getCompactDateLabel(event.eventDate) : "Sin fecha principal"}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={editHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d5deea] bg-white px-4 py-2 text-sm font-semibold text-[#0f203e] transition hover:border-[#205298] hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#205298]/10"
          >
            <FiEdit3 />
            Editar
          </Link>
          <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", statusTone.chip)}>
            {event.status}
          </span>
        </div>
      </div>
    </article>
  );
}

export function EventList({
  events,
  compact = false,
  emptyTitle = "No hay eventos para mostrar",
  emptyDescription = "Aún no hay eventos que coincidan con estos filtros.",
}: {
  events: EventItem[];
  compact?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!events.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <EventListItem
          key={event.id}
          event={event}
          compact={compact}
          editHref={`/admin/events/${encodeURIComponent(event.id)}`}
        />
      ))}
    </div>
  );
}

export function UpcomingEventsList({ events }: { events: EventItem[] }) {
  if (!events.length) {
    return (
      <EmptyState
        title="No hay próximos eventos"
        description="Cuando existan eventos no históricos, aparecerán aquí ordenados por fecha."
      />
    );
  }

  return <EventList events={events} compact emptyTitle="No hay próximos eventos" emptyDescription="" />;
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
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Buscar</span>
            <div className="flex items-center gap-3 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3">
              <FiSearch className="shrink-0 text-[#205298]" />
              <input
                value={filters.search}
                onChange={(event) => onChange({ ...filters, search: event.target.value })}
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#96a2b6]"
                placeholder="Buscar por nombre"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Estado</span>
            <select
              value={filters.status}
              onChange={(event) =>
                onChange({ ...filters, status: event.target.value as EventFiltersState["status"] })
              }
              className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
            >
              <option value="all">Todos</option>
              {eventStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Línea</span>
            <select
              value={filters.line}
              onChange={(event) =>
                onChange({ ...filters, line: event.target.value as EventFiltersState["line"] })
              }
              className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
            >
              <option value="all">Todas</option>
              {lineKeys.map((line) => (
                <option key={line} value={line}>
                  {lineLabels[line]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <button
            type="button"
            onClick={() => onChange({ ...filters, featured: !filters.featured })}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              filters.featured
                ? "border-[#f2d58c] bg-[#fff9e8] text-[#9b6b00]"
                : "border-[#d5deea] bg-white text-[#40506b] hover:border-[#205298] hover:bg-[#f4f7fb]",
            )}
          >
            <FiFilter />
            Solo destacados
          </button>

          <Button variant="ghost" onClick={onClear} className="border border-[#d5deea] bg-white text-[#0f203e]">
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#5c6a82]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[#dbe5ef] bg-[#f8fbfe] px-3 py-1 font-semibold uppercase tracking-[0.14em]">
          {visibleCount} visibles
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#dbe5ef] bg-[#f8fbfe] px-3 py-1 font-semibold uppercase tracking-[0.14em]">
          {totalCount} totales
        </span>
      </div>
    </Card>
  );
}

export function LoadingEventList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-4">
          <div className="grid gap-4">
            <LoadingSkeleton className="h-5 w-1/3" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
              <LoadingSkeleton className="h-7 w-20 rounded-full" />
              <LoadingSkeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
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
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterEvents(events: EventItem[], filters: EventFiltersState) {
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

export function normalizeDraft(event?: EventItem | null): EventDraft {
  return {
    id: event?.id ?? "",
    title: event?.title ?? "",
    description: event?.description ?? "",
    cta: event?.cta ?? "",
    href: event?.href ?? "",
    external: Boolean(event?.external),
    featured: Boolean(event?.featured),
    eventDate: event?.eventDate ?? "",
    eventDateEnd: event?.eventDateEnd ?? "",
    status: event?.status ?? "Próximamente",
    lines: event?.lines?.length ? ([...event.lines] as LineKey[]) : ["compite"],
    createdAt: event?.createdAt,
    updatedAt: event?.updatedAt,
  };
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f203e]/50 px-4 py-4 sm:items-center"
      role="presentation"
      onMouseDown={onCancel}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
        aria-describedby="delete-event-description"
        className="w-full max-w-lg p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] text-[#b42318]">
              <FiTrash2 />
            </div>
            <div className="space-y-1">
              <h3 id="delete-event-title" className="text-lg font-semibold text-[#0f203e]">
                Eliminar evento
              </h3>
              <p id="delete-event-description" className="text-sm leading-7 text-[#5c6a82]">
                Vas a eliminar <strong>{eventTitle}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              ref={cancelRef}
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full border border-[#d5deea] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f203e] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#205298]/10"
            >
              Cancelar
            </button>
            <Button
              variant="ghost"
              onClick={() => {
                void onConfirm();
              }}
              disabled={busy}
              className="border border-[#f5c2c7] bg-[#fff5f5] text-[#b42318] hover:bg-[#ffeaea]"
            >
              {busy ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
