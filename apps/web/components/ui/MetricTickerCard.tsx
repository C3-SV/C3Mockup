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
      gradientSize={240}
      gradientColor={`${accent}1f`}
      gradientFrom={accent}
      gradientTo="#33BEAC"
      className="h-full rounded-[2.15rem]"
    >
      <article
        className="relative flex h-full min-h-[15rem] flex-col overflow-hidden rounded-[inherit] bg-[#132548]/94 px-7 py-7 shadow-[0_18px_34px_rgba(2,8,22,0.24)] md:px-8 md:py-8"
        aria-label={`${prefix}${value}${suffix} ${label}`}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: accent }} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.06),transparent_24%)]"
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="space-y-3">
            <p className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-[3rem]">
              {prefix}
              {prefersReducedMotion ? value : <NumberTicker value={value} className="text-white" />}
              {suffix}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
              {label}
            </p>
          </div>

          <p className="max-w-[20rem] text-sm leading-7 text-white/76">{description}</p>
        </div>
      </article>
    </MagicCard>
  );
}
