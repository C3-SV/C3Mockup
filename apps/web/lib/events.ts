import "server-only";

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  defaultEvents,
  normalizeEventLines,
  normalizeEventStatus,
  type EventItem,
} from "@c3/config";

const EVENTS_COLLECTION = "events";

function readFirebaseServiceAccount(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

let firestore: ReturnType<typeof getFirestore> | null = null;

function getAdminFirestore() {
  if (firestore) {
    return firestore;
  }

  const serviceAccount = readFirebaseServiceAccount();

  if (!serviceAccount) {
    throw new Error("Firebase service account is not configured.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
  }

  firestore = getFirestore();
  return firestore;
}

function parseEventDoc(docId: string, data: Record<string, unknown>): EventItem | null {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const href = typeof data.href === "string" ? data.href.trim() : "";
  const cta = typeof data.cta === "string" ? data.cta.trim() : "";

  if (!title || !description || !href || !cta) {
    return null;
  }

  const lines = normalizeEventLines(data.lines);
  if (!lines.length) {
    return null;
  }

  return {
    id: typeof data.id === "string" && data.id.trim() ? data.id.trim() : docId,
    title,
    description,
    lines,
    status: normalizeEventStatus(data.status),
    cta,
    href,
    external: Boolean(data.external),
  };
}

export async function getPublicEvents(): Promise<EventItem[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection(EVENTS_COLLECTION).orderBy("updatedAt", "desc").get();

    if (snapshot.empty) {
      return defaultEvents;
    }

    const events = snapshot.docs
      .map((doc) => parseEventDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((event): event is EventItem => event !== null);

    return events.length ? events : defaultEvents;
  } catch (error) {
    console.warn("Falling back to bundled events data:", error);
    return defaultEvents;
  }
}
