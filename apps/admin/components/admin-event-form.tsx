"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FiArrowLeft, FiSave, FiStar, FiTrash2 } from "react-icons/fi";
import { Badge, Button, Card, Field, Input, Select, Textarea, cn } from "@c3/ui";
import {
  eventStatuses,
  experienceKindLabels,
  experienceKinds,
  lineKeys,
  normalizeFeaturedOrder,
  type AdminEventRecord,
  type EventPageErrors,
  type EventStatus,
  type ExperienceKind,
  type LineKey,
} from "@c3/config";
import { AdminApiError } from "@/lib/admin-api";
import { getEventScheduleLabel, lineLabels } from "@/lib/admin-analytics";
import type { EventDraft, EventPageDraft } from "@/lib/admin-types";
import { normalizeDraft, validatePageDraft } from "@/lib/event-draft";
import { DeleteEventDialog, EventLineChip, EventStatusBadge } from "./admin-events";
import { EventPageFields } from "./admin-event-page-fields";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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

type DraftErrors = Partial<Record<"title" | "description" | "cta" | "href" | "status" | "lines" | "featuredOrder", string>>;

/** Resumen que se anuncia (y recibe el foco) cuando el guardado no prospera. */
type SubmitAlert = { title: string; detail?: string };

/**
 * Qué mostrar cuando falla el guardado. Un 400 con errores por campo se explica junto a los controles: el resumen
 * solo manda a revisarlos. Un 409 (slug o id ocupado) y cualquier otro fallo muestran el mensaje del servidor.
 */
function describeSaveFailure(error: unknown): { alert: SubmitAlert; fieldErrors: EventPageErrors } {
  const message = error instanceof Error && error.message ? error.message : "No pudimos guardar el evento.";
  const status = error instanceof AdminApiError ? error.status : undefined;
  const fieldErrors = error instanceof AdminApiError ? error.errors : {};

  if (status === 400 && Object.keys(fieldErrors).length > 0) {
    return { alert: { title: "No se guardó el evento.", detail: "Revisa los campos marcados." }, fieldErrors };
  }
  return { alert: { title: "No se guardó el evento.", detail: message }, fieldErrors };
}

