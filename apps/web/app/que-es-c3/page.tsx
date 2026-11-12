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
    <PageShell ds>
      <SeoJsonLd data={getAboutPageJsonLd("/que-es-c3", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/que-es-c3")} />

      <div className="c3-frame">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>C3 / Competitive Coding Club</h1>
            <p>
              C3 es el hub institucional que articula competencia, creación y conexión para
              desarrollar la próxima generación técnica joven de El Salvador y la región.
            </p>
          </div>
        </div>
      </div>

      <section className="c3-frame c3-seccion">
        <article className="c3-card c3-texto-largo">
          <div className="c3-texto-largo__bloque">
            <h2>Qué es C3</h2>
            <p>
              C3 / Competitive Coding Club es una plataforma institucional de talento técnico
              joven que conecta competencia, creación y oportunidades reales para estudiantes,
              comunidades y aliados que quieren impulsar el ecosistema tecnológico.
            </p>
            <p>
              Nuestro enfoque une programación competitiva, hackathons, comunidad, formación e
              industria en una misma experiencia. La meta es que aprender, practicar, construir
              y participar en retos de alto nivel se sientan como parte del mismo camino.
            </p>
          </div>

          <div className="c3-texto-largo__bloque">
            <h2>Historia de C3</h2>
            <p>
              La idea de C3 nació en 2024, durante nuestro primer año en ESEN. Junto a Roberto
              Polanco y Óscar Pleités, compartíamos experiencia en programación competitiva y
              tecnología, pero también una búsqueda en común: crear un espacio donde más
              personas pudieran acercarse a estos temas, aprender, practicar y competir en
              grandes eventos.
            </p>
            <p>
              No empezamos con una gran estructura ni con un plan perfecto. Comenzamos con una
              idea sencilla y honesta: compartir lo que ya habíamos aprendido, entrenar con
              otras personas y construir un espacio que hacía falta, uno que a nosotros también
              nos hubiera gustado encontrar antes.
            </p>
            <p>
              Con el tiempo entendimos que hacía falta algo más amplio. No bastaba con entrenar;
              también era necesario crear espacios donde los jóvenes pudieran competir, descubrir
              su talento y tener un primer acercamiento real al mundo de la tecnología. Así
              comenzamos a ampliar el equipo, sumando amigos como Rodrigo López, Fiorella
              Guzmán, Celeste Aparicio y varios compañeros de distintas carreras, con perfiles
              diferentes, ideas nuevas y muchas ganas de construir.
            </p>
            <p>
              Con ese esfuerzo colectivo realizamos la primera edición de la Copa Salvadoreña de
              Programación en mayo y junio de 2025. Ese primer gran evento nos cambió la forma
              de ver a C3: al reunir a tantos jóvenes de distintos colegios y universidades,
              vimos de cerca la emoción de competir, la alegría de resolver un problema y la
              satisfacción de descubrir que sí eran capaces de enfrentar grandes desafíos.
            </p>
            <p>
              Desde entonces, C3 empezó a crecer más allá de la programación competitiva.
              Comenzamos a construir comunidad con quienes habían participado en nuestros
              eventos, a conectar con patrocinadores, empresas, aliados y otras comunidades, y a
              abrir nuevas formas de crear proyectos, compartir conocimiento y generar
              oportunidades. Así nació una visión más amplia: competir, crear y conectar.
            </p>
            <p>
              C3 existe porque creemos en el talento joven. Porque lo hemos visto de cerca.
              Porque sabemos que, cuando una persona encuentra el espacio correcto, una comunidad
              que la acompaña y un reto que la empuja a crecer, pueden pasar cosas increíbles.
            </p>
            <p>
              Si alguna vez has querido aprender, competir, crear, conectar o simplemente
              encontrar un lugar donde tu talento pueda crecer, este espacio también es para ti.
            </p>
            <p className="c3-texto-largo__cierre">
              <strong>Bienvenido/a a C3.</strong>
            </p>
            <p className="c3-texto-largo__firma">— Christopher Marroquín</p>
          </div>
        </article>

        <div className="c3-tarjetas c3-tarjetas--dos">
          <article className="c3-card c3-tarjeta-texto">
            <h2>Misión</h2>
            <p>{siteConfig.mission}</p>
          </article>
          <article className="c3-card c3-tarjeta-texto">
            <h2>Visión</h2>
            <p>{siteConfig.vision}</p>
          </article>
        </div>

        <article className="c3-card c3-tarjeta-texto">
          <h2>Propuesta de valor</h2>
          <p>
            C3 conecta el rigor técnico de las competencias, la construcción de proyectos reales
            y el puente hacia instituciones, empresas y oportunidades para talento joven.
          </p>
          <div className="c3-enlaces-linea">
            <Link href="/compite" className="c3-enlace-linea c3-enlace-linea--compite">
              Compite
            </Link>
            <Link href="/crea" className="c3-enlace-linea c3-enlace-linea--crea">
              Crea
            </Link>
            <Link href="/conecta" className="c3-enlace-linea c3-enlace-linea--conecta">
              Conecta
            </Link>
          </div>
        </article>
      </section>

      <section className="c3-frame c3-seccion" aria-labelledby="equipo-lider">
        <div className="c3-section-head">
          <h2 id="equipo-lider">Equipo líder</h2>
          <p>Las personas que hacen que el C3 sea posible.</p>
        </div>

        <div className="c3-tarjetas">
          {teamLeaders.map((member) => (
            <article key={member.name} className="c3-card c3-equipo">
              <div className="c3-equipo__foto">
                {member.photoSrc ? (
                  <Image
                    src={member.photoSrc}
                    alt={member.photoAlt ?? member.name}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 100vw"
                  />
                ) : (
                  <span className="c3-equipo__pendiente">Imagen pendiente</span>
                )}
              </div>

              <div className="c3-equipo__texto">
                <p className="c3-equipo__nombre">{member.name}</p>
                <p className="c3-equipo__rol">{member.role}</p>
              </div>

              <div className="c3-equipo__enlaces">
                <a
                  href={member.linkedinHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} en LinkedIn`}
                  title="LinkedIn"
                  className="c3-equipo__enlace"
                >
                  <FaLinkedinIn size={14} aria-hidden="true" />
                </a>

                {member.portfolioHref ? (
                  <a
                    href={member.portfolioHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} portafolio`}
                    title="Portafolio"
                    className="c3-equipo__enlace c3-equipo__enlace--portafolio"
                  >
                    <FiLink size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
