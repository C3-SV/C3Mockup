import type { Metadata } from "next";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import { faqItems } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { createFaqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Preguntas frecuentes sobre C3 | Competitive Coding Club",
  description:
    "Respuestas claras sobre qué es C3, cómo participar, sus líneas de acción, eventos, comunidad, aliados y oportunidades.",
  path: "/faq",
});

export default function FaqPage() {
  const faqJsonLd = createFaqJsonLd(faqItems);

  return (
    <div className="bg-white py-16 md:py-20">
      <div className="container-shell space-y-8">
        <SectionBadge label="FAQ" />
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-[#0F203E] md:text-5xl">
          Preguntas frecuentes sobre C3
        </h1>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl border border-[#DDE6EF] bg-white p-6 shadow-[0_10px_22px_rgba(15,32,62,0.08)]"
            >
              <h2 className="mb-3 text-lg font-bold text-[#0F203E]">{item.question}</h2>
              <p className="text-base leading-7 text-[#31405c]">{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="rounded-3xl border border-[#DDE6EF] bg-[#F4F7FB] p-6">
          <p className="text-base leading-7 text-[#31405c]">
            ¿Tienes una pregunta específica de universidad, empresa o prensa?
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
          >
            Ir a contacto
          </Link>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
