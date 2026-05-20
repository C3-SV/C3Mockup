import Image from "next/image";
import type { Metadata } from "next";
import {
  audiences,
  events,
  faqItems,
  lines,
  metrics,
  partners,
  timeline,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { getEventJsonLd, getFaqJsonLd } from "@/lib/structured-data";
import { AudienceCard } from "@/components/site/AudienceCard";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { EventCard } from "@/components/site/EventCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { GradientBackground } from "@/components/site/GradientBackground";
import { ImpactStats } from "@/components/site/ImpactStats";
import { JsonLd } from "@/components/site/JsonLd";
import { LineCard } from "@/components/site/LineCard";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { SiteFrame } from "@/components/site/SiteFrame";
import { Timeline } from "@/components/site/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = createPageMetadata({
  title: "C3 | Competitive Coding Club — Compite. Crea. Conecta.",
  description: siteConfig.description,
  path: "/",
});

const eventSchemas = events
  .map((event) => getEventJsonLd(event))
  .filter((event): event is NonNullable<ReturnType<typeof getEventJsonLd>> => Boolean(event));

export default function HomePage() {
  return (
    <SiteFrame>
      <JsonLd data={getFaqJsonLd()} />
      {eventSchemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}

      <SectionWrapper id="hero" className="pt-8 md:pt-10">
        <Container>
          <GradientBackground>
            <div className="grid gap-12 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal className="space-y-8">
                <Badge variant="light" className="w-fit">
                  Plataforma institucional para talento técnico joven
                </Badge>
                <div className="space-y-5">
                  <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                    C3 desarrolla talento técnico joven a través de competencia, creación y conexión.
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-white/74 md:text-lg">
                    Competitive Coding Club es una plataforma que conecta programación competitiva,
                    hackathons, comunidad, formación e industria para abrir oportunidades reales a la
                    próxima generación técnica.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <CTAButton href="/que-es-c3">Conoce C3</CTAButton>
                  <CTAButton href="/eventos" variant="secondary">
                    Ver eventos
                  </CTAButton>
                  <CTAButton href="/comunidad" variant="secondary">
                    Únete a la comunidad
                  </CTAButton>
                  <CTAButton href="/aliados" variant="secondary">
                    Sé aliado
                  </CTAButton>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2">
                {lines.map((line) => (
                  <Card key={line.key} className="glass-panel border-white/10 bg-white/8">
                    <CardHeader className="gap-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={line.key === "crea" ? "teal" : line.key === "conecta" ? "purple" : "blue"}>
                          {line.name}
                        </Badge>
                        <Image
                          src={line.logo}
                          alt={`Logo de ${line.name}`}
                          width={44}
                          height={44}
                          className="h-11 w-11 object-contain"
                        />
                      </div>
                      <CardTitle className="text-lg">{line.description}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
                <Card className="sm:col-span-2">
                  <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
                    <div>
                      <p className="text-3xl font-extrabold text-white">2024</p>
                      <p className="mt-2 text-sm text-white/68">Fundado el 24 de octubre en ESEN.</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">+60</p>
                      <p className="mt-2 text-sm text-white/68">Miembros de comunidad.</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">+150</p>
                      <p className="mt-2 text-sm text-white/68">Personas alcanzadas en eventos.</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </GradientBackground>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="confianza">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Barra de confianza"
            title="Evidencia temprana de una organización que ya ejecuta."
            description="C3 no se presenta como una promesa abstracta. Ya articula comunidad, eventos y aliados visibles con una dirección institucional clara."
          />
          <ImpactStats metrics={metrics} />
        </Container>
      </SectionWrapper>

      <SectionWrapper id="que-es-c3">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="space-y-6">
            <SectionHeading
              eyebrow="Qué es C3"
              title="Una organización híbrida entre comunidad, plataforma de talento y productora de eventos."
              description="C3 / Competitive Coding Club es una organización híbrida que conecta eventos de tecnología, comunidad, formación, competencias y oportunidades reales para talento técnico joven."
            />
            <p className="text-base leading-8 text-white/72">{siteConfig.longDefinition}</p>
            <CTAButton href="/que-es-c3" variant="secondary">
              Leer más sobre C3
            </CTAButton>
          </Reveal>
          <Reveal delay={0.08} className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Badge variant="blue" className="w-fit">
                  Misión
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-7 text-white/72">{siteConfig.mission}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="teal" className="w-fit">
                  Visión
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-7 text-white/72">{siteConfig.vision}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="purple" className="w-fit">
                  Enfoque
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-7 text-white/72">
                Competencia, creación y conexión como marco para desarrollar talento técnico joven con
                oportunidades reales.
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="lineas">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Compite · Crea · Conecta"
            title="Tres líneas estratégicas, una sola marca madre."
            description="Cada línea responde a una función del ecosistema C3: elevar el rigor técnico, convertir talento en construcción real y conectar personas con oportunidades."
          />
          <div className="grid gap-5 xl:grid-cols-3">
            {lines.map((line, index) => (
              <Reveal key={line.key} delay={index * 0.05}>
                <LineCard line={line} />
              </Reveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="eventos">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Eventos destacados"
            title="Experiencias que combinan visibilidad, rigor y comunidad."
            description="La Home prioriza eventos confirmados o institucionalmente relevantes para explicar cómo C3 ejecuta sus líneas en la práctica."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            {events.map((event, index) => (
              <Reveal key={event.slug} delay={index * 0.05}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="audiencias">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Para quién es"
            title="Cada audiencia encuentra una forma clara de participar."
            description="El sitio guía a estudiantes, instituciones, empresas y medios hacia la acción correcta sin forzar datos que todavía siguen en validación."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience, index) => (
              <Reveal key={audience.name} delay={index * 0.05}>
                <AudienceCard audience={audience} />
              </Reveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="impacto">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Impacto"
            title="Cifras, hitos y trayectoria institucional en una misma lectura."
            description="Datos actualizados a mayo de 2026, con foco en evidencia pública y narrativa sobria."
          />
          <Timeline items={timeline} />
        </Container>
      </SectionWrapper>

      <SectionWrapper id="aliados">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Aliados y sponsors"
            title="Una red que mezcla educación, industria y comunidad tecnológica."
            description="En esta primera versión priorizamos nombres confirmados y reservamos logos para una fase posterior con permisos explícitos."
          />
          <PartnerGrid partners={partners} />
        </Container>
      </SectionWrapper>

      <SectionWrapper id="comunidad">
        <Container className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="space-y-6">
            <SectionHeading
              eyebrow="Comunidad"
              title="Una comunidad abierta que nace desde la participación."
              description="Hoy C3 articula comunidad principalmente desde eventos y un canal operativo por WhatsApp. El formulario público llegará cuando la experiencia esté lista para escalar."
            />
            <ul className="space-y-3 text-sm leading-7 text-white/72">
              <li>Acceso a información de eventos, charlas y convocatorias.</li>
              <li>Conexión con estudiantes, mentores y aliados del ecosistema.</li>
              <li>Mayor visibilidad para oportunidades técnicas y builder pathways.</li>
            </ul>
            <CTAButton href="/comunidad">Únete a la comunidad</CTAButton>
          </Reveal>
          <Reveal delay={0.08}>
            <Card>
              <CardHeader>
                <Badge variant="default" className="w-fit">
                  Estado actual
                </Badge>
                <CardTitle className="text-2xl">Canal operativo por WhatsApp · Formulario en actualización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-white/72">
                <p>
                  No publicamos un enlace de ingreso directo porque el flujo institucional definitivo todavía
                  está en cierre. Mientras tanto, la página de comunidad concentra contexto, beneficios y
                  próximos pasos.
                </p>
                <CTAButton href="/contacto" variant="secondary">
                  Contactar a C3
                </CTAButton>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper id="faq">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Preguntas frecuentes para usuarios, aliados y motores de búsqueda."
            description="La sección de FAQ también fortalece la indexabilidad y prepara respuestas consistentes para búsqueda asistida por IA."
          />
          <FAQAccordion items={faqItems} />
        </Container>
      </SectionWrapper>

      <SectionWrapper id="cta-final" className="pb-20">
        <Container>
          <GradientBackground>
            <div className="space-y-8 px-6 py-10 text-center md:px-10 md:py-14">
              <Badge variant="light" className="mx-auto w-fit">
                Cierre institucional
              </Badge>
              <div className="mx-auto max-w-3xl space-y-4">
                <h2 className="text-balance text-3xl font-extrabold text-white md:text-5xl">
                  Forma parte de la nueva generación técnica que compite, crea y conecta.
                </h2>
                <p className="text-base leading-8 text-white/72 md:text-lg">
                  C3 está construyendo una base seria, joven y escalable para talento técnico con visión
                  regional, comunidad y oportunidades reales.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <CTAButton href="/comunidad">Participar</CTAButton>
                <CTAButton href="/aliados" variant="secondary">
                  Ser aliado
                </CTAButton>
                <CTAButton href="/contacto" variant="secondary">
                  Contactar
                </CTAButton>
              </div>
            </div>
          </GradientBackground>
        </Container>
      </SectionWrapper>
    </SiteFrame>
  );
}
