import type { Metadata } from "next";
import ActionLinesSection from "@/components/ActionLinesSection";
import AudienceSection from "@/components/AudienceSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import PageShell from "@/components/PageShell";
import ProjectsSection from "@/components/ProjectsSection";
import SeoJsonLd from "@/components/SeoJsonLd";
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
    <PageShell>
      <SeoJsonLd data={getWebPageJsonLd({ path: "/", title: seoTitle, description: seoDescription })} />
      <Hero />
      <MissionVisionSection />
      <ActionLinesSection />
      <ProjectsSection events={events} />
      <AudienceSection />
      <FinalCtaSection />
    </PageShell>
  );
}
