import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Actualización del sitio tras guardar (T5, spec §8): crear, guardar (incluida la despublicación) y borrar envían
 * al webhook el patrón /eventos/[slug] y /sitemap.xml. Si el webhook falla, el guardado sigue confirmado y la
 * respuesta lo dice con claridad: nunca se aparenta que el refresco tuvo éxito, ni que el guardado falló.
 */

const repo = vi.hoisted(() => ({
  created: { id: "copa-2026", title: "Copa" },
  failWith: null as unknown,
}));

vi.mock("@/lib/firebase-admin", () => {
  class HttpError extends Error {
    constructor(
      message: string,
      readonly status: number,
    ) {
      super(message);
    }
  }
  return {
    HttpError,
    toErrorBody: (error: HttpError) => ({ ok: false, message: error.message }),
    verifyAdminRequest: async () => ({ email: "admin@c3.com.sv" }),
    listAdminEvents: async () => [],
    getAdminEvent: async () => repo.created,
    createAdminEvent: async () => {
      if (repo.failWith) throw repo.failWith;
      return repo.created;
    },
    updateAdminEvent: async () => {
      if (repo.failWith) throw repo.failWith;
      return repo.created;
    },
    deleteAdminEvent: async () => {
      if (repo.failWith) throw repo.failWith;
    },
  };
});

import { DELETE, PATCH } from "@/app/api/events/[id]/route";
import { POST } from "@/app/api/events/route";
import { getRefreshPending, REFRESH_PENDING_MESSAGE } from "@/lib/admin-api";
import { triggerSiteRevalidation } from "@/lib/revalidate-site";

const URL_ = "https://web.test/api/revalidate";
const EXPECTED_PATHS = ["/", "/compite", "/crea", "/conecta", "/eventos", "/eventos/[slug]", "/sitemap.xml"];

let fetchMock: ReturnType<typeof vi.fn>;

function stubWebhook(response: () => Response | Promise<Response>) {
  fetchMock = vi.fn(async () => response());
  vi.stubGlobal("fetch", fetchMock);
}

const ok = () => new Response(JSON.stringify({ ok: true }), { status: 200 });
const context = { params: Promise.resolve({ id: "copa-2026" }) };
const json = (body: unknown = {}) =>
  new Request("https://admin.test/api/events", { method: "POST", body: JSON.stringify(body) });

function sentPaths(): string[] {
  const init = fetchMock.mock.calls[0][1] as RequestInit;
  return JSON.parse(String(init.body)).paths;
}

beforeEach(() => {
  process.env.REVALIDATION_WEBHOOK_URL = URL_;
  process.env.REVALIDATION_WEBHOOK_SECRET = "secreto";
  repo.failWith = null;
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.REVALIDATION_WEBHOOK_URL;
  delete process.env.REVALIDATION_WEBHOOK_SECRET;
});

describe("triggerSiteRevalidation", () => {
  it("sin rutas explícitas envía las cinco actuales, el patrón de ficha y el sitemap", async () => {
    stubWebhook(ok);

    const result = await triggerSiteRevalidation({ reason: "x", source: "test" });

    expect(result.ok).toBe(true);
    expect(sentPaths()).toEqual(EXPECTED_PATHS);
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "x-c3-revalidate-secret": "secreto" });
  });

  it("descarta rutas ajenas o comodines antes de enviarlas", async () => {
    stubWebhook(ok);

    await triggerSiteRevalidation({
      reason: "x",
      source: "test",
      paths: ["/eventos/[slug]", "/eventos/*", "/eventos/copa-2026", "/admin", "/sitemap.xml"],
    });

    expect(sentPaths()).toEqual(["/eventos/[slug]", "/sitemap.xml"]);
  });
});

describe("rutas del admin", () => {
  it("crear envía el patrón y el sitemap", async () => {
    stubWebhook(ok);
    const response = await POST(json());

    expect(response.status).toBe(201);
    expect(sentPaths()).toEqual(expect.arrayContaining(["/eventos/[slug]", "/sitemap.xml"]));
  });

  it("guardar (y despublicar, que es un guardado con publication:draft) envía el patrón y el sitemap", async () => {
    stubWebhook(ok);
    const response = await PATCH(json({ page: { publication: "draft" } }), context);

    expect(response.status).toBe(200);
    expect(sentPaths()).toEqual(expect.arrayContaining(["/eventos/[slug]", "/sitemap.xml"]));
  });

  it("borrar envía el patrón y el sitemap", async () => {
    stubWebhook(ok);
    const response = await DELETE(json(), context);

    expect(response.status).toBe(200);
    expect(sentPaths()).toEqual(expect.arrayContaining(["/eventos/[slug]", "/sitemap.xml"]));
  });

  it("si el guardado falla no se llama al webhook (no hay nada que refrescar)", async () => {
    stubWebhook(ok);
    repo.failWith = new Error("boom");
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await PATCH(json(), context);

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("fallo del webhook", () => {
  const failures: Array<[string, () => Response | Promise<Response>]> = [
    ["responde 500", () => new Response(JSON.stringify({ ok: false, message: "Unauthorized." }), { status: 500 })],
    ["responde 401", () => new Response(JSON.stringify({ ok: false, message: "Unauthorized." }), { status: 401 })],
    [
      "no se puede alcanzar",
      () => {
        throw new Error("network down");
      },
    ],
  ];

  for (const [label, response] of failures) {
    it(`el guardado sigue confirmado cuando el webhook ${label}, con aviso de refresco pendiente`, async () => {
      stubWebhook(response);
      const patch = await PATCH(json(), context);
      const body = await patch.json();

      expect(patch.status).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.event).toEqual(repo.created);
      expect(body.revalidation.ok).toBe(false);
      expect(getRefreshPending(body)).toBe(true);
    });
  }

  it("crear y borrar también siguen confirmados cuando el webhook falla", async () => {
    stubWebhook(() => new Response("{}", { status: 502 }));

    const created = await POST(json());
    const deleted = await DELETE(json(), context);

    expect(created.status).toBe(201);
    expect((await created.json()).revalidation.ok).toBe(false);
    expect(deleted.status).toBe(200);
    const deletedBody = await deleted.json();
    expect(deletedBody.ok).toBe(true);
    expect(getRefreshPending(deletedBody)).toBe(true);
  });
});

describe("aviso de refresco pendiente", () => {
  it("un refresco confirmado no genera aviso", () => {
    expect(getRefreshPending({ revalidation: { ok: true, skipped: false, paths: [] } })).toBe(false);
  });

  it("sin webhook configurado (skipped) tampoco se afirma que el sitio se refrescó", () => {
    expect(getRefreshPending({ revalidation: { ok: true, skipped: true, paths: [] } })).toBe(true);
  });

  it("una respuesta sin datos de revalidación se trata como pendiente, no como éxito", () => {
    expect(getRefreshPending({})).toBe(true);
  });

  it("el mensaje confirma el guardado, no promete el refresco y nombra el respaldo", () => {
    expect(REFRESH_PENDING_MESSAGE).toMatch(/guard/i);
    expect(REFRESH_PENDING_MESSAGE).toMatch(/minuto/i);
    expect(REFRESH_PENDING_MESSAGE).not.toMatch(/error|no se pudo guardar/i);
  });
});
