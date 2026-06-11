import type { Metadata } from "next";
import ActionLinesSection from "@/components/ActionLinesSection";
import AudienceSection from "@/components/AudienceSection";
import C3SectionTransition from "@/components/C3SectionTransition";
import CommunityActionSection from "@/components/CommunityActionSection";
import EventsSection from "@/components/EventsSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Navbar from "@/components/Navbar";
import SeoJsonLd from "@/components/SeoJsonLd";
import SiteFooter from "@/components/SiteFooter";
import { getPublicEvents } from "@/lib/events";
import { createPageMetadata } from "@/lib/metadata";
import { getWebPageJsonLd } from "@/lib/structured-data";
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

  return (
    <div className="min-h-screen bg-[#0F203E]">
      <Navbar showScrollProgress />
      <main>
        <SeoJsonLd data={getWebPageJsonLd({ path: "/", title: seoTitle, description: seoDescription })} />
        <Hero />
        <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />
        <MissionVisionSection events={events} />
        <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />
        <ActionLinesSection />
        <CommunityActionSection />
        <EventsSection events={events} />
        <C3SectionTransition variant="darkToLight" height="sm" className="relative z-10 -my-4" />
        <AudienceSection />
        <C3SectionTransition variant="lightToDark" height="sm" className="relative z-10 -my-4" />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
