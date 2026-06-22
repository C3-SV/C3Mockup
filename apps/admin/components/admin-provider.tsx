"use client";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { EventItem } from "@c3/config";
import { fetchAdminEvent, fetchAdminEvents, fetchAdminSession, fetchAdminApi } from "@/lib/admin-api";
import { getFirebaseClient, isFirebaseConfigured } from "@/lib/firebase-client";
import type { AdminFeedback, AdminSession } from "@/lib/admin-types";

type AdminAuthState = "loading" | "authenticated" | "unauthenticated" | "config-missing";

type AdminContextValue = {
  firebaseReady: boolean;
  authState: AdminAuthState;
  session: AdminSession | null;
  events: EventItem[];
  eventsLoading: boolean;
  feedback: AdminFeedback;
  setFeedback: (feedback: AdminFeedback) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  reloadEvents: () => Promise<void>;
  getEventById: (eventId: string) => Promise<EventItem>;
  createEvent: (payload: unknown) => Promise<EventItem>;
  updateEvent: (eventId: string, payload: unknown) => Promise<EventItem>;
  deleteEvent: (eventId: string) => Promise<void>;
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

export function AdminProvider({ children }: { children: ReactNode }) {
  const firebaseReady = isFirebaseConfigured();
  const [authState, setAuthState] = useState<AdminAuthState>(firebaseReady ? "loading" : "config-missing");
  const [session, setSession] = useState<AdminSession | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
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
    const response = await withAuthenticatedToken((token) => fetchAdminApi<{ ok: true; event: EventItem }>(
      "/api/events",
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ));

    await reloadEvents();
    return response.event;
  }

  async function updateEvent(eventId: string, payload: unknown) {
    const response = await withAuthenticatedToken((token) =>
      fetchAdminApi<{ ok: true; event: EventItem }>(
        `/api/events/${encodeURIComponent(eventId)}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      ),
    );

    await reloadEvents();
    return response.event;
  }

  async function deleteEvent(eventId: string) {
    await withAuthenticatedToken((token) =>
      fetchAdminApi<{ ok: true }>(`/api/events/${encodeURIComponent(eventId)}`, token, {
        method: "DELETE",
      }),
    );

    await reloadEvents();
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
