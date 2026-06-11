import Link from "next/link";
import SeoJsonLd from "./SeoJsonLd";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import CommunityActionGrid from "./CommunityActionGrid";
import MovingRecapCards from "./MovingRecapCards";
import { getCommunityHighlights } from "@/lib/home";
import { getItemListJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { type EventItem } from "@c3/config";

type ProjectsSectionProps = {
  events: EventItem[];
};

export default function ProjectsSection({ events }: ProjectsSectionProps) {
  const itemList = getItemListJsonLd(
    "/",
    events.map((event) => ({
      name: event.title,
      description: event.description,
      url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
    })),
    "Highlights del ecosistema C3",
  );

  const highlights = getCommunityHighlights(events);

  return (
    <>
      <SeoJsonLd data={itemList} />
      <section
        id="c3-en-accion"
        className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24"
      >
        <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-16 mix-blend-screen" />
        <div className="container-shell relative z-10 space-y-8">
          <div className="max-w-4xl space-y-4">
            <span className="inline-flex rounded-full border border-white/12 bg-white/7 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/78">
              Comunidad
            </span>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">C3 en acción</h2>
            <p className="max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              Evidencia viva de comunidad, competencias, hackathons y espacios técnicos que hacen
              visible el trabajo de C3.
            </p>
          </div>

          <CommunityActionGrid />

          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white md:text-3xl">Recaps reales</h3>
                <p className="max-w-2xl text-sm leading-7 text-white/68">
                  Highlights y actividades confirmadas que muestran el movimiento continuo del ecosistema.
                </p>
              </div>
              <Link href="/eventos" className="text-sm font-semibold text-[#33BEAC] hover:underline">
                Ver todos los eventos
              </Link>
            </div>

            <MovingRecapCards items={highlights} />
          </div>
        </div>
      </section>
    </>
  );
}
