"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type MovingCardItem = {
  title: string;
  description: string;
  line: string;
  status: string;
  schedule?: string;
  href?: string;
  external?: boolean;
  cta?: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: MovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  const addAnimation = React.useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );

      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "24s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "42s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "72s");
      }

      setStart(true);
    }
  }, [direction, speed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-3",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => {
          const card = (
            <blockquote className="flex h-full flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/72">
                    {item.line}
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/72">
                    {item.status}
                  </span>
                  {item.schedule ? (
                    <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/72">
                      {item.schedule}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold leading-tight text-white md:text-[1.95rem]">
                    {item.title}
                  </h3>
                  <p className="max-w-[36ch] text-sm leading-7 text-white/78 md:text-[1rem]">
                    {item.description}
                  </p>
                </div>
              </div>

              {item.cta ? (
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#33BEAC]">
                  {item.cta}
                  <span aria-hidden="true">→</span>
                </span>
              ) : null}
            </blockquote>
          );

          return (
            <li
              key={item.title}
              className="relative w-[20rem] max-w-full shrink-0 rounded-[1.7rem] border border-white/10 bg-[#122449] px-6 py-6 shadow-[0_14px_32px_rgba(2,8,22,0.18)] md:w-[32rem] md:px-7 md:py-7"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="block h-full"
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
