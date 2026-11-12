import type { Metadata } from "next";
import { AudienceSection } from "@/components/home/AudienceSection";
import { ClosingPanel } from "@/components/home/ClosingPanel";
import { DatosSection } from "@/components/home/DatosSection";
import { EventosSection } from "@/components/home/EventosSection";
import { Hero } from "@/components/home/Hero";
import { IniciativasSection } from "@/components/home/IniciativasSection";
import { LinesSection } from "@/components/home/LinesSection";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getPublicEvents } from "@/lib/events";
import { toCatalogCard } from "@/lib/ds/event-card";
import { createPageMetadata } from "@/lib/metadata";
import { getItemListJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
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
  const itemList = getItemListJsonLd(
    "/",
    events.map((event) => ({
      name: event.title,
      description: event.description,
      url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
    })),
    "Eventos destacados C3",
  );

  return (
    <PageShell ds>
      <SeoJsonLd data={getWebPageJsonLd({ path: "/", title: seoTitle, description: seoDescription })} />
      <SeoJsonLd data={itemList} />
      <Hero />
      <IniciativasSection />
      <DatosSection />
      <LinesSection />
      <EventosSection cards={events.map((event) => toCatalogCard(event))} />
      <AudienceSection />
      <ClosingPanel />
    </PageShell>
  );
}
