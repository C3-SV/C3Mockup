import Image from "next/image";
import Link from "next/link";
import SectionBadge from "./ui/SectionBadge";

const ecosystemNodes = [
  {
    key: "compite",
    name: "Compite",
    description: "Programacion competitiva y excelencia tecnica.",
    logo: "/brand/compite-blanco.png",
    color: "#205298",
    desktopPosition: "left-[6%] top-[18%]",
    href: "/compite",
  },
  {
    key: "crea",
    name: "Crea",
    description: "Hackathons, software y proyectos reales.",
    logo: "/brand/crea-blanco.png",
    color: "#33BEAC",
    desktopPosition: "right-[8%] top-[18%]",
    href: "/crea",
  },
  {
    key: "conecta",
    name: "Conecta",
    description: "Comunidad, industria y oportunidades.",
    logo: "/brand/conecta-blanco.png",
    color: "#4F5BA9",
    desktopPosition: "left-1/2 top-[66%] -translate-x-1/2",
    href: "/conecta",
  },
];

const lineCards = [
  {
    title: "COMPITE",
    description:
      "Desarrollamos el maximo potencial tecnico a traves de desafios y competencias de clase mundial.",
    bullets: ["Programacion competitiva", "ICPC", "Copa Salvadorena", "Entrenamientos"],
    logo: "/brand/compite-blanco.png",
    color: "#205298",
    href: "/compite",
  },
  {
    title: "CREA",
    description:
      "Convertimos conocimiento tecnico en construccion: prototipos, software y soluciones para retos reales.",
    bullets: ["Hackathons", "Builders", "Desarrollo de software", "Proyectos reales"],
    logo: "/brand/crea-blanco.png",
    color: "#33BEAC",
    href: "/crea",
  },
  {
    title: "CONECTA",
    description:
      "Construimos el puente entre talento emergente, comunidad, instituciones y oportunidades reales.",
    bullets: ["Comunidad", "Industria", "Mentoria", "Alianzas"],
    logo: "/brand/conecta-blanco.png",
    color: "#4F5BA9",
    href: "/conecta",
  },
];

export default function ActionLinesSection() {
  return (
    <section id="ecosistema" className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_12%,rgba(32,82,152,0.28),transparent_38%),radial-gradient(circle_at_74%_20%,rgba(51,190,172,0.22),transparent_40%),radial-gradient(circle_at_54%_78%,rgba(79,91,169,0.22),transparent_44%)]" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute right-[-4rem] top-8 h-64 w-64 rounded-full border border-[#4F5BA9]/35" />
      </div>
      <div className="container-shell relative space-y-10">
        <SectionBadge label="Compite • Crea • Conecta" />
        <div className="space-y-4">
          <h2 className="text-3xl font-bold md:text-5xl">Un ecosistema integrado</h2>
          <p className="max-w-3xl text-base leading-8 text-white/80 md:text-lg">
            C3 no solo organiza eventos. Construimos un sistema donde el talento tecnico joven
            puede crecer de forma progresiva.
          </p>
        </div>

        <div className="hidden rounded-[2.2rem] border border-white/12 bg-[#132548]/78 p-8 md:block">
          <div className="relative mx-auto h-[29rem] max-w-[58rem]">
            <svg
              aria-hidden="true"
              viewBox="0 0 920 460"
              className="absolute inset-0 h-full w-full opacity-50"
            >
              <circle cx="460" cy="220" r="150" fill="none" stroke="rgba(255,255,255,0.12)" />
              <line x1="460" y1="220" x2="188" y2="110" stroke="#205298" strokeWidth="1.8" />
              <line x1="460" y1="220" x2="728" y2="110" stroke="#33BEAC" strokeWidth="1.8" />
              <line x1="460" y1="220" x2="460" y2="352" stroke="#4F5BA9" strokeWidth="1.8" />
            </svg>

            <div className="absolute left-1/2 top-1/2 w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/18 bg-[#0f203e] p-6 text-center shadow-[0_22px_60px_rgba(2,8,22,0.52)]">
              <Image
                src="/brand/logo-c3-claro-con-color.png"
                alt="Logo central de C3"
                width={320}
                height={320}
                className="mx-auto h-auto w-40 object-contain"
              />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                Plataforma C3
              </p>
            </div>

            {ecosystemNodes.map((node) => (
              <article
                key={node.key}
                className={`absolute w-[15.5rem] rounded-[1.6rem] border border-white/14 bg-[#152c55]/88 p-4 ${node.desktopPosition}`}
              >
                <div className="relative mb-3 h-10 w-28">
                  <Image src={node.logo} alt={`Identidad de ${node.name}`} fill className="object-contain" />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: node.color }}>
                  {node.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/82">{node.description}</p>
                <Link href={node.href} className="mt-3 inline-flex text-sm font-semibold text-white hover:underline">
                  Explorar linea
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:hidden">
          {ecosystemNodes.map((node) => (
            <article
              key={node.key}
              className="rounded-3xl border border-white/14 bg-[#152c55]/88 p-5 shadow-[0_12px_30px_rgba(2,8,22,0.35)]"
            >
              <div className="relative mb-3 h-9 w-24">
                <Image src={node.logo} alt={`Identidad de ${node.name}`} fill className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: node.color }}>
                {node.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/82">{node.description}</p>
              <Link href={node.href} className="mt-3 inline-flex text-sm font-semibold text-white hover:underline">
                Explorar linea
              </Link>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {lineCards.map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[1.8rem] border border-white/13 bg-[#121f3d] p-6"
            >
              <div className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: card.color }} />
              <div className="relative mb-4 h-9 w-28">
                <Image src={card.logo} alt={`Logo de ${card.title}`} fill className="object-contain" />
              </div>
              <p className="mb-3 text-xs font-semibold tracking-[0.18em]" style={{ color: card.color }}>
                {card.title}
              </p>
              <p className="text-sm leading-7 text-white/82">{card.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/82">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: card.color }}
                      aria-hidden="true"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link href={card.href} className="mt-4 inline-flex text-sm font-semibold text-white hover:underline">
                Ir a la linea
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
