"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { FiArrowRight, FiCalendar, FiCheckCircle, FiClock, FiPlus, FiRefreshCw, FiStar } from "react-icons/fi";
import { Badge, Button, Card, Table, Td, Th, Tr, cn } from "@c3/ui";
import { compareEventsBySchedule, lineKeys, type EventItem, type EventStatus } from "@c3/config";
import {
  getDashboardStats,
  getEventScheduleLabel,
  getLineCounts,
  getSortedUpcomingEvents,
  getStatusCounts,
  lineLabels,
  lineTone,
  statusTone,
} from "@/lib/admin-analytics";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import { EmptyState, LoadingSkeleton } from "./admin-primitives";
import { EventLineChip, EventStatusBadge } from "./admin-events";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  loading: boolean;
}) {
  return (
    <Card className="flex items-start justify-between gap-4 p-5">
      <div className="space-y-2">
        <p className="text-sm text-muted">{label}</p>
        {loading ? (
          <LoadingSkeleton className="h-8 w-16" />
        ) : (
          <p className="text-3xl font-semibold tabular-nums text-ink">{value}</p>
        )}
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon aria-hidden={true} />
      </span>
    </Card>
  );
}

function Panel({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("flex min-w-0 flex-col", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="flex-1 p-5">{children}</div>
    </Card>
  );
}

function EventsTable({ events }: { events: EventItem[] }) {
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
        {events.map((event) => (
          <Tr key={event.id}>
            <Td className="font-medium">{event.title}</Td>
            <Td>
              <div className="flex flex-wrap gap-1.5">
                {event.lines.map((line) => (
                  <EventLineChip key={line} line={line} />
                ))}
              </div>
            </Td>
            <Td className="whitespace-nowrap text-muted">{getEventScheduleLabel(event) || "Sin fecha"}</Td>
            <Td>
              <EventStatusBadge status={event.status} />
            </Td>
            <Td className="text-right">
              <Link href={`/admin/events/${encodeURIComponent(event.id)}`} className="text-sm font-medium text-brand hover:underline">
                Editar
              </Link>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

export function AdminDashboardPage() {
  const { events, eventsLoading, reloadEvents } = useAdminData();
  const loading = eventsLoading && !events.length;

  const stats = getDashboardStats(events);
  const upcomingEvents = getSortedUpcomingEvents(events).slice(0, 5);
  const featuredEvents = [...events]
    .filter((event) => event.featured)
    .sort(compareEventsBySchedule)
    .slice(0, 5);
  const lineCounts = getLineCounts(events);
  const maxLineCount = Math.max(...lineKeys.map((line) => lineCounts[line]), 1);
  const statusEntries = Object.entries(getStatusCounts(events));

  return (
    <AdminMain>
      <AdminTopbar
        breadcrumbs={[{ label: "Dashboard" }]}
        title="Dashboard"
        description="Resumen de los eventos que administra C3."
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

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Eventos" value={stats.total} icon={FiCalendar} loading={loading} />
        <StatCard label="Próximos" value={stats.upcoming} icon={FiClock} loading={loading} />
        <StatCard label="Inscripciones abiertas" value={stats.openRegistrations} icon={FiCheckCircle} loading={loading} />
        <StatCard label="Destacados" value={stats.featured} icon={FiStar} loading={loading} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Próximos eventos"
          className="lg:col-span-2"
          action={
            <Link href="/admin/events" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Ver todos
              <FiArrowRight aria-hidden="true" />
            </Link>
          }
        >
          {loading ? (
            <LoadingSkeleton className="h-40" />
          ) : upcomingEvents.length ? (
            <EventsTable events={upcomingEvents} />
          ) : (
            <EmptyState title="No hay próximos eventos" description="Cuando haya eventos por venir, aparecerán aquí." />
          )}
        </Panel>

        <div className="grid content-start gap-6">
          <Panel title="Eventos por línea">
            <ul className="grid gap-4">
              {lineKeys.map((line) => (
                <li key={line} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{lineLabels[line]}</span>
                    <span className="font-semibold tabular-nums text-ink">{lineCounts[line]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-subtle">
                    <div
                      className={cn("h-2 rounded-full", lineTone[line].bar)}
                      style={{ width: `${(lineCounts[line] / maxLineCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Eventos por estado">
            <ul className="grid gap-3">
              {statusEntries.map(([label, count]) => (
                <li key={label} className="flex items-center justify-between gap-3">
                  <Badge tone={statusTone[label as EventStatus] ?? "neutral"}>{label}</Badge>
                  <span className="text-sm font-semibold tabular-nums text-ink">{count}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="Destacados en el sitio">
        {loading ? (
          <LoadingSkeleton className="h-32" />
        ) : featuredEvents.length ? (
          <EventsTable events={featuredEvents} />
        ) : (
          <EmptyState title="No hay eventos destacados" description="Marca un evento como destacado para mostrarlo en la portada." />
        )}
      </Panel>
    </AdminMain>
  );
}
