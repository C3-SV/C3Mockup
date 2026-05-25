import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import { FaBuilding, FaGraduationCap, FaUserAstronaut } from "react-icons/fa";
import Link from "next/link";

const audiences = [
  {
    title: "Personas",
    subtitle: "Para estudiantes, builders y talento técnico joven.",
    text: "Participa en competencias, hackathons, comunidad y espacios de aprendizaje para desarrollar habilidades, construir proyectos y conectar con oportunidades reales.",
    cta: "Participar en C3",
    href: "/eventos",
    icon: FaUserAstronaut,
    accent: "#205298",
    benefits: ["Competencias", "Hackathons", "Comunidad"],
  },
  {
    title: "Instituciones educativas",
    subtitle: "Para colegios, universidades y programas formativos.",
    text: "Colabora con C3 para llevar competencias, hackathons, charlas, talleres y experiencias técnicas a tus estudiantes.",
    cta: "Crear una alianza educativa",
    href: "/contacto",
    icon: FaGraduationCap,
    accent: "#33BEAC",
    benefits: ["Charlas", "Talleres", "Activaciones técnicas"],
  },
  {
    title: "Empresas y organizaciones",
    subtitle: "Para empresas, startups, sponsors y aliados del ecosistema.",
    text: "Apoya experiencias de alto impacto, conecta con talento joven y fortalece el ecosistema tecnológico desde El Salvador hacia la región.",
    cta: "Ser aliado",
    href: "/contacto",
    icon: FaBuilding,
    accent: "#4F5BA9",
    benefits: ["Visibilidad", "Mentoría", "Alianzas estratégicas"],
  },
];

export default function AudienceSection() {
  return (
    <section id="audiencias" className="section-divider relative overflow-hidden bg-[#F8FAFD] py-20 text-[#0F203E] md:py-24">
      <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-20 mix-blend-multiply" />
      <div className="container-shell relative z-10 space-y-8">
        <div className="max-w-4xl space-y-4">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            C3 conecta a quienes quieren construir el ecosistema técnico joven
          </h2>
          <p className="max-w-3xl text-base leading-8 text-[#31405c] md:text-lg">
            Desde estudiantes que quieren crecer, hasta instituciones y organizaciones que buscan
            acercarse al talento técnico emergente.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;

            return (
              <article
                key={audience.title}
                className="relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#D6DFEA] bg-white p-6 shadow-[0_16px_34px_rgba(15,32,62,0.08)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: audience.accent }}
                  aria-hidden="true"
                />
                <div className="mb-4 flex items-center justify-between pt-1">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${audience.accent}22`, color: audience.accent }}
                  >
                    <Icon size={20} />
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: audience.accent }}
                  >
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#0F203E]">{audience.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-7" style={{ color: audience.accent }}>
                  {audience.subtitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#344766]">{audience.text}</p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {audience.benefits.map((benefit) => (
                    <li
                      key={`${audience.title}-${benefit}`}
                      className="rounded-full border border-[#d6dfeb] bg-[#f4f8fc] px-3 py-1 text-xs font-semibold text-[#3a4c67]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link
                  href={audience.href}
                  className="mt-8 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{
                    backgroundColor: audience.accent,
                  }}
                >
                  {audience.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
