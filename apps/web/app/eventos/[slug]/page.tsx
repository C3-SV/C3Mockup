import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { EventDetail } from "@/components/events/EventDetail";
import { getPublicEventBySlug } from "@/lib/event-detail";
import { createPageMetadata } from "@/lib/metadata";

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

  // Título, descripción, canonical y Open Graph propios del evento (no los del layout ni los de la home), con la
  // imagen institucional por defecto. Sitemap y JSON-LD son de la tarea T5.
  return createPageMetadata({
    title: event.title,
    description: event.description,
    path: `/eventos/${event.page?.slug ?? slug}`,
  });
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  return (
    <PageShell ds>
      <EventDetail event={event} now={new Date()} />
    </PageShell>
  );
}
