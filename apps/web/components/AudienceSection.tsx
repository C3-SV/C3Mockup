import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import AudienceCard from "./AudienceCard";
import { FaBuilding, FaGraduationCap, FaUserAstronaut } from "react-icons/fa";

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
    subtitle: "Para empresas, startups y aliados del ecosistema.",
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
          <span className="inline-flex rounded-full border border-[#205298]/18 bg-[#205298]/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#205298]">
            Públicos
          </span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            C3 conecta a quienes quieren construir el ecosistema técnico joven
          </h2>
          <p className="max-w-3xl text-base leading-8 text-[#31405c] md:text-lg">
            Desde estudiantes que quieren crecer, hasta instituciones y organizaciones que buscan
            acercarse al talento técnico emergente.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {audiences.map((audience, index) => (
            <AudienceCard
              key={audience.title}
              {...audience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
