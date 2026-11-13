"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button, Input, Select, Textarea, cn } from "@c3/ui";
import {
  EVENT_PAGE_LIMITS,
  eventModalities,
  getEventPagePhase,
  type AdminEventRecord,
  type EventModality,
  type EventPageErrors,
} from "@c3/config";
import type {
  EventDraft,
  EventMemoryImageDraft,
  EventMemoryOutputDraft,
  EventMemoryResultDraft,
  EventPageDraft,
} from "@/lib/admin-types";
import { createEmptyMemoryDraft, createEmptyPageDraft, isPageErrorPath } from "@/lib/event-draft";

/**
 * Editor de bloque de la ficha por edición (plan eventos-memorias, T3; spec §5 y §7).
 *
 * Es controlado y sin persistencia propia: recibe el borrador y devuelve el siguiente con `onChange`. No valida con
 * `maxLength` ni decide nada de seguridad: los mensajes llegan en `errors`, con las claves del validador compartido
 * («overview», «memory.results.0.value»…), ya vengan del propio validador o del cuerpo de un 400/409 del servidor.
 * Cada mensaje se muestra junto a su control y se enlaza con aria-describedby.
 */

type ErrorsContextValue = { errors: EventPageErrors; idFor: (path: string) => string };

const ErrorsContext = createContext<ErrorsContextValue>({ errors: {}, idFor: (path) => path });

const TOUCH = "min-h-11";

function useErrors() {
  return useContext(ErrorsContext);
}

/** Mensaje de error de una clave; no pinta nada si no hay error. */
function ErrorText({ path }: { path: string }) {
  const { errors, idFor } = useErrors();
  const message = errors[path];

  return message ? (
    <p id={idFor(path)} role="alert" className="text-xs font-medium text-danger">
      {message}
    </p>
  ) : null;
}

/** ids de los errores que describen a un control: el propio y los de grupo que lo afectan. */
function useDescribedBy(paths: string[], extra: (string | undefined)[] = []) {
  const { errors, idFor } = useErrors();
  const present = paths.filter((path) => errors[path]);
  const ids = [...extra.filter((id): id is string => Boolean(id)), ...present.map(idFor)];

  return {
    "aria-invalid": present.length ? (true as const) : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  };
}

// ---------------------------------------------------------------------------------------------------------
// Campos
// ---------------------------------------------------------------------------------------------------------

type TextFieldProps = {
  label: string;
  /** Etiqueta solo para lectores de pantalla (filas de listas, donde el encabezado del grupo ya da contexto visual). */
  hideLabel?: boolean;
  path: string;
  /** Errores de grupo que también afectan a este control (p. ej. «overview» para cada párrafo). */
  linkedPaths?: string[];
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  focusKey?: string;
};

