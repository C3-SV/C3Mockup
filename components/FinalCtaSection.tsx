import Image from "next/image";
import Link from "next/link";
import C3BackgroundLayer from "./backgrounds/C3BackgroundLayer";
import Button from "./ui/Button";

export default function FinalCtaSection() {
  return (
    <section id="cta-final" className="section-divider relative overflow-hidden bg-[#0F203E] py-20 text-white md:py-24">
      <C3BackgroundLayer variant="glow" line="brand" intensity="medium" className="opacity-80" />
      <C3BackgroundLayer variant="particles" line="brand" intensity="low" animated className="opacity-50" />

      <div className="container-shell relative z-10">
        <div className="rounded-[2.1rem] border border-white/14 bg-[#101f3e]/86 p-8 shadow-[0_24px_60px_rgba(4,10,24,0.5)] backdrop-blur-sm md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/18 bg-white/8 p-2">
              <Image
                src="/brand/logo-c3-claro-con-color.png"
                alt="Logo C3 en llamado final"
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Plataforma C3 · El Salvador
            </p>
          </div>

          <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Construyamos la próxima generación técnica de la región.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/84 md:text-lg">
            C3 une competencia, creación y conexión para abrir más oportunidades al talento joven.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/eventos">Participar en C3</Button>
            <Button href="/contacto" variant="secondary">
              Ser aliado
            </Button>
            <Link
              href="/contacto"
              className="text-sm font-semibold tracking-wide text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
