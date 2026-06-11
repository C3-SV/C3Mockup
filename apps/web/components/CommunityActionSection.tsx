import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import CommunityActionGrid from "./CommunityActionGrid";

export default function CommunityActionSection() {
  return (
    <section id="c3-en-accion" className="section-divider relative overflow-hidden bg-[#0E1930] py-20 text-white md:py-24">
      <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-16 mix-blend-screen" />

      <div className="container-shell relative z-10 space-y-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
            Rostros reales
          </p>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">C3 en acción</h2>
          <p className="max-w-3xl text-base leading-8 text-white/78 md:text-lg">
            Fotos y rostros que sostienen la operación del club, preparadas para crecer cuando
            entren imágenes reales de eventos y actividades.
          </p>
        </div>

        <CommunityActionGrid />
      </div>
    </section>
  );
}
