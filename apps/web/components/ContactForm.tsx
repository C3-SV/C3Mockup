"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/Button";
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

type FieldName = Exclude<keyof ContactFormValues, "honeypot">;

const fieldId = (name: FieldName) => `contacto-${name}`;
const errorId = (name: FieldName) => `contacto-${name}-error`;

/** Atributos de un control: id para su etiqueta, campo del DS y error asociado (aria-describedby). */
function controlProps(name: FieldName, errors: ContactFieldErrors, required: boolean) {
  const error = errors[name];
  return {
    id: fieldId(name),
    name,
    className: error ? "c3-campo c3-campo--error" : "c3-campo",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId(name) : undefined,
    "aria-required": required ? true : undefined,
  } as const;
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const isLoading = status === "loading";
  const hasMessage = statusMessage.trim().length > 0;

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
    <form onSubmit={handleSubmit} className="c3-card c3-form p-6 md:p-8">
      <p className="c3-etiqueta">Formulario institucional</p>
      <p className="c3-form__intro">Cuéntanos quién eres, qué buscas y cómo podemos ayudarte.</p>

      <div className="c3-form-two">
        <Field name="fullName" label="Nombre completo" error={fieldErrors.fullName}>
          <input
            {...controlProps("fullName", fieldErrors, true)}
            value={values.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </Field>

        <Field name="email" label="Correo electrónico" error={fieldErrors.email}>
          <input
            {...controlProps("email", fieldErrors, true)}
            type="email"
            value={values.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </Field>
      </div>

      <Field name="organization" label="Institución / organización" optional error={fieldErrors.organization}>
        <input
          {...controlProps("organization", fieldErrors, false)}
          value={values.organization}
          onChange={handleChange}
          autoComplete="organization"
        />
      </Field>

      <Field name="consultationType" label="Tipo de consulta" error={fieldErrors.consultationType}>
        <select
          {...controlProps("consultationType", fieldErrors, true)}
          value={values.consultationType}
          onChange={handleChange}
          required
        >
          <option value="">Elige una opción</option>
          {consultationOptions.map((option) => (
            <option key={option} value={option}>
              {consultationLabels[option]}
            </option>
          ))}
        </select>
      </Field>

      <Field name="message" label="Mensaje" error={fieldErrors.message}>
        <textarea
          {...controlProps("message", fieldErrors, true)}
          value={values.message}
          onChange={handleChange}
          required
          minLength={20}
          rows={7}
        />
      </Field>

      <div hidden>
        <label htmlFor="contacto-empresa">Empresa</label>
        <input
          id="contacto-empresa"
          name="honeypot"
          value={values.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="c3-form__footer">
        <Button type="submit" variant="primario" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar mensaje"}
        </Button>

        <div role={status === "error" ? "alert" : "status"}>
          {hasMessage ? (
            <p className={status === "error" ? "c3-alerta c3-alerta--error" : "c3-alerta c3-alerta--exito"}>
              {statusMessage}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  name: FieldName;
  label: string;
  children: ReactNode;
  error?: string;
  optional?: boolean;
};

/** Etiqueta visible asociada por htmlFor; el error va fuera de la etiqueta para no formar parte de su nombre. */
function Field({ name, label, children, error, optional }: FieldProps) {
  return (
    <div className="c3-field-group">
      <label htmlFor={fieldId(name)} className="c3-etiqueta-campo">
        {label}
        {optional ? <span className="c3-ayuda"> (opcional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId(name)} className="c3-error-campo">
          {error}
        </p>
      ) : null}
    </div>
  );
}
