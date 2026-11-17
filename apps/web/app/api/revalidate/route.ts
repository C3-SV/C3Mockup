import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  eventDrivenRevalidationPaths,
  getRevalidationPathType,
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

/** Comparación en tiempo constante; una longitud distinta es un rechazo sin lanzar (timingSafeEqual lanzaría). */
function secretsMatch(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
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
  if (!providedSecret || !secretsMatch(providedSecret, secret)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RevalidateRequestBody | null;
  const paths = resolvePaths(body);

  for (const path of paths) {
    // El patrón /eventos/[slug] exige el tipo «page»; las rutas literales se revalidan sin tipo.
    const type = getRevalidationPathType(path);
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    reason: body?.reason ?? null,
    source: body?.source ?? null,
  });
}
