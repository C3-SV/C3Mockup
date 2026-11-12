import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getContactPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import type { IconType } from "react-icons";

const seoTitle = "Contacto | C3 / Competitive Coding Club";
const seoDescription =
  "Contacta a C3 para participar en eventos, proponer alianzas educativas, apoyar iniciativas o conectar con talento técnico joven.";

const officialChannels: Array<{
  title: string;
  value: string;
  description: string;
  cta: string;
  href: string;
  icon: IconType;
  external?: boolean;
}> = [
  {
    title: "Correo",
    value: siteConfig.contact.email,
    description: "Para alianzas, coordinación institucional y consultas generales.",
    cta: "Enviar correo",
    href: `mailto:${siteConfig.contact.email}`,
    icon: FiMail,
  },
  {
    title: "Instagram",
    value: "@c3.elsalvador",
    description: "Para novedades, eventos, comunidad y contenido.",
    cta: "Abrir Instagram",
    href: siteConfig.social.instagram,
    icon: FaInstagram,
    external: true,
  },
  {
    title: "LinkedIn",
    value: "C3 / Competitive Coding Club",
    description: "Para alianzas, sponsors, empresas e instituciones.",
    cta: "Ver LinkedIn",
    href: siteConfig.social.linkedin,
    icon: FaLinkedinIn,
    external: true,
  },
] as const;

const eventHelpCards = [
  {
    title: "Copa Salvadoreña de Programación",
    text: "Para inscripciones, fechas, categorías y detalles de competencia.",
    cta: "Ir a la Copa",
    href: siteConfig.sites.copa,
  },
  {
    title: "Hackathon de Turismo Creativo I",
    text: "Para información sobre el hackathon, retos, inscripción y detalles del evento.",
    cta: "Ver hackathon",
    href: siteConfig.sites.hackathon,
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/contacto",
  keywords: [
    "contacto C3",
    "contactar Competitive Coding Club",
    "alianzas C3",
    "sponsors C3",
  ],
});

export default function ContactoPage() {
  return (
    <PageShell ds>
      <SeoJsonLd data={getContactPageJsonLd("/contacto", seoTitle, seoDescription)} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/contacto")} />

      <div className="c3-frame">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>Habla con nosotros</h1>
            <p>
              Ya sea para participar, proponer una alianza educativa, apoyar como empresa o consultar
              sobre una iniciativa, elige la vía que mejor se adapte a tu objetivo.
            </p>
          </div>
        </div>
      </div>

      <section className="c3-frame c3-seccion" aria-labelledby="contacto-envio">
        <div className="c3-section-head">
          <h2 id="contacto-envio">Envía tu mensaje</h2>
          <p>
            Cuéntanos quién eres, qué buscas y cómo podemos ayudarte. El equipo de C3 recibirá tu mensaje.
          </p>
        </div>
        <ContactForm />
      </section>

      <section className="c3-frame c3-seccion" aria-labelledby="contacto-canales">
        <div className="c3-section-head">
          <h2 id="contacto-canales">Canales oficiales</h2>
        </div>
        <div className="c3-tarjetas">
          {officialChannels.map(({ title, value, description, cta, href, icon: Icon, external }) => (
            <a
              key={title}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="c3-card c3-canal"
            >
              <span className="c3-canal__icono">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="c3-etiqueta">{title}</span>
              <span className="c3-canal__valor">{value}</span>
              <span className="c3-canal__texto">{description}</span>
              <span className="c3-canal__accion">
                {cta}
                {external ? (
                  <span className="c3-arrow" aria-hidden="true">
                    ↗
                  </span>
                ) : null}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="c3-frame c3-seccion" aria-labelledby="contacto-eventos">
        <div className="c3-section-head">
          <h2 id="contacto-eventos">¿Buscas información de un evento específico?</h2>
        </div>
        <div className="c3-tarjetas c3-tarjetas--dos">
          {eventHelpCards.map((card) => (
            <article key={card.title} className="c3-card c3-contacto-ayuda">
              <h3>{card.title}</h3>
              <p className="c3-form__intro">{card.text}</p>
              <Button variant="contorno" arrow href={card.href}>
                {card.cta}
              </Button>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
