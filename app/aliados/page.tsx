import type { Metadata } from "next";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Aliados y sponsors para talento técnico joven — C3",
  description:
    "Conoce cómo empresas, universidades y sponsors pueden colaborar con C3 para impulsar talento técnico joven y fortalecer el ecosistema tecnológico.",
  path: "/aliados",
});

const allyPaths = [
  {
    title: "Universidades y colegios",
    description:
      "Colaboración en competencias, hackathons, charlas, activaciones y desarrollo de comunidad técnica estudiantil.",
  },
  {
    title: "Empresas y sponsors",
    description:
      "Apoyo a experiencias de alto impacto con visibilidad de marca y conexión con talento técnico joven.",
  },
  {
    title: "Aliados del ecosistema",
    description:
      "Vinculación para mentorías, contenido, retos aplicados y oportunidades para la comunidad C3.",
  },
] as const;

export default function AliadosPage() {
  return (
    <div className="bg-white py-16 md:py-20">
      <div className="container-shell space-y-8">
        <SectionBadge label="Aliados C3" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#0F203E] md:text-5xl">
          Colabora con C3 para impulsar talento técnico joven
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-[#31405c]">
          C3 funciona como plataforma institucional que conecta comunidad técnica, universidades y
          empresas mediante iniciativas Compite, Crea y Conecta.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {allyPaths.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#DDE6EF] bg-[#F4F7FB] p-7 shadow-[0_12px_22px_rgba(15,32,62,0.08)]"
            >
              <h2 className="mb-3 text-xl font-bold text-[#0F203E]">{item.title}</h2>
              <p className="text-base leading-7 text-[#31405c]">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_30px_rgba(15,32,62,0.08)]">
          <h2 className="mb-4 text-2xl font-bold text-[#0F203E]">Siguiente paso</h2>
          <p className="mb-6 text-base leading-8 text-[#31405c]">
            Si representas una institución o empresa, contáctanos para explorar formatos de alianza
            según objetivos de talento, impacto y comunidad.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
          >
            Contactar a C3
          </Link>
        </div>
      </div>
    </div>
  );
}
