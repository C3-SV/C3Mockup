import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { teamLeaders } from "@/lib/content";
import { getAboutPageJsonLd, getBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { FaLinkedinIn } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const seoTitle = "Qué es C3 / Competitive Coding Club | Talento técnico joven";
const seoDescription =
  "Conoce la historia, misión, visión, equipo y enfoque de C3, una plataforma institucional de talento técnico joven nacida en El Salvador.";

export const metadata: Metadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/que-es-c3",
  keywords: [
    "qué es C3",
    "Competitive Coding Club",
    "talento técnico joven",
    "comunidad tecnológica El Salvador",
  ],
});

export default function QueEsC3Page() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getAboutPageJsonLd("/que-es-c3", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/que-es-c3")} />

      <section className="bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-5">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            C3 / Competitive Coding Club
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            C3 es el hub institucional que articula competencia, creación y conexión para
            desarrollar la próxima generación técnica joven de El Salvador y la región.
          </p>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-6">
          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <h2 className="text-2xl font-bold">Historia breve</h2>
            <p className="mt-3 text-sm leading-7 text-[#364765]">
              C3 nace desde la experiencia de programación competitiva en ESEN y evoluciona hacia
              una plataforma institucional que integra eventos, comunidad, hackathons y conexión
              con industria para abrir oportunidades reales.
            </p>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Misión</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.mission}</p>
            </article>
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Visión</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.vision}</p>
            </article>
          </div>

          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <h2 className="text-2xl font-bold">Propuesta de valor</h2>
            <p className="mt-3 text-sm leading-7 text-[#364765]">
              C3 conecta el rigor técnico de las competencias, la construcción de proyectos reales
              y el puente hacia instituciones, empresas y oportunidades para talento joven.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/compite" className="font-semibold text-[#205298] hover:underline">
                Compite
              </Link>
              <Link href="/crea" className="font-semibold text-[#33BEAC] hover:underline">
                Crea
              </Link>
              <Link href="/conecta" className="font-semibold text-[#4F5BA9] hover:underline">
                Conecta
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section-divider relative overflow-hidden bg-white py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Equipo líder
            </h2>
            <p className="text-base leading-8 text-[#364765] md:text-lg">
              Las personas que hacen que el C3 sea posible. 
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {teamLeaders.map((member) => (
              <article
                key={member.name}
                className="flex h-full flex-col rounded-[1.8rem] border border-[#d5deea] bg-[#F8FAFD] p-4 shadow-[0_12px_30px_rgba(15,32,62,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,32,62,0.1)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-[#d5deea] bg-gradient-to-br from-[#e9f0f7] via-[#f8fbfe] to-white">
                  {member.photoSrc ? (
                    <Image
                      src={member.photoSrc}
                      alt={member.photoAlt ?? member.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-4">
                      <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82] backdrop-blur-sm">
                        Imagen pendiente
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-lg font-bold leading-tight text-[#0F203E]">{member.name}</p>
                  <p className="text-sm font-medium text-[#205298]">{member.role}</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={member.linkedinHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} en LinkedIn`}
                    title="LinkedIn"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5deea] bg-white text-[#205298] transition hover:border-[#205298] hover:bg-[#eef4fb]"
                    >
                    <FaLinkedinIn size={14} aria-hidden="true" />
                  </a>

                  {member.portfolioHref ? (
                    <a
                      href={member.portfolioHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} portafolio`}
                      title="Portafolio"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5deea] bg-white text-[#33BEAC] transition hover:border-[#33BEAC] hover:bg-[#effaf8]"
                    >
                      <FiLink size={14} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </PageShell>
  );
}
