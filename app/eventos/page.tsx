import type { Metadata } from "next";
import SectionBadge from "@/components/ui/SectionBadge";
import { initiatives, updateNote } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Eventos C3 | Competencias, hackathons y comunidad técnica",
  description:
    "Explora eventos de C3 relacionados con programación competitiva, hackathons, comunidad, formación y conexión con oportunidades reales.",
  path: "/eventos",
});

export default function EventosPage() {
  return (
    <div className="bg-white py-16 md:py-20">
      <div className="container-shell space-y-8">
        <SectionBadge label="Eventos e iniciativas" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#0F203E] md:text-5xl">
          Eventos C3 para competir, crear y conectar
        </h1>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
          {updateNote}
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {initiatives.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_30px_rgba(15,32,62,0.08)]"
            >
              <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                <span className="rounded-full bg-[#0F203E]/8 px-3 py-1 text-[#0F203E]">
                  {item.line}
                </span>
                <span className="rounded-full bg-[#33BEAC]/15 px-3 py-1 text-[#0F203E]">
                  {item.status}
                </span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#0F203E]">{item.title}</h2>
              <p className="mb-8 text-base leading-8 text-[#31405c]">{item.description}</p>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
              >
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
