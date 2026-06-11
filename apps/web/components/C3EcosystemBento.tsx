import Image from "next/image";
import { FaArrowRight, FaCode, FaLayerGroup, FaTrophy, FaUsers } from "react-icons/fa";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
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

export default function C3EcosystemBento() {
  return (
    <BentoGrid className="grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
      <BentoCard
        name="Un ecosistema para desarrollar talento técnico con impacto"
        className="lg:col-span-3 lg:row-span-2"
        background={
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(51,190,172,0.18),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(79,91,169,0.18),transparent_24%),radial-gradient(circle_at_50%_82%,rgba(32,82,152,0.14),transparent_26%)]"
            />
            <AnimatedGridPattern
              width={38}
              height={38}
              numSquares={48}
              maxOpacity={0.15}
              duration={3.8}
              repeatDelay={0.45}
              className="absolute inset-0 h-full w-full opacity-35 motion-reduce:hidden"
            />
            <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-2">
              {(["Compite", "Crea", "Conecta"] as const).map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        }
        Icon={FaLayerGroup}
        description="C3 no es una suma de piezas sueltas. Es una ruta clara para competir, construir y conectar con el ecosistema técnico."
        href="/que-es-c3"
        cta="Conocer C3"
      />

      {lineCards.map((card) => (
        <BentoCard
          key={card.key}
          name={card.name}
          className="lg:col-span-1"
          background={
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at 20% 18%, ${card.color}2e, transparent 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.08), transparent 26%)`,
                }}
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <Image
                  src={card.logo}
                  alt=""
                  width={40}
                  height={40}
                  sizes="40px"
                  className="h-10 w-10 object-contain opacity-90"
                  aria-hidden="true"
                />
                <span
                  className="rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    color: card.color,
                    backgroundColor: `${card.color}18`,
                    borderColor: `${card.color}44`,
                  }}
                >
                  {siteConfig.lines[card.key].name}
                </span>
              </div>
            </div>
          }
          Icon={card.icon}
          description={card.description}
          href={card.href}
          cta={card.cta}
        />
      ))}

      <BentoCard
        name="De competir a construir, de construir a conectar."
        className="lg:col-span-3"
        background={
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_18%_18%,rgba(51,190,172,0.12),transparent_24%),radial-gradient(circle_at_88%_14%,rgba(79,91,169,0.14),transparent_22%)]"
          />
        }
        Icon={FaArrowRight}
        description="Una narrativa simple para entender cómo C3 acompaña al talento técnico joven en cada etapa de crecimiento."
        href="/eventos"
        cta="Explorar eventos"
      />
    </BentoGrid>
  );
}
