import "server-only";

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import {
  defaultEvents,
  normalizeEventLines,
  normalizeEventStatus,
  type EventItem,
  type EventStatus,
  type LineKey,
} from "@c3/config";

const EVENTS_COLLECTION = "events";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function readServiceAccount(): ServiceAccount | null {
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

function parseAllowedEmails() {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(/[,\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string) {
  const allowedEmails = parseAllowedEmails();
  if (!allowedEmails.length) {
    return false;
  }

  return allowedEmails.includes(email.trim().toLowerCase());
}

let firestore: Firestore | null = null;

export function getAdminFirestore() {
  if (firestore) {
    return firestore;
  }

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new HttpError(500, "Firebase service account is not configured.");
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

export async function verifyAdminRequest(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

  if (!token) {
    throw new HttpError(401, "Missing authorization token.");
  }

  const decoded = await getAuth().verifyIdToken(token);

  if (!decoded.email) {
    throw new HttpError(403, "Google account email is required.");
  }

  if (!isAllowedAdminEmail(decoded.email)) {
    throw new HttpError(403, "This account is not allowed to access the admin.");
  }

  return decoded;
}

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

export type AdminEventRecord = EventItem & {
  createdAt: string;
  updatedAt: string;
};

function sanitizeEventPayload(input: unknown, fallbackId?: string): AdminEventRecord {
  const payload = (input ?? {}) as Record<string, unknown>;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const href = typeof payload.href === "string" ? payload.href.trim() : "";
  const cta = typeof payload.cta === "string" ? payload.cta.trim() : "";
  const id =
    typeof payload.id === "string" && payload.id.trim()
      ? slugify(payload.id)
      : fallbackId || slugify(title);

  if (!title || !description || !href || !cta || !id) {
    throw new HttpError(400, "Title, description, href, cta and id are required.");
  }

  const lines = normalizeEventLines(payload.lines);
  if (!lines.length) {
    throw new HttpError(400, "At least one line must be selected.");
  }

  const now = new Date().toISOString();
  const createdAt = typeof payload.createdAt === "string" && payload.createdAt ? payload.createdAt : now;
  const updatedAt = typeof payload.updatedAt === "string" && payload.updatedAt ? payload.updatedAt : now;

  return {
    id,
    title,
    description,
    lines,
    status: normalizeEventStatus(payload.status) as EventStatus,
    cta,
    href,
    external: Boolean(payload.external),
    createdAt,
    updatedAt,
  };
}

export function parseAdminEventDoc(id: string, data: Record<string, unknown>): AdminEventRecord | null {
  try {
    return sanitizeEventPayload(
      {
        id,
        ...data,
      },
      id,
    );
  } catch {
    return null;
  }
}

export async function listAdminEvents() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection(EVENTS_COLLECTION).orderBy("updatedAt", "desc").get();
    const now = new Date().toISOString();

    if (snapshot.empty) {
      return defaultEvents.map((event) => ({
        ...event,
        createdAt: now,
        updatedAt: now,
      })) satisfies AdminEventRecord[];
    }

    return snapshot.docs
      .map((doc) => parseAdminEventDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((event): event is AdminEventRecord => event !== null);
  } catch (error) {
    console.warn("Falling back to bundled events data in admin:", error);
    const now = new Date().toISOString();
    return defaultEvents.map((event) => ({
      ...event,
      createdAt: now,
      updatedAt: now,
    })) satisfies AdminEventRecord[];
  }
}

export async function createAdminEvent(input: unknown) {
  const record = sanitizeEventPayload(input);
  const db = getAdminFirestore();
  await db.collection(EVENTS_COLLECTION).doc(record.id).set(record, { merge: false });
  return record;
}

export async function updateAdminEvent(id: string, input: unknown) {
  const existing = await getAdminFirestore().collection(EVENTS_COLLECTION).doc(id).get();
  const existingData = existing.exists ? (existing.data() as Record<string, unknown>) : {};
  const record = sanitizeEventPayload(
    { ...existingData, ...(input as Record<string, unknown>), id, updatedAt: new Date().toISOString() },
    id,
  );
  await getAdminFirestore().collection(EVENTS_COLLECTION).doc(id).set(record, { merge: false });
  return record;
}

export async function deleteAdminEvent(id: string) {
  await getAdminFirestore().collection(EVENTS_COLLECTION).doc(id).delete();
}
