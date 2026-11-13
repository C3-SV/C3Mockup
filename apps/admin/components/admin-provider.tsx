"use client";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AdminEventRecord } from "@c3/config";
import {
  fetchAdminEvent,
  fetchAdminEvents,
  fetchAdminSession,
  fetchAdminApi,
  getRefreshPending,
  type RefreshPending,
  type SiteRevalidationStatus,
} from "@/lib/admin-api";
import { getFirebaseClient, isFirebaseConfigured } from "@/lib/firebase-client";
import type { AdminFeedback, AdminSession } from "@/lib/admin-types";

type AdminAuthState = "loading" | "authenticated" | "unauthenticated" | "config-missing";

type AdminContextValue = {
  firebaseReady: boolean;
  authState: AdminAuthState;
  session: AdminSession | null;
  events: AdminEventRecord[];
  eventsLoading: boolean;
  feedback: AdminFeedback;
  setFeedback: (feedback: AdminFeedback) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  reloadEvents: () => Promise<void>;
  getEventById: (eventId: string) => Promise<AdminEventRecord>;
  /** El guardado ya está confirmado cuando resuelve; `refreshPending` avisa de que el sitio aún no se refrescó. */
  createEvent: (payload: unknown) => Promise<AdminEventRecord & RefreshPending>;
  updateEvent: (eventId: string, payload: unknown) => Promise<AdminEventRecord & RefreshPending>;
  deleteEvent: (eventId: string) => Promise<RefreshPending | void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

async function getAuthToken(currentUser: User | null) {
  if (!currentUser) {
    throw new Error("No active session found.");
  }

  return currentUser.getIdToken();
}

function buildFriendlyMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

/** Solo marca el aviso cuando hace falta: un refresco confirmado deja el registro tal cual. */
function withRefreshState(
  event: AdminEventRecord,
  response: { revalidation?: SiteRevalidationStatus },
): AdminEventRecord & RefreshPending {
  return getRefreshPending(response) ? { ...event, refreshPending: true } : event;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const firebaseReady = isFirebaseConfigured();
  const [authState, setAuthState] = useState<AdminAuthState>(firebaseReady ? "loading" : "config-missing");
  const [session, setSession] = useState<AdminSession | null>(null);
  const [events, setEvents] = useState<AdminEventRecord[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedback>({ kind: "idle", text: "" });

  useEffect(() => {
    if (!firebaseReady) {
      return;
    }

    const { auth } = getFirebaseClient();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setSession(null);
        setEvents([]);
        setAuthState("unauthenticated");
        setFeedback({ kind: "idle", text: "" });
        return;
      }

      try {
        const token = await getAuthToken(currentUser);
        const [sessionResponse, eventsResponse] = await Promise.all([
          fetchAdminSession(token),
          fetchAdminEvents(token),
        ]);

        setSession(sessionResponse.user);
        setEvents(eventsResponse.events);
        setAuthState("authenticated");
        setFeedback({ kind: "idle", text: "" });
      } catch (error) {
        console.error("Admin session bootstrap failed:", error);
        setSession(null);
        setEvents([]);
        setAuthState("unauthenticated");
        setFeedback({
          kind: "error",
          text: buildFriendlyMessage(
            error,
            "No pudimos validar la sesion de administracion.",
          ),
        });

        await signOut(auth).catch(() => undefined);
      }
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  async function withAuthenticatedToken<T>(handler: (token: string) => Promise<T>) {
    const { auth } = getFirebaseClient();
    const token = await getAuthToken(auth.currentUser);
    return handler(token);
  }

  async function reloadEvents() {
    setEventsLoading(true);

    try {
      const response = await withAuthenticatedToken((token) => fetchAdminEvents(token));
      setEvents(response.events);
      setFeedback({ kind: "success", text: "Eventos recargados correctamente." });
    } catch (error) {
      setFeedback({
        kind: "error",
        text: buildFriendlyMessage(error, "No pudimos recargar los eventos."),
      });
    } finally {
      setEventsLoading(false);
    }
  }

  async function getEventById(eventId: string) {
    const response = await withAuthenticatedToken((token) => fetchAdminEvent(token, eventId));
    return response.event;
  }

  async function createEvent(payload: unknown) {
    const response = await withAuthenticatedToken((token) =>
      fetchAdminApi<{ ok: true; event: AdminEventRecord; revalidation?: SiteRevalidationStatus }>("/api/events", token, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    await reloadEvents();
    return withRefreshState(response.event, response);
  }

  async function updateEvent(eventId: string, payload: unknown) {
    const response = await withAuthenticatedToken((token) =>
      fetchAdminApi<{ ok: true; event: AdminEventRecord; revalidation?: SiteRevalidationStatus }>(
        `/api/events/${encodeURIComponent(eventId)}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      ),
    );

    await reloadEvents();
    return withRefreshState(response.event, response);
  }

  async function deleteEvent(eventId: string) {
    const response = await withAuthenticatedToken((token) =>
      fetchAdminApi<{ ok: true; revalidation?: SiteRevalidationStatus }>(
        `/api/events/${encodeURIComponent(eventId)}`,
        token,
        { method: "DELETE" },
      ),
    );

    await reloadEvents();
    return { refreshPending: getRefreshPending(response) };
  }

  async function signIn() {
    try {
      const { auth, googleProvider } = getFirebaseClient();
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, googleProvider);
      setFeedback({ kind: "idle", text: "" });
    } catch (error) {
      setFeedback({
        kind: "error",
        text: buildFriendlyMessage(error, "No pudimos iniciar sesión con Google."),
      });
    }
  }

  async function handleSignOut() {
    try {
      const { auth } = getFirebaseClient();
      await signOut(auth);
    } catch (error) {
      setFeedback({
        kind: "error",
        text: buildFriendlyMessage(error, "No pudimos cerrar la sesión."),
      });
    }
  }

  const value: AdminContextValue = {
    firebaseReady,
    authState,
    session,
    events,
    eventsLoading,
    feedback,
    setFeedback,
    signIn,
    signOut: handleSignOut,
    reloadEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminData must be used within AdminProvider.");
  }

  return context;
}
