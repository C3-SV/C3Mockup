import type { Metadata } from "next";
import Image from "next/image";
import C3BackgroundLayer from "@/components/backgrounds/C3BackgroundLayer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 | C3",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-screen overflow-hidden bg-[#0F203E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(51,190,172,0.12),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(79,91,169,0.18),transparent_28%),linear-gradient(180deg,rgba(15,32,62,0.98),#0F203E_58%,#0B172C)]" />
      <C3BackgroundLayer variant="glow" line="brand" intensity="medium" mask="center" className="opacity-70" />
      <C3BackgroundLayer variant="dots" line="brand" intensity="low" className="opacity-55" />
      <C3BackgroundLayer
        variant="graph"
        line="compite"
        intensity="low"
        animated
        mask="both"
        className="opacity-30 mix-blend-screen"
      />
      <C3BackgroundLayer
        variant="orbit"
        line="conecta"
        intensity="low"
        mask="both"
        className="opacity-28 mix-blend-screen"
      />

      <div className="container-shell relative z-10 flex w-full flex-1 items-center justify-center py-20">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto flex w-fit items-center justify-center">
            <Image
              src="/brand/logo-c3-blanco-monocromatico.png"
              alt="C3"
              width={96}
              height={96}
              className="h-14 w-auto sm:h-16"
              priority
            />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/62">
            ERROR 404
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Este sitio no existe
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
            La página que estás buscando no está disponible o pudo haber cambiado de ubicación.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" variant="primary" className="min-w-52">
              Regresar al inicio
            </Button>
            <Button href="/eventos" variant="secondary" className="min-w-52">
              Ver eventos
            </Button>
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.24em] text-white/52">
            C3 · Compite. Crea. Conecta.
          </p>
        </div>
      </div>
    </section>
  );
}
