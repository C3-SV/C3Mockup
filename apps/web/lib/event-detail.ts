// Solo servidor: la protección viene de "@/lib/events" (import "server-only"), de donde sale el acceso a Firestore.
import { cache } from "react";
import type { EventItem } from "@c3/config";
import { getAdminFirestore } from "@/lib/events";
import { parseEventDocument } from "@/lib/events-parse";

const EVENTS_COLLECTION = "events";
const SLUG_RESERVATIONS_COLLECTION = "eventPageSlugs";

/** Misma forma que el contrato de la spec §4: minúsculas ASCII, números y guiones, 3–120 caracteres. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Evento con ficha publicada para /eventos/{slug}, o null (→ 404) si no existe una reserva activa, el documento,
 * la ficha publicada o un evento base válido.
 *
 * Resuelve por reserva (eventPageSlugs/{slug}) y documento real (events/{eventId}); proyecta con la misma función
 * pública que el catálogo, así que borradores y derechos de la galería nunca salen de aquí. No usa defaultEvents
 * y no captura errores de Firestore: un fallo de infraestructura debe llegar al límite de error del servidor,
 * no disfrazarse de 404 ni de otro evento. La memoria publicada no se vuelve a validar contra el reloj (R13).
 */
async function readPublicEventBySlug(slug: string): Promise<EventItem | null> {
  if (slug.length < 3 || slug.length > 120 || !SLUG_PATTERN.test(slug)) {
    return null;
  }

  const db = getAdminFirestore();

  const reservation = await db.collection(SLUG_RESERVATIONS_COLLECTION).doc(slug).get();
  if (!reservation.exists) {
    return null;
  }
  const reserved = reservation.data();
  if (
    typeof reserved !== "object" ||
    reserved === null ||
    typeof reserved.eventId !== "string" ||
    !reserved.eventId ||
    reserved.retired !== false
  ) {
    return null;
  }

  const snapshot = await db.collection(EVENTS_COLLECTION).doc(reserved.eventId).get();
  if (!snapshot.exists) {
    return null;
  }
  const data = snapshot.data();
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const event = parseEventDocument(snapshot.id, data as Record<string, unknown>);
  // La ficha del documento debe ser la que reservó este slug.
  if (!event?.page || event.page.slug !== slug) {
    return null;
  }

  return event;
}

/** La página y generateMetadata piden lo mismo en una petición: se lee una vez. */
export const getPublicEventBySlug = cache(readPublicEventBySlug);
