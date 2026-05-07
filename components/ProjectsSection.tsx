import ProjectCard from "./ProjectCard";
import SectionBadge from "./ui/SectionBadge";

export default function ProjectsSection() {
  return (
    <section id="proyectos" className="section-divider bg-white py-20 md:py-24">
      <div className="container-shell space-y-8">
        <SectionBadge label="Proyectos Activos" />
        <div>
          <h2 className="text-3xl font-bold text-[#0F203E] md:text-4xl">
            Accesos directos a eventos C3
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-[#47566f]">
            Conoce las nuevas iniciativa que estamos construyendo. 
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ProjectCard
            title="Copa Salvadoreña de Programación"
            tag="Competencia · Programación · Talento"
            description="La competencia nacional que reúne a estudiantes de colegios y universidades para resolver problemas, fortalecer su pensamiento algorítmico y conectar con una comunidad técnica de alto nivel."
            cta="Ir a la Copa"
            href="/copa"
            accent="blue"
          />
          <ProjectCard
            title="Festival / Hackathon"
            tag="Tecnología · Cultura · Creación"
            description="Una experiencia de creación donde equipos construyen soluciones reales combinando tecnología, cultura, turismo, comunidad e impacto."
            cta="Ir al Festival"
            href="/festival"
            accent="turquoise"
          />
        </div>
      </div>
    </section>
  );
}
