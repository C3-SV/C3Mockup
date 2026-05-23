"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { events, lineVisuals, type EventStatus, type LineKey } from "@/lib/content";

type EventFilter = "todos" | LineKey | "proximos" | "historicos";

const filterButtons: { key: EventFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "compite", label: "Compite" },
  { key: "crea", label: "Crea" },
  { key: "conecta", label: "Conecta" },
  { key: "proximos", label: "Proximos" },
  { key: "historicos", label: "Historicos" },
];

const statusStyle: Record<EventStatus, string> = {
  "Inscripciones abiertas": "bg-[#dff6ec] text-[#0d6d4f] border-[#9adabf]",
  Proximamente: "bg-[#e8f3ff] text-[#1f4f9b] border-[#9cbde8]",
  Historico: "bg-[#f4f5f8] text-[#4f5c74] border-[#d2d8e4]",
  "Apoyo institucional": "bg-[#ede9fb] text-[#5c4b9a] border-[#c3b7ee]",
};

export default function EventsCatalog() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("todos");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "todos") {
      return events;
    }
    if (activeFilter === "proximos") {
      return events.filter((event) => event.status === "Inscripciones abiertas" || event.status === "Proximamente");
    }
    if (activeFilter === "historicos") {
      return events.filter((event) => event.status === "Historico" || event.status === "Apoyo institucional");
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
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-[1.7rem] border border-[#d5deea] bg-white p-6 shadow-[0_12px_28px_rgba(15,32,62,0.08)]"
            >
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
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: visual.color }} />
                      {visual.name}
                    </span>
                  );
                })}
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] ${statusStyle[event.status]}`}>
                  {event.status}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-xl bg-[#132c53]">
                  <Image
                    src={lineVisuals[event.lines[0]].logo}
                    alt={`Icono de ${lineVisuals[event.lines[0]].name}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xl font-bold leading-snug">{event.title}</h3>
              </div>

              <p className="text-sm leading-7 text-[#364765]">{event.description}</p>
              {event.external ? (
                <a
                  href={event.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                >
                  {event.cta}
                </a>
              ) : (
                <Link
                  href={event.href}
                  className="mt-5 inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                >
                  {event.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
