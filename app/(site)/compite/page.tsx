import type { Metadata } from "next";
import { events, lines } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getEventJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { EventCard } from "@/components/site/EventCard";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Compite | Programación competitiva y excelencia técnica — C3",
  description:
    "La línea Compite de C3 impulsa programación competitiva, torneos, entrenamiento algorítmico y excelencia técnica para estudiantes y talento joven.",
  path: "/compite",
});

const line = lines.find((item) => item.key === "compite")!;
const competeEvents = events.filter((event) => event.line === "compite");
const copaSchema = getEventJsonLd(competeEvents[0]);

export default function CompitePage() {
  return (
    <>
      {copaSchema ? <JsonLd data={copaSchema} /> : null}
      <PageHero
        eyebrow="Compite"
        title="Programación competitiva y excelencia técnica con identidad propia."
        description={line.detail}
        actions={[
          { href: "https://copa.c3.com.sv", label: "Ir a la Copa", external: true },
          { href: "/eventos", label: "Ver eventos" },
        ]}
        aside={
          <Card className="w-full">
            <CardHeader>
              <Badge variant="blue" className="w-fit">
                Qué impulsa
              </Badge>
              <CardTitle className="text-2xl">{line.description}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">{line.visual}</CardContent>
          </Card>
        }
      />

      <SectionWrapper>
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Competiciones"
            title="Copa, ICPC y cultura de entrenamiento sostenido."
            description="Compite conecta rigor técnico con visibilidad pública a través de competencias, editoriales, preparación y comunidad."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            {competeEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="blue" className="w-fit">
                Copa 2025
              </Badge>
              <CardTitle className="text-2xl">Primera edición con alrededor de 130 participantes.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              Fases el 17 y 24 de mayo y 7 de junio de 2025, con final presencial en ESEN como primer gran
              punto de expansión pública de C3.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="blue" className="w-fit">
                ICPC
              </Badge>
              <CardTitle className="text-2xl">Apoyo institucional a la sede de El Salvador.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              C3 apoya la narrativa y el alcance digital de ICPC Centroamérica en El Salvador, fortaleciendo la
              conexión entre competencia e industria.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                TODO seguro
              </Badge>
              <CardTitle className="text-2xl">Ruta de recursos en actualización.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/72">
              <p>
                La página queda preparada para sumar editoriales, problemas históricos, guías de Codeforces y
                temarios por nivel cuando esos recursos estén listos para publicación.
              </p>
              <CTAButton href="/contacto" variant="secondary">
                Consultar colaboraciones
              </CTAButton>
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>
    </>
  );
}
