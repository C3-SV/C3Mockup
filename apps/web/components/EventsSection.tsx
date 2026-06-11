import Link from "next/link";
import SeoJsonLd from "./SeoJsonLd";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import MovingRecapCards from "./MovingRecapCards";
import { Button } from "./ui/button";
import { getCommunityHighlights } from "@/lib/home";
import { getItemListJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { type EventItem } from "@c3/config";

type EventsSectionProps = {
  events: EventItem[];
};

export default function EventsSection({ events }: EventsSectionProps) {
  const itemList = getItemListJsonLd(
    "/",
    events.map((event) => ({
      name: event.title,
      description: event.description,
      url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
    })),
    "Eventos y recaps de C3",
  );

  const highlights = getCommunityHighlights(events);

  return (
    <>
      <SeoJsonLd data={itemList} />
      <section
        id="nuestros-eventos"
        className="section-divider relative overflow-hidden bg-[#0C1529] py-24 text-white md:py-28"
      >
        <C3BackgroundLayer variant="glow" line="compite" intensity="medium" mask="bottom" className="opacity-26" />
        <div className="container-shell relative z-10 space-y-10">
        <div className="max-w-4xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
              Recaps y hitos
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">Nuestros eventos</h2>
            <p className="max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              Actividades confirmadas, colaboraciones e hitos recientes que muestran el movimiento
              continuo del ecosistema C3.
            </p>
          </div>

          <MovingRecapCards items={highlights} />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="max-w-2xl text-sm leading-7 text-white/64">
              Cada tarjeta resume un evento, una colaboración o un hito que ya dejó huella en la
              comunidad.
            </p>
            <Button asChild variant="secondary" tone="white" size="lg" className="rounded-full px-6">
              <Link href="/eventos">Ver todos los eventos</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
