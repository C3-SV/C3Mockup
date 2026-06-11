import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCode, FaTrophy, FaUsers } from "react-icons/fa";
import { MagicCard } from "./ui/magic-card";
import { Button } from "./ui/button";
import { lineVisuals } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const lineCards = [
  {
    key: "compite",
    name: "Compite",
    description:
      "Programación competitiva, precisión técnica, entrenamiento y la Copa Salvadoreña de Programación.",
    href: "/compite",
    cta: "Ir a Compite",
    icon: FaTrophy,
    color: lineVisuals.compite.color,
    logo: lineVisuals.compite.logo,
  },
  {
    key: "crea",
    name: "Crea",
    description:
      "Hackathons, prototipos y proyectos reales que convierten ideas en soluciones útiles.",
    href: "/crea",
    cta: "Ir a Crea",
    icon: FaCode,
    color: lineVisuals.crea.color,
    logo: lineVisuals.crea.logo,
  },
  {
    key: "conecta",
    name: "Conecta",
    description:
      "Comunidad, mentoría, industria e instituciones para abrir oportunidades al talento joven.",
    href: "/conecta",
    cta: "Ir a Conecta",
    icon: FaUsers,
    color: lineVisuals.conecta.color,
    logo: lineVisuals.conecta.logo,
  },
] as const;

const toneByKey = {
  compite: "blue",
  crea: "turquoise",
  conecta: "purple",
} as const;

export default function C3EcosystemBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {lineCards.map((card) => {
        const ToneIcon = card.icon;
        const tone = toneByKey[card.key];

        return (
          <MagicCard
            key={card.key}
            mode="gradient"
            gradientSize={220}
            gradientColor={`${card.color}20`}
            gradientFrom={card.color}
            gradientTo="#33BEAC"
            className="h-full rounded-[2.15rem]"
          >
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[inherit] bg-[#122449]/94 p-7 shadow-[0_20px_48px_rgba(2,8,22,0.28)] transition duration-300 hover:-translate-y-1">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: card.color }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.05),transparent_18%)] opacity-90"
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color: card.color,
                      backgroundColor: `${card.color}14`,
                      border: `1px solid ${card.color}4a`,
                    }}
                  >
                    {siteConfig.lines[card.key].name}
                  </span>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] border bg-white/6"
                    style={{ borderColor: `${card.color}33` }}
                  >
                    <ToneIcon size={18} style={{ color: card.color }} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={card.logo}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                    aria-hidden="true"
                  />
                  <h3 className="text-2xl font-bold text-white">{card.name}</h3>
                </div>

                <p className="mt-4 max-w-[32ch] text-base leading-8 text-white/80">
                  {card.description}
                </p>

                <div className="mt-auto pt-7">
                  <Button asChild variant="link" tone={tone} className="px-0 text-sm">
                    <Link href={card.href}>
                      {card.cta}
                      <FaArrowRight className="ms-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </MagicCard>
        );
      })}
    </div>
  );
}
