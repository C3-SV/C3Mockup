// @vitest-environment jsdom
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AdminEventRecord } from "@c3/config";
import type { EventPageDraft } from "@/lib/admin-types";
import { EventPageFields } from "@/components/admin-event-page-fields";
import { createEmptyPageDraft, normalizePageDraft } from "@/lib/event-draft";
import { makeAdminEvent } from "./fixtures/event-page-fixtures";

type HarnessProps = {
  initial: EventPageDraft | undefined;
  event?: AdminEventRecord | null;
  errors?: Record<string, string>;
  schedule?: { status: AdminEventRecord["status"]; eventDate: string; eventDateEnd: string };
  onChangeSpy?: (value: EventPageDraft | undefined) => void;
};

/** El componente es controlado y sin persistencia propia: el arnés guarda el valor como lo haría el formulario. */
function Harness({ initial, event = null, errors, schedule, onChangeSpy }: HarnessProps) {
  const [value, setValue] = useState(initial);
  return (
    <EventPageFields
      value={value}
      event={event}
      errors={errors}
      schedule={schedule}
      onChange={(next) => {
        onChangeSpy?.(next);
        setValue(next);
      }}
    />
  );
}

function savedHarness(overrides: Partial<HarnessProps> = {}) {
  const event = makeAdminEvent();
  const spy = vi.fn();
  render(<Harness initial={normalizePageDraft(event.page)} event={event} onChangeSpy={spy} {...overrides} />);
  return { event, spy };
}

const lastValue = (spy: ReturnType<typeof vi.fn>) => spy.mock.calls.at(-1)?.[0] as EventPageDraft | undefined;

