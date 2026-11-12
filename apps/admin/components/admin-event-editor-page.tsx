"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { Button, Card } from "@c3/ui";
import type { EventItem } from "@c3/config";
import { useAdminData } from "./admin-provider";
import { AdminMain, AdminTopbar } from "./admin-shell";
import { EmptyState, ErrorState, LoadingSkeleton } from "./admin-primitives";
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
      ? [{ label: "Dashboard", href: "/admin" }, { label: "Eventos", href: "/admin/events" }, { label: "Nuevo evento" }]
      : [
          { label: "Dashboard", href: "/admin" },
          { label: "Eventos", href: "/admin/events" },
          { label: getEventLabel(resolvedEvent, eventId || "Evento") },
        ];

  const retryLoad =
    mode === "edit" && eventId
      ? () => {
          setPageError("");
          setLoadingEvent(true);
          getEventById(eventId)
            .then((event) => setResolvedEvent(event))
            .catch((error) => setPageError(error instanceof Error ? error.message : "No pudimos cargar el evento."))
            .finally(() => setLoadingEvent(false));
        }
      : undefined;

  return (
    <AdminMain>
      <AdminTopbar
        breadcrumbs={breadcrumbs}
        title={mode === "edit" ? "Editar evento" : "Nuevo evento"}
        description={
          mode === "edit" && resolvedEvent
            ? `ID ${resolvedEvent.id} · ${resolvedEvent.status}`
            : "Completa los datos del evento. Se publica en el sitio al guardarlo."
        }
        actions={
          <Button href="/admin/events" variant="secondary">
            <FiArrowLeft aria-hidden="true" />
            Volver a eventos
          </Button>
        }
      />

      {pageError ? <ErrorState description={pageError} onRetry={retryLoad} /> : null}

      {loadingEvent && mode === "edit" ? (
        <Card className="grid gap-4 p-6">
          <LoadingSkeleton className="h-6 w-1/3" />
          <LoadingSkeleton className="h-4 w-2/3" />
          <LoadingSkeleton className="h-80" />
        </Card>
      ) : mode === "edit" && !resolvedEvent ? (
        <EmptyState
          title="No encontramos este evento"
          description="Revisa el enlace o vuelve al listado para elegir otro evento."
          action={
            <Button href="/admin/events" variant="secondary">
              <FiArrowLeft aria-hidden="true" />
              Volver a eventos
            </Button>
          }
        />
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
    </AdminMain>
  );
}
