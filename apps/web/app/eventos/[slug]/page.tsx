import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { EventDetail } from "@/components/events/EventDetail";
import { getPublicEventBySlug } from "@/lib/event-detail";
import { getEventJsonLd } from "@/lib/event-jsonld";
import { createPageMetadata } from "@/lib/metadata";
import { getEventBreadcrumbJsonLd, getEventWebPageJsonLd } from "@/lib/structured-data";

/**
 * Ficha permanente de una edición (spec 2026-11-13). Las fichas se generan bajo demanda (ISR): con
 * generateStaticParams vacío, `revalidate` surte efecto sin cerrar el catálogo (dynamicParams sigue en true, así que
 * un slug nuevo se resuelve en la primera visita). Sin reserva activa, documento, ficha publicada o dato válido →
 * 404. Un fallo de Firestore no se captura: llega a error.tsx (no es un 404 ni otro evento).
 */
export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

type EventPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  // Título, descripción, canonical y Open Graph propios del evento (no los del layout ni los de la home). Si la
  // edición tiene portada, esa es la imagen social, con su texto alternativo; si no, la institucional. Las medidas
  // solo se declaran si la portada las guarda (H13, auditoría 2026-11-17).
  const cover = event.cover;
  return createPageMetadata({
    title: event.title,
    description: event.description,
    path: `/eventos/${event.page?.slug ?? slug}`,
    image: cover?.url
      ? { url: cover.url, alt: cover.alt || event.title }
      : undefined,
  });
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  // Event solo con datos verificados (fecha, lugar y ficha publicada); sin ellos, solo WebPage y BreadcrumbList.
  const eventJsonLd = getEventJsonLd(event);

  return (
    <PageShell ds>
      <SeoJsonLd data={getEventWebPageJsonLd(event)} />
      <SeoJsonLd data={getEventBreadcrumbJsonLd(event)} />
      {eventJsonLd ? <SeoJsonLd data={eventJsonLd} /> : null}
      <EventDetail event={event} now={new Date()} />
    </PageShell>
  );
}
