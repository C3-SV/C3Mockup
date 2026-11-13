// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { EventDraft } from "@/lib/admin-types";
import { EventForm } from "@/components/admin-event-form";
import { AdminApiError } from "@/lib/admin-api";
import { buildEventPayload } from "@/lib/event-draft";
import { makeAdminEvent } from "./fixtures/event-page-fixtures";

function renderForm(
  overrides: { event?: ReturnType<typeof makeAdminEvent> | null; mode?: "create" | "edit"; onSubmit?: (draft: EventDraft) => Promise<void> } = {},
) {
  const event = overrides.event === undefined ? makeAdminEvent() : overrides.event;
  const onSubmit = overrides.onSubmit ?? vi.fn(async () => undefined);
  render(
    <EventForm
      mode={overrides.mode ?? (event ? "edit" : "create")}
      initialEvent={event}
      onSubmit={onSubmit}
      onCancel={() => undefined}
    />,
  );
  return { event, onSubmit: onSubmit as ReturnType<typeof vi.fn> };
}

const submit = () => fireEvent.click(screen.getByRole("button", { name: /guardar cambios|crear evento/i }));
const lastDraft = (onSubmit: ReturnType<typeof vi.fn>) => onSubmit.mock.calls.at(-1)?.[0] as EventDraft;

describe("EventForm: ficha estructurada", () => {
  it("cargar una ficha publicada con memoria, cambiar solo el título y enviar conserva todo", async () => {
    const { event, onSubmit } = renderForm();

    fireEvent.change(screen.getByPlaceholderText("Nombre del evento"), { target: { value: "Título nuevo" } });
    submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const payload = buildEventPayload(lastDraft(onSubmit));

    expect(payload.title).toBe("Título nuevo");
    // slug, galería, resultados, recursos y memoria llegan idénticos a lo guardado
    expect(payload.page).toEqual(event!.page);
    // campos legados y los que el formulario no edita
    expect(payload.cover).toEqual(event!.cover);
    expect(payload.source).toBe("seed:prueba");
    expect(payload).toMatchObject({ kind: "hackathon", featuredOrder: "3", external: true, status: "Histórico" });
  });

  it("añadir y quitar filas produce el payload exacto", async () => {
    const { event, onSubmit } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Añadir recurso a Recursos" }));
    const added = screen.getByRole("group", { name: "Recurso 3" });
    fireEvent.change(within(added).getByRole("textbox", { name: "Título" }), { target: { value: "Calendario" } });
    fireEvent.change(within(added).getByRole("textbox", { name: "Enlace" }), { target: { value: "https://c3.com.sv/calendario" } });
    fireEvent.click(screen.getByRole("button", { name: "Quitar recurso 1 de Recursos" }));
    submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const page = buildEventPayload(lastDraft(onSubmit)).page as { resources: unknown[] };
    expect(page.resources).toEqual([event!.page!.resources[1], { title: "Calendario", url: "https://c3.com.sv/calendario" }]);
  });

  it("quitar la memoria envía memory: null de forma explícita", async () => {
    const { onSubmit } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, quitar la memoria" }));
    submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const page = buildEventPayload(lastDraft(onSubmit)).page as Record<string, unknown>;
    expect(page.memory).toBeNull();
    expect(page.slug).toBe("hackathon-prueba-2025");
  });

  it("un evento sin ficha no envía page (ni page: null)", async () => {
    const { onSubmit } = renderForm({ event: makeAdminEvent({ page: undefined }) });

    submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect("page" in buildEventPayload(lastDraft(onSubmit))).toBe(false);
  });

  it("crear una ficha desde un evento sin ficha la envía completa con el slug elegido", async () => {
    const { onSubmit } = renderForm({ event: makeAdminEvent({ page: undefined }) });

    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Slug de la ficha" }), { target: { value: "mi-edicion-2026" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" }), { target: { value: "Texto de prueba." } });
    submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(buildEventPayload(lastDraft(onSubmit)).page).toEqual({
      slug: "mi-edicion-2026",
      publication: "draft",
      overview: ["Texto de prueba."],
      resources: [],
    });
  });

  it("el slug de una ficha guardada no se puede editar", () => {
    renderForm();

    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toHaveAttribute("readonly");
  });

  it("advierte que los cambios de una ficha publicada se hacen públicos al guardar", () => {
    renderForm();

    expect(screen.getByRole("switch", { name: /publicar ficha/i })).toHaveAccessibleName(/públicos al guardar/i);
  });
});

