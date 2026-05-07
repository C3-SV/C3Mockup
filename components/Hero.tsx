import Image from "next/image";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-[#0F203E] via-[#133364] to-[#205298] py-20 text-white md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-8 right-16 h-44 w-44 rounded-full bg-[#33BEAC]/20 blur-2xl" />
      </div>

      <div className="container-shell relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
            Plataforma tecnica joven
          </p>
          <div className="space-y-5">
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight md:text-6xl">
              C3
            </h1>
            <h2 className="text-xl font-semibold text-white/90 md:text-2xl">
              Compite. Crea. Conecta.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/85 md:text-lg">
              C3 | Competitive Coding Club,  conecta talento tecnico joven con experiencias de competencia,
              creacion, comunidad y oportunidades reales.
            </p>
          </div>
          <Button href="#proyectos">Explorar proyectos</Button>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_18px_40px_rgba(6,16,35,0.34)] backdrop-blur-md">
            <div className="relative rounded-3xl bg-[#0B1A34]/80 p-6">
              <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                Identidad visual
              </span>
              <Image
                src="/brand/logo-c3-fondo-azul.png"
                alt="Logo principal de C3"
                width={700}
                height={700}
                className="h-auto w-full rounded-2xl"
                priority
              />
              <div className="pointer-events-none absolute -left-5 top-10 h-px w-10 bg-white/35" />
              <div className="pointer-events-none absolute -right-4 bottom-16 h-8 w-8 rounded-full border border-white/25 bg-white/10" />
              <div className="pointer-events-none absolute bottom-5 left-5 h-2 w-16 rounded-full bg-[#4F5BA9]/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
