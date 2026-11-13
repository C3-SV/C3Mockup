// Solo servidor: la protección viene de "@/lib/events" (import "server-only"), de donde sale el acceso a Firestore.
import { cache } from "react";
import type { Firestore } from "firebase-admin/firestore";
import type { EventItem } from "@c3/config";
import { getAdminFirestore } from "@/lib/events";
import { parseEventDocument } from "@/lib/events-parse";

const EVENTS_COLLECTION = "events";
const SLUG_RESERVATIONS_COLLECTION = "eventPageSlugs";

/** Misma forma que el contrato de la spec §4: minúsculas ASCII, números y guiones, 3–120 caracteres. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Id del evento al que pertenece el slug según su reserva, o null si no hay reserva activa (inexistente, retirada
 * o con datos inválidos). La reserva es lo que hace pública una ficha (spec §4).
 */
async function readActiveReservation(db: Firestore, slug: string): Promise<string | null> {
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
  return reserved.eventId;
}

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

  const eventId = await readActiveReservation(db, slug);
  if (!eventId) {
    return null;
  }

  const snapshot = await db.collection(EVENTS_COLLECTION).doc(eventId).get();
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

/**
 * Todos los eventos con ficha publicada, para el sitemap. Misma regla que el detalle: documento real de
 * Firestore, proyección pública (sin borradores) y reserva activa a nombre de ese documento. Una ficha publicada
 * sin reserva (huérfana), con reserva retirada o de otro evento no se lista. Sin respaldo a defaultEvents y sin
 * capturar errores: quien llama decide qué hacer si Firestore falla.
 */
export async function getPublishedEventPages(): Promise<EventItem[]> {
  const db = getAdminFirestore();
  const snapshot = await db.collection(EVENTS_COLLECTION).get();

  const candidates = snapshot.docs
    .map((doc) => ({ docId: doc.id, event: parseEventDocument(doc.id, doc.data() as Record<string, unknown>) }))
    .filter((entry): entry is { docId: string; event: EventItem } => Boolean(entry.event?.page));

  const checked = await Promise.all(
    candidates.map(async ({ docId, event }) => {
      const slug = event.page?.slug ?? "";
      if (!SLUG_PATTERN.test(slug) || slug.length < 3 || slug.length > 120) {
        return null;
      }
      return (await readActiveReservation(db, slug)) === docId ? event : null;
    }),
  );

  return checked.filter((event): event is EventItem => event !== null);
}
