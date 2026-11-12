import { FaBuilding, FaGraduationCap, FaUserAstronaut } from "react-icons/fa";
import { Button } from "@/components/ui/Button";

/** Audiencias (antes AudienceSection). Textos, viñetas y destinos actuales. */
const AUDIENCES = [
  {
    title: "Personas",
    subtitle: "Para estudiantes, builders y talento técnico joven.",
    text: "Participa en competencias, hackathons, comunidad y espacios de aprendizaje para desarrollar habilidades, construir proyectos y conectar con oportunidades reales.",
    cta: "Participar en C3",
    href: "/eventos",
    icon: FaUserAstronaut,
    bar: "var(--c3-compite)",
    ink: "var(--c3-compite)",
    benefits: ["Competencias", "Hackathons", "Comunidad"],
    primary: true,
  },
  {
    title: "Instituciones educativas",
    subtitle: "Para colegios, universidades y programas formativos.",
    text: "Colabora con C3 para llevar competencias, hackathons, charlas, talleres y experiencias técnicas a tus estudiantes.",
    cta: "Crear una alianza educativa",
    href: "/contacto",
    icon: FaGraduationCap,
    bar: "var(--c3-crea)",
    ink: "var(--c3-crea-texto)",
    benefits: ["Charlas", "Talleres", "Activaciones técnicas"],
    primary: false,
  },
  {
    title: "Empresas y organizaciones",
    subtitle: "Para empresas, startups, sponsors y aliados del ecosistema.",
    text: "Apoya experiencias de alto impacto, conecta con talento joven y fortalece el ecosistema tecnológico desde El Salvador hacia la región.",
    cta: "Ser aliado",
    href: "/contacto",
    icon: FaBuilding,
    bar: "var(--c3-conecta)",
    ink: "var(--c3-conecta)",
    benefits: ["Visibilidad", "Mentoría", "Alianzas estratégicas"],
    primary: false,
  },
] as const;

export function AudienceSection() {
  return (
    <section className="c3-featured" aria-labelledby="audiencias">
      <div className="c3-frame">
        <div className="c3-section-head">
          <h2 id="audiencias">C3 conecta a quienes quieren construir el ecosistema técnico joven</h2>
          <p className="c3-lead">
            Desde estudiantes que quieren crecer, hasta instituciones y organizaciones que buscan acercarse al talento
            técnico emergente.
          </p>
        </div>
        <div className="c3-home-grid c3-home-grid--3">
          {AUDIENCES.map((audience) => {
            const Icon = audience.icon;
            return (
              <article key={audience.title} className="c3-home-card">
                <div className="c3-home-bar" style={{ background: audience.bar }} aria-hidden="true" />
                <span
                  className="c3-home-icon"
                  style={{ background: audience.bar, color: "var(--c3-texto-inverso)" }}
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </span>
                <h3>{audience.title}</h3>
                <p style={{ color: audience.ink, fontWeight: 600 }}>{audience.subtitle}</p>
                <p>{audience.text}</p>
                <ul className="c3-home-tags">
                  {audience.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div>
                  <Button href={audience.href} variant={audience.primary ? "primario" : "contorno"}>
                    {audience.cta}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
