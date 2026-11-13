import "server-only";

import { cert, getApp, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import {
  compareEventsBySchedule,
  defaultEvents,
  normalizeFirebasePrivateKey,
  type AdminEventRecord,
} from "@c3/config";
import {
  ApiError,
  createEventFromPayload,
  deleteEventWithPage,
  getStoredAdminEvent,
  listStoredAdminEvents,
  parseStoredAdminEvent,
  toErrorBody,
  updateEventFromPayload,
  upsertEventsWithPages,
} from "./event-page-repository";

/**
 * HttpError es el mismo ApiError del repositorio: las rutas distinguen 400/401/403/409 con un solo instanceof y el
 * cuerpo de error (toErrorBody) conserva los errores por campo de la ficha.
 */
export { ApiError, ApiError as HttpError, toErrorBody };

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
    privateKey: normalizeFirebasePrivateKey(privateKey),
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

function getAdminApp(): App {
  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new ApiError(500, "Firebase service account is not configured.");
  }

  if (getApps().length) {
    return getApp();
  }

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

let firestore: Firestore | null = null;

export function getAdminFirestore() {
  if (firestore) {
    return firestore;
  }

  firestore = getFirestore(getAdminApp());
  return firestore;
}

export async function verifyAdminRequest(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

  if (!token) {
    throw new ApiError(401, "Missing authorization token.");
  }

  const decoded = await getAuth(getAdminApp()).verifyIdToken(token);

  if (!decoded.email) {
    throw new ApiError(403, "Google account email is required.");
  }

  if (!isAllowedAdminEmail(decoded.email)) {
    throw new ApiError(403, "This account is not allowed to access the admin.");
  }

  return decoded;
}

export type { AdminEventRecord };

/**
 * Lectura tolerante de un documento (ver parseStoredAdminEvent): la ficha se lee sin reloj, así un evento nunca
 * desaparece del admin porque su ficha dejó de validar con la fecha actual. Validar es cosa del guardado.
 */
export function parseAdminEventDoc(id: string, data: Record<string, unknown>): AdminEventRecord | null {
  return parseStoredAdminEvent(id, data);
}

/** Eventos incluidos en el código como registros administrativos. No tienen ficha (page): el admin la crea después. */
function bundledAdminEvents(now: string): AdminEventRecord[] {
  return defaultEvents
    .map((event) => ({ ...event, page: undefined, createdAt: now, updatedAt: now }))
    .sort(compareEventsBySchedule);
}

export async function listAdminEvents() {
  try {
    const { empty, events } = await listStoredAdminEvents(getAdminFirestore());
    return empty ? bundledAdminEvents(new Date().toISOString()) : events;
  } catch (error) {
    console.warn("Falling back to bundled events data in admin:", error);
    return bundledAdminEvents(new Date().toISOString());
  }
}

/**
 * Escrituras: todas pasan por el repositorio (event-page-repository.ts), que guarda evento y reserva de slug en una
 * transacción. No hay otra ruta de escritura de events/{id}.
 */
export async function createAdminEvent(input: unknown) {
  return createEventFromPayload(getAdminFirestore(), input);
}

export async function getAdminEvent(id: string) {
  return getStoredAdminEvent(getAdminFirestore(), id);
}

export async function updateAdminEvent(id: string, input: unknown) {
  return updateEventFromPayload(getAdminFirestore(), id, input);
}

export async function deleteAdminEvent(id: string) {
  await deleteEventWithPage(getAdminFirestore(), id);
}

export async function upsertAdminEvents(events: AdminEventRecord[]) {
  return upsertEventsWithPages(getAdminFirestore(), events);
}
