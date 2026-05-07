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
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={480}
                  height={160}
                  className="h-auto w-full"
                />
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
