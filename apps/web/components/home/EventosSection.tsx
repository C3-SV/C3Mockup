import Link from "next/link";
import { FeaturedGrid } from "@/components/ds/FeaturedGrid";
import { FeaturedRotation } from "@/components/ds/FeaturedRotation";
import type { CatalogCardData } from "@/lib/ds/event-card";

/**
 * Evidencia viva del ecosistema C3. Arriba, el destacado rotativo (eventos destacados y vigentes).
 * Debajo, el catálogo con el resto de eventos, paginado de 6. Ningún evento aparece dos veces.
 */
export function EventosSection({ spotlight = [], cards }: { spotlight?: CatalogCardData[]; cards: CatalogCardData[] }) {
  const showGrid = cards.length > 0 || spotlight.length === 0;

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
        {spotlight.length > 0 ? <FeaturedRotation items={spotlight} /> : null}
        {showGrid ? <FeaturedGrid cards={cards} /> : null}
      </div>
    </section>
  );
}
