import type { Metadata } from "next";
import { audiences, lines, partners } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { AudienceCard } from "@/components/site/AudienceCard";
import { Container } from "@/components/site/Container";
import { PageHero } from "@/components/site/PageHero";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Conecta | Comunidad, industria y oportunidades — C3",
  description:
    "La línea Conecta de C3 acerca talento técnico joven con comunidad, universidades, empresas, startups, sponsors y oportunidades reales.",
  path: "/conecta",
});

const line = lines.find((item) => item.key === "conecta")!;

export default function ConectaPage() {
  return (
    <>
      <PageHero
        eyebrow="Conecta"
        title="Comunidad, industria y oportunidades reales como parte del mismo ecosistema."
        description={line.detail}
        actions={[
          { href: "/comunidad", label: "Unirme a la comunidad" },
          { href: "/aliados", label: "Ser aliado" },
        ]}
        aside={
          <Card className="w-full">
            <CardHeader>
              <Badge variant="purple" className="w-fit">
                Canal actual
              </Badge>
              <CardTitle className="text-2xl">WhatsApp operativo · formulario próximo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              La experiencia pública se comunica con transparencia: la comunidad existe y funciona, pero el
              flujo web definitivo de ingreso sigue en actualización.
            </CardContent>
          </Card>
        }
      />

      <SectionWrapper>
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Audiencias"
            title="Conecta le da una ruta clara a cada actor del ecosistema."
            description="Desde estudiantes hasta sponsors, la página prioriza mensajes accionables y sobrios."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience) => (
              <AudienceCard key={audience.name} audience={audience} />
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Red institucional"
            title="Aliados educativos, empresas y comunidad alrededor de la marca madre C3."
            description="Conecta no se comunica como una sub-marca aislada, sino como el punto de puente entre líneas, aliados y oportunidades."
          />
          <PartnerGrid partners={partners.slice(0, 8)} />
        </Container>
      </SectionWrapper>
    </>
  );
}
