import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StatePill } from "@/components/ui/StatePill";
import { lineVisuals } from "@/lib/content";
import { isUpcomingEvent, pillStatusFor, toPillState } from "@/lib/ds/event-state";
import type { EventItem } from "@c3/config";

/** Tarjetas como mucho: la rejilla del home tiene dos columnas. */
const MAX_CARDS = 2;

/**
 * Próximas iniciativas. Muestra los eventos próximos del catálogo, con su propio estado. Si no hay ninguno,
 * muestra los destacados, con la pastilla que corresponde a su fecha. Si tampoco hay destacados, no muestra la
 * sección (la evidencia viva del ecosistema sigue debajo).
 */
export function IniciativasSection({ events, now = new Date() }: { events: EventItem[]; now?: Date }) {
  const upcoming = events.filter((event) => isUpcomingEvent(event, now));
  const showingFeatured = upcoming.length === 0;
  const items = (showingFeatured ? events.filter((event) => event.featured) : upcoming).slice(0, MAX_CARDS);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="c3-featured" aria-labelledby="proximas-iniciativas">
      <div className="c3-frame">
        <div className="c3-section-head">
          <h2 id="proximas-iniciativas">Próximas iniciativas</h2>
          <p className="c3-lead">
            {showingFeatured
              ? "Por ahora no hay iniciativas próximas. Estos son eventos destacados de C3."
              : "Iniciativas de C3 con fecha por venir."}
          </p>
        </div>
        <div className="c3-home-grid c3-home-grid--2">
          {items.map((event) => {
            const line = event.lines[0];
            const visual = lineVisuals[line];
            const state = toPillState(pillStatusFor(event, now));
            return (
              <article key={event.id} className="c3-home-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="c3-exp__line">
                    <span className={`c3-dot c3-dot--${line}`} aria-hidden="true" />
                    {visual.name}
                  </div>
                  <Image
                    src={visual.logo.src}
                    alt={`Identidad visual de la línea ${visual.name}`}
                    width={visual.logo.width}
                    height={visual.logo.height}
                    className="h-14 w-auto"
                  />
                </div>
                <div>
                  <StatePill label={state.label} tone={state.tone} />
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>
                  <Button href={event.href} variant="primario">
                    {event.cta}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
