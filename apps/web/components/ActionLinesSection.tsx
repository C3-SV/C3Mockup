import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import C3EcosystemBento from "./C3EcosystemBento";
import OrbitingC3 from "./OrbitingC3";

export default function ActionLinesSection() {
  return (
    <section id="ecosistema" className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24">
      <C3BackgroundLayer variant="dots" line="brand" intensity="low" mask="top" className="opacity-70" />
      <C3BackgroundLayer
        variant="graph"
        line="brand"
        intensity="medium"
        animated
        mask="both"
        className="opacity-18 mix-blend-screen"
      />

      <div className="container-shell relative z-10 space-y-10">
        <div className="max-w-4xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
            Compite / Crea / Conecta
          </p>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">
            Un ecosistema integrado
          </h2>
          <p className="max-w-3xl text-base leading-8 text-white/80 md:text-lg">
            C3 no solo organiza eventos. Construimos un sistema donde el talento técnico joven
            puede crecer de forma progresiva y pasar de competir a construir y conectar.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <OrbitingC3 className="max-w-[42rem]" />
          <div className="space-y-5">
            <p className="text-sm leading-7 text-white/74">
              El centro es C3. Alrededor orbitan tres rutas con identidad propia, pero pensadas
              como una sola experiencia para el talento.
            </p>
            <C3EcosystemBento />
          </div>
        </div>
      </div>
    </section>
  );
}
