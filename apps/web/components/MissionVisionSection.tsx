import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import C3SectionTransition from "./C3SectionTransition";
import FeaturedInitiativeCard from "./FeaturedInitiativeCard";
import MetricTickerCard from "./ui/MetricTickerCard";
import { getFeaturedHomeEvents, homeMetrics } from "@/lib/home";
import type { EventItem } from "@c3/config";

type MissionVisionSectionProps = {
  events: EventItem[];
};

export default function MissionVisionSection({ events }: MissionVisionSectionProps) {
  const featuredEvents = getFeaturedHomeEvents(events);

  return (
    <>
      <section
        id="proximas-iniciativas"
        className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24"
      >
        <C3BackgroundLayer variant="glow" line="crea" intensity="medium" mask="bottom" className="opacity-65" />
        <C3BackgroundLayer variant="dots" line="crea" intensity="low" mask="bottom" className="opacity-50" />
        <div className="container-shell relative z-10 space-y-8">
          <div className="max-w-4xl space-y-4">
            <span className="inline-flex rounded-full border border-white/12 bg-white/7 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/78">
              Próximas iniciativas
            </span>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              Lo próximo que mueve a C3 ya está en marcha
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              Iniciativas activas y reales que sostienen el siguiente ciclo de crecimiento técnico
              joven dentro del ecosistema C3.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featuredEvents.map((event) => (
              <FeaturedInitiativeCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />

      <section
        id="metricas"
        className="section-divider relative overflow-hidden bg-[#101A31] py-16 text-white md:py-20"
      >
        <C3BackgroundLayer variant="glow" line="conecta" intensity="medium" mask="bottom" className="opacity-60" />
        <C3BackgroundLayer variant="dots" line="conecta" intensity="low" mask="bottom" className="opacity-35" />
        <div className="container-shell relative z-10 space-y-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-white/12 bg-white/7 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/78">
                Métricas
              </span>
              <h3 className="text-3xl font-bold leading-tight md:text-4xl">
                Datos que respaldan el avance de C3
              </h3>
            </div>
            <p className="text-sm uppercase tracking-[0.14em] text-white/70">Actualizado a mayo 2026</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {homeMetrics.map((metric) => (
              <MetricTickerCard
                key={metric.label}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                label={metric.label}
                description={metric.description}
                accent={metric.accent}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
