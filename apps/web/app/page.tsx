import type { Metadata } from "next";
import { AudienceSection } from "@/components/home/AudienceSection";
import { ClosingPanel } from "@/components/home/ClosingPanel";
import { DatosSection } from "@/components/home/DatosSection";
import { EventosSection } from "@/components/home/EventosSection";
import { Hero } from "@/components/home/Hero";
import { LinesSection } from "@/components/home/LinesSection";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getPublicEvents } from "@/lib/events";
import { toCatalogCard } from "@/lib/ds/event-card";
import { splitForHome } from "@/lib/ds/featured-rotation";
import { createPageMetadata } from "@/lib/metadata";
import { getEventItemListEntry, getItemListJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = siteConfig.homepageTitle;
const seoDescription = siteConfig.description;

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.homepageTitle,
  description: siteConfig.description,
  path: "/",
  keywords: siteConfig.keywords,
});

export default async function Home() {
  const events = await getPublicEvents();
  const now = new Date();
  const { rotation, rest } = splitForHome(events, now);
  const itemList = getItemListJsonLd(
    "/",
    events.map(getEventItemListEntry),
    "Eventos destacados C3",
  );

  return (
    <PageShell ds>
      <SeoJsonLd data={getWebPageJsonLd({ path: "/", title: seoTitle, description: seoDescription })} />
      <SeoJsonLd data={itemList} />
      <Hero />
      <EventosSection
        spotlight={rotation.map((event) => toCatalogCard(event, now))}
        cards={rest.map((event) => toCatalogCard(event, now))}
      />
      <DatosSection />
      <LinesSection />
      <AudienceSection />
      <ClosingPanel />
    </PageShell>
  );
}
