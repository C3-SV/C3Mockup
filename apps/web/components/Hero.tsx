import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import OrbitingC3 from "./OrbitingC3";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { BorderBeam } from "./ui/border-beam";
import { Highlight } from "./ui/hero-highlight";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#0F203E] py-24 text-white md:py-32"
    >
      <C3BackgroundLayer
        variant="glow"
        line="brand"
        intensity="medium"
        mask="bottom"
        className="opacity-55"
      />
      <AnimatedGridPattern
        width={48}
        height={48}
        numSquares={72}
        maxOpacity={0.22}
        duration={3.5}
        repeatDelay={0.35}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] motion-reduce:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(32,82,152,0.24),transparent_34%),radial-gradient(circle_at_80%_24%,rgba(79,91,169,0.16),transparent_28%),radial-gradient(circle_at_52%_82%,rgba(51,190,172,0.18),transparent_32%)]"
      />

      <div className="container-shell relative z-10 grid items-center gap-16 md:grid-cols-[1.18fr_0.82fr] xl:gap-24">
        <div className="space-y-10 md:pr-6">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/58">
              Competitive Coding Club · El Salvador
            </p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.96] tracking-[-0.04em] md:text-[4.9rem]">
              C3 desarrolla{" "}
              <Highlight className="whitespace-normal rounded-[0.6rem] px-2 pb-1 text-white shadow-none md:whitespace-nowrap">
                talento técnico joven
              </Highlight>{" "}
              a través de competencia, creación y conexión.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/84 md:text-xl md:leading-9">
              Competitive Coding Club conecta programación competitiva, hackathons, comunidad e
              industria para abrir oportunidades reales a la próxima generación técnica de El
              Salvador y la región.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
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
              size="lg"
              tone="blue"
              className="rounded-[1.05rem] px-7 py-4 text-base"
            >
              <Link href="/contacto">Ser aliado</Link>
            </Button>
            <Button asChild variant="link" tone="white" className="px-0 py-3 text-base">
              <Link href="/que-es-c3">Conocer C3</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <OrbitingC3 className="md:translate-x-2 xl:translate-x-0" />
        </div>
      </div>
    </section>
  );
}