describe("EventForm: publicación bloqueada con datos incompletos", () => {
  it("publicar la memoria sin resumen impide enviar y muestra la causa junto al control", async () => {
    const { onSubmit } = renderForm();

    const summary = screen.getByRole("textbox", { name: "Párrafo 1 del resumen de la memoria" });
    fireEvent.change(summary, { target: { value: "" } });
    submit();

    const message = await screen.findByText(/para publicar la memoria escribe al menos un párrafo de resumen/i);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Párrafo 1 del resumen de la memoria" }).getAttribute("aria-describedby")).toContain(message.id);
    expect(screen.getByRole("alert", { name: /revisa/i })).toBeInTheDocument();
  });

  it("R9: sin fecha final confirmada la memoria no se publica y el formulario dice que esa es la causa", async () => {
    const { onSubmit } = renderForm({ event: makeAdminEvent({ status: "Próximamente", eventDate: "2025-05-10", eventDateEnd: undefined }) });

    submit();

    const messages = await screen.findAllByText(/fecha final/i);
    expect(messages.length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("switch", { name: /publicar memoria/i }).getAttribute("aria-describedby")).toBeTruthy();
  });

  it("un enlace http en un recurso se bloquea con el mensaje del validador compartido", async () => {
    const { onSubmit } = renderForm();

    const row = screen.getByRole("group", { name: "Recurso 1" });
    fireEvent.change(within(row).getByRole("textbox", { name: "Enlace" }), { target: { value: "http://c3.com.sv/guia" } });
    submit();

    expect(await within(row).findByText(/https/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("los errores se limpian al corregir el campo", async () => {
    renderForm();

    const row = screen.getByRole("group", { name: "Recurso 1" });
    const link = within(row).getByRole("textbox", { name: "Enlace" });
    fireEvent.change(link, { target: { value: "http://c3.com.sv/guia" } });
    submit();
    await within(row).findByText(/https/i);

    fireEvent.change(link, { target: { value: "https://c3.com.sv/guia" } });

    await waitFor(() => expect(within(row).queryByText(/https/i)).toBeNull());
  });
});

describe("EventForm: errores del servidor", () => {
  it("un 409 por slug llega al usuario en el formulario y junto al campo", async () => {
    const message = "El slug «hackathon-prueba-2025» ya está reservado por otro evento.";
    const onSubmit = vi.fn(async () => {
      throw new AdminApiError(message, 409, { slug: message });
    });
    renderForm({ event: makeAdminEvent({ page: undefined }), onSubmit });

    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Slug de la ficha" }), { target: { value: "hackathon-prueba-2025" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" }), { target: { value: "Texto." } });
    submit();

    const alert = await screen.findByRole("alert", { name: /no se guardó/i });
    expect(within(alert).getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toHaveAttribute("aria-invalid", "true");
  });

  it("un 400 con errores por campo los muestra junto a los controles", async () => {
    const onSubmit = vi.fn(async () => {
      throw new AdminApiError("Invalid event page", 400, { "memory.results.1.context": "Máximo 1000 caracteres." });
    });
    renderForm({ onSubmit });

    submit();

    const row = screen.getByRole("group", { name: "Resultado 2" });
    const message = await within(row).findByText("Máximo 1000 caracteres.");
    expect(within(row).getByRole("textbox", { name: "Contexto" }).getAttribute("aria-describedby")).toContain(message.id);
    expect(screen.getByRole("alert", { name: /no se guardó/i })).toHaveTextContent(/revisa los campos marcados/i);
  });

  it("un error del servidor sin control propio (id repetido) aparece en el resumen", async () => {
    const onSubmit = vi.fn(async () => {
      throw new AdminApiError("Ya existe un evento con el id «x».", 409, { id: "Ya existe un evento con el id «x»." });
    });
    renderForm({ event: null, onSubmit });

    fireEvent.change(screen.getByPlaceholderText("Nombre del evento"), { target: { value: "x" } });
    fireEvent.change(screen.getByPlaceholderText("Describe el evento"), { target: { value: "d" } });
    fireEvent.change(screen.getByRole("textbox", { name: "CTA" }), { target: { value: "c" } });
    fireEvent.change(screen.getByRole("textbox", { name: "URL" }), { target: { value: "https://c3.com.sv" } });
    submit();

    const alert = await screen.findByRole("alert", { name: /no se guardó/i });
    expect(alert).toHaveTextContent("Ya existe un evento con el id «x».");
  });

  it("un fallo de red sin errores por campo muestra su mensaje", async () => {
    const onSubmit = vi.fn(async () => {
      throw new Error("No se pudo leer la respuesta del servidor.");
    });
    renderForm({ onSubmit });

    submit();

    expect(await screen.findByRole("alert", { name: /no se guardó/i })).toHaveTextContent("No se pudo leer la respuesta del servidor.");
  });

  it("los errores del servidor se limpian al editar la ficha", async () => {
    const onSubmit = vi.fn(async () => {
      throw new AdminApiError("Invalid event page", 400, { audience: "Máximo 300 caracteres." });
    });
    renderForm({ onSubmit });

    submit();
    await screen.findByText("Máximo 300 caracteres.");

    fireEvent.change(screen.getByRole("textbox", { name: "Público" }), { target: { value: "Otro" } });

    await waitFor(() => expect(screen.queryByText("Máximo 300 caracteres.")).toBeNull());
  });
});

describe("EventForm: lo que ya existía", () => {
  it("sigue exigiendo título, descripción, CTA y URL antes de enviar", async () => {
    const { onSubmit } = renderForm({ event: null });

    submit();

    expect(await screen.findByText("El título es obligatorio.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
