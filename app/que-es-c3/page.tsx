import type { Metadata } from "next";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Qué es C3 / Competitive Coding Club | Talento técnico joven",
  description:
    "Conoce C3, una plataforma de desarrollo de talento técnico joven que conecta competencia, creación, comunidad y oportunidades reales.",
  path: "/que-es-c3",
});

export default function QueEsC3Page() {
  return (
    <div className="bg-white py-16 md:py-20">
      <div className="container-shell space-y-8">
        <SectionBadge label="Qué es C3" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#0F203E] md:text-5xl">
          C3 / Competitive Coding Club
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-[#31405c]">{siteConfig.shortDescription}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_28px_rgba(15,32,62,0.08)]">
            <h2 className="mb-4 text-2xl font-bold text-[#0F203E]">Misión</h2>
            <p className="text-base leading-8 text-[#31405c]">{siteConfig.mission}</p>
          </article>
          <article className="rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_28px_rgba(15,32,62,0.08)]">
            <h2 className="mb-4 text-2xl font-bold text-[#0F203E]">Visión</h2>
            <p className="text-base leading-8 text-[#31405c]">{siteConfig.vision}</p>
          </article>
        </div>
        <article className="rounded-3xl border border-[#DDE6EF] bg-[#F4F7FB] p-8">
          <h2 className="mb-4 text-2xl font-bold text-[#0F203E]">Compite. Crea. Conecta.</h2>
          <p className="text-base leading-8 text-[#31405c]">
            C3 actúa como puente entre la programación competitiva, el mundo builder y el
            ecosistema de aliados que abre oportunidades reales a estudiantes y talento técnico
            joven.
          </p>
        </article>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/eventos"
            className="inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
          >
            Ver eventos
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-full border border-[#0F203E]/20 px-5 py-2.5 text-sm font-semibold text-[#0F203E] transition hover:bg-[#0F203E]/5"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
}
