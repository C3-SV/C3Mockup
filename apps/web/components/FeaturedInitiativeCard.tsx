import Image from "next/image";
import Link from "next/link";
import { BorderBeam } from "./ui/border-beam";
import { MagicCard } from "./ui/magic-card";
import { Button } from "./ui/button";
import { lineVisuals } from "@/lib/content";
import type { FeaturedHomeEvent } from "@/lib/home";

type FeaturedInitiativeCardProps = {
  event: FeaturedHomeEvent;
};

export default function FeaturedInitiativeCard({ event }: FeaturedInitiativeCardProps) {
  const visual = lineVisuals[event.primaryLine];
  const isExternal = Boolean(event.external);
  const highlighted = event.status === "Inscripciones abiertas";

  const action = isExternal ? (
    <a
      href={event.href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0F203E] transition hover:bg-[#33BEAC] hover:text-[#0F203E]"
    >
      {event.cta}
    </a>
  ) : (
    <Button asChild size="sm" className="rounded-full px-5">
      <Link href={event.href}>{event.cta}</Link>
    </Button>
  );

  return (
    <MagicCard
      mode="gradient"
      gradientSize={240}
      gradientColor={`${visual.color}22`}
      gradientFrom={visual.color}
      gradientTo="#33BEAC"
      className="h-full rounded-[2rem]"
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[inherit] border border-white/12 bg-[#122449]/92 p-7 shadow-[0_22px_50px_rgba(2,8,22,0.34)]">
        <div
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: visual.color }}
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_72%_92%,rgba(255,255,255,0.04),transparent_18%)] opacity-80"
        />

        <div className="relative flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                color: visual.color,
                backgroundColor: `${visual.color}1f`,
                border: `1px solid ${visual.color}55`,
              }}
            >
              {visual.name}
            </span>
            <span className="rounded-full border border-white/18 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-white/85">
              {event.status}
            </span>
            {highlighted ? (
              <span className="rounded-full border border-[#33BEAC]/35 bg-[#33BEAC]/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#A7F3E7]">
                Prioritaria
              </span>
            ) : null}
          </div>

          <div className="mt-6 flex items-start justify-between gap-5">
            <div className="space-y-4">
              <h3 className="max-w-[18ch] text-3xl font-bold leading-tight text-white">
                {event.title}
              </h3>
              {event.schedule ? (
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                  {event.schedule}
                </p>
              ) : null}
              <p className="max-w-[48ch] text-base leading-8 text-white/80">
                {event.description}
              </p>
            </div>

            <div className="relative hidden h-20 w-20 shrink-0 rounded-2xl border border-white/12 bg-white/6 p-3 md:flex">
              <Image
                src={visual.logo}
                alt={`Identidad visual de ${visual.name}`}
                fill
                sizes="80px"
                className="object-contain p-3"
              />
            </div>
          </div>

          <div className="mt-7">{action}</div>
        </div>

        {highlighted ? (
          <>
            <BorderBeam
              colorFrom="#205298"
              colorTo="#33BEAC"
              borderWidth={1}
              size={80}
              duration={8}
              className="opacity-80"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[2rem] border border-[#33BEAC]/35 shadow-[0_0_0_1px_rgba(51,190,172,0.08),0_0_45px_rgba(51,190,172,0.1)]"
            />
          </>
        ) : null}
      </article>
    </MagicCard>
  );
}
