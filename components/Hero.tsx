import Image from "next/image";
import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-28">
      <C3BackgroundLayer variant="dots" line="brand" intensity="low" mask="bottom" className="opacity-90" />
      <C3BackgroundLayer
        variant="orbit"
        line="brand"
        intensity="medium"
        animated
        mask="bottom"
        className="opacity-70"
      />

      <div className="container-shell relative z-10 grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr] xl:gap-20">
        <div className="space-y-8 md:pr-4">
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              C3 desarrolla talento técnico joven a través de competencia, creación y conexión.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/85 md:text-lg">
              Competitive Coding Club conecta programación competitiva, hackathons, comunidad e
              industria para abrir oportunidades reales a la próxima generación técnica de El
              Salvador y la región.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/eventos">Explorar eventos</Button>
            <Button href="/contacto" variant="secondary">
              Ser aliado
            </Button>
            <Link
              href="/que-es-c3"
              className="text-sm font-semibold tracking-wide text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              Conocer C3
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-center">
          <div className="relative flex flex-col items-center">
            <Image
              src="/brand/logo-c3-claro-con-color.png"
              alt="Logo principal de C3"
              width={920}
              height={920}
              className="mx-auto h-auto w-full max-w-[21rem] drop-shadow-[0_16px_35px_rgba(3,11,27,0.55)] md:max-w-[24rem]"
              priority
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-[0.18em] md:text-base">
              <span className="text-[#205298]">Compite</span>
              <span className="text-white/35">·</span>
              <span className="text-[#33BEAC]">Crea</span>
              <span className="text-white/35">·</span>
              <span className="text-[#4F5BA9]">Conecta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
