import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { faqItems } from "@/lib/content";
import { getFaqPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Preguntas frecuentes sobre C3 | Competitive Coding Club";
const seoDescription =
  "Respuestas sobre qué es C3, sus líneas Compite, Crea y Conecta, cómo participar, colaborar y contactar al club.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: `${siteConfig.domain}/faq`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function FaqPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getFaqPageJsonLd("/faq", seoTitle, seoDescription)} />

      <section className="bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-5">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Preguntas frecuentes sobre C3
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Esta página responde dudas clave para personas, instituciones educativas y
            organizaciones que buscan participar o colaborar con C3.
          </p>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-4">
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
