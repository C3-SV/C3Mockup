import type { Metadata } from "next";
import EventsCatalog from "@/components/EventsCatalog";
import PageShell from "@/components/PageShell";
import C3BackgroundLayer from "@/components/backgrounds/C3BackgroundLayer";
import SeoJsonLd from "@/components/SeoJsonLd";
import { events } from "@/lib/content";
import {
  getCollectionPageJsonLd,
  getItemListJsonLd,
  getWebPageJsonLd,
} from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Eventos C3 | Competencias, hackathons y comunidad técnica";
const seoDescription =
  "Explora eventos de C3 relacionados con programación competitiva, hackathons, comunidad, formación y conexión con oportunidades reales.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/eventos",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: `${siteConfig.domain}/eventos`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function EventosPage() {
  const itemList = getItemListJsonLd(
    "/eventos",
    events.map((event) => ({
      name: event.title,
      description: event.description,
      url: event.external ? event.href : `${siteConfig.domain}${event.href}`,
    })),
  );

  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({ path: "/eventos", title: seoTitle, description: seoDescription })}
      />
      <SeoJsonLd data={getCollectionPageJsonLd("/eventos", seoTitle, seoDescription)} />
      <SeoJsonLd data={itemList} />

      <section className="relative overflow-hidden bg-[#0F203E] py-16 text-white md:py-20">
        <C3BackgroundLayer variant="dots" line="brand" intensity="low" className="opacity-70" />
        <div className="container-shell relative z-10 space-y-5">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Iniciativas que activan el ecosistema técnico joven
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Participa en competencias, hackathons y colaboraciones institucionales.
          </p>
        </div>
      </section>

      <EventsCatalog />
    </PageShell>
  );
}
