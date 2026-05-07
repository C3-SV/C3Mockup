import ActionLinesSection from "@/components/ActionLinesSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <MissionVisionSection />
        <ActionLinesSection />
        <ProjectsSection />
      </main>
      <footer className="section-divider bg-white py-8">
        <div className="container-shell flex flex-col gap-3 text-sm text-[#5c6a82] md:flex-row md:items-center md:justify-between">
          <p>C3 | Competitive Coding Club</p>
          <p>Shell temporal de c3.com.sv</p>
        </div>
      </footer>
    </div>
  );
}
