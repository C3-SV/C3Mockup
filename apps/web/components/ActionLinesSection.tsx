import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import C3EcosystemDiagram from "./C3EcosystemDiagram";

export default function ActionLinesSection() {
  return (
    <section id="ecosistema" className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white">
      <C3BackgroundLayer variant="dots" line="brand" intensity="low" mask="top" className="opacity-70" />
      <C3BackgroundLayer
        variant="graph"
        line="brand"
        intensity="medium"
        animated
        mask="both"
        className="opacity-20 mix-blend-screen"
      />

      <div className="container-shell relative z-10 space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold md:text-5xl">Un ecosistema integrado</h2>
          <p className="max-w-3xl text-base leading-8 text-white/80 md:text-lg">
            C3 no solo organiza eventos. Construimos un sistema donde el talento técnico joven
            puede crecer de forma progresiva.
          </p>
        </div>

        <C3EcosystemDiagram />

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "COMPITE",
              description:
                "Desarrollamos el máximo potencial técnico a través de desafíos y competencias de clase mundial.",
              bullets: ["Programación competitiva", "ICPC", "Copa Salvadoreña de Programación", "Entrenamientos"],
              color: "#205298",
              href: "/compite",
            },
            {
              title: "CREA",
              description:
                "Convertimos conocimiento técnico en construcción: prototipos, software y soluciones para retos reales.",
              bullets: ["Hackathons", "Builders", "Desarrollo de software", "Proyectos reales"],
              color: "#33BEAC",
              href: "/crea",
            },
            {
              title: "CONECTA",
              description:
                "Construimos el puente entre talento emergente, comunidad, instituciones y oportunidades reales.",
              bullets: ["Comunidad", "Industria", "Mentoría", "Alianzas"],
              color: "#4F5BA9",
              href: "/conecta",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col rounded-[1.8rem] border border-white/13 bg-[#121f3d] p-6"
              style={{ boxShadow: "0 16px 40px rgba(2,8,22,0.22)" }}
            >
              <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: card.color }} />
              <h3 className="text-2xl font-bold leading-tight text-white">
                {card.title}
                {/*card.title === "CONECTA" ? "Conecta" : card.title.charAt(0) + card.title.slice(1).toLowerCase()*/}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/82">{card.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/82">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: card.color }}
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <a href={card.href} className="mt-6 inline-flex text-sm font-semibold text-white hover:underline">
                Ir a la línea
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
