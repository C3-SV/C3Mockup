import Image from "next/image";
import Link from "next/link";
import SeoJsonLd from "./SeoJsonLd";
import { FeaturedGrid } from "@/components/ds/FeaturedGrid";
import { Button } from "@/components/ui/Button";
import { linePageContent, lineVisuals } from "@/lib/content";
import { toCatalogCard } from "@/lib/ds/event-card";
import { lineTheme } from "@/lib/ds/line-theme";
import { getEventItemListEntry, getItemListJsonLd } from "@/lib/structured-data";
import type { EventItem, LineKey } from "@c3/config";

type LinePageTemplateProps = {
  line: LineKey;
  events: EventItem[];
};

/**
 * Página de una línea (DS §9.1). Cabecera sobre el tinte de la página, con la órbita del DS y el logo de la línea
 * dentro; debajo, los eventos de la línea. Textos y acciones actuales; el color llega por variables
 * (lib/ds/line-theme.ts). Titulares, metadata y JSON-LD no cambian; se quitaron la descripción corta, las etiquetas
 * y el símbolo de C3.
 */
export default function LinePageTemplate({ line, events }: LinePageTemplateProps) {
  const visual = lineVisuals[line];
  const content = linePageContent[line];
  const relatedEvents = events.filter((event) => event.lines.includes(line));
  const itemList = relatedEvents.length
    ? getItemListJsonLd(
        `/${line}`,
        relatedEvents.map(getEventItemListEntry),
        `Eventos relacionados con ${visual.name}`,
      )
    : null;

  return (
    <div className="c3-line-page" style={lineTheme(line)}>
      {itemList ? <SeoJsonLd data={itemList} /> : null}

      <section className="c3-line-intro c3-line-hero">
        <div className="c3-frame c3-line-hero__grid">
          <div className="c3-line-hero__text">
            <h1>{content.heroTitle}</h1>
            <p className="c3-lead">{content.heroDescription}</p>
            <div className="c3-actions">
              <Button href={content.primaryCta.href} variant="primario" arrow={content.primaryCta.external}>
                {content.primaryCta.label}
              </Button>
              <Button href={content.secondaryCta.href} variant="contorno">
                {content.secondaryCta.label}
              </Button>
            </div>
          </div>
          <div className="c3-orbit-visual">
            <div className="c3-orbit">
              <span className="c3-orbit__ring c3-orbit__ring--outer" aria-hidden="true" />
              <span className="c3-orbit__ring c3-orbit__ring--inner" aria-hidden="true" />
              <span className="c3-orbit__spin c3-orbit__spin--outer" aria-hidden="true">
                <span className="c3-orbit__satellite" />
                <span className="c3-orbit__satellite c3-orbit__satellite--bottom c3-orbit__satellite--compite" />
              </span>
              <span className="c3-orbit__spin c3-orbit__spin--inner" aria-hidden="true">
                <span className="c3-orbit__satellite c3-orbit__satellite--bottom c3-orbit__satellite--crea" />
              </span>
              <div className="c3-orbit__mark">
                <Image
                  className="c3-line-mark"
                  src={visual.logo.src}
                  alt={`Logo de ${visual.name}`}
                  width={visual.logo.width}
                  height={visual.logo.height}
                  priority
                  sizes="(min-width: 900px) 176px, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c3-featured c3-line-events" aria-labelledby="eventos-de-la-linea">
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
