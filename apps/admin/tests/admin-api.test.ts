import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminApiError, fetchAdminApi } from "@/lib/admin-api";

function stubFetch(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })),
  );
}

/** La llamada debe fallar: devuelve el AdminApiError lanzado. */
async function failure(): Promise<AdminApiError> {
  try {
    await fetchAdminApi("/api/events", "token");
  } catch (caught) {
    return caught as AdminApiError;
  }
  throw new Error("La llamada debía fallar.");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchAdminApi", () => {
  it("un 400 conserva los errores por campo del cuerpo", async () => {
    stubFetch(400, { ok: false, message: "Invalid event page", errors: { overview: "Es obligatorio.", "memory.results.0.value": "Máximo 80 caracteres." } });

    const error = await failure();

    expect(error).toBeInstanceOf(AdminApiError);
    expect(error.status).toBe(400);
    expect(error.errors).toEqual({ overview: "Es obligatorio.", "memory.results.0.value": "Máximo 80 caracteres." });
  });

  it("un 409 conserva el mensaje del servidor y el estado", async () => {
    stubFetch(409, { ok: false, message: "El slug «x» ya está reservado por otro evento.", errors: { slug: "El slug «x» ya está reservado por otro evento." } });

    const error = await failure();

    expect(error).toBeInstanceOf(AdminApiError);
    expect(error.status).toBe(409);
    expect(error.message).toBe("El slug «x» ya está reservado por otro evento.");
  });

  it("ignora errores que no son pares clave-texto y no rompe sin errors", async () => {
    stubFetch(500, { ok: false, message: "Unable to update event.", errors: { a: 1, b: "ok", c: ["x"] } });
    const withJunk = await failure();
    expect(withJunk.errors).toEqual({ b: "ok" });

    stubFetch(500, { ok: false, message: "Falló." });
    const without = await failure();
    expect(without.errors).toEqual({});
  });

  it("una respuesta correcta devuelve los datos", async () => {
    stubFetch(200, { ok: true, events: [] });

    await expect(fetchAdminApi<{ events: unknown[] }>("/api/events", "token")).resolves.toMatchObject({ events: [] });
  });
});
