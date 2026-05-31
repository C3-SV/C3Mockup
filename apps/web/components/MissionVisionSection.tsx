import Image from "next/image";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import C3SectionTransition from "./C3SectionTransition";

type Initiative = {
  line: "Compite" | "Crea";
  status: "Inscripciones abiertas" | "Próximamente";
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
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    logo: "/brand/compite-blanco.png",
    lineColor: "#205298",
    ringColor: "rgba(32,82,152,0.55)",
  },
  {
    line: "Crea",
    status: "Inscripciones abiertas",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde código, turismo y cultura.",
    cta: "Ver hackathon",
    href: "https://hackathon.c3.com.sv",
    logo: "/brand/crea-blanco.png",
    lineColor: "#33BEAC",
    ringColor: "rgba(51,190,172,0.55)",
  },
];

const stats = [
  { value: "+60", label: "miembros de la comunidad", accent: "#205298" },
  { value: "+150", label: "personas alcanzadas", accent: "#33BEAC" },
  { value: "+130", label: "participantes en Copa 2025", accent: "#4F5BA9" },
  { value: "5+", label: "eventos organizados o apoyados", accent: "#46B8A8" }
];

export default function MissionVisionSection() {
  return (
    <>
      <section
        id="proximas-iniciativas"
        className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24"
      >
        <C3BackgroundLayer variant="glow" line="crea" intensity="medium" mask="bottom" className="opacity-65" />
        <C3BackgroundLayer variant="dots" line="crea" intensity="low" mask="bottom" className="opacity-50" />
        <div className="container-shell relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-5xl">Próximas iniciativas</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              Dos iniciativas activas marcan el siguiente ciclo de crecimiento técnico joven en C3.
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
                      alt={`Identidad visual de la línea ${initiative.line}`}
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

      <C3SectionTransition variant="darkToDark" height="sm" className="relative z-10 -my-4" />

      <section className="section-divider relative overflow-hidden bg-[#101A31] py-16 text-white md:py-20">
        <C3BackgroundLayer variant="glow" line="conecta" intensity="medium" mask="bottom" className="opacity-60" />
        <C3BackgroundLayer variant="dots" line="conecta" intensity="low" mask="bottom" className="opacity-35" />
        <div className="container-shell relative z-10 space-y-7">
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
