import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getAboutPageJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Qué es C3 / Competitive Coding Club | Historia, equipo y propósito";
const seoDescription =
  "Conoce qué es C3, su historia, misión, visión y el equipo que impulsa una plataforma de talento técnico joven en El Salvador.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/que-es-c3",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: `${siteConfig.domain}/que-es-c3`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function QueEsC3Page() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getWebPageJsonLd({ path: "/que-es-c3", title: seoTitle, description: seoDescription })} />
      <SeoJsonLd data={getAboutPageJsonLd("/que-es-c3", seoTitle, seoDescription)} />

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

    </PageShell>
  );
}
