"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { Badge, Button, Card } from "@c3/ui";
import {
  eventStatuses,
  lineKeys,
  type EventItem,
  type EventStatus,
  type LineKey,
} from "@c3/config";
import { getFirebaseClient, isFirebaseConfigured } from "@/lib/firebase-client";

type AdminSession = {
  email: string;
  name: string;
  picture?: string;
};

type DashboardMessage = {
  kind: "idle" | "success" | "error";
  text: string;
};

type EventDraft = {
  id: string;
  title: string;
  description: string;
  lines: LineKey[];
  status: EventStatus;
  cta: string;
  href: string;
  external: boolean;
};

const emptyDraft: EventDraft = {
  id: "",
  title: "",
  description: "",
  lines: ["compite"],
  status: "Próximamente",
  cta: "",
  href: "",
  external: false,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toDraft(event: EventItem): EventDraft {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    lines: [...event.lines],
    status: event.status,
    cta: event.cta,
    href: event.href,
    external: Boolean(event.external),
  };
}

function buildDraftId(draft: EventDraft, isEditing: boolean) {
  if (isEditing) {
    return draft.id.trim();
  }

  return draft.id.trim() || slugify(draft.title);
}

async function fetchWithAuth<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | { ok?: boolean; message?: string }
    | null;

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data as T;
}

