import type { Metadata } from "next";
import { timeline } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Timeline } from "@/components/site/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Qué es C3 / Competitive Coding Club | Talento técnico joven",
  description:
    "Conoce C3, una plataforma de desarrollo de talento técnico joven que conecta competencia, creación, comunidad y oportunidades reales.",
  path: "/que-es-c3",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Qué es C3"
        title="Una plataforma nacida en ESEN que evolucionó de club universitario a hub institucional."
        description={siteConfig.longDefinition}
        actions={[
          { href: "/compite", label: "Conoce Compite" },
          { href: "/eventos", label: "Ver eventos" },
        ]}
        aside={
          <Card className="w-full">
            <CardHeader>
              <Badge variant="light" className="w-fit">
                Definición corta
              </Badge>
              <CardTitle className="text-2xl">{siteConfig.shortDefinition}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>{siteConfig.mission}</p>
              <p>{siteConfig.vision}</p>
            </CardContent>
          </Card>
        }
      />

      <SectionWrapper>
        <Container className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="blue" className="w-fit">
                Qué hace
              </Badge>
              <CardTitle className="text-2xl">Competencias, hackathons, comunidad y oportunidades.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              C3 diseña experiencias que integran competencia técnica, construcción de proyectos,
              conexión con industria y crecimiento de comunidad.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Qué no es
              </Badge>
              <CardTitle className="text-2xl">Ni un club informal, ni una startup sobreactuada.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              La marca evita estética gamer, hype vacío o promesas no verificadas. Busca verse joven,
              técnica, confiable y preparada para crecer.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="purple" className="w-fit">
                Equipo de origen
              </Badge>
              <CardTitle className="text-2xl">Fundadores y expansión temprana.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              C3 comenzó con Christopher Marroquín, Roberto Polanco, Óscar Pleités y Diego Arévalo.
              Luego se sumaron Rodrigo López, Celeste Aparicio, Angie Fiorella Alberto, Roberto Morán
              y Javier Galdámez.
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Historia"
            title="Una evolución rápida con base técnica real."
            description="La historia de C3 ayuda a entender por qué la marca hoy necesita una presencia institucional más sólida que una landing de evento."
          />
          <Timeline items={timeline} />
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container>
          <Card>
            <CardHeader>
              <Badge variant="light" className="w-fit">
                Próximo paso
              </Badge>
              <CardTitle className="text-3xl">Explora cómo se materializa C3 en Compite, Crea y Conecta.</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 pt-0">
              <CTAButton href="/compite">Ir a Compite</CTAButton>
              <CTAButton href="/crea" variant="secondary">
                Ir a Crea
              </CTAButton>
              <CTAButton href="/conecta" variant="secondary">
                Ir a Conecta
              </CTAButton>
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>
    </>
  );
}
