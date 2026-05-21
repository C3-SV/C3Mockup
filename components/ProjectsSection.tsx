import ProjectCard from "./ProjectCard";
import SectionBadge from "./ui/SectionBadge";

const isFestivalPublic = process.env.NEXT_PUBLIC_SHOW_FESTIVAL === "true";

const projects = [
  {
    title: "Copa Salvadoreña de Programación",
    tag: "Competencia · Programación · Talento",
    description:
      "La competencia nacional que reúne a estudiantes de colegios y universidades para resolver problemas, fortalecer su pensamiento algorítmico y conectar con una comunidad técnica de alto nivel.",
    cta: "Ir a la Copa",
    href: "/copa",
    accent: "blue" as const,
    isPublic: true,
  },
  {
    title: "Festival de Código / Hackathon",
    tag: "Tecnología · Cultura · Creación",
    description:
      "Una experiencia de creación donde equipos construyen soluciones reales combinando tecnología, cultura, turismo, comunidad e impacto.",
    cta: "Ir al Festival",
    href: "/festival",
    accent: "turquoise" as const,
    isPublic: isFestivalPublic,
  },
  {
    title: "Hackathon de Turismo Creativo",
    tag: "Hackathon · Turismo · Innovación",
    description:
      "Un fin de semana para construir soluciones reales donde el turismo, el código y la cultura se encuentran.",
    cta: "Ir a la Hackathon",
    href: "https://hackathon.c3.com.sv/",
    accent: "turquoise" as const,
    isPublic: true,
  },
];

export default function ProjectsSection() {
  const visibleProjects = projects.filter((project) => project.isPublic);

  return (
    <section id="proyectos" className="section-divider bg-white py-20 md:py-24">
      <div className="container-shell space-y-8">
        <SectionBadge label="Proyectos Activos" />
        <div>
          <h2 className="text-3xl font-bold text-[#0F203E] md:text-4xl">
            Accesos directos a eventos C3
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-[#47566f]">
            Conoce las iniciativas que estamos construyendo.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.href}
              title={project.title}
              tag={project.tag}
              description={project.description}
              cta={project.cta}
              href={project.href}
              accent={project.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