export function AdminDashboard() {
  const firebaseReady = isFirebaseConfigured();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [draft, setDraft] = useState<EventDraft>(emptyDraft);
  const [message, setMessage] = useState<DashboardMessage>({ kind: "idle", text: "" });

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  useEffect(() => {
    if (!firebaseReady) {
      setLoadingAuth(false);
      return;
    }

    const { auth } = getFirebaseClient();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setSession(null);
        setEvents([]);
        setDraft(emptyDraft);
        setSelectedEventId("");
        setLoadingAuth(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const sessionResponse = await fetchWithAuth<{
          ok: true;
          user: AdminSession;
        }>("/api/session", token, { method: "GET" });
        const eventsResponse = await fetchWithAuth<{
          ok: true;
          events: EventItem[];
        }>("/api/events", token, { method: "GET" });

        setSession(sessionResponse.user);
        setEvents(eventsResponse.events);
        setSelectedEventId((current) => current || eventsResponse.events[0]?.id || "");
        setMessage({ kind: "idle", text: "" });
      } catch (error) {
        console.error("Admin session failed:", error);
        setSession(null);
        setEvents([]);
        setSelectedEventId("");
        setDraft(emptyDraft);
        setMessage({
          kind: "error",
          text:
            error instanceof Error
              ? error.message
              : "No pudimos validar la sesión de administración.",
        });
        await signOut(auth);
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  useEffect(() => {
    if (!selectedEvent) {
      if (!selectedEventId) {
        setDraft(emptyDraft);
      }
      return;
    }

    setDraft(toDraft(selectedEvent));
  }, [selectedEvent, selectedEventId]);

  async function loadEvents() {
    if (!session) {
      return;
    }

    setLoadingEvents(true);

    try {
      const { auth } = getFirebaseClient();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No active session found.");
      }

      const response = await fetchWithAuth<{
        ok: true;
        events: EventItem[];
      }>("/api/events", token, { method: "GET" });

      setEvents(response.events);
      setMessage({ kind: "success", text: "Eventos cargados correctamente." });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "No pudimos cargar los eventos.",
      });
    } finally {
      setLoadingEvents(false);
    }
  }

  async function handleSignIn() {
    try {
      const { auth, googleProvider } = getFirebaseClient();
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "No pudimos iniciar sesión con Google.",
      });
    }
  }

  async function handleSignOut() {
    try {
      const { auth } = getFirebaseClient();
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "No pudimos cerrar la sesión.",
      });
    }
  }

  function handleNewEvent() {
    setSelectedEventId("");
    setDraft(emptyDraft);
    setMessage({ kind: "idle", text: "" });
  }

  function handleSelectEvent(event: EventItem) {
    setSelectedEventId(event.id);
    setDraft(toDraft(event));
    setMessage({ kind: "idle", text: "" });
  }

  function updateField<K extends keyof EventDraft>(key: K, value: EventDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };

      if (key === "title" && !selectedEventId) {
        next.id = slugify(String(value));
      }

      return next;
    });
  }

  function toggleLine(line: LineKey) {
    setDraft((current) => {
      const lines = current.lines.includes(line)
        ? current.lines.filter((entry) => entry !== line)
        : [...current.lines, line];

      return {
        ...current,
        lines: lines.length ? lines : [line],
      };
    });
  }

  async function handleSave() {
    if (!session) {
      return;
    }

    setSaving(true);
    setMessage({ kind: "idle", text: "" });

    try {
      const { auth } = getFirebaseClient();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No active session found.");
      }

      const id = buildDraftId(draft, Boolean(selectedEventId));
      if (!draft.title.trim() || !draft.description.trim() || !draft.href.trim() || !draft.cta.trim()) {
        throw new Error("Completa los campos principales antes de guardar.");
      }

      const payload = {
        ...draft,
        id,
        lines: draft.lines,
      };

      const path = selectedEventId ? `/api/events/${encodeURIComponent(selectedEventId)}` : "/api/events";
      const method = selectedEventId ? "PATCH" : "POST";

      const response = await fetchWithAuth<{ ok: true; event: EventItem }>(path, token, {
        method,
        body: JSON.stringify(payload),
      });

      setSelectedEventId(response.event.id);
      await loadEvents();
      setMessage({
        kind: "success",
        text: selectedEventId ? "Evento actualizado correctamente." : "Evento creado correctamente.",
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "No pudimos guardar el evento.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!session || !selectedEventId) {
      return;
    }

    const confirmed = window.confirm("¿Seguro que querés borrar este evento?");
    if (!confirmed) {
      return;
    }

    try {
      const { auth } = getFirebaseClient();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No active session found.");
      }

      await fetchWithAuth(`/api/events/${encodeURIComponent(selectedEventId)}`, token, {
        method: "DELETE",
      });

      setSelectedEventId("");
      setDraft(emptyDraft);
      await loadEvents();
      setMessage({ kind: "success", text: "Evento eliminado correctamente." });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "No pudimos borrar el evento.",
      });
    }
  }

  if (!firebaseReady) {
    return (
      <section className="container-shell py-10 md:py-14">
        <Card className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">C3 Admin</p>
          <h1 className="mt-3 text-3xl font-bold">Falta configurar Firebase</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#364765]">
            El panel está listo, pero necesita las variables `NEXT_PUBLIC_FIREBASE_*` para
            autenticar con Google y acceder a Firestore.
          </p>
          <p className="mt-4 text-sm text-[#5c6a82]">
            Revisa <code className="rounded bg-[#eef3f9] px-2 py-1">apps/admin/.env.example</code>
            para completar la configuración.
          </p>
        </Card>
      </section>
    );
  }

  if (loadingAuth) {
    return (
      <section className="container-shell py-10 md:py-14">
        <Card className="p-8">
          <p className="text-sm text-[#5c6a82]">Cargando sesión de administración...</p>
        </Card>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="container-shell py-10 md:py-14">
        <Card className="grid gap-6 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
              C3 Admin
            </p>
            <h1 className="text-4xl font-bold leading-tight">Panel de eventos</h1>
            <p className="max-w-2xl text-sm leading-7 text-[#364765]">
              Iniciá sesión con Google para gestionar el catálogo de eventos de C3. El acceso se
              restringe por allowlist de correo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSignIn}>Iniciar con Google</Button>
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-[#0F203E] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">
              Acceso privado
            </p>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Configura `ADMIN_ALLOWED_EMAILS` con las cuentas que pueden entrar al panel.
            </p>
            {message.text ? (
              <p className={`mt-4 text-sm font-medium ${message.kind === "error" ? "text-[#fca5a5]" : "text-[#a7f3d0]"}`}>
                {message.text}
              </p>
            ) : null}
          </div>
        </Card>
      </section>
    );
  }

  const metrics = [
    { label: "Eventos", value: events.length.toString() },
    { label: "Líneas activas", value: new Set(events.flatMap((event) => event.lines)).size.toString() },
    { label: "Usuario", value: session.email },
  ];

  return (
    <section className="container-shell py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[1.8rem] border border-[#d5deea] bg-white p-6 shadow-[0_12px_30px_rgba(15,32,62,0.08)] md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">C3 Admin</p>
            <h1 className="text-3xl font-bold leading-tight">Eventos y contenido editorial</h1>
            <p className="text-sm leading-7 text-[#364765]">
              Sesión activa como <strong>{session.name}</strong> ({session.email})
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={loadEvents} disabled={loadingEvents}>
              {loadingEvents ? "Actualizando..." : "Recargar"}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              Salir
            </Button>
          </div>
        </header>

        {message.text ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              message.kind === "error"
                ? "border-[#f5c2c7] bg-[#fff5f5] text-[#b42318]"
                : "border-[#a7f3d0] bg-[#ecfdf5] text-[#0f7a5f]"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                {metric.label}
              </p>
              <p className="mt-3 break-words text-2xl font-bold text-[#0F203E]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  Catálogo
                </p>
                <h2 className="mt-2 text-2xl font-bold">Eventos</h2>
              </div>
              <Button onClick={handleNewEvent} variant="secondary">
                Nuevo evento
              </Button>
            </div>

            <div className="mt-5 grid gap-3">
              {events.map((event) => {
                const isActive = event.id === selectedEventId;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleSelectEvent(event)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-[#0F203E] bg-[#f0f5fb]"
                        : "border-[#d5deea] bg-white hover:border-[#9fb4d1]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-[#0F203E]">{event.title}</p>
                        <p className="line-clamp-2 text-xs leading-6 text-[#5c6a82]">
                          {event.description}
                        </p>
                      </div>
                      <Badge className="shrink-0">{event.status}</Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  Editor
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {selectedEventId ? "Editar evento" : "Crear evento"}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <Badge>{draft.status}</Badge>
                <span className="text-xs text-[#5c6a82]">
                  {selectedEventId ? `ID: ${selectedEventId}` : `ID sugerido: ${buildDraftId(draft, false) || "pendiente"}`}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Título</span>
                <input
                  value={draft.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  placeholder="Nombre del evento"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Descripción</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="min-h-28 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  placeholder="Describe el evento"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">CTA</span>
                  <input
                    value={draft.cta}
                    onChange={(event) => updateField("cta", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                    placeholder="Ej. Ver hackathon"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">URL</span>
                  <input
                    value={draft.href}
                    onChange={(event) => updateField("href", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Estado</span>
                  <select
                    value={draft.status}
                    onChange={(event) => updateField("status", event.target.value as EventStatus)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  >
                    {eventStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked={draft.external}
                    onChange={(event) => updateField("external", event.target.checked)}
                    className="h-4 w-4 rounded border-[#cfd9e5] text-[#205298]"
                  />
                  <span className="text-sm font-medium">Link externo</span>
                </label>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-semibold">Líneas</span>
                <div className="flex flex-wrap gap-2">
                  {lineKeys.map((line) => {
                    const active = draft.lines.includes(line);

                    return (
                      <button
                        key={line}
                        type="button"
                        onClick={() => toggleLine(line)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-[#0F203E] bg-[#0F203E] text-white"
                            : "border-[#cfd9e5] bg-white text-[#40506b] hover:border-[#0F203E]"
                        }`}
                      >
                        {line}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d5deea] bg-[#f8fbfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">ID</p>
                <p className="mt-2 font-mono text-sm text-[#0F203E]">
                  {selectedEventId || buildDraftId(draft, false) || "pendiente"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Guardando..." : selectedEventId ? "Guardar cambios" : "Crear evento"}
                </Button>
                {selectedEventId ? (
                  <Button variant="ghost" onClick={handleDelete}>
                    Eliminar
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
