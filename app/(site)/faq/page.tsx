import type { Metadata } from "next";
import { faqItems } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/site/Container";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ | Competitive Coding Club",
  description:
    "Preguntas frecuentes sobre C3, sus líneas, participación, comunidad, aliados y contacto institucional.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={getFaqJsonLd()} />
      <PageHero
        eyebrow="FAQ"
        title="Respuestas directas para usuarios, aliados y sistemas de búsqueda."
        description="La página FAQ consolida definiciones, participación y relación con Copa para hacer el sitio más claro e indexable."
      />

      <SectionWrapper className="pb-20">
        <Container>
          <FAQAccordion items={faqItems} />
        </Container>
      </SectionWrapper>
    </>
  );
}
