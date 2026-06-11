"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type MovingCardItem = {
  quote: string;
  name: string;
  title: string;
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
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
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
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => {
          const card = (
            <blockquote>
              <span className="relative z-20 text-sm leading-[1.6] font-normal text-white/84">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center justify-between gap-4">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] font-normal text-white">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] font-normal text-white/60">
                    {item.title}
                  </span>
                </span>
                {item.cta ? (
                  <span className="shrink-0 text-sm font-semibold text-[#33BEAC]">
                    {item.cta}
                  </span>
                ) : null}
              </div>
            </blockquote>
          );

          return (
            <li
              key={item.name}
              className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-white/10 bg-[#122449] px-8 py-6 shadow-[0_14px_32px_rgba(2,8,22,0.18)] md:w-[450px]"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
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
