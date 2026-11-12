export const consultationOptions = [
  "Participar en C3",
  "Alianza educativa",
  "Empresa / sponsor / organización",
  "Consulta sobre eventos",
  "Consulta general",
] as const;

export const CONTACT_FORM_RECIPIENT_EMAIL = "competitivecodingclub.sv@gmail.com";
export const CONTACT_FORM_SOURCE = "c3.com.sv/contacto";

export type ConsultationOption = (typeof consultationOptions)[number];

export type ContactFormValues = {
  fullName: string;
  email: string;
  organization: string;
  consultationType: ConsultationOption | "";
  message: string;
  honeypot: string;
};

export type ContactFieldErrors = Partial<
  Record<"fullName" | "email" | "organization" | "consultationType" | "message", string>
> & {
  form?: string;
};

export type CleanContactSubmission = {
  fullName: string;
  email: string;
  organization: string;
  consultationType: ConsultationOption;
  message: string;
  honeypot: string;
};

export const CONTACT_FORM_SUCCESS_MESSAGE =
  "Mensaje enviado correctamente. Gracias por contactar a C3.";

export const CONTACT_FORM_GENERIC_ERROR_MESSAGE =
  "No pudimos enviar el mensaje. Intentá de nuevo o escribinos por correo.";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeContactSubmission(
  input: Partial<Record<keyof ContactFormValues, unknown>>,
): ContactFormValues {
  return {
    fullName: normalizeValue(input.fullName),
    email: normalizeValue(input.email),
    organization: normalizeValue(input.organization),
    consultationType: normalizeValue(input.consultationType) as ContactFormValues["consultationType"],
    message: normalizeValue(input.message),
    honeypot: normalizeValue(input.honeypot),
  };
}

export function validateContactSubmission(
  submission: ContactFormValues,
): { ok: true; data: CleanContactSubmission } | { ok: false; errors: ContactFieldErrors } {
  if (submission.honeypot) {
    return {
      ok: false,
      errors: {
        form: CONTACT_FORM_GENERIC_ERROR_MESSAGE,
      },
    };
  }

  const errors: ContactFieldErrors = {};

  if (!submission.fullName) {
    errors.fullName = "El nombre completo es obligatorio.";
  }

  if (!submission.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!emailPattern.test(submission.email)) {
    errors.email = "Ingresá un correo electrónico válido.";
  }

  if (!submission.consultationType) {
    errors.consultationType = "Elegí un tipo de consulta.";
  } else if (!consultationOptions.includes(submission.consultationType)) {
    errors.consultationType = "Elegí un tipo de consulta válido.";
  }

  if (!submission.message) {
    errors.message = "El mensaje es obligatorio.";
  } else if (submission.message.length < 20) {
    errors.message = "El mensaje debe tener al menos 20 caracteres.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName: submission.fullName,
      email: submission.email,
      organization: submission.organization,
      consultationType: submission.consultationType as ConsultationOption,
      message: submission.message,
      honeypot: submission.honeypot,
    },
  };
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactEmailText(data: Omit<CleanContactSubmission, "honeypot">): string {
  const lines = [
    "Nuevo mensaje desde c3.com.sv/contacto",
    "",
    `Nombre completo: ${data.fullName}`,
    `Correo electrónico: ${data.email}`,
    data.organization ? `Institución / organización: ${data.organization}` : null,
    `Tipo de consulta: ${data.consultationType}`,
    "",
    "Mensaje:",
    data.message,
    "",
    "Source: c3.com.sv/contacto",
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildContactEmailHtml(data: Omit<CleanContactSubmission, "honeypot">): string {
  const organizationRow = data.organization
    ? `
        <tr>
          <td style="padding:10px 0 10px 0;font-size:13px;font-weight:700;color:#6b7280;width:190px;vertical-align:top;">Institución / organización</td>
          <td style="padding:10px 0;font-size:14px;line-height:1.7;color:#0f203e;">${escapeHtml(data.organization)}</td>
        </tr>
      `
    : "";

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f203e;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
      <div style="background:#0f203e;border-radius:24px 24px 0 0;padding:24px 28px;color:#ffffff;">
        <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#a7c0ff;">C3 / Competitive Coding Club</p>
        <h1 style="margin:0;font-size:26px;line-height:1.2;">Nuevo mensaje desde c3.com.sv</h1>
      </div>
      <div style="background:#ffffff;border:1px solid #d5deea;border-top:none;border-radius:0 0 24px 24px;padding:28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0 10px 0;font-size:13px;font-weight:700;color:#6b7280;width:190px;vertical-align:top;">Nombre completo</td>
            <td style="padding:10px 0;font-size:14px;line-height:1.7;color:#0f203e;">${escapeHtml(data.fullName)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 10px 0;font-size:13px;font-weight:700;color:#6b7280;width:190px;vertical-align:top;">Correo electrónico</td>
            <td style="padding:10px 0;font-size:14px;line-height:1.7;color:#0f203e;">${escapeHtml(data.email)}</td>
          </tr>
          ${organizationRow}
          <tr>
            <td style="padding:10px 0 10px 0;font-size:13px;font-weight:700;color:#6b7280;width:190px;vertical-align:top;">Tipo de consulta</td>
            <td style="padding:10px 0;font-size:14px;line-height:1.7;color:#0f203e;">${escapeHtml(data.consultationType)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:18px;font-size:13px;font-weight:700;color:#6b7280;">Mensaje</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:8px;font-size:14px;line-height:1.8;color:#0f203e;white-space:pre-wrap;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #d5deea;font-size:12px;line-height:1.7;color:#64748b;">
          <strong style="color:#0f203e;">Source:</strong> c3.com.sv/contacto
        </div>
      </div>
    </div>
  </body>
</html>`;
}
