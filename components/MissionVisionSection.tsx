import Image from "next/image";
import SectionBadge from "./ui/SectionBadge";

type Initiative = {
  line: "Compite" | "Crea";
  status: "Inscripciones abiertas" | "Proximamente";
  title: string;
  description: string;
  cta: string;
  href: string;
  logo: string;
  lineColor: string;
  ringColor: string;
};

const initiatives: Initiative[] = [
  {
    line: "Compite",
    status: "Inscripciones abiertas",
    title: "Copa Salvadorena de Programacion",
    description:
      "La iniciativa principal de C3 para impulsar programacion competitiva, pensamiento algoritmico y excelencia tecnica en estudiantes de El Salvador.",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    logo: "/brand/compite-blanco.png",
    lineColor: "#205298",
    ringColor: "rgba(32,82,152,0.55)",
  },
  {
    line: "Crea",
    status: "Proximamente",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creacion, colaboracion, prototipos y solucion de retos reales desde tecnologia, turismo y cultura.",
    cta: "Ver hackathon",
    href: "https://hackathon.c3.com.sv",
    logo: "/brand/crea-blanco.png",
    lineColor: "#33BEAC",
    ringColor: "rgba(51,190,172,0.55)",
  },
];

const stats = [
  { value: "+60", label: "miembros de comunidad", accent: "#205298" },
  { value: "+150", label: "personas alcanzadas", accent: "#33BEAC" },
  { value: "+130", label: "participantes en Copa 2025", accent: "#4F5BA9" },
  { value: "5+", label: "eventos organizados o apoyados", accent: "#46B8A8" },
  { value: "2024", label: "fundacion", accent: "#2C519B" },
];

export default function MissionVisionSection() {
  return (
    <>
      <section
        id="proximas-iniciativas"
        className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_14%,rgba(51,190,172,0.18),transparent_35%),radial-gradient(circle_at_88%_80%,rgba(79,91,169,0.25),transparent_45%)]" />
          <div className="absolute left-[-6rem] top-[5rem] h-60 w-60 rounded-full border border-white/12" />
        </div>
        <div className="container-shell relative space-y-8">
          <SectionBadge label="Lo proximo en C3" />
          <div>
            <h2 className="text-3xl font-bold text-white md:text-5xl">Proximas iniciativas</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              Dos iniciativas activas marcan el siguiente ciclo de crecimiento tecnico joven en C3.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {initiatives.map((initiative) => (
              <article
                key={initiative.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/14 bg-[#122449]/85 p-7 shadow-[0_28px_50px_rgba(4,10,24,0.45)] backdrop-blur-sm transition duration-300 hover:-translate-y-1"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ backgroundColor: initiative.lineColor }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{
                      color: initiative.lineColor,
                      backgroundColor: `${initiative.lineColor}22`,
                      border: `1px solid ${initiative.lineColor}66`,
                    }}
                  >
                    {initiative.line}
                  </span>
                  <span className="rounded-full border border-white/24 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white/90">
                    {initiative.status}
                  </span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-5">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold leading-tight text-white">{initiative.title}</h3>
                    <p className="max-w-[44ch] text-base leading-8 text-white/82">
                      {initiative.description}
                    </p>
                    <a
                      href={initiative.href}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0F203E] transition group-hover:bg-[#33BEAC] group-hover:text-[#0F203E]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {initiative.cta}
                    </a>
                  </div>
                  <div
                    className="relative hidden h-20 w-20 shrink-0 rounded-2xl border p-2 md:flex"
                    style={{
                      borderColor: initiative.ringColor,
                      backgroundColor: `${initiative.lineColor}20`,
                    }}
                  >
                    <Image
                      src={initiative.logo}
                      alt={`Identidad visual de la linea ${initiative.line}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-9 -right-9 h-28 w-28 rounded-full border border-white/10" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-[#101A31] py-16 text-white md:py-20">
        <div className="container-shell space-y-7">
          <SectionBadge label="Impacto inicial" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-3xl font-bold md:text-4xl">Datos que respaldan el avance de C3</h3>
            <p className="text-sm uppercase tracking-[0.14em] text-white/70">Actualizado a mayo 2026</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="relative overflow-hidden rounded-3xl border border-white/14 bg-[#15274a]/85 px-5 py-6"
              >
                <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: stat.accent }} />
                <p className="text-4xl font-extrabold leading-none text-white">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/78">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
