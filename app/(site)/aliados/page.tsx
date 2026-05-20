import type { Metadata } from "next";
import { partners } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Aliados y sponsors para talento técnico joven — C3",
  description:
    "Conoce cómo empresas, universidades y sponsors pueden colaborar con C3 para impulsar talento técnico joven y fortalecer el ecosistema tecnológico.",
  path: "/aliados",
});

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Aliados y sponsors"
        title="Una herramienta institucional para colaboración, visibilidad y conexión con talento."
        description="La página de aliados convierte el sitio en una interfaz comercial sobria para universidades, empresas y sponsors sin inventar paquetes ni montos no confirmados."
        actions={[
          { href: "/contacto", label: "Conversemos una alianza" },
          { href: "/prensa", label: "Ver factsheet" },
        ]}
      />

      <SectionWrapper>
        <Container className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="blue" className="w-fit">
                Universidades
              </Badge>
              <CardTitle className="text-2xl">Competencias, hackathons, charlas y activaciones.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              C3 puede colaborar como aliado académico y operativo para acercar más oportunidades técnicas a
              estudiantes.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Empresas
              </Badge>
              <CardTitle className="text-2xl">Visibilidad con propósito y cercanía al talento.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              La propuesta se enfoca en presencia relevante, conexión con comunidad y ecosistema técnico joven.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Estado
              </Badge>
              <CardTitle className="text-2xl">Sponsor deck y paquetes en actualización.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/72">
              <p>
                No publicamos beneficios detallados, niveles o montos hasta que esos materiales estén listos para
                uso externo.
              </p>
              <CTAButton href="/contacto" variant="secondary">
                Contactar a C3
              </CTAButton>
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Nombres visibles en el ecosistema C3</h2>
          <PartnerGrid partners={partners} />
        </Container>
      </SectionWrapper>
    </>
  );
}
