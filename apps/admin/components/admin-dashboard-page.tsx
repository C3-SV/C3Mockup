"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { FiArrowRight, FiBarChart2, FiCalendar, FiLayers, FiRefreshCw, FiShield, FiStar } from "react-icons/fi";
import { Badge, Button, Card, cn } from "@c3/ui";
import { compareEventsBySchedule, lineKeys } from "@c3/config";
import {
  getDashboardStats,
  getLineCounts,
  getSortedUpcomingEvents,
  getStatusCounts,
  lineLabels,
  lineToneClasses,
} from "@/lib/admin-analytics";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import { LoadingSkeleton } from "./admin-primitives";
import { EventList, UpcomingEventsList } from "./admin-events";

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
  loading?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">{label}</p>
          {loading ? (
            <LoadingSkeleton className="h-9 w-24" />
          ) : (
            <p className="text-3xl font-bold text-[#0f203e]">{value}</p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white", tone)}>
          <Icon />
        </div>
      </div>
    </Card>
  );
}

function SummaryCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
        <Icon className="text-[#205298]" />
        {title}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function CountBar({ label, count, max, tone }: { label: string; count: number; max: number; tone: string }) {
  const width = max > 0 ? `${Math.max((count / max) * 100, 6)}%` : "0%";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#0f203e]">{label}</span>
        <span className="text-sm font-semibold text-[#205298]">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-[#e7eef6]">
        <div className={cn("h-2 rounded-full transition-all", tone)} style={{ width }} />
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { session, events, eventsLoading, reloadEvents } = useAdminData();

  const stats = getDashboardStats(events);
  const upcomingEvents = getSortedUpcomingEvents(events).slice(0, 5);
  const recentEvents = [...events].sort(compareEventsBySchedule).slice(0, 3);
  const lineCounts = getLineCounts(events);
  const statusCounts = getStatusCounts(events);
  const lineEntries = lineKeys.map((line) => ({
    line,
    label: lineLabels[line],
    count: lineCounts[line],
    tone: lineToneClasses[line].bar,
  }));
  const maxLineCount = Math.max(...lineEntries.map((entry) => entry.count), 1);
  const statusEntries = Object.entries(statusCounts);
  const maxStatusCount = Math.max(...statusEntries.map(([, count]) => count), 1);

  return (
    <AdminMain>
      <div className="mx-auto grid w-full max-w-[1440px] gap-5">
        <AdminTopbar
          breadcrumbs={[{ label: "Dashboard" }]}
          eyebrow="C3 Admin"
          title="Dashboard"
          description="Resumen general del contenido administrado en C3."
          subtitle={
            <span>
              Sesión activa como <strong>{session?.name || session?.email || "usuario autenticado"}</strong>
            </span>
          }
          actions={
            <Button
              variant="ghost"
              onClick={reloadEvents}
              disabled={eventsLoading}
              className="gap-2 rounded-full border border-[#d5deea] bg-white px-5 py-3 text-[#0f203e]"
            >
              <FiRefreshCw className={eventsLoading ? "animate-spin" : ""} />
              {eventsLoading ? "Recargando..." : "Recargar datos"}
            </Button>
          }
        />

        <section className="overflow-hidden rounded-[1.8rem] border border-[#d5deea] bg-white shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
          <div className="grid gap-6 bg-[linear-gradient(135deg,#0f203e_0%,#205298_58%,#33beac_100%)] px-6 py-6 text-white md:grid-cols-[1.2fr_0.8fr] md:px-8">
            <div className="space-y-4">
              <Badge className="w-fit border-white/20 bg-white/10 text-white">C3 Admin</Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Bienvenido de vuelta</h2>
                <p className="max-w-2xl text-sm leading-7 text-white/80">
                  {session?.name ? `${session.name}, ` : ""}
                  aquí tienes el estado general de los eventos, destacados y actividad editorial.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/85">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <FiShield />
                  {session?.email}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <FiCalendar />
                  {stats.total} eventos
                </span>
              </div>
            </div>

            <Card className="border-white/10 bg-white/10 p-5 text-white shadow-none backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                <FiBarChart2 />
                Resumen rápido
              </div>
              <div className="mt-4 grid gap-3 text-sm text-white/88">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span>Total</span>
                  <strong>{stats.total}</strong>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span>Próximos</span>
                  <strong>{stats.upcoming}</strong>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span>Abiertas</span>
                  <strong>{stats.openRegistrations}</strong>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span>Destacados</span>
                  <strong>{stats.featured}</strong>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total de eventos" value={String(stats.total)} icon={FiCalendar} tone="bg-[#205298]" loading={eventsLoading && !events.length} />
          <StatCard label="Próximos eventos" value={String(stats.upcoming)} icon={FiBarChart2} tone="bg-[#33beac]" loading={eventsLoading && !events.length} />
          <StatCard label="Inscripciones abiertas" value={String(stats.openRegistrations)} icon={FiShield} tone="bg-[#4f5ba9]" loading={eventsLoading && !events.length} />
          <StatCard label="Eventos destacados" value={String(stats.featured)} icon={FiStar} tone="bg-[#0f7a5f]" loading={eventsLoading && !events.length} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiCalendar className="text-[#205298]" />
                  Próximos eventos
                </div>
                <h3 className="text-2xl font-bold text-[#0f203e]">Ordenados cronológicamente</h3>
              </div>

              <Link
                href="/admin/events"
                className="inline-flex items-center gap-2 rounded-full border border-[#d5deea] bg-white px-4 py-2 text-sm font-semibold text-[#0f203e] transition hover:border-[#205298] hover:bg-[#f4f7fb]"
              >
                Ver todos los eventos
                <FiArrowRight />
              </Link>
            </div>

            <div className="mt-5">
              {eventsLoading && !events.length ? (
                <div className="grid gap-4">
                  <LoadingSkeleton className="h-28 rounded-[1.5rem]" />
                  <LoadingSkeleton className="h-28 rounded-[1.5rem]" />
                  <LoadingSkeleton className="h-28 rounded-[1.5rem]" />
                </div>
              ) : upcomingEvents.length ? (
                <UpcomingEventsList events={upcomingEvents} />
              ) : (
                <div className="grid gap-3 rounded-[1.5rem] border border-[#dbe5ef] bg-[#f8fbfe] p-5 text-sm leading-7 text-[#5c6a82]">
                  <p className="font-semibold text-[#0f203e]">No hay próximos eventos visibles.</p>
                  <p>Cuando se carguen eventos no históricos, se mostrarán aquí.</p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-5">
            <SummaryCard title="Distribución por línea" icon={FiLayers}>
              <div className="grid gap-4">
                {lineEntries.map((entry) => (
                  <CountBar
                    key={entry.line}
                    label={entry.label}
                    count={entry.count}
                    max={maxLineCount}
                    tone={entry.tone}
                  />
                ))}
              </div>
            </SummaryCard>

            <SummaryCard title="Resumen por estado" icon={FiBarChart2}>
              <div className="grid gap-3">
                {statusEntries.map(([label, count]) => (
                  <div key={label} className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[#0f203e]">{label}</span>
                      <span className="text-sm font-semibold text-[#205298]">{count}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#e7eef6]">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,#205298_0%,#33beac_100%)]"
                        style={{ width: `${Math.max((count / maxStatusCount) * 100, count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiCalendar className="text-[#205298]" />
              Acciones rápidas
            </div>
            <div className="mt-4 grid gap-3">
              <Button href="/admin/events/new" className="justify-start gap-3 rounded-2xl bg-[#33beac] px-4 py-3.5 text-[#0f203e]">
                <FiCalendar />
                Crear evento
              </Button>
              <Button href="/admin/events" variant="ghost" className="justify-start gap-3 rounded-2xl border border-[#d5deea] bg-white px-4 py-3.5 text-[#0f203e]">
                <FiLayers />
                Administrar eventos
              </Button>
              <Button variant="ghost" onClick={reloadEvents} className="justify-start gap-3 rounded-2xl border border-[#d5deea] bg-white px-4 py-3.5 text-[#0f203e]">
                <FiRefreshCw className={eventsLoading ? "animate-spin" : ""} />
                Recargar información
              </Button>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiLayers className="text-[#205298]" />
              Últimos cambios
            </div>
            <div className="mt-4 grid gap-3">
              {recentEvents.length ? (
                <EventList
                  events={recentEvents}
                  compact
                  emptyTitle="No hay cambios recientes"
                  emptyDescription="Cuando existan eventos, aparecerán aquí como referencia rápida."
                />
              ) : (
                <div className="rounded-[1.5rem] border border-[#dbe5ef] bg-[#f8fbfe] p-5 text-sm leading-7 text-[#5c6a82]">
                  Aún no hay eventos para resumir.
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </AdminMain>
  );
}
