"use client";

import { useState, type FormEvent } from "react";
import { FiArrowLeft, FiClock, FiEdit3, FiSave, FiShield, FiStar, FiTrash2 } from "react-icons/fi";
import { Badge, Button, Card, cn } from "@c3/ui";
import { eventStatuses, lineKeys, type EventItem, type EventStatus, type LineKey } from "@c3/config";
import { getEventScheduleLabel, lineLabels, lineToneClasses } from "@/lib/admin-analytics";
import type { EventDraft } from "@/lib/admin-types";
import { DeleteEventDialog, EventLineChip, EventStatusBadge, normalizeDraft } from "./admin-events";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function formatTimestamp(value?: string) {
  if (!value) {
    return "No disponible";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(parsed)
    .replace(/\./g, "");
}

function getDefaultId(title: string) {
  return title.trim() ? slugify(title) : "";
}

type DraftErrors = Partial<Record<"title" | "description" | "cta" | "href" | "status" | "lines", string>>;

export function EventForm({
  mode,
  initialEvent,
  saving,
  deleting,
  onSubmit,
  onCancel,
  onDelete,
}: {
  mode: "create" | "edit";
  initialEvent?: EventItem | null;
  saving?: boolean;
  deleting?: boolean;
  onSubmit: (draft: EventDraft) => Promise<void>;
  onCancel: () => void;
  onDelete?: (eventId: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<EventDraft>(() => normalizeDraft(initialEvent));
  const [errors, setErrors] = useState<DraftErrors>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  function updateField<K extends keyof EventDraft>(field: K, value: EventDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [field]: value };

      if (field === "title" && mode === "create") {
        next.id = getDefaultId(String(value));
      }

      return next;
    });

    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleLine(line: LineKey) {
    setDraft((current) => {
      const nextLines = current.lines.includes(line)
        ? current.lines.filter((entry) => entry !== line)
        : [...current.lines, line];

      return {
        ...current,
        lines: nextLines.length ? nextLines : [line],
      };
    });

    setErrors((current) => ({ ...current, lines: undefined }));
  }

  function validate(nextDraft: EventDraft) {
    const nextErrors: DraftErrors = {};

    if (!nextDraft.title.trim()) {
      nextErrors.title = "El título es obligatorio.";
    }

    if (!nextDraft.description.trim()) {
      nextErrors.description = "La descripción es obligatoria.";
    }

    if (!nextDraft.cta.trim()) {
      nextErrors.cta = "El CTA es obligatorio.";
    }

    if (!nextDraft.href.trim()) {
      nextErrors.href = "La URL es obligatoria.";
    }

    if (!nextDraft.status.trim()) {
      nextErrors.status = "Selecciona un estado.";
    }

    if (!nextDraft.lines.length) {
      nextErrors.lines = "Selecciona al menos una línea.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(draft);
  }

  const scheduleLabel = getEventScheduleLabel(draft as EventItem);
  const derivedId = draft.id.trim() || getDefaultId(draft.title);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-5 sm:p-6">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">
                  {mode === "edit" ? "Editar evento" : "Crear evento"}
                </Badge>
                {mode === "edit" ? <EventStatusBadge status={draft.status} /> : null}
              </div>
              <h2 className="text-2xl font-bold text-[#0f203e]">
                {mode === "edit" ? "Editar evento" : "Crear evento"}
              </h2>
              <p className="text-sm leading-7 text-[#5c6a82]">
                Conserva la identidad visual del admin y administra el contenido existente sin agregar campos nuevos.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">ID</span>
              <code className="max-w-full rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] px-3 py-2 text-sm text-[#0f203e]">
                {mode === "edit" ? initialEvent?.id ?? derivedId : derivedId || "pendiente"}
              </code>
              {mode === "edit" && initialEvent?.updatedAt ? (
                <span className="text-xs text-[#5c6a82]">Actualizado: {formatTimestamp(initialEvent.updatedAt)}</span>
              ) : null}
            </div>
          </div>

          <section className="grid gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiShield className="text-[#205298]" />
              Información principal
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#0f203e]">Título</span>
              <input
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={cn(
                  "rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#205298]/10",
                  errors.title ? "border-[#f5c2c7] focus:border-[#b42318]" : "border-[#cfd9e5] focus:border-[#205298]",
                )}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                placeholder="Nombre del evento"
              />
              {errors.title ? (
                <p id="title-error" className="text-xs font-medium text-[#b42318]">
                  {errors.title}
                </p>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#0f203e]">Descripción</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={cn(
                  "min-h-32 rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#205298]/10",
                  errors.description
                    ? "border-[#f5c2c7] focus:border-[#b42318]"
                    : "border-[#cfd9e5] focus:border-[#205298]",
                )}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
                placeholder="Describe el evento"
              />
              {errors.description ? (
                <p id="description-error" className="text-xs font-medium text-[#b42318]">
                  {errors.description}
                </p>
              ) : null}
            </label>
          </section>

          <section className="grid gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiEdit3 className="text-[#205298]" />
              Publicación
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0f203e]">CTA</span>
                <input
                  value={draft.cta}
                  onChange={(event) => updateField("cta", event.target.value)}
                  className={cn(
                    "rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#205298]/10",
                    errors.cta ? "border-[#f5c2c7] focus:border-[#b42318]" : "border-[#cfd9e5] focus:border-[#205298]",
                  )}
                  aria-invalid={Boolean(errors.cta)}
                  aria-describedby={errors.cta ? "cta-error" : undefined}
                  placeholder="Ej. Ver hackathon"
                />
                {errors.cta ? (
                  <p id="cta-error" className="text-xs font-medium text-[#b42318]">
                    {errors.cta}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0f203e]">URL</span>
                <input
                  value={draft.href}
                  onChange={(event) => updateField("href", event.target.value)}
                  className={cn(
                    "rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#205298]/10",
                    errors.href ? "border-[#f5c2c7] focus:border-[#b42318]" : "border-[#cfd9e5] focus:border-[#205298]",
                  )}
                  aria-invalid={Boolean(errors.href)}
                  aria-describedby={errors.href ? "href-error" : undefined}
                  placeholder="https://..."
                />
                {errors.href ? (
                  <p id="href-error" className="text-xs font-medium text-[#b42318]">
                    {errors.href}
                  </p>
                ) : null}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0f203e]">Estado</span>
                <select
                  value={draft.status}
                  onChange={(event) => updateField("status", event.target.value as EventStatus)}
                  className={cn(
                    "rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#205298]/10",
                    errors.status ? "border-[#f5c2c7] focus:border-[#b42318]" : "border-[#cfd9e5] focus:border-[#205298]",
                  )}
                  aria-invalid={Boolean(errors.status)}
                  aria-describedby={errors.status ? "status-error" : undefined}
                >
                  {eventStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status ? (
                  <p id="status-error" className="text-xs font-medium text-[#b42318]">
                    {errors.status}
                  </p>
                ) : null}
              </label>

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#0f203e]">Destacado</span>
                  <p className="text-xs text-[#5c6a82]">Activa el destaque en listados y dashboard.</p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-5 w-5 rounded border-[#cfd9e5] text-[#205298]"
                />
              </label>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiClock className="text-[#205298]" />
              Fechas
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0f203e]">Fecha principal</span>
                <input
                  type="date"
                  value={draft.eventDate}
                  onChange={(event) => updateField("eventDate", event.target.value)}
                  className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0f203e]">Fecha final</span>
                <input
                  type="date"
                  value={draft.eventDateEnd}
                  onChange={(event) => updateField("eventDateEnd", event.target.value)}
                  className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                />
              </label>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiStar className="text-[#205298]" />
              Clasificación
            </div>

            <div className="flex flex-wrap gap-2">
              {lineKeys.map((line) => {
                const active = draft.lines.includes(line);
                const tone = lineToneClasses[line];

                return (
                  <button
                    key={line}
                    type="button"
                    onClick={() => toggleLine(line)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#205298]/10",
                      active
                        ? cn(tone.chip, "shadow-[0_8px_20px_rgba(15,32,62,0.06)]")
                        : "border-[#cfd9e5] bg-white text-[#40506b] hover:border-[#205298] hover:bg-[#f5f9ff]",
                    )}
                    aria-pressed={active}
                  >
                    {lineLabels[line]}
                  </button>
                );
              })}
            </div>
            {errors.lines ? <p className="text-xs font-medium text-[#b42318]">{errors.lines}</p> : null}
          </section>

          <section className="grid gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              <FiShield className="text-[#205298]" />
              Información técnica
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">ID</p>
                <p className="mt-2 break-all font-mono text-sm text-[#0f203e]">{derivedId || "pendiente"}</p>
              </div>

              <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Orden temporal</p>
                <p className="mt-2 text-sm font-semibold text-[#0f203e]">
                  {scheduleLabel || "Sin fechas definidas"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Externo</p>
                <p className="mt-2 text-sm font-semibold text-[#0f203e]">
                  {draft.external ? "Sí" : "No"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">Actualizado</p>
                <p className="mt-2 text-sm font-semibold text-[#0f203e]">
                  {formatTimestamp(initialEvent?.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-[#dbe5ef] pt-5">
            <Button
              type="submit"
              disabled={saving}
              className="gap-3 rounded-full bg-[#33beac] px-6 py-3.5 text-[#0f203e] shadow-[0_12px_30px_rgba(51,190,172,0.18)] hover:bg-[#48c6b5]"
            >
              <FiSave />
              {saving ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear evento"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="gap-2 rounded-full border border-[#d5deea] bg-white px-6 py-3.5 text-[#0f203e]"
            >
              <FiArrowLeft />
              {mode === "edit" ? "Volver" : "Cancelar"}
            </Button>

            {mode === "edit" && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteOpen(true)}
                className="gap-2 rounded-full border border-[#f5c2c7] bg-[#fff5f5] px-6 py-3.5 text-[#b42318] hover:bg-[#ffeaea]"
              >
                <FiTrash2 />
                Eliminar
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <Badge className="border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">Vista previa</Badge>
          <h3 className="text-xl font-bold text-[#0f203e]">
            {draft.title.trim() || "El evento aparecerá aquí"}
          </h3>
          <p className="text-sm leading-7 text-[#5c6a82]">
            Esta tarjeta muestra el resultado que se reflejará en el catálogo y en el dashboard.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {draft.lines.map((line) => (
              <EventLineChip key={`preview-${line}`} line={line} />
            ))}
            <EventStatusBadge status={draft.status} />
            {draft.featured ? (
              <Badge className="border-[#f2d58c] bg-[#fff9e8] text-[#9b6b00]">
                <FiStar className="mr-1" />
                Destacado
              </Badge>
            ) : null}
          </div>

          <p className="rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4 text-sm leading-7 text-[#364765]">
            {draft.description.trim() || "Agrega una descripción para mostrar el resumen público del evento."}
          </p>

          <div className="grid gap-3 rounded-2xl border border-[#dbe5ef] bg-[#f8fbfe] p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">CTA</p>
              <p className="mt-1 text-sm font-medium text-[#0f203e]">{draft.cta.trim() || "Sin CTA"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">URL</p>
              <p className="mt-1 break-all text-sm font-medium text-[#0f203e]">
                {draft.href.trim() || "Sin URL"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {mode === "edit" && onDelete ? (
        <DeleteEventDialog
          open={deleteOpen}
          eventTitle={initialEvent?.title || draft.title || "este evento"}
          busy={deleting}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={async () => {
            await onDelete(initialEvent?.id || draft.id || derivedId);
            setDeleteOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
