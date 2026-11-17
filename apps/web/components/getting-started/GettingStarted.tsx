import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CommunityAction, GettingStartedContent } from "@/lib/getting-started-content";
import { siteConfig } from "@/lib/site";

type GettingStartedProps = {
  content: GettingStartedContent;
  communityAction: CommunityAction;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

const lineLinks: Record<string, { href: string; className: string; area: string }> = {
  Compite: { href: "/compite", className: "c3-enlace-linea--compite", area: "compite" },
  Crea: { href: "/crea", className: "c3-enlace-linea--crea", area: "crea" },
  Conecta: { href: "/conecta", className: "c3-enlace-linea--conecta", area: "conecta" },
};

const NOTICE_ID = "aviso-comunidad-externa";

function splitLine(text: string): { name: string; rest: string } | null {
  const index = text.indexOf(": ");
  if (index < 0) return null;
  const name = text.slice(0, index);
  return lineLinks[name] ? { name, rest: text.slice(index + 2) } : null;
}

/**
 * Guía lineal «Empieza en C3», leída como un sitio informativo: cada bloque responde una pregunta de quien
 * nos conoce. Componente de servidor: no requiere JavaScript. La órbita del encabezado es decorativa (aria-hidden)
 * y se detiene con prefers-reduced-motion (app/ds/empieza-en-c3.css).
 */
export default function GettingStarted({ content, communityAction, faqs }: GettingStartedProps) {
  const external = communityAction.external;
  const stepById = (id: string) => content.steps.find((s) => s.id === id);
  const areas = stepById("que-puedes-encontrar");
  const firstStep = stepById("primer-paso");
  const participate = stepById("participar");
  const noEvent = stepById("sin-experiencia");

  return (
    <div className="c3-guia">
      <header className="c3-frame c3-guia-hero">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
        </div>
        <div className="c3-guia-orbita" aria-hidden="true">
          <div className="c3-orbit">
            <span className="c3-orbit__ring c3-orbit__ring--outer" />
            <span className="c3-orbit__ring c3-orbit__ring--inner" />
            <span className="c3-orbit__spin c3-orbit__spin--outer">
              <span className="c3-orbit__satellite c3-orbit__satellite--compite" />
              <span className="c3-orbit__satellite c3-orbit__satellite--crea c3-orbit__satellite--bottom" />
            </span>
            <span className="c3-orbit__spin c3-orbit__spin--inner">
              <span className="c3-orbit__satellite c3-orbit__satellite--conecta" />
            </span>
            <span className="c3-orbit__mark">
              <Image src="/brand/c3/c3-symbol.png" alt="" width={200} height={200} />
            </span>
          </div>
        </div>
      </header>

      {areas ? (
        <section className="c3-frame c3-seccion c3-guia-bloque" aria-labelledby={areas.id}>
          <h2 id={areas.id} className="c3-guia__titulo">
            {areas.title}
          </h2>
          <div className="c3-guia-areas">
            {areas.paragraphs.map((text) => {
              const line = splitLine(text);
              if (!line) return <p key={text}>{text}</p>;
              const target = lineLinks[line.name];
              return (
                <article key={line.name} className={`c3-guia-area c3-guia-area--${target.area}`}>
                  <h3>
                    <Link href={target.href} className={`c3-enlace-linea ${target.className}`}>
                      {line.name}
                    </Link>
                  </h3>
                  <p>{line.rest}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {firstStep ? (
        <section className="c3-frame c3-seccion c3-guia-bloque c3-guia-comunidad" aria-labelledby={firstStep.id}>
          <h2 id={firstStep.id} className="c3-guia__titulo c3-guia-comunidad__titulo">
            {firstStep.title}
          </h2>
          {external ? (
            <>
              {firstStep.paragraphs.map((text) => (
                <p key={text} className="c3-guia-lead">
                  {text}
                </p>
              ))}
              <div className="c3-actions">
                <Button href={communityAction.href} arrow aria-describedby={NOTICE_ID}>
                  {communityAction.label}
                </Button>
              </div>
              <p id={NOTICE_ID} className="c3-ayuda">
                Se abrirá {siteConfig.community.label}, un servicio externo a C3, en una pestaña nueva.
              </p>
            </>
          ) : (
            <>
              <p className="c3-guia-lead">Por ahora puedes escribirnos desde el formulario de contacto.</p>
              <div className="c3-actions">
                <Button href={communityAction.href}>{communityAction.label}</Button>
              </div>
            </>
          )}
        </section>
      ) : null}

      {participate ? (
        <section className="c3-frame c3-seccion c3-guia-bloque" aria-labelledby={participate.id}>
          <h2 id={participate.id} className="c3-guia__titulo">
            {participate.title}
          </h2>
          <ol className="c3-guia-pasos">
            {participate.paragraphs.map((text) => (
              <li key={text}>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="c3-actions">
            <Button href="/eventos" variant="contorno">
              Explorar eventos
            </Button>
          </div>
        </section>
      ) : null}

      {noEvent ? (
        <section className="c3-frame c3-seccion c3-guia-bloque" aria-labelledby={noEvent.id}>
          <h2 id={noEvent.id} className="c3-guia__titulo">
            {noEvent.title}
          </h2>
          <div className="c3-guia-nota">
            {noEvent.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="c3-frame c3-seccion c3-guia-bloque" aria-labelledby="dudas-para-empezar">
        <h2 id="dudas-para-empezar" className="c3-guia__titulo">
          Dudas para empezar
        </h2>
        <div className="c3-guia-dudas">
          {faqs.map((item) => (
            <article key={item.question} className="c3-card c3-guia-duda">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="c3-actions">
          <Link href="/faq" className="c3-enlace-linea">
            Ver todas las preguntas frecuentes
          </Link>
        </div>
      </section>

      <section className="c3-frame c3-seccion c3-guia-bloque c3-guia-cierre" aria-labelledby="contacto-alternativo">
        <h2 id="contacto-alternativo" className="c3-guia__titulo">
          {external ? "¿No usas WhatsApp?" : "Escríbenos"}
        </h2>
        <p className="c3-guia-lead">
          Escríbenos por correo a{" "}
          <a className="c3-enlace-linea [overflow-wrap:anywhere]" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>{" "}
          o desde el formulario de contacto.
        </p>
        {external ? (
          <div className="c3-actions">
            <Button href="/contacto" variant="contorno">
              Contactar a C3
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
