import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StatePill } from "@/components/ui/StatePill";
import { lineVisuals } from "@/lib/content";
import { isUpcomingEvent, pillStatusFor, toPillState } from "@/lib/ds/event-state";
import type { EventItem } from "@c3/config";

/** Tarjetas como mucho: la rejilla del home tiene dos columnas. */
const MAX_CARDS = 2;

/**
 * Próximas iniciativas: eventos con fecha por venir que no están ya en el destacado rotativo. Los eventos
 * terminados no aparecen aquí, ni como destacados. El encabezado siempre se muestra; si no hay tarjetas, el
 * texto dice dónde están las iniciativas con fecha (el destacado) o que por ahora no hay ninguna.
 */
export function IniciativasSection({
  events,
  now = new Date(),
  spotlightCount = 0,
}: {
  events: EventItem[];
  now?: Date;
  spotlightCount?: number;
}) {
  const items = events.filter((event) => isUpcomingEvent(event, now)).slice(0, MAX_CARDS);

  const lead =
    items.length > 0
      ? "Iniciativas de C3 con fecha por venir."
      : spotlightCount > 0
        ? "Las iniciativas con fecha por venir se destacan más abajo, en Evidencia viva."
        : "Por ahora no hay iniciativas próximas.";

  return (
    <section className="c3-featured" aria-labelledby="proximas-iniciativas">
      <div className="c3-frame">
        <div className="c3-section-head">
          <h2 id="proximas-iniciativas">Próximas iniciativas</h2>
          <p className="c3-lead">{lead}</p>
        </div>
        {items.length > 0 ? (
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
        ) : null}
      </div>
    </section>
  );
}
