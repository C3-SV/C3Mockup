import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import { events, lineVisuals } from "@/lib/content";

export default function ProjectsSection() {
  return (
    <section id="eventos" className="section-divider relative overflow-hidden bg-[#F1F5FB] py-20 text-[#0F203E] md:py-24">
      <C3BackgroundLayer variant="dots" line="compite" intensity="low" className="opacity-22 mix-blend-multiply" />
      <div className="container-shell relative z-10 space-y-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">Evidencia viva del ecosistema C3</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-[#31405c] md:text-lg">
            Eventos, competencias, hackathons y colaboraciones institucionales que conectan talento técnico
            joven con aprendizaje y oportunidades reales.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const mainLine = lineVisuals[event.lines[0]];

            return (
              <article
                key={event.id}
                className="flex h-full flex-col rounded-[1.8rem] border border-[#D5DFEA] bg-white p-6 shadow-[0_16px_35px_rgba(15,32,62,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,32,62,0.14)]"
              >
                <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: mainLine.color }} />
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {event.lines.map((line) => {
                    const styles = lineVisuals[line];
                    return (
                      <span
                        key={`${event.id}-${line}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                        style={{
                          color: styles.color,
                          backgroundColor: `${styles.color}1a`,
                          border: `1px solid ${styles.color}73`,
                        }}
                      >
                        {styles.name}
                      </span>
                    );
                  })}
                  <span className="rounded-full border border-[#cfd8e4] bg-[#F8FAFD] px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#4a5b77]">
                    {event.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold leading-tight text-[#0F203E]">{event.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#344766]">{event.description}</p>

                <div className="mt-auto pt-6">
                  {event.external ? (
                    <a
                      href={event.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                    >
                      {event.cta}
                    </a>
                  ) : (
                    <Link
                      href={event.href}
                      className="inline-flex items-center rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                    >
                      {event.cta}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <Link href="/eventos" className="inline-flex text-sm font-semibold text-[#205298] hover:underline">
          Ver hub completo de eventos
        </Link>
      </div>
    </section>
  );
}
