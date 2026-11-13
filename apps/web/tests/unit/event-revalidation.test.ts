import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Webhook de revalidación (T5, spec §8): secreto incorrecto → 401; ruta fuera de la lista → se descarta; el patrón
 * /eventos/[slug] se revalida con el tipo «page»; nunca un comodín /eventos/*.
 */

const revalidate = vi.hoisted(() => ({ calls: [] as unknown[][] }));
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => {
    revalidate.calls.push(args);
  },
}));

import { POST } from "@/app/api/revalidate/route";
import { eventDrivenRevalidationPaths, isEventDrivenRevalidationPath } from "@c3/config";

const SECRET = "secreto-de-prueba";

function request(body: unknown, secret: string | null = SECRET) {
  return new Request("https://c3.com.sv/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(secret === null ? {} : { "x-c3-revalidate-secret": secret }) },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  revalidate.calls.length = 0;
  process.env.REVALIDATION_WEBHOOK_SECRET = SECRET;
});

describe("lista permitida", () => {
  it("conserva las cinco rutas actuales y añade exactamente el patrón de ficha y el sitemap", () => {
    expect([...eventDrivenRevalidationPaths]).toEqual([
      "/",
      "/compite",
      "/crea",
      "/conecta",
      "/eventos",
      "/eventos/[slug]",
      "/sitemap.xml",
    ]);
    expect(isEventDrivenRevalidationPath("/eventos/[slug]")).toBe(true);
    expect(isEventDrivenRevalidationPath("/sitemap.xml")).toBe(true);
  });

  it("no admite comodines ni fichas concretas bajo /eventos", () => {
    for (const path of ["/eventos/*", "/eventos/copa-2026", "/eventos/[slug]/", "/eventos/[id]", "/admin", "/eventos/"]) {
      expect(isEventDrivenRevalidationPath(path)).toBe(false);
    }
  });
});

describe("POST /api/revalidate", () => {
  it("secreto incorrecto o ausente → 401 y no revalida nada", async () => {
    const wrong = await POST(request({ paths: ["/eventos/[slug]"] }, "otro"));
    const missing = await POST(request({ paths: ["/eventos/[slug]"] }, null));

    expect(wrong.status).toBe(401);
    expect(missing.status).toBe(401);
    expect(revalidate.calls).toEqual([]);
  });

  it("el patrón permitido llama a revalidatePath con el tipo «page»", async () => {
    const response = await POST(request({ paths: ["/eventos/[slug]"] }));

    expect(response.status).toBe(200);
    expect(revalidate.calls).toEqual([["/eventos/[slug]", "page"]]);
    expect((await response.json()).revalidated).toEqual(["/eventos/[slug]"]);
  });

  it("las rutas literales se revalidan sin tipo, incluido el sitemap", async () => {
    await POST(request({ paths: ["/eventos", "/sitemap.xml"] }));

    expect(revalidate.calls).toEqual([["/eventos"], ["/sitemap.xml"]]);
  });

  it("una ruta ajena se descarta y no se revalida", async () => {
    const response = await POST(request({ paths: ["/admin", "/eventos/*", "/eventos/copa-2026", "/eventos/[slug]"] }));

    expect(revalidate.calls).toEqual([["/eventos/[slug]", "page"]]);
    expect((await response.json()).revalidated).toEqual(["/eventos/[slug]"]);
  });

  it("solo rutas ajenas: nada se revalida", async () => {
    const response = await POST(request({ paths: ["/admin"] }));

    expect(response.status).toBe(200);
    expect(revalidate.calls).toEqual([]);
    expect((await response.json()).revalidated).toEqual([]);
  });
});
