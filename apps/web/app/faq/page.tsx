import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
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
    <PageShell ds>
      <SeoJsonLd data={getFaqPageJsonLd("/faq", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/faq")} />

      <div className="c3-frame">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>Preguntas frecuentes sobre C3</h1>
            <p>
              Esta página responde dudas clave para personas, instituciones educativas y
              organizaciones que buscan participar o colaborar con C3.
            </p>
          </div>
        </div>
      </div>

      <section className="c3-frame c3-seccion">
        <div className="c3-faq-lista">
          {faqItems.map((item) => (
            <article key={item.question} className="c3-card c3-faq-item">
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
