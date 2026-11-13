import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { EventDetail } from "@/components/events/EventDetail";
import { getPublicEventBySlug } from "@/lib/event-detail";

/**
 * Ficha permanente de una edición (spec 2026-11-13). Se renderiza bajo demanda, sin generateStaticParams: el
 * catálogo no es un conjunto cerrado. Sin reserva activa, documento, ficha publicada o dato válido → 404. Un fallo
 * de Firestore no se captura: llega al límite de error del servidor (no es un 404 ni otro evento).
 */
export const revalidate = 60;

type EventPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  // Solo el título real. Canonical, Open Graph y sitemap son de la tarea T5.
  return { title: event.title };
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
