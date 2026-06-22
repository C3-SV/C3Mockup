"use client";

import { useEffect, useState } from "react";
import { c3ContextTokens, type C3Context } from "@/lib/c3-theme";
import { cn } from "./utils";

type ScrollProgressProps = {
  variant?: C3Context;
  className?: string;
};

export default function ScrollProgress({ variant = "general", className }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      if (maxScroll === 0) {
        setProgress(0);
        return;
      }

      setProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const tokens = c3ContextTokens[variant];
  const fillStyle =
    variant === "general"
      ? { backgroundImage: tokens.gradient }
      : {
          backgroundColor: tokens.main,
          boxShadow: `0 0 18px ${tokens.glow}`,
        };

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-x-0 top-[var(--c3-navbar-offset)] z-40 w-full", className)}
    >
      <div className="relative h-1 overflow-hidden bg-[#0F203E]/8 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] backdrop-blur-sm">
        <div className="absolute inset-0 bg-white/5" />
        <div
          className="absolute inset-y-0 left-0 origin-left transition-[width] duration-100 ease-linear"
          style={{
            width: `${progress * 100}%`,
            ...fillStyle,
          }}
        />
      </div>
    </div>
  );
}
