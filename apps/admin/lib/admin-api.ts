import type { EventItem } from "@c3/config";

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
} & T;

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
    throw new Error(data.message || `Request failed with ${response.status}.`);
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
  return fetchAdminApi<{ ok: true; events: EventItem[] }>("/api/events", token);
}

export async function fetchAdminEvent(token: string, eventId: string) {
  return fetchAdminApi<{ ok: true; event: EventItem }>(
    `/api/events/${encodeURIComponent(eventId)}`,
    token,
  );
}

export async function createAdminEvent(token: string, payload: unknown) {
  return fetchAdminApi<{ ok: true; event: EventItem }>("/api/events", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminEvent(token: string, eventId: string, payload: unknown) {
  return fetchAdminApi<{ ok: true; event: EventItem }>(
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