function TextField({
  label,
  hideLabel,
  path,
  linkedPaths = [],
  hint,
  value,
  onChange,
  multiline,
  readOnly,
  placeholder,
  focusKey,
}: TextFieldProps) {
  const controlId = useId();
  const hintId = `${controlId}-hint`;
  const describedBy = useDescribedBy([path, ...linkedPaths], [hint ? hintId : undefined]);
  const shared = {
    id: controlId,
    value,
    readOnly,
    placeholder,
    "aria-label": hideLabel ? label : undefined,
    "aria-readonly": readOnly ? true : undefined,
    "data-focus-key": focusKey,
    ...describedBy,
  };

  return (
    <div className="grid gap-1.5">
      {hideLabel ? null : (
        <label htmlFor={controlId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {multiline ? (
        <Textarea
          {...shared}
          rows={4}
          className={cn(TOUCH, readOnly && "bg-subtle")}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          {...shared}
          className={cn(TOUCH, readOnly && "bg-subtle")}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <ErrorText path={path} />
    </div>
  );
}

function SelectField({
  label,
  path,
  value,
  onChange,
  children,
}: {
  label: string;
  path: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const controlId = useId();
  const describedBy = useDescribedBy([path]);

  return (
    <div className="grid gap-1.5">
      <label htmlFor={controlId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <Select id={controlId} value={value} className={TOUCH} onChange={(event) => onChange(event.target.value)} {...describedBy}>
        {children}
      </Select>
      <ErrorText path={path} />
    </div>
  );
}

/** Casilla con etiqueta; `role="switch"` para las publicaciones (encendido = público al guardar). */
function CheckField({
  title,
  description,
  checked,
  onChange,
  path,
  asSwitch,
  describedByIds,
  below,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  path: string;
  asSwitch?: boolean;
  describedByIds?: string[];
  below?: ReactNode;
}) {
  const describedBy = useDescribedBy([path], describedByIds);

  return (
    <div className="grid gap-1.5">
      <label className={cn("flex items-start gap-3 rounded-lg border border-line bg-surface p-3", TOUCH)}>
        <input
          type="checkbox"
          role={asSwitch ? "switch" : undefined}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
          {...describedBy}
        />
        <span className="grid gap-0.5">
          <span className="text-sm font-medium text-ink">{title}</span>
          {description ? <span className="text-xs text-muted">{description}</span> : null}
        </span>
      </label>
      {below}
      <ErrorText path={path} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------
// Listas con añadir y quitar filas
// ---------------------------------------------------------------------------------------------------------

type RowListProps<T> = {
  /** Clave de error del grupo (p. ej. «resources»): su mensaje se muestra bajo el encabezado y afecta a cada fila. */
  path: string;
  /** Nombre del grupo, con mayúscula inicial: «Recursos». */
  legend: string;
  /** Nombre de una fila: «recurso» (para los botones) y «Recurso» (para el grupo de la fila). */
  noun: string;
  items: T[];
  max: number;
  create: () => T;
  onChange: (next: T[]) => void;
  hint?: string;
  /** El contenedor ya es un grupo con ese nombre (fieldset): no repetir el rol. */
  bare?: boolean;
  /** Cada fila es un grupo nombrado («Recurso 1») con varios campos. */
  groupRows?: boolean;
  renderRow: (item: T, index: number, set: (next: T) => void) => ReactNode;
};

function RowList<T>({ path, legend, noun, items, max, create, onChange, hint, bare, groupRows, renderRow }: RowListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<"add" | number | null>(null);
  const capitalized = noun.charAt(0).toUpperCase() + noun.slice(1);
  const atLimit = items.length >= max;

  // Tras añadir, el foco va al primer control de la fila nueva; tras quitar, al botón de añadir (la fila ya no existe).
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === null) {
      return;
    }
    if (target === "add") {
      addRef.current?.focus();
      return;
    }
    containerRef.current
      ?.querySelector<HTMLElement>(`[data-row-index="${target}"] input, [data-row-index="${target}"] textarea`)
      ?.focus();
  });

  function setItem(index: number, next: T) {
    onChange(items.map((item, position) => (position === index ? next : item)));
  }

  function addItem() {
    pendingFocus.current = items.length;
    onChange([...items, create()]);
  }

  function removeItem(index: number) {
    pendingFocus.current = "add";
    onChange(items.filter((_, position) => position !== index));
  }

  return (
    <div
      ref={containerRef}
      role={bare ? undefined : "group"}
      aria-label={bare ? undefined : legend}
      className="grid gap-3"
    >
      {bare ? null : <h4 className="text-sm font-medium text-ink">{legend}</h4>}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      <ErrorText path={path} />

      {items.map((item, index) => {
        const rowLabel = `${capitalized} ${index + 1}`;
        return (
          <div
            key={index}
            data-row-index={index}
            role={groupRows ? "group" : undefined}
            aria-label={groupRows ? rowLabel : undefined}
            className={cn(
              groupRows ? "grid gap-3 rounded-lg border border-line bg-surface p-3" : "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
            )}
          >
            <div className="grid gap-3">{renderRow(item, index, (next) => setItem(index, next))}</div>
            <div>
              <Button
                type="button"
                variant="secondary"
                className={cn(TOUCH, "min-w-11")}
                aria-label={`Quitar ${noun} ${index + 1} de ${legend}`}
                onClick={() => removeItem(index)}
              >
                <FiTrash2 aria-hidden="true" />
                Quitar
              </Button>
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          ref={addRef}
          type="button"
          variant="secondary"
          className={TOUCH}
          disabled={atLimit}
          aria-label={`Añadir ${noun} a ${legend}`}
          onClick={addItem}
        >
          <FiPlus aria-hidden="true" />
          Añadir {noun}
        </Button>
        <span className="text-xs text-muted">
          {items.length} de {max}
          {atLimit ? " (máximo)" : ""}
        </span>
      </div>
    </div>
  );
}

/** Lista de textos (párrafos o frases): una fila por texto. */
function TextRows({
  path,
  legend,
  noun,
  rowLabel,
  items,
  max,
  onChange,
  multiline,
  hint,
  firstFocusKey,
}: {
  path: string;
  legend: string;
  noun: string;
  /** Marca del primer control, para devolverle el foco tras una acción que cambia la estructura. */
  firstFocusKey?: string;
  /** Nombre accesible de cada control: «Párrafo 1 de la presentación». */
  rowLabel: (position: number) => string;
  items: string[];
  max: number;
  onChange: (next: string[]) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <RowList
      path={path}
      legend={legend}
      noun={noun}
      items={items}
      max={max}
      create={() => ""}
      onChange={onChange}
      hint={hint}
      renderRow={(item, index, set) => (
        <TextField
          hideLabel
          label={rowLabel(index + 1)}
          path={`${path}.${index}`}
          linkedPaths={[path]}
          value={item}
          multiline={multiline}
          focusKey={index === 0 ? firstFocusKey : undefined}
          onChange={set}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------------------------------------
// Bloque completo
// ---------------------------------------------------------------------------------------------------------

export type EventPageFieldsProps = {
  /** Borrador de la ficha; undefined = el evento no tiene ficha (no se envía nada). */
  value: EventPageDraft | undefined;
  onChange: (next: EventPageDraft | undefined) => void;
  /** Errores por campo (claves del validador compartido): del validador local o del cuerpo de un 400/409. */
  errors?: EventPageErrors;
  /** Registro guardado: decide qué es inmutable (slug) y qué se borra de forma expresa (memoria). */
  event?: AdminEventRecord | null;
  /** Estado y fechas que el editor tiene ahora en el formulario, para avisar de la regla de la memoria (R9). */
  schedule?: Pick<EventDraft, "status" | "eventDate" | "eventDateEnd">;
};

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="grid min-w-0 gap-4 rounded-lg border border-line p-4">
      <legend className="px-1 text-sm font-semibold text-ink">{legend}</legend>
      {children}
    </fieldset>
  );
}

const MODALITY_LABELS: Record<EventModality, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

export function EventPageFields({ value, onChange, errors = {}, event = null, schedule }: EventPageFieldsProps) {
  const prefix = useId();
  const containerRef = useRef<HTMLElement>(null);
  const focusKey = useRef<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);

  const idFor = (path: string) => `${prefix}-e-${path.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const ctx: ErrorsContextValue = { errors, idFor };

  // Foco tras un cambio de estructura (crear ficha, añadir o quitar memoria): el botón pulsado desaparece del DOM.
  useEffect(() => {
    const key = focusKey.current;
    focusKey.current = null;
    if (key) {
      containerRef.current?.querySelector<HTMLElement>(`[data-focus-key="${key}"]`)?.focus();
    }
  });

  const savedPage = event?.page;
  const slugLocked = Boolean(savedPage);
  const leftovers = Object.entries(errors).filter(([path]) => !isPageErrorPath(path));

  function update(patch: Partial<EventPageDraft>) {
    if (value) {
      onChange({ ...value, ...patch });
    }
  }

  const otherErrors = leftovers.length ? (
    <div role="alert" className="grid gap-1 rounded-lg border border-danger/25 bg-danger-soft p-3 text-xs text-danger">
      <p className="font-semibold">Otros errores</p>
      <ul className="list-disc pl-4">
        {leftovers.map(([path, message]) => (
          <li key={path}>{message}</li>
        ))}
      </ul>
    </div>
  ) : null;

  let body: ReactNode;

  if (!value) {
    body = (
      <div className="grid gap-3">
        <p className="text-sm text-muted">
          Este evento aún no tiene ficha pública. La ficha cuenta la edición en /eventos/ con su dirección propia y,
          después, conserva la memoria y los resultados.
        </p>
        <div>
          <Button
            type="button"
            variant="secondary"
            className={TOUCH}
            onClick={() => {
              focusKey.current = "page-first";
              onChange(createEmptyPageDraft());
            }}
          >
            <FiPlus aria-hidden="true" />
            Crear ficha
          </Button>
        </div>
      </div>
    );
  } else {
    const memory = value.memory ?? undefined;
    const phase = getEventPagePhase(
      schedule ?? { status: event?.status ?? "Próximamente", eventDate: event?.eventDate, eventDateEnd: event?.eventDateEnd },
      new Date(),
    );
    const memoryHintId = `${prefix}-memory-phase`;
    const savedPublished = savedPage?.publication === "published";
    const savedMemoryPublished = savedPage?.memory?.publication === "published";

    body = (
      <div className="grid gap-5">
        <p className="text-sm text-muted">
          Texto plano: sin HTML ni formato. Los campos vacíos no generan secciones en el sitio.
        </p>

        <Group legend="Ficha">
          <TextField
            label="Slug de la ficha"
            path="slug"
            value={value.slug}
            readOnly={slugLocked}
            focusKey="page-first"
            hint={
              slugLocked
                ? `No se puede cambiar después del primer guardado. Dirección pública: /eventos/${value.slug}`
                : "Minúsculas sin acentos, números y guiones (de 3 a 120 caracteres). Será la dirección /eventos/ de la ficha y no se podrá cambiar después del primer guardado."
            }
            onChange={(slug) => update({ slug })}
          />

          <CheckField
            asSwitch
            title="Publicar ficha"
            description={
              savedPublished
                ? "La ficha ya es pública: los cambios que guardes se hacen públicos al guardar, sin versión previa. Para retirarla, apaga el interruptor y guarda."
                : "Apagada, la ficha es un borrador y no se ve en el sitio. Encendida, la ficha y cualquier cambio posterior serán públicos al guardar."
            }
            path="publication"
            checked={value.publication === "published"}
            onChange={(published) => update({ publication: published ? "published" : "draft" })}
          />

          <TextRows
            path="overview"
            legend="Presentación"
            noun="párrafo"
            rowLabel={(position) => `Párrafo ${position} de la presentación`}
            items={value.overview}
            max={EVENT_PAGE_LIMITS.paragraphs}
            multiline
            hint="Obligatoria para publicar la ficha: al menos un párrafo."
            onChange={(overview) => update({ overview })}
          />

          <TextField
            label="Público"
            path="audience"
            hint="Opcional. A quién va dirigida la edición."
            value={value.audience}
            onChange={(audience) => update({ audience })}
          />

          <TextRows
            path="requirements"
            legend="Requisitos"
            noun="requisito"
            rowLabel={(position) => `Requisito ${position}`}
            items={value.requirements}
            max={EVENT_PAGE_LIMITS.listItems}
            onChange={(requirements) => update({ requirements })}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Modalidad"
              path="modality"
              value={value.modality}
              onChange={(modality) => update({ modality: modality as EventModality | "" })}
            >
              <option value="">Sin definir</option>
              {eventModalities.map((modality) => (
                <option key={modality} value={modality}>
                  {MODALITY_LABELS[modality]}
                </option>
              ))}
            </SelectField>
            <TextField label="Lugar" path="location" value={value.location} onChange={(location) => update({ location })} />
          </div>
        </Group>

        <Group legend="Participación">
          <p className="text-xs text-muted">
            Opcional. El botón solo se muestra mientras las inscripciones estén abiertas y la edición no haya terminado.
          </p>
          <ErrorText path="participation" />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Texto del botón"
              path="participation.label"
              value={value.participation.label}
              onChange={(label) => update({ participation: { ...value.participation, label } })}
            />
            <TextField
              label="Enlace de participación"
              path="participation.url"
              hint="https completo o ruta local que empiece con «/»."
              value={value.participation.url}
              onChange={(url) => update({ participation: { ...value.participation, url } })}
            />
          </div>
        </Group>

        <Group legend="Recursos">
          <RowList
            bare
            groupRows
            path="resources"
            legend="Recursos"
            noun="recurso"
            items={value.resources}
            max={EVENT_PAGE_LIMITS.entries}
            create={() => ({ title: "", url: "" })}
            onChange={(resources) => update({ resources })}
            hint="Materiales de la edición: guías, bases, presentaciones."
            renderRow={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-2">
                <TextField label="Título" path={`resources.${index}.title`} linkedPaths={["resources"]} value={item.title} onChange={(title) => set({ ...item, title })} />
                <TextField label="Enlace" path={`resources.${index}.url`} linkedPaths={["resources"]} value={item.url} onChange={(url) => set({ ...item, url })} />
              </div>
            )}
          />
        </Group>

        <Group legend="Memoria y resultados">
          {!memory ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted">
                La memoria cuenta lo que pasó: resumen, aprendizajes, resultados y proyectos. Puedes prepararla en
                borrador y publicarla cuando la edición termine. No hace falta tener cifras ni fotos.
              </p>
              <ErrorText path="memory" />
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className={TOUCH}
                  data-focus-key="add-memory"
                  onClick={() => {
                    focusKey.current = "memory-first";
                    update({ memory: createEmptyMemoryDraft() });
                  }}
                >
                  <FiPlus aria-hidden="true" />
                  Añadir memoria
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CheckField
                asSwitch
                title="Publicar memoria"
                description="La memoria se hace pública al guardar, junto con la ficha. Requiere la ficha publicada y al menos un párrafo de resumen."
                path="memory.publication"
                checked={memory.publication === "published"}
                describedByIds={phase !== "ended" ? [memoryHintId] : []}
                onChange={(published) => update({ memory: { ...memory, publication: published ? "published" : "draft" } })}
                below={
                  phase !== "ended" ? (
                    <p id={memoryHintId} className="text-xs text-muted">
                      Esta edición todavía no tiene una fecha final confirmada ya pasada ni el estado Histórico, y no
                      se deduce de la fecha principal. Confirma una de las dos en «Fechas» o «Estado» para poder
                      publicar la memoria.
                    </p>
                  ) : null
                }
              />
              {savedMemoryPublished ? (
                <p className="text-xs text-muted">
                  La memoria ya es pública: los cambios que guardes se hacen públicos al guardar.
                </p>
              ) : null}

              <TextRows
                path="memory.summary"
                legend="Resumen de la memoria"
                noun="párrafo"
                rowLabel={(position) => `Párrafo ${position} del resumen de la memoria`}
                items={memory.summary}
                max={EVENT_PAGE_LIMITS.paragraphs}
                multiline
                firstFocusKey="memory-first"
                hint="Obligatorio para publicar la memoria."
                onChange={(summary) => update({ memory: { ...memory, summary } })}
              />

              <TextRows
                path="memory.learnings"
                legend="Aprendizajes"
                noun="aprendizaje"
                rowLabel={(position) => `Aprendizaje ${position}`}
                items={memory.learnings}
                max={EVENT_PAGE_LIMITS.listItems}
                onChange={(learnings) => update({ memory: { ...memory, learnings } })}
              />

              <RowList<EventMemoryResultDraft>
                groupRows
                path="memory.results"
                legend="Resultados"
                noun="resultado"
                items={memory.results}
                max={EVENT_PAGE_LIMITS.entries}
                create={() => ({ label: "", value: "", context: "", evidenceUrl: "" })}
                onChange={(results) => update({ memory: { ...memory, results } })}
                hint="Cifras o logros con su contexto. Solo con datos confirmados: no hay valores de ejemplo."
                renderRow={(item, index, set) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <TextField label="Etiqueta" path={`memory.results.${index}.label`} linkedPaths={["memory.results"]} value={item.label} onChange={(label) => set({ ...item, label })} />
                      <TextField label="Valor" path={`memory.results.${index}.value`} linkedPaths={["memory.results"]} value={item.value} onChange={(next) => set({ ...item, value: next })} />
                    </div>
                    <TextField multiline label="Contexto" path={`memory.results.${index}.context`} linkedPaths={["memory.results"]} value={item.context} onChange={(context) => set({ ...item, context })} />
                    <TextField label="Enlace de evidencia" path={`memory.results.${index}.evidenceUrl`} linkedPaths={["memory.results"]} hint="Opcional." value={item.evidenceUrl} onChange={(evidenceUrl) => set({ ...item, evidenceUrl })} />
                  </>
                )}
              />

              <RowList<EventMemoryOutputDraft>
                groupRows
                path="memory.outputs"
                legend="Proyectos y productos"
                noun="proyecto"
                items={memory.outputs}
                max={EVENT_PAGE_LIMITS.entries}
                create={() => ({ title: "", description: "", url: "" })}
                onChange={(outputs) => update({ memory: { ...memory, outputs } })}
                renderRow={(item, index, set) => (
                  <>
                    <TextField label="Título" path={`memory.outputs.${index}.title`} linkedPaths={["memory.outputs"]} value={item.title} onChange={(title) => set({ ...item, title })} />
                    <TextField multiline label="Descripción" path={`memory.outputs.${index}.description`} linkedPaths={["memory.outputs"]} value={item.description} onChange={(description) => set({ ...item, description })} />
                    <TextField label="Enlace" path={`memory.outputs.${index}.url`} linkedPaths={["memory.outputs"]} hint="Opcional." value={item.url} onChange={(url) => set({ ...item, url })} />
                  </>
                )}
              />

              <div className="grid gap-3 border-t border-line pt-4">
                {confirmingRemoval ? (
                  <div role="group" aria-label="Confirmar que se quita la memoria" className="grid gap-3 rounded-lg border border-danger/25 bg-danger-soft p-3">
                    <p className="text-sm text-ink">
                      ¿Quitar la memoria? Se elimina al guardar, con sus resultados y fotos
                      {savedMemoryPublished ? " y deja de ser pública" : ""}.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="danger"
                        className={TOUCH}
                        onClick={() => {
                          setConfirmingRemoval(false);
                          focusKey.current = "add-memory";
                          // null borra la memoria guardada de forma expresa; una memoria nunca guardada simplemente se quita.
                          update({ memory: savedPage?.memory ? null : undefined });
                        }}
                      >
                        <FiTrash2 aria-hidden="true" />
                        Sí, quitar la memoria
                      </Button>
                      <Button type="button" variant="secondary" className={TOUCH} data-focus-key="cancel-removal" onClick={() => setConfirmingRemoval(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="danger"
                      className={TOUCH}
                      onClick={() => {
                        focusKey.current = "cancel-removal";
                        setConfirmingRemoval(true);
                      }}
                    >
                      <FiTrash2 aria-hidden="true" />
                      Quitar memoria
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </Group>

        <Group legend="Fotos">
          {memory ? (
            <RowList<EventMemoryImageDraft>
              bare
              groupRows
              path="memory.gallery"
              legend="Fotos"
              noun="foto"
              items={memory.gallery}
              max={EVENT_PAGE_LIMITS.galleryItems}
              create={() => ({ url: "", alt: "", caption: "", rightsConfirmed: false })}
              onChange={(gallery) => update({ memory: { ...memory, gallery } })}
              hint="Imágenes ya alojadas en un host de C3 (https). Desde aquí no se suben archivos. Cada foto necesita texto alternativo y la confirmación de derechos."
              renderRow={(item, index, set) => (
                <>
                  <TextField label="Dirección de la imagen" path={`memory.gallery.${index}.url`} linkedPaths={["memory.gallery"]} value={item.url} onChange={(url) => set({ ...item, url })} />
                  <TextField label="Texto alternativo" path={`memory.gallery.${index}.alt`} linkedPaths={["memory.gallery"]} hint="Describe lo que se ve en la imagen." value={item.alt} onChange={(alt) => set({ ...item, alt })} />
                  <TextField label="Pie de foto" path={`memory.gallery.${index}.caption`} linkedPaths={["memory.gallery"]} hint="Opcional." value={item.caption} onChange={(caption) => set({ ...item, caption })} />
                  <CheckField
                    title="Confirmo que tengo los derechos para publicar esta imagen"
                    path={`memory.gallery.${index}.rightsConfirmed`}
                    checked={item.rightsConfirmed}
                    onChange={(rightsConfirmed) => set({ ...item, rightsConfirmed })}
                  />
                </>
              )}
            />
          ) : (
            <p className="text-sm text-muted">Las fotos forman parte de la memoria: añade primero la memoria.</p>
          )}
        </Group>

        {!savedPage ? (
          <div>
            <Button type="button" variant="ghost" className={TOUCH} onClick={() => onChange(undefined)}>
              <FiTrash2 aria-hidden="true" />
              Quitar ficha sin guardar
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ErrorsContext.Provider value={ctx}>
      <section ref={containerRef} aria-labelledby={`${prefix}-title`} className="grid gap-4">
        <h2 id={`${prefix}-title`} className="text-sm font-semibold text-ink">
          Ficha pública
        </h2>
        <ErrorText path="page" />
        {body}
        {otherErrors}
      </section>
    </ErrorsContext.Provider>
  );
}
