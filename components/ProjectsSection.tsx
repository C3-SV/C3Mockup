import Image from "next/image";
import Link from "next/link";
import SectionBadge from "./ui/SectionBadge";
import { events, lineVisuals } from "@/lib/content";

export default function ProjectsSection() {
  return (
    <section id="eventos" className="section-divider bg-[#F1F5FB] py-20 text-[#0F203E] md:py-24">
      <div className="container-shell space-y-8">
        <SectionBadge label="Eventos C3" />
        <div>
          <h2 className="text-3xl font-bold md:text-5xl">Evidencia viva del ecosistema C3</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-[#31405c] md:text-lg">
            Competencias, hackathons y colaboraciones institucionales que conectan talento tecnico
            joven con aprendizaje y oportunidades reales.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const mainLine = lineVisuals[event.lines[0]];
            return (
              <article
                key={event.id}
                className="group relative overflow-hidden rounded-[1.8rem] border border-[#D5DFEA] bg-white p-6 shadow-[0_16px_35px_rgba(15,32,62,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,32,62,0.14)]"
              >
                <div className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: mainLine.color }} />
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
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: styles.color }}
                        />
                        {styles.name}
                      </span>
                    );
                  })}
                  <span className="rounded-full border border-[#cfd8e4] bg-[#F8FAFD] px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#4a5b77]">
                    {event.status}
                  </span>
                </div>

                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{ backgroundColor: `${mainLine.color}20`, borderColor: `${mainLine.color}73` }}
                >
                  <div className="relative h-7 w-7">
                    <Image
                      src={mainLine.logo}
                      alt={`Simbolo de ${mainLine.name}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold leading-tight text-[#0F203E]">{event.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#344766]">{event.description}</p>
                {event.external ? (
                  <a
                    href={event.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                  >
                    {event.cta}
                  </a>
                ) : (
                  <Link
                    href={event.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F203E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
                  >
                    {event.cta}
                  </Link>
                )}
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