describe("EventPageFields: estructura y ficha existente", () => {
  it("sin ficha ofrece crearla y la crea vacía y en borrador", () => {
    const spy = vi.fn();
    render(<Harness initial={undefined} onChangeSpy={spy} />);

    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));

    expect(lastValue(spy)).toEqual(createEmptyPageDraft());
    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toBeEnabled();
  });

  it("muestra los cinco grupos con los controles de packages/ui", () => {
    savedHarness();

    for (const name of ["Ficha", "Participación", "Recursos", "Memoria y resultados", "Fotos"]) {
      expect(screen.getByRole("group", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" })).toHaveValue("Primer párrafo de prueba.");
    expect(screen.getByRole("combobox", { name: "Modalidad" })).toHaveValue("presencial");
  });

  it("el slug de una ficha guardada no es editable y explica por qué", () => {
    savedHarness();

    const slug = screen.getByRole("textbox", { name: "Slug de la ficha" });
    expect(slug).toHaveValue("hackathon-prueba-2025");
    expect(slug).toHaveAttribute("readonly");
    expect(screen.getByText(/no se puede cambiar/i)).toBeInTheDocument();
  });

  it("advierte que los cambios de una ficha publicada se hacen públicos al guardar", () => {
    savedHarness();

    const publish = screen.getByRole("switch", { name: /publicar ficha/i });
    expect(publish).toBeChecked();
    expect(publish).toHaveAccessibleName(/públicos al guardar/i);
  });

  it("la publicación es un interruptor explícito que no cambia nada más", () => {
    const { spy } = savedHarness();

    fireEvent.click(screen.getByRole("switch", { name: /publicar ficha/i }));

    const next = lastValue(spy)!;
    expect(next.publication).toBe("draft");
    expect(next.slug).toBe("hackathon-prueba-2025");
    expect(next.memory?.publication).toBe("published");
  });
});

describe("EventPageFields: añadir y quitar filas", () => {
  it("añadir un recurso produce el valor exacto y mueve el foco a la fila nueva", () => {
    const { event, spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Añadir recurso a Recursos" }));

    const next = lastValue(spy)!;
    expect(next.resources).toEqual([...event.page!.resources, { title: "", url: "" }]);
    const row = screen.getByRole("group", { name: "Recurso 3" });
    expect(within(row).getByRole("textbox", { name: "Título" })).toHaveFocus();
  });

  it("quitar una fila saca solo esa fila y devuelve el foco al botón de añadir", () => {
    const { spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Quitar recurso 1 de Recursos" }));

    expect(lastValue(spy)!.resources).toEqual([{ title: "Bases locales", url: "/bases" }]);
    expect(screen.getAllByRole("group", { name: /^Recurso \d$/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Añadir recurso a Recursos" })).toHaveFocus();
  });

  it("los botones de las filas son ≥ 44 px (clase min-h-11) y alcanzables con el teclado", () => {
    savedHarness();

    const remove = screen.getByRole("button", { name: "Quitar recurso 1 de Recursos" });
    expect(remove).toHaveClass("min-h-11");
    expect(remove).not.toHaveAttribute("tabindex", "-1");
    expect(remove).toHaveAttribute("type", "button");
  });

  it("añadir párrafo a la presentación, requisito y resultado", () => {
    const { event, spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Añadir párrafo a Presentación" }));
    expect(lastValue(spy)!.overview).toEqual([...event.page!.overview, ""]);

    fireEvent.click(screen.getByRole("button", { name: "Añadir requisito a Requisitos" }));
    expect(lastValue(spy)!.requirements).toEqual([...event.page!.requirements!, ""]);

    fireEvent.click(screen.getByRole("button", { name: "Añadir resultado a Resultados" }));
    expect(lastValue(spy)!.memory!.results.at(-1)).toEqual({ label: "", value: "", context: "", evidenceUrl: "" });
  });

  it("escribir en una fila cambia solo ese campo", () => {
    const { event, spy } = savedHarness();
    const row = screen.getByRole("group", { name: "Recurso 2" });

    fireEvent.change(within(row).getByRole("textbox", { name: "Título" }), { target: { value: "Bases nuevas" } });

    expect(lastValue(spy)!.resources).toEqual([event.page!.resources[0], { title: "Bases nuevas", url: "/bases" }]);
  });

  it("deshabilita añadir al llegar al máximo de la spec, sin depender de maxLength", () => {
    const page = createEmptyPageDraft();
    page.resources = Array.from({ length: 20 }, (_, index) => ({ title: `R${index}`, url: "/x" }));
    render(<Harness initial={page} />);

    expect(screen.getByRole("button", { name: "Añadir recurso a Recursos" })).toBeDisabled();
    for (const textbox of screen.getAllByRole("textbox")) {
      expect(textbox).not.toHaveAttribute("maxlength");
    }
  });
});

describe("EventPageFields: errores del servidor o del validador", () => {
  it("muestra errors.overview y lo asocia al control con aria-describedby", () => {
    const page = createEmptyPageDraft();
    page.slug = "mi-edicion";
    render(<Harness initial={page} errors={{ overview: "Para publicar la ficha escribe al menos un párrafo de resumen." }} />);

    const message = screen.getByText("Para publicar la ficha escribe al menos un párrafo de resumen.");
    const control = screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" });

    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control.getAttribute("aria-describedby")).toContain(message.id);
    expect(message.id).not.toBe("");
  });

  it("asocia el error de un campo de fila (memory.results.0.value) a su control", () => {
    savedHarness({ errors: { "memory.results.0.value": "Máximo 80 caracteres." } });

    const row = screen.getByRole("group", { name: "Resultado 1" });
    const control = within(row).getByRole("textbox", { name: "Valor" });
    const message = within(row).getByText("Máximo 80 caracteres.");

    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control.getAttribute("aria-describedby")).toContain(message.id);
    // Las otras filas no heredan el error.
    expect(within(screen.getByRole("group", { name: "Resultado 2" })).queryByText("Máximo 80 caracteres.")).toBeNull();
  });

  it("muestra el conflicto de slug (409) junto al campo", () => {
    const page = createEmptyPageDraft();
    page.slug = "ocupado";
    render(<Harness initial={page} errors={{ slug: "El slug «ocupado» ya está reservado por otro evento." }} />);

    const slug = screen.getByRole("textbox", { name: "Slug de la ficha" });
    const message = screen.getByText("El slug «ocupado» ya está reservado por otro evento.");

    expect(slug).toHaveAttribute("aria-invalid", "true");
    expect(slug.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("muestra errores de grupo (límite de elementos) y de la publicación de la memoria", () => {
    savedHarness({ errors: { resources: "Máximo 20 elementos.", "memory.publication": "La memoria solo se publica cuando la edición terminó." } });

    expect(screen.getByText("Máximo 20 elementos.")).toBeInTheDocument();
    const publishMemory = screen.getByRole("switch", { name: /publicar memoria/i });
    const message = screen.getByText("La memoria solo se publica cuando la edición terminó.");
    expect(publishMemory.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("un error sin control propio no se pierde: aparece en «Otros errores»", () => {
    savedHarness({ errors: { "memory.nope": "Algo raro del servidor." } });

    expect(screen.getByText("Algo raro del servidor.")).toBeInTheDocument();
  });
});

describe("EventPageFields: memoria, resultados y fotos", () => {
  it("avisa de la causa cuando la edición no terminó (R9) sin inferir el final de la fecha principal", () => {
    savedHarness({ schedule: { status: "Próximamente", eventDate: "2025-05-10", eventDateEnd: "" } });

    expect(screen.getByText(/fecha final confirmada/i)).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /publicar memoria/i })).toHaveAccessibleDescription(/fecha final confirmada/i);
  });

  it("no muestra el aviso cuando la edición está terminada", () => {
    savedHarness({ schedule: { status: "Histórico", eventDate: "2025-05-10", eventDateEnd: "" } });

    expect(screen.queryByText(/fecha final confirmada/i)).toBeNull();
  });

  it("añadir memoria crea una memoria en borrador", () => {
    const page = createEmptyPageDraft();
    page.slug = "mi-edicion";
    const spy = vi.fn();
    render(<Harness initial={page} onChangeSpy={spy} />);

    fireEvent.click(screen.getByRole("button", { name: "Añadir memoria" }));

    expect(lastValue(spy)!.memory).toMatchObject({ publication: "draft", summary: [""], results: [], gallery: [] });
  });

  it("quitar la memoria guardada pide confirmación y deja memory: null (borrado explícito)", () => {
    const { spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    // Todavía no se ha tocado nada.
    expect(lastValue(spy)).toBeUndefined();
    expect(screen.getByText(/se elimina al guardar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sí, quitar la memoria" }));

    expect(lastValue(spy)!.memory).toBeNull();
    expect(screen.getByRole("button", { name: "Añadir memoria" })).toBeInTheDocument();
  });

  it("cancelar la confirmación conserva la memoria", () => {
    const { spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(lastValue(spy)).toBeUndefined();
    expect(screen.getByRole("switch", { name: /publicar memoria/i })).toBeInTheDocument();
  });

  it("quitar una memoria que nunca se guardó la deja como undefined, no como null", () => {
    const page = createEmptyPageDraft();
    page.slug = "mi-edicion";
    const spy = vi.fn();
    render(<Harness initial={page} onChangeSpy={spy} />);

    fireEvent.click(screen.getByRole("button", { name: "Añadir memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, quitar la memoria" }));

    expect(lastValue(spy)!.memory).toBeUndefined();
  });

  it("cada foto exige confirmar los derechos con su casilla; añadir una foto la deja sin confirmar", () => {
    const { spy } = savedHarness();

    fireEvent.click(screen.getByRole("button", { name: "Añadir foto a Fotos" }));

    const gallery = lastValue(spy)!.memory!.gallery;
    expect(gallery).toHaveLength(2);
    expect(gallery[1]).toEqual({ url: "", alt: "", caption: "", rightsConfirmed: false });

    const row = screen.getByRole("group", { name: "Foto 2" });
    const rights = within(row).getByRole("checkbox", { name: /derechos/i });
    expect(rights).not.toBeChecked();

    fireEvent.click(rights);
    expect(lastValue(spy)!.memory!.gallery[1].rightsConfirmed).toBe(true);
  });

  it("la galería no ofrece subida de archivos ni editor de HTML", () => {
    const { container } = render(<Harness initial={normalizePageDraft(makeAdminEvent().page)} event={makeAdminEvent()} />);

    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(container.querySelector("[contenteditable]")).toBeNull();
  });

  it("sin ficha guardada se puede quitar la ficha nueva; con ficha guardada no hay botón para quitarla", () => {
    const spy = vi.fn();
    const { unmount } = render(<Harness initial={createEmptyPageDraft()} onChangeSpy={spy} />);
    fireEvent.click(screen.getByRole("button", { name: "Quitar ficha sin guardar" }));
    expect(lastValue(spy)).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(undefined);
    unmount();

    savedHarness();
    expect(screen.queryByRole("button", { name: /quitar ficha/i })).toBeNull();
  });
});
