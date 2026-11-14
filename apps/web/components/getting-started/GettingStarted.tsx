import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CommunityAction, GettingStartedContent } from "@/lib/getting-started-content";
import { siteConfig } from "@/lib/site";

type GettingStartedProps = {
  content: GettingStartedContent;
  communityAction: CommunityAction;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

const lineLinks: Record<string, { href: string; className: string }> = {
  Compite: { href: "/compite", className: "c3-enlace-linea--compite" },
  Crea: { href: "/crea", className: "c3-enlace-linea--crea" },
  Conecta: { href: "/conecta", className: "c3-enlace-linea--conecta" },
};

const NOTICE_ID = "aviso-comunidad-externa";

function splitLine(text: string): { name: string; rest: string } | null {
  const index = text.indexOf(": ");
  if (index < 0) return null;
  const name = text.slice(0, index);
  return lineLinks[name] ? { name, rest: text.slice(index + 2) } : null;
}

/** Guía lineal «Empieza en C3». Componente de servidor: no requiere JavaScript para navegar ni unirse. */
export default function GettingStarted({ content, communityAction, faqs }: GettingStartedProps) {
  const external = communityAction.external;
  const stepById = (id: string) => content.steps.find((s) => s.id === id);
  const areas = stepById("que-puedes-encontrar");
  const firstStep = stepById("primer-paso");
  const participate = stepById("participar");
  const noEvent = stepById("sin-experiencia");

  return (
    <>
      <div className="c3-frame">
        <div className="c3-page-head">
          <div className="c3-page-head__text">
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
        </div>
      </div>

      {areas ? (
        <section className="c3-frame c3-seccion" aria-labelledby={areas.id}>
          <h2 id={areas.id}>{areas.title}</h2>
          <div className="c3-tarjetas">
            {areas.paragraphs.map((text) => {
              const line = splitLine(text);
              if (!line) return <p key={text}>{text}</p>;
              const target = lineLinks[line.name];
              return (
                <article key={line.name} className="c3-card c3-faq-item">
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
        <section className="c3-frame c3-seccion" aria-labelledby={firstStep.id}>
          <h2 id={firstStep.id}>{firstStep.title}</h2>
          {external ? (
            <>
              {firstStep.paragraphs.map((text) => (
                <p key={text}>{text}</p>
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
              <p>Por ahora puedes escribirnos desde el formulario de contacto.</p>
              <div className="c3-actions">
                <Button href={communityAction.href}>{communityAction.label}</Button>
              </div>
            </>
          )}
        </section>
      ) : null}

      {participate ? (
        <section className="c3-frame c3-seccion" aria-labelledby={participate.id}>
          <h2 id={participate.id}>{participate.title}</h2>
          <ol className="c3-texto-largo">
            {participate.paragraphs.map((text) => (
              <li key={text}>{text}</li>
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
        <section className="c3-frame c3-seccion" aria-labelledby={noEvent.id}>
          <h2 id={noEvent.id}>{noEvent.title}</h2>
          {noEvent.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>
      ) : null}

      <section className="c3-frame c3-seccion" aria-labelledby="dudas-para-empezar">
        <h2 id="dudas-para-empezar">Dudas para empezar</h2>
        <div className="c3-faq-lista">
          {faqs.map((item) => (
            <article key={item.question} className="c3-card c3-faq-item">
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

      <section className="c3-frame c3-seccion" aria-labelledby="contacto-alternativo">
        <h2 id="contacto-alternativo">{external ? "¿No usas WhatsApp?" : "Escríbenos"}</h2>
        <p>
          Escríbenos por correo a{" "}
          <a className="c3-enlace-linea" href={`mailto:${siteConfig.contact.email}`}>
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
    </>
  );
}
