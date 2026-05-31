"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  FiAlertCircle,
  FiEdit3,
  FiLayers,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { Badge, Button, Card } from "@c3/ui";
import {
  compareEventsBySchedule,
  formatEventSchedule,
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
  featured: boolean;
  eventDate: string;
  eventDateEnd: string;
};

const lineLabels: Record<LineKey, string> = {
  compite: "Compite",
  crea: "Crea",
  conecta: "Conecta",
};

const statusStyle: Record<EventStatus, string> = {
  [eventStatuses[0]]: "border-[#b9eadf] bg-[#ecfdf5] text-[#0f7a5f]",
  [eventStatuses[1]]: "border-[#d8e2f0] bg-[#f4f7fb] text-[#42526b]",
  [eventStatuses[2]]: "border-[#e6d8fa] bg-[#f8f3ff] text-[#6b3fd4]",
  [eventStatuses[3]]: "border-[#d4e1f5] bg-[#eef4ff] text-[#205298]",
};

const emptyDraft: EventDraft = {
  id: "",
  title: "",
  description: "",
  lines: ["compite"],
  status: eventStatuses[1],
  cta: "",
  href: "",
  external: false,
  featured: false,
  eventDate: "",
  eventDateEnd: "",
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
    featured: Boolean(event.featured),
    eventDate: event.eventDate ?? "",
    eventDateEnd: event.eventDateEnd ?? "",
  };
}

function buildDraftId(draft: EventDraft, isEditing: boolean) {
  if (isEditing) {
    return draft.id.trim();
  }

  return draft.id.trim() || slugify(draft.title);
}

