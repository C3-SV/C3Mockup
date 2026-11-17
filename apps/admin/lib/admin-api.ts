import type { AdminEventRecord, EventPageErrors } from "@c3/config";

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  errors?: unknown;
} & T;

/** Resultado de pedir al sitio que refresque sus páginas tras un cambio (lib/revalidate-site.ts). */
export type SiteRevalidationStatus = { ok: boolean; skipped?: boolean; paths?: string[]; message?: string; status?: number };

/**
 * Aviso cuando el cambio quedó guardado pero el sitio aún no se refrescó. El guardado sigue confirmado: solo falta
 * que el sitio público lo muestre, lo que ocurre solo en cuanto vence la caché de las fichas (60 s).
 */
export const REFRESH_PENDING_MESSAGE =
  "Los cambios quedaron guardados, pero no pudimos pedir al sitio que se refresque ahora. El sitio público los mostrará solo en aproximadamente un minuto.";

/** Marca opcional que el proveedor añade al resultado de un guardado o borrado cuyo refresco quedó pendiente. */
export type RefreshPending = { refreshPending?: boolean };

/**
 * ¿Quedó pendiente el refresco del sitio? Solo se da por hecho cuando el webhook confirmó (ok y no omitido). Un
 * fallo, un webhook sin configurar o una respuesta sin datos de revalidación cuentan como pendiente: nunca se
 * afirma un refresco que no consta.
 */
export function getRefreshPending(response: { revalidation?: SiteRevalidationStatus }): boolean {
  const status = response.revalidation;
  return !(status && status.ok === true && status.skipped !== true);
}

/**
 * Error de la API del panel. Conserva el estado HTTP (400 datos inválidos, 409 slug o id ocupado) y los errores por
 * campo del cuerpo (`errors`, p. ej. «memory.results.0.value»), para que el formulario los muestre junto a cada control.
 */
export class AdminApiError extends Error {
  readonly status: number;
  readonly errors: EventPageErrors;

  constructor(message: string, status: number, errors: EventPageErrors = {}) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** Solo se aceptan pares clave → texto: el cuerpo viene de la red y no se confía en su forma. */
function readFieldErrors(value: unknown): EventPageErrors {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as T | null;

  if (!data) {
    throw new Error("No se pudo leer la respuesta del servidor.");
  }

  return data;
}

export async function fetchAdminApi<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const data = await readJson<ApiResponse<T>>(response);

  if (!response.ok || data.ok === false) {
    throw new AdminApiError(
      data.message || `Request failed with ${response.status}.`,
      response.status,
      readFieldErrors(data.errors),
    );
  }

  return data as T;
}

export async function fetchAdminSession(token: string) {
  return fetchAdminApi<{ ok: true; user: { email: string; name: string; picture?: string } }>(
    "/api/session",
    token,
  );
}

export async function fetchAdminEvents(token: string) {
  return fetchAdminApi<{ ok: true; events: AdminEventRecord[] }>("/api/events", token);
}

export async function fetchAdminEvent(token: string, eventId: string) {
  return fetchAdminApi<{ ok: true; event: AdminEventRecord }>(
    `/api/events/${encodeURIComponent(eventId)}`,
    token,
  );
}

export async function createAdminEvent(token: string, payload: unknown) {
  return fetchAdminApi<{ ok: true; event: AdminEventRecord; revalidation?: SiteRevalidationStatus }>("/api/events", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminEvent(token: string, eventId: string, payload: unknown) {
  return fetchAdminApi<{ ok: true; event: AdminEventRecord; revalidation?: SiteRevalidationStatus }>(
    `/api/events/${encodeURIComponent(eventId)}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminEvent(token: string, eventId: string) {
  return fetchAdminApi<{ ok: true; revalidation?: SiteRevalidationStatus }>(`/api/events/${encodeURIComponent(eventId)}`, token, {
    method: "DELETE",
  });
}
