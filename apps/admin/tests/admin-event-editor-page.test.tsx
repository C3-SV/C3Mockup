// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { AdminEventRecord } from "@c3/config";
import { AdminEventEditorPage } from "@/components/admin-event-editor-page";
import { AdminApiError } from "@/lib/admin-api";
import { buildEventPayload, normalizeDraft } from "@/lib/event-draft";
import { routerMock } from "./stubs/next-navigation";
import { makeAdminEvent } from "./fixtures/event-page-fixtures";

/**
 * Cableado real del guardado (T3, ronda de correcciones): la pantalla del editor con el proveedor simulado. Comprueba
 * qué recibe createEvent/updateEvent, que un rechazo llega al formulario y que tras guardar no se pierde el foco ni el
 * estado del formulario (sin remontarlo).
 */

const data = vi.hoisted(() => ({
  events: [] as unknown[],
  getEventById: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
  setFeedback: vi.fn(),
}));

vi.mock("@/components/admin-provider", () => ({ useAdminData: () => data }));

const save = () => fireEvent.click(screen.getByRole("button", { name: /guardar cambios|crear evento/i }));
const titleInput = () => screen.getByPlaceholderText("Nombre del evento");

function renderEdit(event: AdminEventRecord) {
  data.events = [event];
  render(<AdminEventEditorPage mode="edit" eventId={event.id} />);
}

beforeEach(() => {
  vi.clearAllMocks();
  data.events = [];
});

describe("AdminEventEditorPage: el guardado envía buildEventPayload(draft)", () => {
  it("update: título nuevo y memoria quitada llegan como payload exacto, con memory: null", async () => {
    const event = makeAdminEvent();
    data.updateEvent.mockResolvedValue({ ...event, title: "Título nuevo", page: { ...event.page!, memory: undefined }, updatedAt: "2026-11-13T18:00:00.000Z" });
    renderEdit(event);

    fireEvent.change(titleInput(), { target: { value: "Título nuevo" } });
    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, quitar la memoria" }));
    save();

    await waitFor(() => expect(data.updateEvent).toHaveBeenCalledTimes(1));
    const base = normalizeDraft(event);
    const expected = buildEventPayload({ ...base, title: "Título nuevo", page: { ...base.page!, memory: null } });

    expect(data.updateEvent).toHaveBeenCalledWith("evento-prueba", expected);
    const payload = data.updateEvent.mock.calls[0][1] as { page: Record<string, unknown> };
    expect(payload.page.memory).toBeNull();
    expect(payload.page).toEqual({ ...event.page, memory: null });
  });

  it("update sin tocar la ficha: se envía completa e idéntica a la guardada", async () => {
    const event = makeAdminEvent();
    data.updateEvent.mockResolvedValue(event);
    renderEdit(event);

    save();

    await waitFor(() => expect(data.updateEvent).toHaveBeenCalledTimes(1));
    expect(data.updateEvent).toHaveBeenCalledWith("evento-prueba", buildEventPayload(normalizeDraft(event)));
    expect((data.updateEvent.mock.calls[0][1] as { page: unknown }).page).toEqual(event.page);
  });

  it("update de un evento sin ficha no envía page", async () => {
    const event = makeAdminEvent({ page: undefined });
    data.updateEvent.mockResolvedValue(event);
    renderEdit(event);

    save();

    await waitFor(() => expect(data.updateEvent).toHaveBeenCalledTimes(1));
    expect("page" in (data.updateEvent.mock.calls[0][1] as object)).toBe(false);
  });

  it("create: envía el payload con la ficha elegida y navega a la edición", async () => {
    const created = makeAdminEvent({ id: "mi-evento", title: "Mi evento", page: undefined });
    data.createEvent.mockResolvedValue(created);
    render(<AdminEventEditorPage mode="create" />);

    fireEvent.change(titleInput(), { target: { value: "Mi evento" } });
    fireEvent.change(screen.getByPlaceholderText("Describe el evento"), { target: { value: "Descripción." } });
    fireEvent.change(screen.getByPlaceholderText("Ej. Ver hackathon"), { target: { value: "Ver evento" } });
    fireEvent.change(screen.getByPlaceholderText("https://…"), { target: { value: "https://c3.com.sv" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Slug de la ficha" }), { target: { value: "mi-evento-2026" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" }), { target: { value: "Texto." } });
    save();

    await waitFor(() => expect(data.createEvent).toHaveBeenCalledTimes(1));
    const payload = data.createEvent.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).toMatchObject({ id: "mi-evento", title: "Mi evento", cta: "Ver evento", href: "https://c3.com.sv" });
    expect(payload.page).toEqual({ slug: "mi-evento-2026", publication: "draft", overview: ["Texto."], resources: [] });
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/admin/events/mi-evento"));
  });
});

