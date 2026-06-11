"use client";

import { useEffect, useState } from "react";
import { MagicCard } from "./magic-card";
import { NumberTicker } from "./number-ticker";

type MetricTickerCardProps = {
  value: number;
  label: string;
  description: string;
  accent: string;
  prefix?: string;
  suffix?: string;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export default function MetricTickerCard({
  value,
  label,
  description,
  accent,
  prefix = "",
  suffix = "",
}: MetricTickerCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MagicCard
      mode="gradient"
      gradientSize={220}
      gradientColor={`${accent}22`}
      gradientFrom={accent}
      gradientTo="#33BEAC"
      className="h-full rounded-[1.6rem]"
    >
      <article
        className="relative h-full overflow-hidden rounded-[inherit] border border-white/10 bg-[#132548]/92 px-5 py-6 shadow-[0_18px_34px_rgba(2,8,22,0.24)]"
        aria-label={`${prefix}${value}${suffix} ${label}`}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: accent }} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.06),transparent_24%)]"
        />
        <div className="relative">
          <p className="text-4xl font-extrabold leading-none text-white md:text-[2.75rem]">
            {prefix}
            {prefersReducedMotion ? (
              value
            ) : (
              <NumberTicker value={value} className="text-white" />
            )}
            {suffix}
          </p>
          <p
            className="mt-3 text-sm font-semibold uppercase tracking-[0.12em]"
            style={{ color: accent }}
          >
            {label}
          </p>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/72">
            {description}
          </p>
        </div>
      </article>
    </MagicCard>
  );
}
