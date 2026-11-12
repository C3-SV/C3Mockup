import SeoJsonLd from "./SeoJsonLd";
import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import Button from "./ui/Button";
import { lineVisuals } from "@/lib/content";
import { getItemListJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { formatEventSchedule, type EventItem } from "@c3/config";

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
    "Eventos destacados C3",
  );

  return (
    <>
      <SeoJsonLd data={itemList} />
      <section
        id="eventos"
        className="section-divider relative overflow-hidden bg-[linear-gradient(180deg,#101A31_0%,#F1F5FB_12%,#F1F5FB_100%)] py-24 text-[#0F203E] md:py-28"
      >
        <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-22 mix-blend-multiply" />
        <div className="container-shell relative z-10 space-y-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">Evidencia viva del ecosistema C3</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[#31405c] md:text-lg">
              Eventos, competencias, hackathons y colaboraciones institucionales que conectan talento técnico
              joven con aprendizaje y oportunidades reales.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const mainLine = lineVisuals[event.lines[0]];

              return (
                <article
                  key={event.id}
                  className="flex h-full flex-col rounded-[1.8rem] border border-[#D5DFEA] bg-white p-6 shadow-[0_16px_35px_rgba(15,32,62,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,32,62,0.14)]"
                >
                  <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: mainLine.color }} />
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {event.lines.map((line) => {
                      const styles = lineVisuals[line];
                      return (
                        <span
                          key={`${event.id}-${line}`}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                          style={{
                            color: styles.color,
                            backgroundColor: `${styles.color}1a`,
                            border: `1px solid ${styles.color}73`,
                          }}
                        >
                          {styles.name}
                        </span>
                      );
                    })}
                    <span className="rounded-full border border-[#cfd8e4] bg-[#F8FAFD] px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#4a5b77]">
                      {event.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight text-[#0F203E]">{event.title}</h3>
                  {event.eventDate ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
                      {formatEventSchedule(event)}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-7 text-[#344766]">{event.description}</p>

                  <div className="mt-auto pt-6">
                    <Button
                      href={event.href}
                      target={event.external ? "_blank" : undefined}
                      rel={event.external ? "noreferrer" : undefined}
                      variant="secondary"
                      context={mainLine.key}
                      accent={mainLine.color}
                      surface="light"
                    >
                      {event.cta}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <Link href="/eventos" className="inline-flex text-sm font-semibold text-[#205298] hover:underline">
            Ver hub completo de eventos
          </Link>
        </div>
      </section>
    </>
  );
}

