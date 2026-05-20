import type { Metadata } from "next";
import { events } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/site/Container";
import { EventCard } from "@/components/site/EventCard";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";

export const metadata: Metadata = createPageMetadata({
  title: "Eventos C3",
  description:
    "Listado de iniciativas y eventos confirmados de C3, incluyendo Copa, ICPC, hackathons apoyados y actividades históricas.",
  path: "/eventos",
});

export default function EventsPage() {
  const active = events.filter((event) => event.status === "Activo / público");
  const institutional = events.filter((event) => event.status === "Apoyo institucional");
  const historical = events.filter((event) => event.status === "Histórico / apoyado");

  return (
    <>
      <PageHero
        eyebrow="Eventos"
        title="Una sola página para próximos, activos e históricos."
        description="Eventos C3 centraliza iniciativas propias, apoyadas e institucionales para que la organización no se perciba como un único proyecto aislado."
      />

      <SectionWrapper>
        <Container className="space-y-10">
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Activos y públicos</h2>
            <div className="grid gap-5 xl:grid-cols-2">
              {active.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Apoyo institucional</h2>
            <div className="grid gap-5 xl:grid-cols-2">
              {institutional.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Históricos y apoyados</h2>
            <div className="grid gap-5 xl:grid-cols-2">
              {historical.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>
        </Container>
      </SectionWrapper>
    </>
  );
}
