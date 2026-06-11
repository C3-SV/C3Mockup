import Image from "next/image";
import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import { BorderBeam } from "./ui/border-beam";
import { Button } from "./ui/button";

export default function FinalCtaSection() {
  return (
    <section
      id="cta-final"
      className="section-divider relative overflow-hidden bg-[#0F203E] py-24 text-white md:py-28"
    >
      <C3BackgroundLayer variant="glow" line="brand" intensity="medium" className="opacity-72" />
      <C3BackgroundLayer variant="particles" line="brand" intensity="low" animated className="opacity-45" />

      <div className="container-shell relative z-10">
        <div className="relative overflow-hidden rounded-[2.6rem] border border-white/12 bg-[#101f3e]/88 p-9 shadow-[0_24px_60px_rgba(4,10,24,0.5)] backdrop-blur-sm md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(51,190,172,0.16),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(79,91,169,0.15),transparent_28%),radial-gradient(circle_at_50%_82%,rgba(32,82,152,0.14),transparent_30%)]" />

          <div className="relative mb-8 flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-[1.35rem] border border-white/18 bg-white/8 p-2.5">
              <Image
                src="/brand/logo-c3-claro-con-color.png"
                alt="Logo C3 en llamado final"
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Plataforma C3 · El Salvador
            </p>
          </div>

          <div className="relative max-w-4xl space-y-5">
            <h2 className="text-4xl font-bold leading-tight tracking-[-0.03em] md:text-6xl">
              Construyamos la próxima generación técnica de la región junto a C3.
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-white/84 md:text-xl md:leading-9">
              C3 une competencia, creación y conexión para abrir más oportunidades al talento joven
              y convertir el ecosistema en algo tangible.
            </p>
          </div>

          <div className="relative mt-10 flex flex-wrap items-center gap-4">
            <div className="relative inline-flex rounded-[1.15rem]">
              <BorderBeam
                colorFrom="#205298"
                colorTo="#33BEAC"
                borderWidth={1}
                size={128}
                duration={9}
                className="opacity-65"
              />
              <Button
                asChild
                size="lg"
                tone="brand"
                className="relative z-10 min-w-[15rem] rounded-[1.15rem] px-8 py-4 text-base"
              >
                <Link href="/eventos">Participar ahora</Link>
              </Button>
            </div>
            <Button
              asChild
              variant="secondary"
              tone="white"
              size="lg"
              className="rounded-[1.05rem] px-7 py-4 text-base"
            >
              <Link href="/contacto">Ser aliado</Link>
            </Button>
            <Button asChild variant="link" tone="white" className="px-0 py-3 text-base">
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
