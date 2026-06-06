import { eventDrivenRevalidationPaths, isEventDrivenRevalidationPath } from "@c3/config";

const WEBHOOK_HEADER = "x-c3-revalidate-secret";

type TriggerRevalidationOptions = {
  reason: string;
  source: string;
  paths?: readonly string[];
};

export type SiteRevalidationResult = {
  ok: boolean;
  skipped: boolean;
  paths: string[];
  message?: string;
  status?: number;
};

function readWebhookUrl() {
  return process.env.REVALIDATION_WEBHOOK_URL?.trim();
}

function readWebhookSecret() {
  return process.env.REVALIDATION_WEBHOOK_SECRET?.trim();
}

function resolvePaths(paths?: readonly string[]) {
  if (!paths?.length) {
    return [...eventDrivenRevalidationPaths];
  }

  return [...new Set(paths.filter(isEventDrivenRevalidationPath))];
}

export async function triggerSiteRevalidation(
  options: TriggerRevalidationOptions,
): Promise<SiteRevalidationResult> {
  const url = readWebhookUrl();
  const secret = readWebhookSecret();
  const paths = resolvePaths(options.paths);

  if (!url || !secret) {
    return {
      ok: true,
      skipped: true,
      paths,
      message: "Revalidation webhook is not configured.",
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [WEBHOOK_HEADER]: secret,
      },
      body: JSON.stringify({
        reason: options.reason,
        source: options.source,
        paths,
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; message?: string }
      | null;

    if (!response.ok || payload?.ok === false) {
      return {
        ok: false,
        skipped: false,
        paths,
        message: payload?.message || `Revalidation webhook failed with ${response.status}.`,
        status: response.status,
      };
    }

    return {
      ok: true,
      skipped: false,
      paths,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      paths,
      message: error instanceof Error ? error.message : "Revalidation failed.",
    };
  }
}
