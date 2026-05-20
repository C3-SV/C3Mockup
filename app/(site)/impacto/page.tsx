import type { Metadata } from "next";
import { metrics, partners, timeline } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/site/Container";
import { ImpactStats } from "@/components/site/ImpactStats";
import { PageHero } from "@/components/site/PageHero";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Timeline } from "@/components/site/Timeline";

export const metadata: Metadata = createPageMetadata({
  title: "Impacto de C3",
  description:
    "Cifras, hitos, eventos y evidencia pública del impacto de C3 como plataforma de talento técnico joven.",
  path: "/impacto",
});

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impacto"
        title="Probar que C3 existe, ejecuta y genera valor."
        description="La página de impacto reúne cifras verificables, hitos institucionales y aliados visibles con una fecha de corte clara: mayo de 2026."
      />

      <SectionWrapper>
        <Container className="space-y-8">
          <ImpactStats metrics={metrics} />
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Timeline institucional</h2>
          <Timeline items={timeline} />
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Aliados que refuerzan la narrativa de impacto</h2>
          <PartnerGrid partners={partners.slice(0, 8)} />
        </Container>
      </SectionWrapper>
    </>
  );
}
