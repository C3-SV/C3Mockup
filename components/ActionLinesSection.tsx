import Image from "next/image";

const actionLines = [
  {
    src: "/brand/compite-blanco.png",
    alt: "Logo de Compite",
    label: "COMPITE",
  },
  {
    src: "/brand/crea-blanco.png",
    alt: "Logo de Crea",
    label: "CREA",
  },
  {
    src: "/brand/conecta-blanco.png",
    alt: "Logo de Conecta",
    label: "CONECTA",
  },
];

export default function ActionLinesSection() {
  return (
    <section className="section-divider bg-[#0F203E] py-12 text-white md:py-14">
      <div className="container-shell">
        <p className="mb-7 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/75 md:mb-8">
          3 lineas de accion
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {actionLines.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-white/15 bg-white/8 p-4 text-center backdrop-blur-md"
            >
              <div className="rounded-2xl border border-white/10 bg-[#0B1A34] p-3">
                <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold tracking-[0.16em] text-white">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
