import Image from "next/image";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-[#070D1A] via-[#0A1428] to-[#0E1E3D] py-20 text-white md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-8 right-16 h-44 w-44 rounded-full bg-[#33BEAC]/20 blur-2xl" />
      </div>

      <div className="container-shell relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
            Plataforma técnica joven
          </p>
          <div className="space-y-5">
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight md:text-6xl">
              Potenciamos talento técnico joven con impacto
            </h1>
            <h2 className="text-xl font-semibold text-white/90 md:text-2xl">
              Compite. Crea. Conecta.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/85 md:text-lg">
              C3, Competitive Coding Club, conecta programación competitiva, creación de proyectos,
              comunidad y oportunidades reales para impulsar una nueva generación técnica en El
              Salvador y la región.
            </p>
          </div>
          <Button href="#proyectos">Explorar proyectos</Button>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center md:justify-end">
            <div className="h-80 w-80 rounded-full bg-[#33BEAC]/20 blur-3xl md:h-96 md:w-96" />
          </div>
          <Image
            src="/brand/logo-c3-claro-con-color.png"
            alt="Logo principal de C3"
            width={980}
            height={980}
            className="h-auto w-full max-w-[30rem] drop-shadow-[0_24px_45px_rgba(4,10,24,0.52)] md:max-w-[44rem]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
