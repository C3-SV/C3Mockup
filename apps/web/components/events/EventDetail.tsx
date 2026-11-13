import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  formatEventSchedule,
  getEventPagePhase,
  type EventItem,
  type EventModality,
  type PublicEventMemory,
  type PublicEventPage,
} from "@c3/config";
import { Button } from "@/components/ui/Button";
import { StatePill } from "@/components/ui/StatePill";
import { lineVisuals } from "@/lib/content";
import { pillStatusFor, toPillState } from "@/lib/ds/event-state";

/**
 * Ficha pública de una edición (spec 2026-11-13, §6–§7). Recibe solo la proyección pública: nada de borradores ni
 * de datos de derechos. Todo el contenido es texto plano que React escapa; no hay HTML libre. Una sección sin
 * contenido no se pinta (ni su encabezado). Un solo h1; la memoria y los resultados cuelgan de su propio h2.
 */

const MODALITY_LABEL: Record<EventModality, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

/** Enlace de texto: ruta local con Link; https externo en pestaña nueva con rel seguro. */
function TextLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link className="c3-event__link" href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className="c3-event__link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </>
  );
}

function Memory({ memory }: { memory: PublicEventMemory }) {
  const { summary, learnings, results, outputs, gallery } = memory;

  return (
    <section className="c3-event__section" aria-labelledby="evento-memoria">
      <h2 id="evento-memoria">Memoria de la edición</h2>
      <div className="c3-event__prose">
        <Paragraphs items={summary} />
      </div>

      {results.length ? (
        <div className="c3-event__block">
          <h3>Resultados</h3>
          <ul className="c3-event__results">
            {results.map((result, index) => (
              <li key={index} className="c3-event__result">
                <p className="c3-event__result-value">{result.value}</p>
                <p className="c3-event__result-label">{result.label}</p>
                <p className="c3-event__result-context">{result.context}</p>
                {result.evidenceUrl ? (
                  <TextLink href={result.evidenceUrl}>
                    Ver evidencia<span className="sr-only"> de {result.label}</span>
                  </TextLink>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {learnings.length ? (
        <div className="c3-event__block">
          <h3>Aprendizajes</h3>
          <ul className="c3-event__list">
            {learnings.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {outputs.length ? (
        <div className="c3-event__block">
          <h3>Proyectos y entregables</h3>
          <ul className="c3-event__outputs">
            {outputs.map((output, index) => (
              <li key={index} className="c3-event__output">
                <h4>{output.url ? <TextLink href={output.url}>{output.title}</TextLink> : output.title}</h4>
                <p>{output.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {gallery.length ? (
        <div className="c3-event__block">
          <h3>Galería</h3>
          <ul className="c3-event__gallery">
            {gallery.map((image, index) => (
              <li key={`${index}-${image.url}`}>
                <figure>
                  <div className="c3-event__media c3-event__media--gallery">
                    <Image src={image.url} alt={image.alt} fill sizes="(min-width: 900px) 33vw, 100vw" unoptimized />
                  </div>
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function PracticalInfo({ page }: { page: PublicEventPage }) {
  const facts: Array<{ term: string; value: string }> = [];
  if (page.modality) {
    facts.push({ term: "Modalidad", value: MODALITY_LABEL[page.modality] });
  }
  if (page.location) {
    facts.push({ term: "Lugar", value: page.location });
  }
  if (page.audience) {
    facts.push({ term: "Dirigido a", value: page.audience });
  }
  const requirements = page.requirements ?? [];

  if (!facts.length && !requirements.length) {
    return null;
  }

  return (
    <section className="c3-event__section" aria-labelledby="evento-practica">
      <h2 id="evento-practica">Información práctica</h2>
      {facts.length ? (
        <dl className="c3-event__facts">
          {facts.map((fact) => (
            <div key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {requirements.length ? (
        <div className="c3-event__block">
          <h3>Requisitos</h3>
          <ul className="c3-event__list">
            {requirements.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function EventDetail({ event, now }: { event: EventItem; now: Date }) {
  const page = event.page;
  if (!page) {
    throw new Error(`El evento ${event.id} no tiene una ficha publicada.`);
  }

  const primaryLine = event.lines[0];
  const schedule = formatEventSchedule(event);
  const state = toPillState(pillStatusFor(event, now));

  // Participar solo con inscripciones abiertas y una edición que sabemos que no terminó (spec §6; R20).
  const phase = getEventPagePhase(event, now);
  const canParticipate =
    Boolean(page.participation) && event.status === "Inscripciones abiertas" && (phase === "upcoming" || phase === "ongoing");

  const ownHref = `/eventos/${page.slug}`;
  const showSiteLink = Boolean(event.href) && event.href !== ownHref;

  return (
    <div className={`c3-event${primaryLine ? ` c3-event--${primaryLine}` : ""}`}>
      <div className="c3-frame">
        <nav className="c3-event__crumbs" aria-label="Ruta de navegación">
          <ol>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/eventos">Eventos</Link>
            </li>
            <li>
              <span aria-current="page">{event.title}</span>
            </li>
          </ol>
        </nav>

        <header className="c3-event__head">
          <div className="c3-event__meta">
            <span className="c3-exp__lines">
              {event.lines.map((line) => (
                <span key={line} className="c3-exp__line">
                  <span className={`c3-dot c3-dot--${line}`} aria-hidden="true" />
                  {lineVisuals[line].name}
                </span>
              ))}
            </span>
            <StatePill label={state.label} tone={state.tone} />
          </div>
          <h1>{event.title}</h1>
          <p className="c3-event__lead">{event.description}</p>
          {schedule ? (
            <p className="c3-event__date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false">
                <path d="M7 3v3 M17 3v3 M4 9h16 M5 5h14v15H5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span className="sr-only">Fecha: </span>
                {schedule}
              </span>
            </p>
          ) : null}
        </header>

        {event.cover ? (
          <figure className="c3-event__cover">
            <div className="c3-event__media">
              <Image src={event.cover.url} alt={event.cover.alt} fill sizes="(min-width: 1180px) 1100px, 100vw" unoptimized priority />
            </div>
          </figure>
        ) : null}
      </div>

      <div className="c3-frame c3-event__body">
        <section className="c3-event__section" aria-labelledby="evento-acerca">
          <h2 id="evento-acerca">Acerca de este evento</h2>
          <div className="c3-event__prose">
            <Paragraphs items={page.overview} />
          </div>
        </section>

        <PracticalInfo page={page} />

        {canParticipate && page.participation ? (
          <section className="c3-event__section" aria-labelledby="evento-participa">
            <h2 id="evento-participa">Participa</h2>
            <div className="c3-event__actions">
              <Button variant="primario" href={page.participation.url} arrow>
                {page.participation.label}
              </Button>
            </div>
          </section>
        ) : null}

        {page.memory ? <Memory memory={page.memory} /> : null}

        {page.resources.length ? (
          <section className="c3-event__section" aria-labelledby="evento-materiales">
            <h2 id="evento-materiales">Materiales</h2>
            <ul className="c3-event__list c3-event__list--links">
              {page.resources.map((resource) => (
                <li key={resource.url}>
                  <TextLink href={resource.url}>{resource.title}</TextLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {showSiteLink ? (
          <section className="c3-event__section" aria-labelledby="evento-sitio">
            <h2 id="evento-sitio">Sitio del evento</h2>
            <div className="c3-event__actions">
              <Button variant="contorno" href={event.href} arrow>
                {event.cta}
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
