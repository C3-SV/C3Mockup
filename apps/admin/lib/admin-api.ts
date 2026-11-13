import type { AdminEventRecord, EventPageErrors } from "@c3/config";

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  errors?: unknown;
} & T;

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
  return fetchAdminApi<{ ok: true; event: AdminEventRecord }>("/api/events", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminEvent(token: string, eventId: string, payload: unknown) {
  return fetchAdminApi<{ ok: true; event: AdminEventRecord }>(
    `/api/events/${encodeURIComponent(eventId)}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminEvent(token: string, eventId: string) {
  return fetchAdminApi<{ ok: true }>(`/api/events/${encodeURIComponent(eventId)}`, token, {
    method: "DELETE",
  });
}
