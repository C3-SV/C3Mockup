import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";
import { CONTACT_FORM_GENERIC_ERROR_MESSAGE, CONTACT_FORM_SUCCESS_MESSAGE } from "@/lib/contact-form";

/** Formulario de /contacto (Tarea 7.2): etiquetas asociadas, campos del DS, honeypot oculto y mensajes con rol. */

function respuesta(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

function llenarFormulario() {
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana Pérez" } });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@example.com" } });
  fireEvent.change(screen.getByLabelText("Tipo de consulta"), { target: { value: "Consulta general" } });
  fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Quisiera saber cómo participar en C3." } });
}

function enviar() {
  fireEvent.submit(screen.getByRole("button", { name: "Enviar mensaje" }).closest("form") as HTMLFormElement);
}

describe("ContactForm (Tarea 7.2)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta({ ok: true, message: CONTACT_FORM_SUCCESS_MESSAGE })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asocia cada etiqueta a su control", () => {
    render(<ContactForm />);
    const campos: Array<[RegExp | string, string]> = [
      ["Nombre completo", "fullName"],
      ["Correo electrónico", "email"],
      [/Institución \/ organización/, "organization"],
      ["Tipo de consulta", "consultationType"],
      ["Mensaje", "message"],
    ];
    for (const [etiqueta, nombre] of campos) {
      expect(screen.getByLabelText(etiqueta)).toHaveAttribute("name", nombre);
    }
  });

  it("marca como requeridos los campos obligatorios y no la institución", () => {
    render(<ContactForm />);
    for (const nombre of ["fullName", "email", "consultationType", "message"]) {
      expect(document.querySelector(`[name="${nombre}"]`)).toHaveAttribute("aria-required", "true");
    }
    expect(document.querySelector('[name="organization"]')).not.toHaveAttribute("aria-required");
  });

  it("usa los campos del DS (c3-campo) en cada control", () => {
    render(<ContactForm />);
    for (const nombre of ["fullName", "email", "organization", "consultationType", "message"]) {
      expect(document.querySelector(`[name="${nombre}"]`)).toHaveClass("c3-campo");
    }
  });

  it("el botón de envío es el primario del DS", () => {
    render(<ContactForm />);
    const boton = screen.getByRole("button", { name: "Enviar mensaje" });
    expect(boton).toHaveAttribute("type", "submit");
    expect(boton).toHaveClass("c3-btn", "c3-btn--primario");
  });

  it("el honeypot queda oculto, vacío y fuera del orden de tabulación", () => {
    render(<ContactForm />);
    const trampa = document.querySelector('input[name="honeypot"]') as HTMLInputElement;
    expect(trampa).toHaveValue("");
    expect(trampa.closest("[hidden]")).not.toBeNull();
    expect(trampa).toHaveAttribute("tabindex", "-1");
  });

  it("un envío correcto se anuncia en role=status", async () => {
    render(<ContactForm />);
    llenarFormulario();
    enviar();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(CONTACT_FORM_SUCCESS_MESSAGE));
  });

  it("un error del servidor se anuncia en role=alert", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuesta({ ok: false, message: CONTACT_FORM_GENERIC_ERROR_MESSAGE }, false)));
    render(<ContactForm />);
    llenarFormulario();
    enviar();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(CONTACT_FORM_GENERIC_ERROR_MESSAGE));
  });

  it("un error de campo queda asociado al control con aria-describedby", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        respuesta(
          {
            ok: false,
            message: CONTACT_FORM_GENERIC_ERROR_MESSAGE,
            errors: { email: "Ingresa un correo electrónico válido." },
          },
          false,
        ),
      ),
    );
    render(<ContactForm />);
    llenarFormulario();
    enviar();
    const correo = await waitFor(() => {
      const control = document.querySelector('[name="email"]') as HTMLInputElement;
      expect(control).toHaveAttribute("aria-invalid", "true");
      return control;
    });
    const descripcion = correo.getAttribute("aria-describedby");
    expect(descripcion).toBeTruthy();
    expect(document.getElementById(descripcion as string)).toHaveTextContent("Ingresa un correo electrónico válido.");
  });
});
