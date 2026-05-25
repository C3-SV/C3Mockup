"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { events, lineVisuals, type EventStatus, type LineKey } from "@/lib/content";

type EventFilter = "todos" | LineKey | "proximos" | "historicos";

const filterButtons: { key: EventFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "compite", label: "Compite" },
  { key: "crea", label: "Crea" },
  { key: "conecta", label: "Conecta" },
  { key: "proximos", label: "Próximos" },
  { key: "historicos", label: "Históricos" },
];

const statusStyle: Record<EventStatus, string> = {
  "Inscripciones abiertas": "bg-[#dff6ec] text-[#0d6d4f] border-[#9adabf]",
  "Próximamente": "bg-[#e8f3ff] text-[#1f4f9b] border-[#9cbde8]",
  "Histórico": "bg-[#f4f5f8] text-[#4f5c74] border-[#d2d8e4]",
  "Apoyo institucional": "bg-[#ede9fb] text-[#5c4b9a] border-[#c3b7ee]",
};

export default function EventsCatalog() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("todos");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "todos") {
      return events;
    }
    if (activeFilter === "proximos") {
      return events.filter(
        (event) => event.status === "Inscripciones abiertas" || event.status === "Próximamente",
      );
    }
    if (activeFilter === "historicos") {
      return events.filter((event) => event.status === "Histórico" || event.status === "Apoyo institucional");
    }
    return events.filter((event) => event.lines.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
      <div className="container-shell space-y-7">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeFilter === filter.key
                  ? "border-[#0F203E] bg-[#0F203E] text-white"
                  : "border-[#cfd9e5] bg-white text-[#40506b] hover:border-[#0F203E]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const mainLine = lineVisuals[event.lines[0]];

            return (
              <article
                key={event.id}
                className="flex h-full flex-col rounded-[1.7rem] border border-[#d5deea] bg-white p-6 shadow-[0_12px_28px_rgba(15,32,62,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,32,62,0.12)]"
              >
                <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: mainLine.color }} />

                <div className="mb-4 flex flex-wrap gap-2">
                  {event.lines.map((line) => {
                    const visual = lineVisuals[line];
                    return (
                      <span
                        key={`${event.id}-${line}`}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em]"
                        style={{
                          borderColor: `${visual.color}6f`,
                          color: visual.color,
                          backgroundColor: `${visual.color}1a`,
                        }}
                      >
                        {visual.name}
                      </span>
                    );
                  })}
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] ${statusStyle[event.status]}`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold leading-tight text-[#0F203E]">{event.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#344766]">{event.description}</p>

                <div className="mt-auto pt-6">
                  {event.external ? (
                    <a
                      href={event.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                    >
                      {event.cta}
                    </a>
                  ) : (
                    <Link
                      href={event.href}
                      className="inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                    >
                      {event.cta}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