async function fetchWithAuth<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
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

  const orderedEvents = useMemo(() => [...events].sort(compareEventsBySchedule), [events]);
  const featuredCount = useMemo(
    () => events.reduce((count, event) => count + Number(Boolean(event.featured)), 0),
    [events],
  );
  const selectedEvent = useMemo(
    () => orderedEvents.find((event) => event.id === selectedEventId) ?? null,
    [orderedEvents, selectedEventId],
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
              : "No pudimos validar la sesion de administracion.",
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
        text: error instanceof Error ? error.message : "No pudimos iniciar sesion con Google.",
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
        text: error instanceof Error ? error.message : "No pudimos cerrar la sesion.",
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
        eventDate: draft.eventDate.trim() || undefined,
        eventDateEnd: draft.eventDateEnd.trim() || undefined,
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

    const confirmed = window.confirm("Seguro que queres borrar este evento?");
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
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-[#0F203E] via-[#205298] to-[#33BEAC] px-6 py-5 text-white">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <FiShield /> C3 Admin
            </div>
            <h1 className="mt-3 text-3xl font-bold">Falta configurar Firebase</h1>
          </div>
          <div className="space-y-3 px-6 py-6">
            <p className="max-w-2xl text-sm leading-7 text-[#364765]">
              El panel esta listo, pero necesita las variables `NEXT_PUBLIC_FIREBASE_*` para
              autenticar con Google y acceder a Firestore.
            </p>
            <p className="text-sm text-[#5c6a82]">
              Revisa <code className="rounded bg-[#eef3f9] px-2 py-1">apps/admin/.env.example</code>{" "}
              para completar la configuracion.
            </p>
          </div>
        </Card>
      </section>
    );
  }

  if (loadingAuth) {
    return (
      <section className="container-shell py-10 md:py-14">
        <Card className="p-8">
          <p className="text-sm text-[#5c6a82]">Cargando sesion de administracion...</p>
        </Card>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="container-shell py-10 md:py-14">
        <Card className="grid gap-6 overflow-hidden md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="bg-gradient-to-br from-[#0F203E] via-[#17335f] to-[#205298] p-8 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              <FiShield /> C3 Admin
            </div>
            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">
              Panel privado para administrar eventos de C3
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/82">
              Inicia sesion con Google para gestionar el catalogo de eventos. El acceso se restringe
              por allowlist de correo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                onClick={handleSignIn}
                className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full bg-[#33BEAC] text-[#0F203E] shadow-[0_12px_30px_rgba(51,190,172,0.22)] hover:bg-[#48c6b5]"
              >
                <FiShield /> Iniciar con Google
              </Button>
            </div>
          </div>

          <div className="space-y-4 p-8">
            <div className="grid gap-3">
              <Badge className="w-fit border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">
                Acceso privado
              </Badge>
              <h2 className="text-2xl font-bold text-[#0F203E]">Control editorial en C3</h2>
              <p className="text-sm leading-7 text-[#364765]">
                Configura `ADMIN_ALLOWED_EMAILS` con las cuentas que pueden entrar al panel.
              </p>
            </div>
            {message.text ? (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  message.kind === "error"
                    ? "border-[#f5c2c7] bg-[#fff5f5] text-[#b42318]"
                    : "border-[#a7f3d0] bg-[#ecfdf5] text-[#0f7a5f]"
                }`}
              >
                {message.text}
              </p>
            ) : null}
          </div>
        </Card>
      </section>
    );
  }

  const metrics = [
    { label: "Eventos", value: events.length.toString(), icon: FiLayers },
    { label: "Destacados", value: featuredCount.toString(), icon: FiStar },
    { label: "Usuario", value: session.email, icon: FiShield },
  ];

  return (
    <section className="container-shell py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <header className="overflow-hidden rounded-[1.8rem] border border-[#d5deea] bg-white shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
          <div className="bg-gradient-to-r from-[#0F203E] via-[#205298] to-[#33BEAC] px-6 py-5 text-white md:px-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <FiShield /> C3 Admin
            </div>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  Eventos, destacados y contenido editorial
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/82">
                  Sesion activa como <strong>{session.name}</strong> ({session.email})
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-5">
                <Button
                  onClick={handleNewEvent}
                  className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full bg-[#33BEAC] text-[#0F203E] shadow-[0_12px_30px_rgba(51,190,172,0.22)] hover:bg-[#48c6b5]"
                >
                  <FiPlus /> Agregar evento
                </Button>
                <Button
                  variant="secondary"
                  onClick={loadEvents}
                  disabled={loadingEvents}
                  className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full border-white/20 bg-white/10 text-white hover:bg-white/18"
                >
                  <FiRefreshCw className={loadingEvents ? "animate-spin" : ""} />
                  {loadingEvents ? "Actualizando..." : "Recargar"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full border border-[#f5c2c7] bg-[#fff5f5] text-[#b42318] hover:bg-[#ffeaea]"
                >
                  <FiLogOut /> Salir
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-[#dbe5ef] bg-[#f8fbfe] p-4 md:grid-cols-3 md:p-5">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card key={metric.label} className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                    <Icon className="text-[#205298]" />
                    {metric.label}
                  </div>
                  <p className="mt-3 break-words text-2xl font-bold text-[#0F203E]">{metric.value}</p>
                </Card>
              );
            })}
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
            <span className="inline-flex items-center gap-2">
              <FiAlertCircle />
              {message.text}
            </span>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiLayers className="text-[#205298]" /> Catalogo
                </div>
                <h2 className="mt-2 text-2xl font-bold">Eventos</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {orderedEvents.map((event) => {
                const isActive = event.id === selectedEventId;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleSelectEvent(event)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-[#205298] bg-[#eef4ff] shadow-[0_8px_24px_rgba(32,82,152,0.08)]"
                        : "border-[#d5deea] bg-white hover:border-[#9fb4d1] hover:bg-[#fbfdff]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#0F203E]">{event.title}</p>
                        {event.featured ? (
                          <Badge className="border-[#f2d58c] bg-[#fff9e8] text-[#9b6b00]">
                              <FiStar className="mr-1" /> Destacado
                            </Badge>
                          ) : null}
                        </div>
                        <p className="line-clamp-2 text-xs leading-6 text-[#5c6a82]">
                          {event.description}
                        </p>
                      </div>
                      <Badge className={`${statusStyle[event.status]} shrink-0 border`}>
                        {event.status}
                      </Badge>
                    </div>

                    {event.eventDate ? (
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
                        {formatEventSchedule(event)}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.lines.map((line) => {
                        return (
                          <span
                            key={`${event.id}-${line}`}
                            className="inline-flex items-center rounded-full border border-[#d5deea] bg-[#f7fafc] px-2.5 py-1 text-xs font-semibold text-[#4d5e79]"
                          >
                            {lineLabels[line]}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                  <FiEdit3 className="text-[#205298]" /> Editor
                </div>
                <h2 className="mt-2 text-2xl font-bold">
                  {selectedEventId ? "Editar evento" : "Crear evento"}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <Badge className={`${statusStyle[draft.status]} border`}>
                  {draft.status}
                </Badge>
                <span className="text-xs text-[#5c6a82]">
                  {selectedEventId
                    ? `ID: ${selectedEventId}`
                    : `ID sugerido: ${buildDraftId(draft, false) || "pendiente"}`}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0F203E]">Titulo</span>
                <input
                  value={draft.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  placeholder="Nombre del evento"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0F203E]">Descripcion</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="min-h-28 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  placeholder="Describe el evento"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#0F203E]">CTA</span>
                  <input
                    value={draft.cta}
                    onChange={(event) => updateField("cta", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                    placeholder="Ej. Ver hackathon"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#0F203E]">URL</span>
                  <input
                    value={draft.href}
                    onChange={(event) => updateField("href", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#0F203E]">Fecha principal</span>
                  <input
                    type="date"
                    value={draft.eventDate}
                    onChange={(event) => updateField("eventDate", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#0F203E]">Fecha final</span>
                  <input
                    type="date"
                    value={draft.eventDateEnd}
                    onChange={(event) => updateField("eventDateEnd", event.target.value)}
                    className="rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#205298] focus:ring-4 focus:ring-[#205298]/10"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#0F203E]">Estado</span>
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

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfd9e5] bg-white px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-[#0F203E]">Destacado</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) => updateField("featured", event.target.checked)}
                    className="h-5 w-5 rounded border-[#cfd9e5] text-[#205298]"
                  />
                </label>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-semibold text-[#0F203E]">Lineas</span>
                <div className="flex flex-wrap gap-2">
                  {lineKeys.map((line) => {
                    const label = lineLabels[line];
                    const active = draft.lines.includes(line);

                    return (
                      <button
                        key={line}
                        type="button"
                        onClick={() => toggleLine(line)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-[#205298] bg-[#eef4ff] text-[#205298] shadow-[0_6px_16px_rgba(15,32,62,0.06)]"
                            : "border-[#cfd9e5] bg-white text-[#40506b] hover:border-[#205298] hover:bg-[#f5f9ff]"
                        }`}
                      >
                        {label}
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

              {draft.eventDate ? (
                <div className="rounded-2xl border border-[#d5deea] bg-[#f8fbfe] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">Orden temporal</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F203E]">
                    {draft.eventDateEnd ? `${draft.eventDate} → ${draft.eventDateEnd}` : draft.eventDate}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full bg-[#33BEAC] text-[#0F203E] shadow-[0_12px_30px_rgba(51,190,172,0.18)] hover:bg-[#48c6b5]"
                >
                  <FiSave /> {saving ? "Guardando..." : selectedEventId ? "Guardar cambios" : "Crear evento"}
                </Button>
                {selectedEventId ? (
                  <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="!min-h-[3.5rem] !gap-3 !px-7 !py-3.5 !whitespace-nowrap !rounded-full border border-[#f5c2c7] bg-[#fff5f5] text-[#b42318] hover:bg-[#ffeaea]"
                  >
                    <FiTrash2 /> Eliminar
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
