import Image from "next/image";
import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-28">
      <C3BackgroundLayer variant="dots" line="brand" intensity="low" className="opacity-90" />
      <C3BackgroundLayer variant="orbit" line="brand" intensity="medium" animated className="opacity-70" />

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

        <div className="relative flex justify-center md:justify-end">
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center md:justify-end">
            <div className="h-80 w-80 rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_40%,rgba(51,190,172,0.28),transparent_55%)] md:h-[28rem] md:w-[28rem]" />
          </div>
          <div className="relative isolate w-full max-w-[32rem] overflow-hidden rounded-[2rem] border border-white/18 bg-[#101e3a]/80 p-7 shadow-[0_28px_70px_rgba(4,10,24,0.55)] backdrop-blur-sm md:max-w-[34rem] md:p-9">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -bottom-10 left-2 h-40 w-40 rounded-full border border-[#33BEAC]/30" />
            <Image
              src="/brand/logo-c3-claro-con-color.png"
              alt="Logo principal de C3"
              width={920}
              height={920}
              className="mx-auto h-auto w-full max-w-[18rem] drop-shadow-[0_16px_35px_rgba(3,11,27,0.55)] md:max-w-[20rem]"
              priority
            />
            <div className="mt-6 grid gap-3 text-sm text-white/80 md:grid-cols-3">
              <p className="rounded-2xl border border-[#205298]/35 bg-[#205298]/16 px-3 py-2 text-center font-medium">
                Compite
              </p>
              <p className="rounded-2xl border border-[#33BEAC]/35 bg-[#33BEAC]/14 px-3 py-2 text-center font-medium">
                Crea
              </p>
              <p className="rounded-2xl border border-[#4F5BA9]/35 bg-[#4F5BA9]/14 px-3 py-2 text-center font-medium">
                Conecta
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
