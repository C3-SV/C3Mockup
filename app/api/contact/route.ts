import { NextResponse } from "next/server";
import {
  buildContactEmailHtml,
  CONTACT_FORM_GENERIC_ERROR_MESSAGE,
  CONTACT_FORM_RECIPIENT_EMAIL,
  CONTACT_FORM_SUCCESS_MESSAGE,
  normalizeContactSubmission,
  validateContactSubmission,
} from "@/lib/contact-form";
import { sendBrevoTransactionalEmail } from "@/lib/brevo";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      {
        ok: false,
        message: CONTACT_FORM_GENERIC_ERROR_MESSAGE,
      },
      { status: 400 },
    );
  }

  const normalizedSubmission = normalizeContactSubmission(
    body as Parameters<typeof normalizeContactSubmission>[0],
  );
  const validation = validateContactSubmission(normalizedSubmission);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: validation.errors.form ?? CONTACT_FORM_GENERIC_ERROR_MESSAGE,
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    await sendBrevoTransactionalEmail({
      to: [
        {
          email: CONTACT_FORM_RECIPIENT_EMAIL,
          name: "C3 / Competitive Coding Club",
        },
      ],
      subject: `Nuevo mensaje desde c3.com.sv — ${validation.data.consultationType}`,
      htmlContent: buildContactEmailHtml(validation.data),
      replyTo: {
        email: validation.data.email,
        name: validation.data.fullName,
      },
    });

    return NextResponse.json({
      ok: true,
      message: CONTACT_FORM_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: CONTACT_FORM_GENERIC_ERROR_MESSAGE,
      },
      { status: 502 },
    );
  }
}
