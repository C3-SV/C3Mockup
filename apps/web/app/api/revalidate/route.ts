import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  eventDrivenRevalidationPaths,
  isEventDrivenRevalidationPath,
} from "@c3/config";

const WEBHOOK_SECRET_HEADER = "x-c3-revalidate-secret";

type RevalidateRequestBody = {
  reason?: string;
  source?: string;
  paths?: string[];
};

function readWebhookSecret() {
  return process.env.REVALIDATION_WEBHOOK_SECRET?.trim();
}

function resolvePaths(body: RevalidateRequestBody | null) {
  const requestedPaths = Array.isArray(body?.paths) ? body?.paths : [];
  const candidatePaths = requestedPaths.length ? requestedPaths : [...eventDrivenRevalidationPaths];

  return [...new Set(candidatePaths.filter(isEventDrivenRevalidationPath))];
}

export async function POST(request: Request) {
  const secret = readWebhookSecret();

  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "Revalidation webhook is not configured." },
      { status: 500 },
    );
  }

  const providedSecret = request.headers.get(WEBHOOK_SECRET_HEADER)?.trim();
  if (!providedSecret || providedSecret !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RevalidateRequestBody | null;
  const paths = resolvePaths(body);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    reason: body?.reason ?? null,
    source: body?.source ?? null,
  });
}
