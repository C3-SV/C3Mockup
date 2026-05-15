import ActionLinesSection from "@/components/ActionLinesSection";
import Hero from "@/components/Hero";
import MissionVisionSection from "@/components/MissionVisionSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://www.instagram.com/c3.elsalvador",
    label: "Instagram de C3",
    icon: FaInstagram,
  },
  {
    href: "https://www.linkedin.com/company/c3-sv",
    label: "LinkedIn de C3",
    icon: FaLinkedinIn,
  },
];

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
        <div className="container-shell flex items-center justify-between gap-4 text-sm text-[#5c6a82]">
          <p>C3 | Competitive Coding Club</p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5c6a82]/30 text-[#5c6a82] transition hover:border-[#5c6a82]/50 hover:text-[#0F203E]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
