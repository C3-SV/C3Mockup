import type { Metadata } from "next";
import ActionLinesSection from "@/components/ActionLinesSection";
import AudienceSection from "@/components/AudienceSection";
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
        <MissionVisionSection />
        <ActionLinesSection />
        <ProjectsSection />
        <AudienceSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