describe("AdminEventEditorPage: un rechazo del servidor llega al formulario", () => {
  it("400 con errores por campo: resumen, error junto al control y aviso global", async () => {
    const event = makeAdminEvent();
    data.updateEvent.mockRejectedValue(new AdminApiError("Invalid event page", 400, { "memory.results.1.context": "Máximo 1000 caracteres." }));
    renderEdit(event);

    save();

    const row = screen.getByRole("group", { name: "Resultado 2" });
    expect(await within(row).findByText("Máximo 1000 caracteres.")).toBeInTheDocument();
    expect(screen.getByRole("alert", { name: /no se guardó/i })).toHaveTextContent(/revisa los campos marcados/i);
    expect(data.setFeedback).toHaveBeenCalledWith({ kind: "error", text: "Invalid event page" });
    // Lo escrito se conserva: la ficha sigue ahí.
    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toHaveValue("hackathon-prueba-2025");
  });

  it("409 de slug: el mensaje del servidor se ve en el formulario y junto al slug", async () => {
    const message = "El slug «mi-slug» ya está reservado por otro evento.";
    data.updateEvent.mockRejectedValue(new AdminApiError(message, 409, { slug: message }));
    renderEdit(makeAdminEvent({ page: undefined }));

    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Slug de la ficha" }), { target: { value: "mi-slug" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" }), { target: { value: "Texto." } });
    save();

    const alert = await screen.findByRole("alert", { name: /no se guardó/i });
    expect(within(alert).getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toHaveAttribute("aria-invalid", "true");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});

describe("AdminEventEditorPage: tras guardar no se pierde el foco ni el estado", () => {
  it("no remonta el formulario, relee el registro guardado y enfoca el estado de éxito", async () => {
    const event = makeAdminEvent({ page: undefined });
    const savedPage = {
      slug: "mi-slug",
      publication: "draft" as const,
      overview: ["Texto."],
      resources: [],
    };
    data.updateEvent.mockResolvedValue({ ...event, page: savedPage, updatedAt: "2026-11-13T18:00:00.000Z" });
    renderEdit(event);

    const title = titleInput();
    fireEvent.click(screen.getByRole("button", { name: "Crear ficha" }));
    const slug = screen.getByRole("textbox", { name: "Slug de la ficha" });
    fireEvent.change(slug, { target: { value: "mi-slug" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Párrafo 1 de la presentación" }), { target: { value: "Texto." } });
    save();

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/cambios guardados/i);
    await waitFor(() => expect(status).toHaveFocus());

    // Mismo DOM: el formulario no se remontó.
    expect(titleInput()).toBe(title);
    expect(screen.getByRole("textbox", { name: "Slug de la ficha" })).toBe(slug);
    // El borrador se relee del registro guardado: el slug ya es inmutable.
    expect(slug).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: /quitar ficha sin guardar/i })).toBeNull();
  });

  it("una memoria quitada y guardada deja la pantalla sin memoria y con el botón de añadirla", async () => {
    const event = makeAdminEvent();
    data.updateEvent.mockResolvedValue({ ...event, page: { ...event.page!, memory: undefined }, updatedAt: "2026-11-13T18:00:00.000Z" });
    renderEdit(event);

    fireEvent.click(screen.getByRole("button", { name: "Quitar memoria" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, quitar la memoria" }));
    save();

    await screen.findByRole("status");
    expect(screen.getByRole("button", { name: "Añadir memoria" })).toBeInTheDocument();

    // Un segundo guardado ya no pide borrar nada: la memoria ya no existe en el registro.
    save();
    await waitFor(() => expect(data.updateEvent).toHaveBeenCalledTimes(2));
    const second = data.updateEvent.mock.calls[1][1] as { page: Record<string, unknown> };
    expect("memory" in second.page).toBe(false);
  });

  it("el estado de éxito se retira al volver a editar", async () => {
    const event = makeAdminEvent();
    data.updateEvent.mockResolvedValue({ ...event, updatedAt: "2026-11-13T18:00:00.000Z" });
    renderEdit(event);

    save();
    await screen.findByRole("status");

    fireEvent.change(titleInput(), { target: { value: "Otro título" } });

    expect(screen.queryByRole("status")).toBeNull();
  });
});
