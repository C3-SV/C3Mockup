"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Card = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  accent: string;
  className?: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [active, setActive] = useState<Card["id"] | null>(cards[0]?.id ?? null);

  useEffect(() => {
    if (!cards.length) {
      setActive(null);
      return;
    }

    setActive((current) => current ?? cards[0].id);
  }, [cards]);

  return (
    <div className="grid gap-4 md:flex md:flex-row" onMouseLeave={() => setActive(cards[0]?.id ?? null)}>
      {cards.map((card) => {
        const isActive = active === card.id;

        return (
          <motion.article
            key={card.id}
            layout
            tabIndex={0}
            onFocus={() => setActive(card.id)}
            onMouseEnter={() => setActive(card.id)}
            className={cn(
              "group relative min-h-[20rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#122449]/94 outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#33BEAC]/45 md:min-h-[24rem]",
              card.className,
            )}
            style={{
              flex: isActive ? "1.5 1 0%" : "0.9 1 0%",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 transition duration-700 group-hover:scale-105"
            >
              <Image
                src={card.thumbnail}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-top"
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,32,62,0.08)_0%,rgba(15,32,62,0.48)_60%,rgba(15,32,62,0.92)_100%)]"
            />
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: card.accent }} />

            <div className="relative flex h-full items-end">
              <div className="w-full p-6 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color: card.accent,
                      backgroundColor: `${card.accent}16`,
                      border: `1px solid ${card.accent}42`,
                    }}
                  >
                    Comunidad C3
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    0{card.id}
                  </span>
                </div>

                <div
                  className={cn(
                    "mt-4 space-y-2 transition duration-300",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-92",
                  )}
                >
                  <h3 className="text-2xl font-bold text-white md:text-[2rem]">{card.title}</h3>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.14em]"
                    style={{ color: card.accent }}
                  >
                    {card.subtitle}
                  </p>
                  <p className="max-w-[28ch] text-sm leading-7 text-white/78">{card.description}</p>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
