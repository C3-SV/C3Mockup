import type { Metadata } from "next";
import ActionLinesSection from "@/components/ActionLinesSection";
import AudienceSection from "@/components/AudienceSection";
import C3SectionTransition from "@/components/C3SectionTransition";
import FinalCtaSection from "@/components/FinalCtaSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SiteFooter from "@/components/SiteFooter";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.homepageTitle,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F203E]">
      <Navbar />
      <main>
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
