import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Comunidad C3",
  description:
    "Conoce cómo unirte a la comunidad de C3, sus beneficios actuales y el estado del canal operativo mientras el formulario web se encuentra en actualización.",
  path: "/comunidad",
});

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Comunidad"
        title="Participar ya te conecta con la comunidad C3."
        description="La comunidad actual es abierta para quienes participan en eventos u oportunidades C3. El sitio comunica beneficios y próximos pasos sin fingir un onboarding que todavía no está cerrado."
      />

      <SectionWrapper className="pb-20">
        <Container className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Beneficios
              </Badge>
              <CardTitle className="text-2xl">Eventos, charlas, networking y oportunidades.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              La comunidad sirve como canal para enterarse de convocatorias, contenido y espacios relevantes del
              ecosistema C3.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Estado actual
              </Badge>
              <CardTitle className="text-2xl">WhatsApp operativo · formulario próximamente.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              El formulario público y sus reglas de acceso quedan preparados como siguiente iteración para no
              prometer una experiencia que todavía se está afinando.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="purple" className="w-fit">
                Próximo paso
              </Badge>
              <CardTitle className="text-2xl">Contacta a C3 o explora eventos activos.</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 pt-0">
              <CTAButton href="/eventos">Ver eventos</CTAButton>
              <CTAButton href="/contacto" variant="secondary">
                Contactar
              </CTAButton>
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>
    </>
  );
}
