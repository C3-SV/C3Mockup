import type { Metadata } from "next";
import { events, lines } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { EventCard } from "@/components/site/EventCard";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "Crea | Hackathons y proyectos tecnológicos — C3",
  description:
    "La línea Crea de C3 impulsa hackathons, builders, innovación y proyectos tecnológicos creados por talento joven.",
  path: "/crea",
});

const line = lines.find((item) => item.key === "crea")!;
const creaEvents = events.filter((event) => event.line === "crea");

export default function CreaPage() {
  return (
    <>
      <PageHero
        eyebrow="Crea"
        title="Hackathons, builders y proyectos tecnológicos con ejecución real."
        description={line.detail}
        actions={[
          { href: "/eventos", label: "Ver hackathons" },
          { href: "/contacto", label: "Proponer reto" },
        ]}
        aside={
          <Card className="w-full">
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Framework propuesto
              </Badge>
              <CardTitle className="text-2xl">C3 Build Sprint</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              Reto claro, equipo multidisciplinario, mentoría ligera, demo funcional, feedback de industria y
              cierre con próximos pasos.
            </CardContent>
          </Card>
        }
      />

      <SectionWrapper>
        <Container className="grid gap-6 lg:grid-cols-2">
          {creaEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Publicación cuidada
              </Badge>
              <CardTitle className="text-2xl">Casos y hackathons futuros quedan reservados hasta confirmación.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/72">
              <p>
                El sitio evita publicar retos, aliados o fechas de hackathons que todavía no tengan autorización
                formal. La estructura queda lista para incorporarlos sin rehacer la página.
              </p>
              <CTAButton href="/prensa" variant="secondary">
                Ver descripción oficial
              </CTAButton>
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>

      <SectionWrapper className="pb-20">
        <Container className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Rol
              </Badge>
              <CardTitle className="text-2xl">Transformar capacidad técnica en construcción visible.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              Crea complementa la formación competitiva con prototipado, colaboración y narrativa builder.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="teal" className="w-fit">
                Primer hito
              </Badge>
              <CardTitle className="text-2xl">Hack@Latam como referencia pública inicial.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              Sirve para mostrar que la línea ya tiene un punto de apoyo real aunque todavía esté en etapa de
              consolidación narrativa y metodológica.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                TODO seguro
              </Badge>
              <CardTitle className="text-2xl">Galería de proyectos en actualización.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              La página queda preparada para sumar casos, equipos y resultados una vez que existan nombres,
              demos y autorizaciones para publicación.
            </CardContent>
          </Card>
        </Container>
      </SectionWrapper>
    </>
  );
}
