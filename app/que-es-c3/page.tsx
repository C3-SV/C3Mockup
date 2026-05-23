import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import SectionBadge from "@/components/ui/SectionBadge";
import { getAboutPageJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Que es C3 / Competitive Coding Club | Historia, equipo y proposito";
const seoDescription =
  "Conoce que es C3, su historia, mision, vision y el equipo que impulsa una plataforma de talento tecnico joven en El Salvador.";

const teamPlaceholders = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  name: `Miembro C3 ${index + 1}`,
  role: "Rol por confirmar",
  area: index < 3 ? "Compite" : index < 6 ? "Crea" : "Conecta",
  links: ["LinkedIn", "GitHub"],
}));

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
          <SectionBadge label="Que es C3" />
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            C3 / Competitive Coding Club
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            C3 es el hub institucional que articula competencia, creacion y conexion para
            desarrollar la proxima generacion tecnica joven de El Salvador y la region.
          </p>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-6">
          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <h2 className="text-2xl font-bold">Historia breve</h2>
            <p className="mt-3 text-sm leading-7 text-[#364765]">
              C3 nace desde la experiencia de programacion competitiva en ESEN y evoluciona hacia
              una plataforma institucional que integra eventos, comunidad, hackathons y conexion
              con industria para abrir oportunidades reales.
            </p>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Mision</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.mission}</p>
            </article>
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Vision</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.vision}</p>
            </article>
          </div>

          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <h2 className="text-2xl font-bold">Propuesta de valor</h2>
            <p className="mt-3 text-sm leading-7 text-[#364765]">
              C3 conecta el rigor tecnico de las competencias, la construccion de proyectos reales
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

      <section className="section-divider bg-white py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-6">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Equipo inicial y liderazgo</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#364765]">
              Espacios de referencia para completar con informacion confirmada. No incluye datos
              personales no autorizados.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamPlaceholders.map((member) => (
              <article key={member.id} className="rounded-3xl border border-[#d5deea] bg-[#f8fafe] p-5">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F203E] text-sm font-bold text-white">
                  C3
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#41546f]">{member.role}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#5b6d86]">{member.area}</p>
                <div className="mt-4 flex gap-2 text-xs">
                  {member.links.map((link) => (
                    <span
                      key={`${member.id}-${link}`}
                      className="rounded-full border border-[#cfd9e5] px-2.5 py-1 text-[#42536d]"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
