import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import C3BackgroundLayer from "@/components/backgrounds/C3BackgroundLayer";
import SeoJsonLd from "@/components/SeoJsonLd";
import { faqItems } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from "@/lib/structured-data";

const seoTitle = "Preguntas frecuentes sobre C3 | Competitive Coding Club";
const seoDescription =
  "Respuestas claras sobre qué es C3, sus líneas Compite, Crea y Conecta, cómo participar, eventos, comunidad y contacto.";

export const metadata: Metadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/faq",
  keywords: [
    "FAQ C3",
    "qué es C3",
    "Compite Crea Conecta",
    "participar en C3",
  ],
});

export default function FaqPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getFaqPageJsonLd("/faq", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/faq")} />
      <section className="relative overflow-hidden bg-[#0F203E] py-16 text-white md:py-20">
        <C3BackgroundLayer variant="dots" line="brand" intensity="low" className="opacity-85" />
        <div className="container-shell relative z-10 space-y-5">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Preguntas frecuentes sobre C3
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Esta página responde dudas clave para personas, instituciones educativas y
            organizaciones que buscan participar o colaborar con C3.
          </p>
        </div>
      </section>
      <section className="section-divider relative overflow-hidden bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-20 mix-blend-multiply" />
        <div className="container-shell relative z-10 space-y-4">
          {faqItems.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl border border-[#d5deea] bg-white p-6 shadow-[0_10px_26px_rgba(15,32,62,0.08)]"
            >
              <h2 className="text-xl font-bold">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
