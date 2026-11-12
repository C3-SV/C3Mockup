import Image from "next/image";
import Link from "next/link";
import { lineVisuals } from "@/lib/content";
import type { CatalogCardData } from "@/lib/ds/event-card";
import { StatePill } from "@/components/ui/StatePill";
import { KindIcon } from "@/components/ds/KindIcon";

/**
 * Tarjeta de experiencia (DS §7.9). Muestra solo el contenido del evento: línea, estado, título,
 * resumen, fecha y la acción con su texto original. Sin etiqueta DEMO.
 */
export function CatalogCard({ card }: { card: CatalogCardData }) {
  const action = (
    <>
      {card.action} <span aria-hidden="true">↗</span>
    </>
  );

  return (
    <article className={`c3-exp c3-exp--${card.line}`}>
      <div className="c3-exp__media">
        {card.cover ? (
          <Image
            src={card.cover.url}
            alt={card.cover.alt}
            fill
            sizes="(min-width: 900px) 33vw, 100vw"
            unoptimized
            className="c3-exp__cover"
          />
        ) : (
          <KindIcon kind={card.kind} className="c3-exp__icon" />
        )}
      </div>

      <div className="c3-exp__body">
        <div className="c3-exp__meta">
          <span className="c3-exp__lines">
            {[card.line, ...card.otherLines].map((line) => (
              <span key={line} className="c3-exp__line">
                <span className={`c3-dot c3-dot--${line}`} aria-hidden="true" />
                {lineVisuals[line].name}
              </span>
            ))}
          </span>
          <StatePill label={card.state.label} tone={card.state.tone} />
        </div>

        <h3>{card.title}</h3>
        <p className="c3-exp__summary">{card.summary}</p>

        {card.detail ? (
          <p className="c3-exp__detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false">
              <path d="M7 3v3 M17 3v3 M4 9h16 M5 5h14v15H5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {card.detail}
          </p>
        ) : null}

        <div className="c3-exp__footer">
          <span />
          {card.external ? (
            <a className="c3-exp__go" href={card.href} target="_blank" rel="noopener noreferrer">
              {action}
            </a>
          ) : (
            <Link className="c3-exp__go" href={card.href}>
              {action}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
