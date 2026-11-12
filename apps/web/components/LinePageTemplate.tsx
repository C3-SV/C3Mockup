import Link from "next/link";
import SeoJsonLd from "./SeoJsonLd";
import { FeaturedGrid } from "@/components/ds/FeaturedGrid";
import { HomeOrbit } from "@/components/ds/HomeOrbit";
import { Button } from "@/components/ui/Button";
import { linePageContent, lineVisuals } from "@/lib/content";
import { toCatalogCard } from "@/lib/ds/event-card";
import { lineTheme } from "@/lib/ds/line-theme";
import { getItemListJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import type { EventItem, LineKey } from "@c3/config";

type LinePageTemplateProps = {
  line: LineKey;
  events: EventItem[];
};

/**
 * Página de una línea (DS §9.1). Textos y acciones actuales; el color de la línea llega por variables
 * (lib/ds/line-theme.ts). Eventos: solo los que incluyen su línea.
 */
export default function LinePageTemplate({ line, events }: LinePageTemplateProps) {
  const visual = lineVisuals[line];
  const content = linePageContent[line];
  const relatedEvents = events.filter((event) => event.lines.includes(line));
  const itemList = relatedEvents.length
    ? getItemListJsonLd(
        `/${line}`,
        relatedEvents.map((event) => ({
          name: event.title,
          description: event.description,
          url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
        })),
        `Eventos relacionados con ${visual.name}`,
      )
    : null;

  return (
    <div className="c3-line-page" style={lineTheme(line)}>
      {itemList ? <SeoJsonLd data={itemList} /> : null}

      <section className="c3-line-intro">
        <div className="c3-frame c3-hero__grid">
          <div className="c3-hero__text">
            <h1>
              <span className="c3-line-intro__dot" aria-hidden="true" />
              {content.heroTitle}
            </h1>
            <p className="c3-lead">{content.heroDescription}</p>
            <p>{visual.shortDescription}</p>
            <ul className="c3-home-tags">
              {content.pillars.map((pillar) => (
                <li key={pillar}>{pillar}</li>
              ))}
            </ul>
            <div className="c3-actions">
              <Button href={content.primaryCta.href} variant="primario" arrow={content.primaryCta.external}>
                {content.primaryCta.label}
              </Button>
              <Button href={content.secondaryCta.href} variant="contorno">
                {content.secondaryCta.label}
              </Button>
            </div>
          </div>
          <HomeOrbit />
        </div>
      </section>

      <section className="c3-featured" aria-labelledby="eventos-de-la-linea">
        <div className="c3-frame">
          <div className="c3-section-head">
            <h2 id="eventos-de-la-linea" className="c3-line-events__title">
              Eventos relacionados con {visual.name}
            </h2>
          </div>
          <div className="mt-6">
            <FeaturedGrid
              cards={relatedEvents.map((event) => toCatalogCard(event))}
              emptyMessage={`Todavía no hay eventos de ${visual.name}.`}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/eventos" className="c3-home-link">
              Ver todos los eventos
            </Link>
            <Link href="/faq" className="c3-home-link">
              Revisar FAQ
            </Link>
            <Link href="/contacto" className="c3-home-link">
              Contactar a C3
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
