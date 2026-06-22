import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { teamLeaders } from "@/lib/content";
import { getAboutPageJsonLd, getBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { FaLinkedinIn } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const seoTitle = "Qué es C3 / Competitive Coding Club | Talento técnico joven";
const seoDescription =
  "Conoce la historia, misión, visión, equipo y enfoque de C3, una plataforma institucional de talento técnico joven nacida en El Salvador.";

export const metadata: Metadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/que-es-c3",
  keywords: [
    "qué es C3",
    "Competitive Coding Club",
    "talento técnico joven",
    "comunidad tecnológica El Salvador",
  ],
});

export default function QueEsC3Page() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd data={getAboutPageJsonLd("/que-es-c3", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/que-es-c3")} />

      <section className="bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-5">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            C3 / Competitive Coding Club
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            C3 es el hub institucional que articula competencia, creación y conexión para
            desarrollar la próxima generación técnica joven de El Salvador y la región.
          </p>
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-6">
          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Qué es C3</h2>
                <p className="text-sm leading-7 text-[#364765]">
                  C3 / Competitive Coding Club es una plataforma institucional de talento técnico
                  joven que conecta competencia, creación y oportunidades reales para estudiantes,
                  comunidades y aliados que quieren impulsar el ecosistema tecnológico.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  Nuestro enfoque une programación competitiva, hackathons, comunidad, formación e
                  industria en una misma experiencia. La meta es que aprender, practicar, construir
                  y participar en retos de alto nivel se sientan como parte del mismo camino.
                </p>
              </div>

              <div className="space-y-3 border-t border-[#e4ebf3] pt-8">
                <h2 className="text-2xl font-bold">Historia de C3</h2>
                <p className="text-sm leading-7 text-[#364765]">
                  La idea de C3 nació en 2024, durante nuestro primer año en ESEN. Junto a Roberto
                  Polanco y Óscar Pleités, compartíamos experiencia en programación competitiva y
                  tecnología, pero también una búsqueda en común: crear un espacio donde más
                  personas pudieran acercarse a estos temas, aprender, practicar y competir en
                  grandes eventos.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  No empezamos con una gran estructura ni con un plan perfecto. Comenzamos con una
                  idea sencilla y honesta: compartir lo que ya habíamos aprendido, entrenar con
                  otras personas y construir un espacio que hacía falta, uno que a nosotros también
                  nos hubiera gustado encontrar antes.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  Con el tiempo entendimos que hacía falta algo más amplio. No bastaba con entrenar;
                  también era necesario crear espacios donde los jóvenes pudieran competir, descubrir
                  su talento y tener un primer acercamiento real al mundo de la tecnología. Así
                  comenzamos a ampliar el equipo, sumando amigos como Rodrigo López, Fiorella
                  Guzmán, Celeste Aparicio y varios compañeros de distintas carreras, con perfiles
                  diferentes, ideas nuevas y muchas ganas de construir.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  Con ese esfuerzo colectivo realizamos la primera edición de la Copa Salvadoreña de
                  Programación en mayo y junio de 2025. Ese primer gran evento nos cambió la forma
                  de ver a C3: al reunir a tantos jóvenes de distintos colegios y universidades,
                  vimos de cerca la emoción de competir, la alegría de resolver un problema y la
                  satisfacción de descubrir que sí eran capaces de enfrentar grandes desafíos.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  Desde entonces, C3 empezó a crecer más allá de la programación competitiva.
                  Comenzamos a construir comunidad con quienes habían participado en nuestros
                  eventos, a conectar con patrocinadores, empresas, aliados y otras comunidades, y a
                  abrir nuevas formas de crear proyectos, compartir conocimiento y generar
                  oportunidades. Así nació una visión más amplia: competir, crear y conectar.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  C3 existe porque creemos en el talento joven. Porque lo hemos visto de cerca.
                  Porque sabemos que, cuando una persona encuentra el espacio correcto, una comunidad
                  que la acompaña y un reto que la empuja a crecer, pueden pasar cosas increíbles.
                </p>
                <p className="text-sm leading-7 text-[#364765]">
                  Si alguna vez has querido aprender, competir, crear, conectar o simplemente
                  encontrar un lugar donde tu talento pueda crecer, este espacio también es para ti.
                </p>
                <p className="pt-2 text-sm font-semibold leading-7 text-[#0F203E]">
                  <strong>Bienvenido/a a C3.</strong>
                </p>
                <p className="text-sm leading-7 text-[#5c6a82]">— Christopher Marroquín</p>
              </div>
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Misión</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.mission}</p>
            </article>
            <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
              <h2 className="text-2xl font-bold">Visión</h2>
              <p className="mt-3 text-sm leading-7 text-[#364765]">{siteConfig.vision}</p>
            </article>
          </div>

          <article className="rounded-3xl border border-[#d5deea] bg-white p-7 shadow-[0_12px_30px_rgba(15,32,62,0.08)]">
            <h2 className="text-2xl font-bold">Propuesta de valor</h2>
            <p className="mt-3 text-sm leading-7 text-[#364765]">
              C3 conecta el rigor técnico de las competencias, la construcción de proyectos reales
              y el puente hacia instituciones, empresas y oportunidades para talento joven.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/compite" className="font-semibold text-[#205298] hover:underline">
                Compite
              </Link>
              <Link href="/crea" className="font-semibold text-[#33BEAC] hover:underline">
                Crea
              </Link>
              <Link href="/conecta" className="font-semibold text-[#4F5BA9] hover:underline">
                Conecta
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section-divider relative overflow-hidden bg-white py-14 text-[#0F203E] md:py-16">
        <div className="container-shell space-y-5">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-bold leading-tight md:text-[2.15rem]">
              Equipo líder
            </h2>
            <p className="text-base leading-8 text-[#364765] md:text-lg">
              Las personas que hacen que el C3 sea posible.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamLeaders.map((member) => (
              <article
                key={member.name}
                className="flex h-full flex-col rounded-[1.45rem] border border-[#dbe4ef] bg-[#F8FAFD] p-3 shadow-[0_8px_18px_rgba(15,32,62,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,32,62,0.08)]"
              >
                <div className="relative aspect-[4/4.08] overflow-hidden rounded-[1.15rem] border border-[#dbe4ef] bg-gradient-to-br from-[#edf3f8] via-[#f9fbfd] to-white">
                  {member.photoSrc ? (
                    <Image
                      src={member.photoSrc}
                      alt={member.photoAlt ?? member.name}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-2.5">
                      <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6a82] backdrop-blur-sm">
                        Imagen pendiente
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 space-y-0.5">
                  <p className="text-[0.98rem] font-bold leading-tight text-[#0F203E]">{member.name}</p>
                  <p className="text-[0.78rem] font-medium leading-5 text-[#205298]">{member.role}</p>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href={member.linkedinHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} en LinkedIn`}
                    title="LinkedIn"
                    className="inline-flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-full border border-[#dbe4ef] bg-white text-[#205298] transition hover:border-[#205298] hover:bg-[#eef4fb]"
                  >
                    <FaLinkedinIn size={12} aria-hidden="true" />
                  </a>

                  {member.portfolioHref ? (
                    <a
                      href={member.portfolioHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} portafolio`}
                      title="Portafolio"
                      className="inline-flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-full border border-[#dbe4ef] bg-white text-[#33BEAC] transition hover:border-[#33BEAC] hover:bg-[#effaf8]"
                    >
                      <FiLink size={12} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </PageShell>
  );
}
