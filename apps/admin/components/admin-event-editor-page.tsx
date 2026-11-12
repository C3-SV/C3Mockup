"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { Button, Card } from "@c3/ui";
import type { EventItem } from "@c3/config";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import { ErrorState, LoadingSkeleton } from "./admin-primitives";
import { EventForm } from "./admin-event-form";
import type { EventDraft } from "@/lib/admin-types";

function getEventLabel(event?: EventItem | null, fallback = "Evento") {
  return event?.title || fallback;
}

export function AdminEventEditorPage({
  mode,
  eventId,
}: {
  mode: "create" | "edit";
  eventId?: string;
}) {
  const router = useRouter();
  const { events, getEventById, createEvent, updateEvent, deleteEvent, setFeedback: setGlobalFeedback } = useAdminData();
  const initialResolvedEvent = mode === "edit" ? events.find((item) => item.id === eventId) ?? null : null;
  const [resolvedEvent, setResolvedEvent] = useState<EventItem | null>(initialResolvedEvent);
  const [loadingEvent, setLoadingEvent] = useState(mode === "edit" && !initialResolvedEvent);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !eventId || resolvedEvent) {
      return;
    }

    let cancelled = false;

    async function loadEvent() {
      try {
        const event = await getEventById(eventId || "");
        if (cancelled) {
          return;
        }

        setResolvedEvent(event);
        setPageError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setResolvedEvent(null);
        setPageError(error instanceof Error ? error.message : "No pudimos cargar el evento.");
      } finally {
        if (!cancelled) {
          setLoadingEvent(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, getEventById, mode, resolvedEvent]);

  async function saveDraft(draft: EventDraft) {
    setSaving(true);
    setGlobalFeedback({ kind: "idle", text: "" });

    try {
      if (mode === "create") {
        const created = await createEvent(draft);
        setGlobalFeedback({ kind: "success", text: "Evento creado correctamente." });
        router.replace(`/admin/events/${encodeURIComponent(created.id)}`);
        setResolvedEvent(created);
        return;
      }

      const targetId = eventId || resolvedEvent?.id || draft.id;
      const updated = await updateEvent(targetId, draft);
      setGlobalFeedback({ kind: "success", text: "Evento actualizado correctamente." });
      setResolvedEvent(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos guardar el evento.";
      setGlobalFeedback({ kind: "error", text: message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(eventIdToDelete: string) {
    setDeleting(true);
    setGlobalFeedback({ kind: "idle", text: "" });

    try {
      await deleteEvent(eventIdToDelete);
      setGlobalFeedback({ kind: "success", text: "Evento eliminado correctamente." });
      router.push("/admin/events");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos eliminar el evento.";
      setGlobalFeedback({ kind: "error", text: message });
    } finally {
      setDeleting(false);
    }
  }

  const breadcrumbs =
    mode === "create"
      ? [
          { label: "Eventos", href: "/admin/events" },
          { label: "Nuevo evento" },
        ]
      : [
          { label: "Eventos", href: "/admin/events" },
          { label: getEventLabel(resolvedEvent, eventId || "Evento") },
        ];

  return (
    <AdminMain>
      <div className="mx-auto grid w-full max-w-[1440px] gap-5">
        <AdminTopbar
          breadcrumbs={breadcrumbs}
          eyebrow={mode === "edit" ? "Editar evento" : "Crear evento"}
          title={mode === "edit" ? "Editar evento" : "Crear evento"}
          description={
            mode === "edit"
              ? "Edita iniciativa, fechas, estados y contenido público del evento."
              : "Crea un nuevo evento reutilizando el formulario y los campos actuales."
          }
          subtitle={
            mode === "edit" ? (
              <span>
                ID: <strong>{resolvedEvent?.id || eventId}</strong>
                {resolvedEvent?.status ? ` · ${resolvedEvent.status}` : ""}
              </span>
            ) : (
              <span>Cancelas y vuelves al catálogo cuando quieras.</span>
            )
          }
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/admin/events"
                variant="ghost"
                className="gap-2 rounded-full border border-[#d5deea] bg-white px-5 py-3 text-[#0f203e]"
              >
                <FiArrowLeft />
                Volver al catálogo
              </Button>
            </div>
          }
        />

        {pageError ? (
          <ErrorState
            description={pageError}
            onRetry={
              mode === "edit"
                ? () => {
                    if (eventId) {
                      setPageError("");
                      setLoadingEvent(true);
                      getEventById(eventId)
                        .then((event) => setResolvedEvent(event))
                        .catch((error) =>
                          setPageError(error instanceof Error ? error.message : "No pudimos cargar el evento."),
                        )
                        .finally(() => setLoadingEvent(false));
                    }
                  }
                : undefined
            }
          />
        ) : null}

        {loadingEvent && mode === "edit" ? (
          <Card className="p-6">
            <div className="grid gap-4">
              <LoadingSkeleton className="h-8 w-1/3" />
              <LoadingSkeleton className="h-6 w-2/3" />
              <LoadingSkeleton className="h-96 rounded-[1.75rem]" />
            </div>
          </Card>
        ) : mode === "edit" && !resolvedEvent ? (
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiEdit3 className="text-[#205298]" />
                  Evento no encontrado
                </div>
                <h2 className="text-2xl font-bold text-[#0f203e]">No pudimos cargar este evento</h2>
                <p className="text-sm leading-7 text-[#5c6a82]">
                  Verifica el ID o vuelve al catálogo para elegir otro evento.
                </p>
              </div>
              <Button
                href="/admin/events"
                className="gap-2 rounded-full bg-[#33beac] px-5 py-3 text-[#0f203e]"
              >
                <FiArrowLeft />
                Volver al catálogo
              </Button>
            </div>
          </Card>
        ) : (
          <EventForm
            key={resolvedEvent?.id || mode}
            mode={mode}
            initialEvent={resolvedEvent}
            saving={saving}
            deleting={deleting}
            onCancel={() => router.push("/admin/events")}
            onSubmit={saveDraft}
            onDelete={mode === "edit" ? handleDelete : undefined}
          />
        )}
      </div>
    </AdminMain>
  );
}
