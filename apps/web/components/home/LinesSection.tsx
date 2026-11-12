import Link from "next/link";
import { homeLines } from "@/lib/content";

/** Un ecosistema integrado (antes ActionLinesSection). Textos y viñetas actuales de cada línea. */
export function LinesSection() {
  return (
    <section className="c3-featured" aria-labelledby="ecosistema-integrado">
      <div className="c3-frame">
        <div className="c3-section-head c3-section-head--ancho">
          <h2 id="ecosistema-integrado">Un ecosistema integrado</h2>
          <p className="c3-lead">
            C3 no solo organiza eventos. Construimos un sistema donde el talento técnico joven puede crecer de forma
            progresiva.
          </p>
        </div>
        <div className="c3-home-grid c3-home-grid--3">
          {homeLines.map((line) => (
            <article key={line.key} className="c3-home-card">
              <span className={`c3-dot c3-dot--${line.key}`} aria-hidden="true" />
              <h3>{line.title}</h3>
              <p>{line.description}</p>
              <ul className="c3-home-list">
                {line.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link href={line.href} className="c3-home-link">
                Ir a la línea <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
