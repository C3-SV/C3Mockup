import type { Metadata } from "next";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import {
  audiencePaths,
  c3Lines,
  impactStats,
  initiatives,
  keyCtas,
  updateNote,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "C3 | Competitive Coding Club — Compite. Crea. Conecta.",
  description:
    "C3 desarrolla talento técnico joven conectando programación competitiva, hackathons, comunidad, formación e industria en El Salvador y la región.",
  path: "/",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-[#070D1A] via-[#0A1428] to-[#0E1E3D] py-20 text-white md:py-28"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-8 right-16 h-44 w-44 rounded-full bg-[#33BEAC]/20 blur-2xl" />
        </div>

        <div className="container-shell relative space-y-8">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
            Plataforma institucional de talento técnico joven
          </p>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              C3 desarrolla talento técnico joven a través de competencia, creación y conexión.
            </h1>
            <p className="max-w-4xl text-base leading-8 text-white/85 md:text-lg">
              Competitive Coding Club conecta programación competitiva, hackathons, comunidad,
              formación e industria para abrir oportunidades reales a la próxima generación técnica
              de El Salvador y la región.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {keyCtas.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cta={item.label}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[#205298] px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#1b4785]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-10">
        <div className="container-shell">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82]">
            {updateNote}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {impactStats.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-[#DDE6EF] bg-white p-4 shadow-[0_8px_20px_rgba(15,32,62,0.08)]"
              >
                <p className="text-2xl font-bold text-[#0F203E]">{item.value}</p>
                <p className="text-sm text-[#47566f]">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-white py-20 md:py-24">
        <div className="container-shell space-y-8">
          <SectionBadge label="Qué es C3" />
          <p className="max-w-4xl text-lg leading-8 text-[#31405c]">
            C3 / Competitive Coding Club es una plataforma de desarrollo de talento técnico joven
            que conecta programación competitiva, hackathons, comunidad, formación, industria y
            oportunidades reales bajo una misma visión: {siteConfig.tagline}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_28px_rgba(15,32,62,0.08)]">
              <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#205298] to-[#4F5BA9]" />
              <h2 className="mb-4 text-3xl font-bold text-[#0F203E]">Misión</h2>
              <p className="text-base leading-8 text-[#31405c]">{siteConfig.mission}</p>
            </article>
            <article className="relative overflow-hidden rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_28px_rgba(15,32,62,0.08)]">
              <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#33BEAC] to-[#4F5BA9]" />
              <h2 className="mb-4 text-3xl font-bold text-[#0F203E]">Visión</h2>
              <p className="text-base leading-8 text-[#31405c]">{siteConfig.vision}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-divider bg-[#0F203E] py-16 text-white">
        <div className="container-shell space-y-8">
          <SectionBadge label="Compite · Crea · Conecta" />
          <div className="grid gap-6 md:grid-cols-3">
            {c3Lines.map((line) => (
              <article
                key={line.name}
                className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-[0_14px_28px_rgba(3,8,20,0.22)]"
              >
                <h2 className="mb-3 text-2xl font-bold">{line.name}</h2>
                <p className="mb-6 text-sm leading-7 text-white/85">{line.description}</p>
                <a
                  href={line.href}
                  target={line.href.startsWith("http") ? "_blank" : undefined}
                  rel={line.href.startsWith("http") ? "noreferrer" : undefined}
                  data-cta={line.cta}
                  className="inline-flex rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition hover:bg-white/15"
                >
                  {line.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-white py-20 md:py-24">
        <div className="container-shell space-y-8">
          <SectionBadge label="Eventos e iniciativas" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#0F203E] md:text-4xl">
              C3 como hub institucional
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[#47566f]">
              El sitio principal articula iniciativas oficiales como la Copa y el Hackathon sin
              duplicar sus páginas de evento.
            </p>
          </div>
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
                <h3 className="mb-4 text-2xl font-bold text-[#0F203E]">{item.title}</h3>
                <p className="mb-8 text-base leading-8 text-[#31405c]">{item.description}</p>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  data-cta={item.cta}
                  className="inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                >
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-20 md:py-24">
        <div className="container-shell space-y-8">
          <SectionBadge label="Para quién es C3" />
          <div className="grid gap-6 md:grid-cols-2">
            {audiencePaths.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#DDE6EF] bg-white p-7 shadow-[0_12px_22px_rgba(15,32,62,0.08)]"
              >
                <h2 className="mb-3 text-xl font-bold text-[#0F203E]">{item.title}</h2>
                <p className="text-base leading-7 text-[#31405c]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-white py-20 md:py-24">
        <div className="container-shell rounded-3xl border border-[#DDE6EF] bg-gradient-to-r from-[#0F203E] to-[#202A3F] p-8 text-white shadow-[0_16px_36px_rgba(15,32,62,0.28)] md:p-12">
          <p className="text-lg leading-8 text-white/90">
            La próxima generación técnica necesita espacios para competir, crear y conectar.
            Construyámoslos juntos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/eventos"
              data-cta="Participar en C3"
              className="inline-flex items-center justify-center rounded-full bg-[#33BEAC] px-5 py-2.5 text-sm font-semibold text-[#0F203E] transition hover:brightness-105"
            >
              Participar en C3
            </Link>
            <Link
              href="/aliados"
              data-cta="Ser aliado"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ser aliado
            </Link>
            <Link
              href="/contacto"
              data-cta="Contactar"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
