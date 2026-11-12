import "server-only";

import { cache } from "react";
import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultEvents, compareEventsBySchedule, normalizeFirebasePrivateKey, type EventItem } from "@c3/config";
import { parseEventDocument } from "@/lib/events-parse";

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
    privateKey: normalizeFirebasePrivateKey(privateKey),
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

export const getPublicEvents = cache(async (): Promise<EventItem[]> => {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection(EVENTS_COLLECTION).orderBy("updatedAt", "desc").get();

    if (snapshot.empty) {
      return [...defaultEvents].sort(compareEventsBySchedule);
    }

    const events = snapshot.docs
      .map((doc) => parseEventDocument(doc.id, doc.data() as Record<string, unknown>))
      .filter((event): event is EventItem => event !== null)
      .sort(compareEventsBySchedule);

    return events.length ? events : [...defaultEvents].sort(compareEventsBySchedule);
  } catch (error) {
    console.warn("Falling back to bundled events data:", error);
    return [...defaultEvents].sort(compareEventsBySchedule);
  }
});
