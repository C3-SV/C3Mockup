import type { Metadata } from "next";
import EventsCatalog from "@/components/EventsCatalog";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getPublicEvents } from "@/lib/events";
import { createPageMetadata } from "@/lib/metadata";
import {
  getBreadcrumbJsonLd,
  getCollectionPageJsonLd,
  getEventItemListEntry,
  getItemListJsonLd,
} from "@/lib/structured-data";

const seoTitle = "Eventos C3 | Competencias, hackathons y comunidad técnica";
const seoDescription =
  "Explora eventos e iniciativas de C3 relacionados con programación competitiva, hackathons, comunidad, formación y conexión con oportunidades reales.";

export const revalidate = 60;

const baseMetadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/eventos",
  keywords: ["eventos tecnología El Salvador", "competencias programación", "hackathons El Salvador", "eventos C3"],
});

export async function generateMetadata(): Promise<Metadata> {
  const events = await getPublicEvents();
  const keywords = [...(baseMetadata.keywords ?? []), ...events.slice(0, 5).map((event) => event.title)];

  return {
    ...baseMetadata,
    keywords: [...new Set(keywords)],
  };
}

export default async function EventosPage() {
  const events = await getPublicEvents();
  const itemList = getItemListJsonLd(
    "/eventos",
    events.map(getEventItemListEntry),
    "Catálogo de eventos C3",
  );

  return (
    <PageShell ds>
      <SeoJsonLd data={getCollectionPageJsonLd("/eventos", seoTitle, seoDescription)} />
      <SeoJsonLd data={itemList} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/eventos")} />

      <div className="c3-frame">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>Iniciativas que activan el ecosistema técnico joven</h1>
            <p>Participa en competencias, hackathons y colaboraciones institucionales.</p>
          </div>
        </div>
      </div>

      <section className="c3-featured">
        <div className="c3-frame">
          <EventsCatalog initialEvents={events} />
        </div>
      </section>
    </PageShell>
  );
}
