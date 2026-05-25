import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getContactPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import type { IconType } from "react-icons";

const seoTitle = "Contacto | C3 / Competitive Coding Club";
const seoDescription =
  "Contacta a C3 para participar en eventos, proponer alianzas educativas, apoyar iniciativas o conectar con talento técnico joven.";

const intentionCards = [
  {
    title: "Quiero participar en C3",
    subtitle: "Para estudiantes, builders y talento técnico joven.",
    text: "Participa en competencias, hackathons, comunidad y espacios de aprendizaje para desarrollar habilidades, construir proyectos y conectar con oportunidades reales.",
    cta: "Participar en C3",
    href: "/eventos",
    accent: "#205298",
  },
  {
    title: "Quiero proponer una alianza educativa",
    subtitle: "Para colegios, universidades y programas formativos.",
    text: "Colabora con C3 para llevar competencias, hackathons, charlas, talleres y experiencias técnicas a tus estudiantes.",
    cta: "Proponer alianza",
    href: "/conecta",
    accent: "#33BEAC",
  },
  {
    title: "Quiero apoyar como empresa u organización",
    subtitle: "Para empresas, startups, sponsors y aliados del ecosistema.",
    text: "Apoya experiencias de alto impacto, conecta con talento joven y fortalece el ecosistema tecnológico desde El Salvador hacia la región.",
    cta: "Ser aliado",
    href: "/conecta",
    accent: "#4F5BA9",
  },
  {
    title: "Tengo una consulta general",
    subtitle: "Para coordinación institucional, dudas sobre eventos o comunicación directa con el equipo.",
    text: "Si tu consulta no encaja en las otras categorías, completá el formulario o revisá las preguntas frecuentes.",
    cta: "Ir a FAQ",
    href: "/faq",
    accent: "#0F203E",
  },
] as const;

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

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: `${siteConfig.domain}/contacto`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function ContactoPage() {
  return (
    <PageShell backgroundClassName="bg-[#F4F7FB]">
      <SeoJsonLd data={getContactPageJsonLd("/contacto", seoTitle, seoDescription)} />

      <section className="relative overflow-hidden bg-[#0F203E] py-16 text-white md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(51,190,172,0.18),transparent_32%),radial-gradient(circle_at_82%_16%,rgba(79,91,169,0.24),transparent_35%),radial-gradient(circle_at_50%_78%,rgba(32,82,152,0.22),transparent_38%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        </div>

        <div className="container-shell relative space-y-6">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Habla con nosotros
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Ya sea para participar, proponer una alianza educativa, apoyar como empresa o consultar
            sobre una iniciativa, elegí la vía que mejor se adapte a tu objetivo.
          </p>
        </div>
      </section>
    
      <section className="section-divider bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-8">
          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
              Enviá tu mensaje
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Contanos quién sos, qué buscás y cómo podemos ayudarte. El equipo de C3 recibirá tu
              mensaje.
            </p>
          </div>
            <ContactForm />
  
        </div>
      </section>

      <section className="section-divider bg-[#F4F7FB] py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-8">
          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
              Canales oficiales
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {officialChannels.map(({ title, value, description, cta, href, icon: Icon, external }) => (
              <a
                key={title}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="flex h-full flex-col rounded-[1.7rem] border border-[#d5deea] bg-white p-6 shadow-[0_14px_36px_rgba(15,32,62,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,32,62,0.12)]"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1 space-y-2 pr-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                      {title}
                    </p>
                    <p className="text-lg font-bold leading-tight break-words">{value}</p>
                  </div>
                  <span className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F203E] text-white">
                    <Icon size={18} className="shrink-0" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#364765]">{description}</p>
                <span className="mt-6 inline-flex w-fit rounded-full border border-[#0F203E] px-4 py-2 text-sm font-semibold text-[#0F203E] transition hover:bg-[#0F203E] hover:text-white">
                  {cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-white py-16 text-[#0F203E] md:py-20">
        <div className="container-shell space-y-8">
          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
              ¿Buscás información de un evento específico?
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {eventHelpCards.map((card) => (
              <article
                key={card.title}
                className="flex h-full flex-col rounded-[1.8rem] border border-[#d5deea] bg-[#F8FAFD] p-6 shadow-[0_12px_30px_rgba(15,32,62,0.06)]"
              >
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#364765]">{card.text}</p>
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-fit rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                >
                  {card.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
