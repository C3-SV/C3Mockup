import type { Metadata } from "next";
import ActionLinesSection from "@/components/ActionLinesSection";
import AudienceSection from "@/components/AudienceSection";
import C3SectionTransition from "@/components/C3SectionTransition";
import FinalCtaSection from "@/components/FinalCtaSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SeoJsonLd from "@/components/SeoJsonLd";
import SiteFooter from "@/components/SiteFooter";
import { createPageMetadata } from "@/lib/metadata";
import { getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = siteConfig.homepageTitle;
const seoDescription = siteConfig.description;

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.homepageTitle,
  description: siteConfig.description,
  path: "/",
  keywords: siteConfig.keywords,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F203E]">
      <Navbar />
      <main>
        <SeoJsonLd data={getWebPageJsonLd({ path: "/", title: seoTitle, description: seoDescription })} />
        <Hero />
        <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />
        <MissionVisionSection />
        <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />
        <ActionLinesSection />
        <ProjectsSection />
        <AudienceSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
