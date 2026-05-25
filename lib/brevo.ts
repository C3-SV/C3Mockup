type BrevoEmailAddress = {
  email: string;
  name?: string;
};

type SendBrevoTransactionalEmailInput = {
  to: BrevoEmailAddress[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: BrevoEmailAddress;
  tags?: string[];
};

type BrevoSendResponse = {
  messageId?: string;
  message?: string;
  code?: string;
};

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function resolveSender() {
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  if (!senderEmail) {
    throw new Error(
      "BREVO_SENDER_EMAIL is not configured. Configure a verified sender/domain in Brevo before sending contact emails.",
    );
  }

  return {
    email: senderEmail,
    name: process.env.BREVO_SENDER_NAME?.trim() || "C3 / Competitive Coding Club",
  };
}

function resolveDefaultReplyTo() {
  const replyToEmail = process.env.BREVO_REPLY_TO_EMAIL?.trim();
  if (!replyToEmail) {
    return undefined;
  }

  return {
    email: replyToEmail,
    name: process.env.BREVO_REPLY_TO_NAME?.trim() || undefined,
  };
}

export async function sendBrevoTransactionalEmail(input: SendBrevoTransactionalEmailInput) {
  const apiKey = readRequiredEnv("BREVO_API_KEY");
  const sender = resolveSender();
  const replyTo = input.replyTo ?? resolveDefaultReplyTo();

  if (input.htmlContent && input.textContent) {
    throw new Error("Provide either htmlContent or textContent, not both.");
  }

  const payload: Record<string, unknown> = {
    sender,
    to: input.to,
    subject: input.subject,
  };

  if (input.htmlContent) {
    payload.htmlContent = input.htmlContent;
  }

  if (input.textContent) {
    payload.textContent = input.textContent;
  }

  if (replyTo) {
    payload.replyTo = replyTo;
  }

  if (input.tags?.length) {
    payload.tags = input.tags;
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const responseData = (await response.json().catch(() => null)) as BrevoSendResponse | null;

  if (!response.ok) {
    const errorMessage =
      typeof responseData?.message === "string"
        ? responseData.message
        : `Brevo responded with ${response.status}`;

    throw new Error(errorMessage);
  }

  return {
    messageId: responseData?.messageId || "",
  };
}