/** Bloque del formulario: encabezado sobrio y campos en rejilla. */
function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

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
  initialEvent?: AdminEventRecord | null;
  saving?: boolean;
  deleting?: boolean;
  /** Rechaza si el guardado falla: el formulario muestra el error (400 por campo, 409, red) y conserva lo escrito. */
  onSubmit: (draft: EventDraft) => Promise<void>;
  onCancel: () => void;
  onDelete?: (eventId: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<EventDraft>(() => normalizeDraft(initialEvent));
  const [errors, setErrors] = useState<DraftErrors>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Errores de la ficha: los del validador compartido se recalculan en vivo tras el primer intento de guardar; los
  // del servidor se conservan hasta que el editor cambia la ficha (sus índices ya no valdrían).
  const [showPageErrors, setShowPageErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<EventPageErrors>({});
  const [submitAlert, setSubmitAlert] = useState<SubmitAlert | null>(null);
  // Contador de guardados correctos (0 = ninguno visible): su cambio mueve el foco al estado de éxito.
  const [savedCount, setSavedCount] = useState(0);
  const alertRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);
  const alertTitleId = useId();

  // Tras un guardado correcto el registro guardado vuelve como `initialEvent`: el borrador se relee de él (slug ya
  // bloqueado, memoria quitada…) sin remontar el formulario. Ajuste de estado durante el render, sin efecto.
  const [syncedEvent, setSyncedEvent] = useState(initialEvent);
  if (initialEvent !== syncedEvent) {
    setSyncedEvent(initialEvent);
    setDraft(normalizeDraft(initialEvent));
    setErrors({});
    setShowPageErrors(false);
    setServerErrors({});
  }

  useEffect(() => {
    if (submitAlert) {
      alertRef.current?.focus();
    }
  }, [submitAlert]);

  useEffect(() => {
    if (savedCount > 0) {
      savedRef.current?.focus();
    }
  }, [savedCount]);

  /** Cualquier cambio del borrador deja obsoletos los errores del servidor, el resumen y el aviso de guardado. */
  function markEdited() {
    setServerErrors({});
    setSubmitAlert(null);
    setSavedCount(0);
  }

  const pageErrors = useMemo<EventPageErrors>(
    () => ({ ...(showPageErrors ? validatePageDraft(draft) : {}), ...serverErrors }),
    [draft, serverErrors, showPageErrors],
  );

  function updatePage(next: EventPageDraft | undefined) {
    setDraft((current) => {
      const updated = { ...current };
      delete updated.page;
      if (next) {
        updated.page = next;
      }
      return updated;
    });
    markEdited();
  }

  function updateField<K extends keyof EventDraft>(field: K, value: EventDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [field]: value };

      if (field === "title" && mode === "create") {
        next.id = getDefaultId(String(value));
      }

      return next;
    });

    setErrors((current) => ({ ...current, [field]: undefined }));
    markEdited();
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
    markEdited();
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

    if (nextDraft.featured && nextDraft.featuredOrder.trim() && normalizeFeaturedOrder(nextDraft.featuredOrder) === undefined) {
      nextErrors.featuredOrder = "Usa un número entero entre 1 y 99.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    setShowPageErrors(true);
    setServerErrors({});

    // El validador compartido avisa antes de enviar (publicar la memoria incompleta, enlaces, límites); el
    // servidor vuelve a validar todo y sigue siendo la autoridad.
    if (Object.keys(nextErrors).length > 0 || Object.keys(validatePageDraft(draft)).length > 0) {
      setSubmitAlert({ title: "Revisa los campos marcados antes de guardar." });
      return;
    }

    setSubmitAlert(null);
    setSavedCount(0);
    try {
      await onSubmit(draft);
      setSavedCount((count) => count + 1);
    } catch (error) {
      const failure = describeSaveFailure(error);
      setServerErrors(failure.fieldErrors);
      setSubmitAlert(failure.alert);
    }
  }

  const scheduleLabel = getEventScheduleLabel(draft);
  const derivedId = draft.id.trim() || getDefaultId(draft.title);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="p-5 sm:p-6">
        <form className="grid gap-8" onSubmit={handleSubmit} noValidate>
          <FormSection title="Información principal">
            <Field
              label="Título"
              error={errors.title}
              errorId="title-error"
            >
              <Input
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                placeholder="Nombre del evento"
              />
            </Field>

            <Field label="Descripción" error={errors.description} errorId="description-error">
              <Textarea
                value={draft.description}
                onChange={(event) => updateField("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
                placeholder="Describe el evento"
              />
            </Field>
          </FormSection>

          <FormSection title="Publicación">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA" error={errors.cta} errorId="cta-error">
                <Input
                  value={draft.cta}
                  onChange={(event) => updateField("cta", event.target.value)}
                  aria-invalid={Boolean(errors.cta)}
                  aria-describedby={errors.cta ? "cta-error" : undefined}
                  placeholder="Ej. Ver hackathon"
                />
              </Field>

              <Field label="URL" error={errors.href} errorId="href-error">
                <Input
                  value={draft.href}
                  onChange={(event) => updateField("href", event.target.value)}
                  aria-invalid={Boolean(errors.href)}
                  aria-describedby={errors.href ? "href-error" : undefined}
                  placeholder="https://…"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Estado" error={errors.status} errorId="status-error">
                <Select
                  value={draft.status}
                  onChange={(event) => updateField("status", event.target.value as EventStatus)}
                  aria-invalid={Boolean(errors.status)}
                  aria-describedby={errors.status ? "status-error" : undefined}
                >
                  {eventStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Tipo de experiencia" hint="Elige el ícono de respaldo. Sin tipo, se usa un ícono genérico.">
                <Select
                  value={draft.kind}
                  onChange={(event) => updateField("kind", event.target.value as ExperienceKind | "")}
                >
                  <option value="">Sin tipo</option>
                  {experienceKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {experienceKindLabels[kind]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-lg border border-line bg-surface p-3">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand"
                />
                <span className="grid gap-0.5">
                  <span className="text-sm font-medium text-ink">Destacado</span>
                  <span className="text-xs text-muted">
                    Puede aparecer en el destacado rotativo de la portada mientras el evento esté vigente.
                  </span>
                </span>
              </label>

              {draft.featured ? (
                <Field
                  label="Orden en el destacado"
                  hint="Opcional. El número más bajo sale primero. Vacío: se ordena por fecha."
                  error={errors.featuredOrder}
                  errorId="featured-order-error"
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    step={1}
                    value={draft.featuredOrder}
                    onChange={(event) => updateField("featuredOrder", event.target.value)}
                    aria-invalid={Boolean(errors.featuredOrder)}
                    aria-describedby={errors.featuredOrder ? "featured-order-error" : undefined}
                  />
                </Field>
              ) : null}
            </div>
          </FormSection>

          <FormSection title="Fechas">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Fecha principal">
                <Input
                  type="date"
                  value={draft.eventDate}
                  onChange={(event) => updateField("eventDate", event.target.value)}
                />
              </Field>
              <Field label="Fecha final" hint="Opcional. Si el evento dura más de un día.">
                <Input
                  type="date"
                  value={draft.eventDateEnd}
                  onChange={(event) => updateField("eventDateEnd", event.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Líneas">
            <div className="flex flex-wrap gap-2">
              {lineKeys.map((line) => {
                const active = draft.lines.includes(line);

                return (
                  <Button
                    key={line}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleLine(line)}
                    aria-pressed={active}
                    className={cn(active && "border-brand bg-brand-soft text-brand")}
                  >
                    {lineLabels[line]}
                  </Button>
                );
              })}
            </div>
            {errors.lines ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.lines}
              </p>
            ) : null}
          </FormSection>

          <EventPageFields
            value={draft.page}
            onChange={updatePage}
            errors={pageErrors}
            event={initialEvent}
            schedule={draft}
          />

          <FormSection title="Datos técnicos">
            <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted">Identificador</dt>
                <dd className="mt-1 font-mono break-all text-ink">{derivedId || "pendiente"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Fechas</dt>
                <dd className="mt-1 text-ink">{scheduleLabel || "Sin fechas definidas"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Enlace externo</dt>
                <dd className="mt-1 text-ink">{draft.external ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Última actualización</dt>
                <dd className="mt-1 text-ink">{formatTimestamp(initialEvent?.updatedAt)}</dd>
              </div>
            </dl>
          </FormSection>

          {savedCount > 0 ? (
            <div
              ref={savedRef}
              tabIndex={-1}
              role="status"
              className="rounded-lg border border-success/25 bg-success-soft p-3 text-sm font-medium text-success outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
            >
              Cambios guardados.
            </div>
          ) : null}

          {submitAlert ? (
            <div
              ref={alertRef}
              tabIndex={-1}
              role="alert"
              aria-labelledby={alertTitleId}
              className="grid gap-1 rounded-lg border border-danger/25 bg-danger-soft p-3 text-sm text-danger outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
            >
              <p id={alertTitleId} className="font-semibold">
                {submitAlert.title}
              </p>
              {submitAlert.detail ? <p>{submitAlert.detail}</p> : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <Button type="submit" disabled={saving}>
              <FiSave aria-hidden="true" />
              {saving ? "Guardando…" : mode === "edit" ? "Guardar cambios" : "Crear evento"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              <FiArrowLeft aria-hidden="true" />
              {mode === "edit" ? "Volver" : "Cancelar"}
            </Button>
            {mode === "edit" && onDelete ? (
              <Button type="button" variant="danger" className="sm:ml-auto" onClick={() => setDeleteOpen(true)}>
                <FiTrash2 aria-hidden="true" />
                Eliminar
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <aside aria-label="Vista previa" className="lg:sticky lg:top-6">
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">Vista previa</h2>
            <Badge>Catálogo</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {draft.lines.map((line) => (
                <EventLineChip key={`preview-${line}`} line={line} />
              ))}
              <EventStatusBadge status={draft.status} />
              {draft.featured ? (
                <Badge tone="warning">
                  <FiStar aria-hidden="true" />
                  Destacado
                </Badge>
              ) : null}
            </div>

            <h3 className="text-base font-semibold text-ink">{draft.title.trim() || "Sin título"}</h3>
            <p className="text-sm text-muted">
              {draft.description.trim() || "Escribe una descripción para ver el resumen público."}
            </p>
          </div>

          <dl className="grid gap-3 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-muted">Botón</dt>
              <dd className="text-ink">{draft.cta.trim() || "Sin texto"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted">Enlace</dt>
              <dd className="break-all text-ink">{draft.href.trim() || "Sin enlace"}</dd>
            </div>
          </dl>
        </Card>
      </aside>

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
