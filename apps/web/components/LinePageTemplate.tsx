import Image from "next/image";
import Link from "next/link";
import SeoJsonLd from "./SeoJsonLd";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import { linePageContent, lineVisuals, type LineKey } from "@/lib/content";
import { getItemListJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import type { EventItem } from "@c3/config";

type LinePageTemplateProps = {
  line: LineKey;
  events: EventItem[];
};

export default function LinePageTemplate({ line, events }: LinePageTemplateProps) {
  const visual = lineVisuals[line];
  const content = linePageContent[line];
  const relatedEvents = events.filter((event) => event.lines.includes(line));
  const itemList = relatedEvents.length
    ? getItemListJsonLd(
        `/${line}`,
        relatedEvents.map((event) => ({
          name: event.title,
          description: event.description,
          url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
        })),
        `Eventos relacionados con ${visual.name}`,
      )
    : null;

  return (
    <>
      {itemList ? <SeoJsonLd data={itemList} /> : null}
      <section className="relative overflow-hidden bg-[#0F203E] py-18 text-white md:py-22">
        <C3BackgroundLayer variant="dots" line={line} intensity="low" className="opacity-70" />
        <div className="container-shell relative z-10 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            {/*<p
              className="inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: `${visual.color}88`,
                color: visual.color,
                backgroundColor: `${visual.color}1a`,
              }}
            >
              Línea {visual.name}
            </p>*/}
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{content.heroTitle}</h1>
            <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">{content.heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              {content.primaryCta.external ? (
                <a
                  href={content.primaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: visual.color }}
                >
                  {content.primaryCta.label}
                </a>
              ) : (
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: visual.color }}
                >
                  {content.primaryCta.label}
                </Link>
              )}
              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center rounded-full border border-white/28 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                {content.secondaryCta.label}
              </Link>
            </div>

            <div className="max-w-3xl space-y-4 pt-3">
              <p className="text-sm leading-7 text-white/86">{visual.shortDescription}</p>
              <ul className="flex flex-wrap gap-2">
                {content.pillars.map((pillar) => (
                  <li
                    key={pillar}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] shadow-[0_8px_18px_rgba(2,8,22,0.18)]"
                    style={{
                      borderColor: `${visual.color}aa`,
                      backgroundColor: `${visual.color}`,
                      color: "#F8FAFD",
                    }}
                  >
                    {pillar}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/12 bg-[#102240]/90 shadow-[0_24px_56px_rgba(2,8,22,0.34)] md:h-72 md:w-72">
              <Image
                src={visual.logo}
                alt={`Logo de ${visual.name}`}
                fill
                className="object-contain p-10 md:p-12"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider relative overflow-hidden bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-22 mix-blend-multiply" />
        <div className="container-shell relative z-10 space-y-6">
          <h2 className="text-3xl font-bold md:text-4xl">Eventos relacionados con {visual.name}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedEvents.map((event) => (
              <article key={event.id} className="rounded-3xl border border-[#d5deea] bg-white p-5">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#364765]">{event.description}</p>
                {event.external ? (
                  <a
                    href={event.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center rounded-full border border-[#0F203E] px-4 py-2 text-sm font-semibold text-[#0F203E] transition hover:bg-[#0F203E] hover:text-white"
                  >
                    {event.cta}
                  </a>
                ) : (
                  <Link
                    href={event.href}
                    className="mt-4 inline-flex items-center rounded-full border border-[#0F203E] px-4 py-2 text-sm font-semibold text-[#0F203E] transition hover:bg-[#0F203E] hover:text-white"
                  >
                    {event.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <Link className="font-semibold text-[#205298] hover:underline" href="/eventos">
              Ver todos los eventos
            </Link>
            <span className="text-[#7d8da5]">·</span>
            <Link className="font-semibold text-[#205298] hover:underline" href="/faq">
              Revisar FAQ
            </Link>
            <span className="text-[#7d8da5]">·</span>
            <Link className="font-semibold text-[#205298] hover:underline" href="/contacto">
              Contactar a C3
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
