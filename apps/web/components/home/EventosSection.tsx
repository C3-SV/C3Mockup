import Link from "next/link";
import { FeaturedGrid } from "@/components/ds/FeaturedGrid";
import type { CatalogCardData } from "@/lib/ds/event-card";

/** Evidencia viva del ecosistema C3 (antes ProjectsSection). Eventos reales del catálogo, paginados de 6. */
export function EventosSection({ cards }: { cards: CatalogCardData[] }) {
  return (
    <section className="c3-featured" id="eventos" aria-labelledby="evidencia-viva">
      <div className="c3-frame">
        <div className="c3-featured__head">
          <div className="c3-section-head">
            <h2 id="evidencia-viva">Evidencia viva del ecosistema C3</h2>
            <p className="c3-lead">
              Eventos, competencias, hackathons y colaboraciones institucionales que conectan talento técnico joven con
              aprendizaje y oportunidades reales.
            </p>
          </div>
          <Link href="/eventos" className="c3-featured__all">
            Ver hub completo de eventos <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <FeaturedGrid cards={cards} />
      </div>
    </section>
  );
}
