import { Button } from "@/components/ui/Button";
import { StatePill } from "@/components/ui/StatePill";

/** Próximas iniciativas (antes MissionVisionSection). Textos y destinos actuales. */
const INITIATIVES = [
  {
    key: "compite",
    line: "Compite",
    status: "Inscripciones abiertas",
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
  },
  {
    key: "crea",
    line: "Crea",
    status: "Inscripciones abiertas",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde código, turismo y cultura.",
    cta: "Ver hackathon",
    href: "https://hackathon.c3.com.sv",
  },
] as const;

export function IniciativasSection() {
  return (
    <section className="c3-featured" aria-labelledby="proximas-iniciativas">
      <div className="c3-frame">
        <div className="c3-section-head">
          <h2 id="proximas-iniciativas">Próximas iniciativas</h2>
          <p className="c3-lead">Dos iniciativas activas marcan el siguiente ciclo de crecimiento técnico joven en C3.</p>
        </div>
        <div className="c3-home-grid c3-home-grid--2">
          {INITIATIVES.map((item) => (
            <article key={item.key} className="c3-home-card">
              <div className="c3-exp__line">
                <span className={`c3-dot c3-dot--${item.key}`} aria-hidden="true" />
                {item.line}
              </div>
              <div>
                <StatePill label={item.status} tone="exito" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>
                <Button href={item.href} variant="primario">
                  {item.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
