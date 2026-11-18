import { readCivilDay, type EventAgendaStatus, type EventItem, type PublicEventPage } from "@c3/config";
import { absoluteUrl } from "@/lib/metadata";

/**
 * JSON-LD `Event` de la ficha de una edición (auditoría 2026-11-17, H7). Solo se emite con datos verificados: nombre,
 * fecha de inicio válida, un lugar real (presencial con dirección y nombre de sede, o virtual con enlace https) y la
 * ficha publicada. Nada se inventa: sin hora de inicio la fecha va sola; sin lugar verificable no hay Event.
 *
 * Las horas son de El Salvador (UTC−6 fijo, sin horario de verano), así que llevan el desfase -06:00.
 */

const EL_SALVADOR_OFFSET = "-06:00";
const SCHEMA = "https://schema.org/";

const EVENT_STATUS: Record<EventAgendaStatus, string> = {
  programado: `${SCHEMA}EventScheduled`,
  cancelado: `${SCHEMA}EventCancelled`,
  pospuesto: `${SCHEMA}EventPostponed`,
  reprogramado: `${SCHEMA}EventRescheduled`,
};

const ATTENDANCE_MODE: Record<NonNullable<PublicEventPage["modality"]>, string> = {
  presencial: `${SCHEMA}OfflineEventAttendanceMode`,
  virtual: `${SCHEMA}OnlineEventAttendanceMode`,
  hibrida: `${SCHEMA}MixedEventAttendanceMode`,
};

function isoDateTime(day: string, time: string | undefined): string {
  return time ? `${day}T${time}:00${EL_SALVADOR_OFFSET}` : day;
}

/** Código de país para el JSON-LD: El Salvador → SV; un código de dos letras se pasa en mayúsculas; otro texto tal cual. */
function countryCode(country: string | undefined): string {
  const text = (country ?? "El Salvador").trim();
  if (/^el salvador$/i.test(text)) {
    return "SV";
  }
  return /^[A-Za-z]{2}$/.test(text) ? text.toUpperCase() : text;
}

/** Lugar presencial verificable: nombre de la sede y dirección con calle y localidad. */
function placeFor(page: PublicEventPage): Record<string, unknown> | undefined {
  const address = page.address;
  const name = address?.venue ?? page.location;
  if (!address || !name) {
    return undefined;
  }
  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      ...(address.region ? { addressRegion: address.region } : {}),
      addressCountry: countryCode(address.country),
    },
  };
}

/** Enlace de participación verificable: el de la ficha, o el propio evento si es un enlace externo https. */
function virtualFor(page: PublicEventPage, event: EventItem): Record<string, unknown> | undefined {
  const url = page.participation?.url ?? (event.external && /^https:\/\//.test(event.href) ? event.href : undefined);
  return url ? { "@type": "VirtualLocation", url } : undefined;
}

function locationFor(page: PublicEventPage, event: EventItem): Record<string, unknown> | Record<string, unknown>[] | undefined {
  const physical = placeFor(page);
  const virtual = virtualFor(page, event);
  switch (page.modality) {
    case "presencial":
      return physical;
    case "virtual":
      return virtual;
    case "hibrida":
      return physical && virtual ? [physical, virtual] : (physical ?? virtual);
    default:
      return physical;
  }
}

export function getEventJsonLd(event: EventItem): Record<string, unknown> | null {
  const page = event.page;
  if (!page || page.publication !== "published") {
    return null;
  }

  const start = readCivilDay(event.eventDate);
  if (!start) {
    return null;
  }
  const end = readCivilDay(event.eventDateEnd);
  const location = locationFor(page, event);
  if (!location) {
    return null;
  }

  const status = page.agendaStatus ?? "programado";
  const url = absoluteUrl(`/eventos/${page.slug}`);

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    url,
    startDate: isoDateTime(start, page.schedule?.startTime),
    eventStatus: EVENT_STATUS[status],
    location,
  };

  if (end && end >= start) {
    json.endDate = isoDateTime(end, page.schedule?.endTime);
  }
  if (page.modality) {
    // El modo sale de los lugares que realmente se emiten: una híbrida con un solo lugar no declara modo mixto.
    const emitted = Array.isArray(location) ? location : [location];
    const hasPlace = emitted.some((item) => item["@type"] === "Place");
    const hasVirtual = emitted.some((item) => item["@type"] === "VirtualLocation");
    json.eventAttendanceMode =
      hasPlace && hasVirtual ? ATTENDANCE_MODE.hibrida : hasVirtual ? ATTENDANCE_MODE.virtual : ATTENDANCE_MODE.presencial;
  }
  if (event.cover?.url) {
    json.image = [event.cover.url];
  }
  if (page.organizer) {
    json.organizer = {
      "@type": "Organization",
      name: page.organizer.name,
      ...(page.organizer.url ? { url: page.organizer.url } : {}),
    };
  }
  if (page.speakers?.length) {
    json.performer = page.speakers.map((name) => ({ "@type": "Person", name }));
  }
  if (page.offer) {
    json.offers = {
      "@type": "Offer",
      price: page.offer.price,
      priceCurrency: page.offer.currency,
      url: page.offer.url ?? url,
      ...(page.registrationOpensOn ? { validFrom: page.registrationOpensOn } : {}),
    };
  }
  return json;
}
