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
      className="relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-28"
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

      <div className="container-shell relative z-10 grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr] xl:gap-20">
        <div className="space-y-8 md:pr-4">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
              Competitive Coding Club · El Salvador
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              C3 desarrolla{" "}
              <Highlight className="whitespace-normal rounded-xl px-2 py-1 text-[#0F203E] shadow-[0_10px_30px_rgba(51,190,172,0.22)] md:whitespace-nowrap">
                talento técnico joven
              </Highlight>{" "}
              a través de competencia, creación y conexión.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/84 md:text-lg">
              Competitive Coding Club conecta programación competitiva, hackathons, comunidad e
              industria para abrir oportunidades reales a la próxima generación técnica de El
              Salvador y la región.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative inline-flex rounded-full">
              <BorderBeam
                colorFrom="#205298"
                colorTo="#33BEAC"
                borderWidth={1}
                size={96}
                duration={8}
                className="opacity-80"
              />
              <Button asChild size="lg" className="relative z-10 rounded-full px-6">
                <Link href="/eventos">Participar ahora</Link>
              </Button>
            </div>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6">
              <Link href="/contacto">Ser aliado</Link>
            </Button>
            <Link
              href="/que-es-c3"
              className="text-sm font-semibold tracking-wide text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              Conocer C3
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <OrbitingC3 />
        </div>
      </div>
    </section>
  );
}
