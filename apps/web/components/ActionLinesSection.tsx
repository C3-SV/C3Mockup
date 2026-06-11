import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import C3EcosystemBento from "./C3EcosystemBento";

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
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex rounded-full border border-white/12 bg-white/7 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/78">
            Compite / Crea / Conecta
          </span>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">
            Un ecosistema integrado
          </h2>
          <p className="max-w-3xl text-base leading-8 text-white/80 md:text-lg">
            C3 no solo organiza eventos. Construimos un sistema donde el talento técnico joven
            puede crecer de forma progresiva.
          </p>
        </div>

        <C3EcosystemBento />
      </div>
    </section>
  );
}
