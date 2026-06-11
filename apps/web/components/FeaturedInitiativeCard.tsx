import Image from "next/image";
import Link from "next/link";
import { MagicCard } from "./ui/magic-card";
import { Button } from "./ui/button";
import { lineVisuals } from "@/lib/content";
import type { FeaturedHomeEvent } from "@/lib/home";

type FeaturedInitiativeCardProps = {
  event: FeaturedHomeEvent;
};

const toneByLine = {
  compite: "blue",
  crea: "turquoise",
  conecta: "purple",
} as const;

export default function FeaturedInitiativeCard({ event }: FeaturedInitiativeCardProps) {
  const visual = lineVisuals[event.primaryLine];
  const tone = toneByLine[event.primaryLine];
  const isExternal = Boolean(event.external);
  const actionVariant = event.status === "Inscripciones abiertas" ? "default" : "secondary";

  const action = isExternal ? (
    <Button
      asChild
      variant={actionVariant}
      tone={tone}
      size="sm"
      className="rounded-[1rem] px-5 py-2.5"
    >
      <a href={event.href} target="_blank" rel="noreferrer">
        {event.cta}
      </a>
    </Button>
  ) : (
    <Button
      asChild
      variant={actionVariant}
      tone={tone}
      size="sm"
      className="rounded-[1rem] px-5 py-2.5"
    >
      <Link href={event.href}>{event.cta}</Link>
    </Button>
  );

  return (
    <MagicCard
      mode="gradient"
      gradientSize={260}
      gradientColor={`${visual.color}1c`}
      gradientFrom={visual.color}
      gradientTo="#33BEAC"
      className="h-full rounded-[2.25rem]"
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[inherit] bg-[#122449]/94 p-8 shadow-[0_22px_50px_rgba(2,8,22,0.34)] md:p-9">
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
              className="inline-flex items-center rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em]"
              style={{
                color: visual.color,
                backgroundColor: `${visual.color}14`,
                border: `1px solid ${visual.color}4a`,
              }}
            >
              {visual.name}
            </span>
            <span className="rounded-full border border-white/16 bg-white/7 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/86">
              {event.status}
            </span>
            {event.schedule ? (
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/68">
                {event.schedule}
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
            <div className="space-y-4">
              <h3 className="max-w-[18ch] text-3xl font-bold leading-tight text-white md:text-[2.1rem]">
                {event.title}
              </h3>
              <p className="max-w-[44ch] text-base leading-8 text-white/80 md:text-[1.03rem]">
                {event.description}
              </p>
            </div>

            <div className="hidden md:flex md:justify-end">
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-[1.25rem] border bg-white/6 p-3"
                style={{ borderColor: `${visual.color}33` }}
              >
                <Image
                  src={visual.logo}
                  alt={`Identidad visual de ${visual.name}`}
                  fill
                  sizes="80px"
                  className="object-contain p-3"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-7">{action}</div>
        </div>
      </article>
    </MagicCard>
  );
}
