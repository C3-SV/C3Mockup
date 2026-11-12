"use client";

import { useEffect, useState } from "react";
import { c3ContextTokens, type C3Context } from "@/lib/c3-theme";
import { cn } from "./utils";

type ScrollProgressProps = {
  variant?: C3Context;
  className?: string;
  embedded?: boolean;
};

export default function ScrollProgress({
  variant = "general",
  className,
  embedded = false,
}: ScrollProgressProps) {
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
          boxShadow: `0 0 10px ${tokens.glow}`,
        };

  return (
    <div
      aria-hidden="true"
      className={cn(
        embedded
          ? "pointer-events-none relative z-0 w-full"
          : "pointer-events-none fixed inset-x-0 top-[var(--c3-navbar-offset)] z-[60] w-full",
        className,
      )}
    >
      <div className="relative h-[3px] overflow-hidden bg-white/10 shadow-[0_1px_2px_rgba(2,8,22,0.16)]">
        <div
          className={cn("absolute inset-0 origin-left rounded-full", variant === "general" ? "" : "")}
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left center",
            ...fillStyle,
          }}
        />
      </div>
    </div>
  );
}
