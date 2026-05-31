"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  CONTACT_FORM_GENERIC_ERROR_MESSAGE,
  CONTACT_FORM_SUCCESS_MESSAGE,
  consultationOptions,
  type ContactFieldErrors,
  type ContactFormValues,
} from "@/lib/contact-form";

const initialValues: ContactFormValues = {
  fullName: "",
  email: "",
  organization: "",
  consultationType: "",
  message: "",
  honeypot: "",
};

const consultationLabels: Record<(typeof consultationOptions)[number], string> = {
  "Participar en C3": "Participar en C3",
  "Alianza educativa": "Alianza educativa",
  "Empresa / sponsor / organización": "Empresa / sponsor / organización",
  "Consulta sobre eventos": "Consulta sobre eventos",
  "Consulta general": "Consulta general",
};

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const isLoading = status === "loading";

  const hasMessage = useMemo(() => statusMessage.trim().length > 0, [statusMessage]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name as keyof ContactFieldErrors]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[name as keyof ContactFieldErrors];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; errors?: ContactFieldErrors }
        | null;

      if (!response.ok || !data?.ok) {
        setStatus("error");
        setStatusMessage(data?.message ?? CONTACT_FORM_GENERIC_ERROR_MESSAGE);
        setFieldErrors(data?.errors ?? {});
        return;
      }

      setStatus("success");
      setStatusMessage(data.message ?? CONTACT_FORM_SUCCESS_MESSAGE);
      setValues(initialValues);
    } catch (error) {
      console.error("Unexpected contact form error:", error);
      setStatus("error");
      setStatusMessage(CONTACT_FORM_GENERIC_ERROR_MESSAGE);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#d5deea] bg-white p-6 shadow-[0_18px_48px_rgba(15,32,62,0.10)] md:p-8"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
          Formulario institucional
        </p>
        <p className="text-sm leading-7 text-[#364765]">
          Contanos quién sos, qué buscás y cómo podemos ayudarte. 
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nombre completo" error={fieldErrors.fullName}>
            <input
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="form-input"
              aria-invalid={Boolean(fieldErrors.fullName)}
            />
          </Field>

          <Field label="Correo electrónico" error={fieldErrors.email}>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="form-input"
              aria-invalid={Boolean(fieldErrors.email)}
            />
          </Field>
        </div>

        <Field label="Institución / organización" optional error={fieldErrors.organization}>
          <input
            name="organization"
            value={values.organization}
            onChange={handleChange}
            autoComplete="organization"
            className="form-input"
            aria-invalid={Boolean(fieldErrors.organization)}
          />
        </Field>

        <Field label="Tipo de consulta" error={fieldErrors.consultationType}>
          <select
            name="consultationType"
            value={values.consultationType}
            onChange={handleChange}
            required
            className="form-input"
            aria-invalid={Boolean(fieldErrors.consultationType)}
          >
            <option value="">Elegí una opción</option>
            {consultationOptions.map((option) => (
              <option key={option} value={option}>
                {consultationLabels[option]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Mensaje" error={fieldErrors.message}>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            required
            minLength={20}
            rows={7}
            className="form-input resize-y"
            aria-invalid={Boolean(fieldErrors.message)}
          />
        </Field>

        <div className="sr-only">
          <label htmlFor="contact-company">Empresa</label>
          <input
            id="contact-company"
            name="honeypot"
            value={values.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-[#33BEAC] px-6 py-3 text-sm font-semibold text-[#0F203E] transition hover:bg-[#46b8a8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Enviando..." : "Enviar mensaje"}
        </button>

        <div
          aria-live="polite"
          className={`min-h-6 text-sm font-medium ${
            status === "success"
              ? "text-[#16846f]"
              : status === "error"
                ? "text-[#b42318]"
                : "text-[#5c6a82]"
          }`}
        >
          {hasMessage ? statusMessage : ""}
        </div>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          border-radius: 1.1rem;
          border: 1px solid #cfd9e5;
          background: #ffffff;
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #0f203e;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease,
            background-color 150ms ease;
        }

        .form-input::placeholder {
          color: #8190a7;
        }

        .form-input:focus {
          border-color: #205298;
          box-shadow: 0 0 0 4px rgba(32, 82, 152, 0.12);
        }

        .form-input[aria-invalid="true"] {
          border-color: #b42318;
        }
      `}</style>
    </form>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
  optional?: boolean;
};

function Field({ label, children, error, optional }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F203E]">
        {label}
        {optional ? <span className="ml-1 text-[#5c6a82]">(opcional)</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm font-medium text-[#b42318]">{error}</span> : null}
    </label>
  );
}
