import type { Metadata } from "next";
import SectionBadge from "@/components/ui/SectionBadge";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto C3 | Competitive Coding Club",
  description:
    "Canales oficiales de contacto de C3 para estudiantes, universidades, empresas, sponsors y medios.",
  path: "/contacto",
});

const contactPaths = [
  {
    title: "Estudiantes",
    description:
      "Participación en eventos, comunidad, rutas de aprendizaje y oportunidades técnicas.",
  },
  {
    title: "Universidades y colegios",
    description:
      "Colaboración para competencias, hackathons, charlas, talleres y activaciones estudiantiles.",
  },
  {
    title: "Empresas y sponsors",
    description:
      "Alianzas para apoyar iniciativas C3 y conectar con talento técnico joven en El Salvador.",
  },
  {
    title: "Medios y prensa",
    description:
      "Solicitudes institucionales, contexto de iniciativas y coordinación de cobertura.",
  },
] as const;

export default function ContactoPage() {
  return (
    <div className="bg-white py-16 md:py-20">
      <div className="container-shell space-y-8">
        <SectionBadge label="Contacto" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#0F203E] md:text-5xl">
          Contacta a C3 / Competitive Coding Club
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-[#31405c]">
          C3 prioriza canales oficiales para orientar a cada audiencia según su objetivo.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {contactPaths.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#DDE6EF] bg-[#F4F7FB] p-7 shadow-[0_12px_22px_rgba(15,32,62,0.08)]"
            >
              <h2 className="mb-3 text-xl font-bold text-[#0F203E]">{item.title}</h2>
              <p className="text-base leading-7 text-[#31405c]">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[#DDE6EF] bg-white p-5 text-[#0F203E] shadow-[0_10px_20px_rgba(15,32,62,0.08)] transition hover:border-[#205298]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
              Instagram
            </p>
            <p className="mt-2 text-base font-semibold">@c3.elsalvador</p>
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[#DDE6EF] bg-white p-5 text-[#0F203E] shadow-[0_10px_20px_rgba(15,32,62,0.08)] transition hover:border-[#205298]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
              LinkedIn
            </p>
            <p className="mt-2 text-base font-semibold">C3 / Competitive Coding Club</p>
          </a>
        </div>
      </div>
    </div>
  );
}
