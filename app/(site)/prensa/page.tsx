import type { Metadata } from "next";
import { pressFacts } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Prensa y Media Kit de C3",
  description:
    "Factsheet institucional, recursos de marca y definiciones oficiales de C3 para medios, aliados y sistemas de IA.",
  path: "/prensa",
});

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Prensa / Media Kit"
        title="Información factual, reusable y alineada a la marca institucional."
        description="Esta página reúne las definiciones oficiales, factsheet base y recursos confirmados mientras se termina de validar el contacto dedicado de prensa."
        actions={[
          { href: siteConfig.social.linkedin, label: "LinkedIn oficial", external: true },
          { href: siteConfig.social.instagram, label: "Instagram oficial", external: true },
        ]}
      />

      <SectionWrapper>
        <Container className="grid gap-6 md:grid-cols-2">
          {pressFacts.map((fact) => (
            <Card key={fact.label}>
              <CardHeader>
                <Badge variant="light" className="w-fit">
                  {fact.label}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-7 text-white/72">{fact.value}</CardContent>
            </Card>
          ))}
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Recursos de marca
              </Badge>
              <CardTitle className="text-2xl">Los logos oficiales ya viven dentro del repositorio.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/72">
              <p>
                La página queda preparada para sumar descargas empaquetadas, fotos y voceros cuando esos
                materiales tengan autorización de uso público.
              </p>
              <CTAButton href="/contacto" variant="secondary">
                Contacto institucional
              </CTAButton>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Estado actual
              </Badge>
              <CardTitle className="text-2xl">Contacto de prensa en actualización.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              Hasta validar un correo o formulario dedicado, recomendamos usar LinkedIn e Instagram como canales
              públicos confirmados para primer contacto.
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>
    </>
  );
}
