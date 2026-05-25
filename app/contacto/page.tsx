import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import SectionBadge from "@/components/ui/SectionBadge";
import { getContactPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Contacto | C3 / Competitive Coding Club";
const seoDescription =
  "Contacta a C3 para participar en eventos, proponer alianzas educativas, apoyar iniciativas o conectar con talento técnico joven.";

const contactPaths = [
  {
    title: "Quiero participar",
    description:
      "Para estudiantes, builders y talento técnico joven que quiere competir, crear proyectos y conectar con oportunidades.",
    cta: "Participar en C3",
    href: "/eventos",
  },
  {
    title: "Quiero proponer una alianza educativa",
    description:
      "Para colegios, universidades y programas formativos que desean colaborar con competencias, hackathons o experiencias técnicas.",
    cta: "Explorar línea Conecta",
    href: "/conecta",
  },
  {
    title: "Quiero apoyar como empresa u organización",
    description:
      "Para sponsors, startups y organizaciones interesadas en fortalecer el ecosistema técnico joven desde El Salvador.",
    cta: "Ser aliado",
    href: "/conecta",
  },
  {
    title: "Quiero comunicarme con el equipo",
    description:
      "Para consultas institucionales, alianzas, contexto de iniciativas y coordinación general del ecosistema C3.",
    cta: "Ir a FAQ",
    href: "/faq",
  },
] as const;

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: `${siteConfig.domain}/contacto`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function ContactoPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getContactPageJsonLd("/contacto", seoTitle, seoDescription)} />

      <section className="bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-5">
          <SectionBadge label="Contactar a C3" />
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Contacto institucional para participar y colaborar
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Elige la vía que mejor se adapta a tu objetivo y te orientamos hacia la línea,
            iniciativa o alianza adecuada.
          </p>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {contactPaths.map((path) => (
              <article
                key={path.title}
                className="rounded-3xl border border-[#d5deea] bg-white p-6 shadow-[0_10px_26px_rgba(15,32,62,0.08)]"
              >
                <h2 className="text-xl font-bold">{path.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#364765]">{path.description}</p>
                <Link
                  href={path.href}
                  className="mt-5 inline-flex rounded-full border border-[#0F203E] px-4 py-2 text-sm font-semibold text-[#0F203E] hover:bg-[#0F203E] hover:text-white"
                >
                  {path.cta}
                </Link>
              </article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="rounded-3xl border border-[#d5deea] bg-white p-5 text-sm shadow-[0_10px_26px_rgba(15,32,62,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5e6e87]">Correo</p>
              <p className="mt-2 font-semibold">{siteConfig.contact.email}</p>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#d5deea] bg-white p-5 text-sm shadow-[0_10px_26px_rgba(15,32,62,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5e6e87]">Instagram</p>
              <p className="mt-2 font-semibold">@c3.elsalvador</p>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#d5deea] bg-white p-5 text-sm shadow-[0_10px_26px_rgba(15,32,62,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5e6e87]">LinkedIn</p>
              <p className="mt-2 font-semibold">C3 / Competitive Coding Club</p>
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
