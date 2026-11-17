/** Datos que respaldan el avance de C3 (antes en MissionVisionSection). Cifras actuales del sitio. */
const STATS = [
  { value: "+60", label: "miembros de la comunidad", bar: "var(--c3-compite)" },
  { value: "+150", label: "personas alcanzadas", bar: "var(--c3-crea)" },
  { value: "+130", label: "participantes en Copa 2025", bar: "var(--c3-conecta)" },
  { value: "5+", label: "eventos organizados o apoyados", bar: "var(--c3-sec-crea)" },
] as const;

export function DatosSection() {
  return (
    <section className="c3-featured c3-featured--flush" aria-labelledby="datos-c3">
      <div className="c3-frame">
        <div className="c3-featured__head">
          <div className="c3-section-head">
            <h2 id="datos-c3">Datos que respaldan el avance de C3</h2>
          </div>
          <p className="c3-eyebrow">Actualizado a mayo 2026</p>
        </div>
        <div className="c3-home-stats">
          {STATS.map((stat) => (
            <article key={stat.label} className="c3-home-stat">
              <div className="c3-home-bar" style={{ background: stat.bar }} aria-hidden="true" />
              <p className="c3-home-stat__value">{stat.value}</p>
              <p className="c3-home-stat__label">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
