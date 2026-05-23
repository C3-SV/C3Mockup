import type { Metadata } from "next";
import EventsCatalog from "@/components/EventsCatalog";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import SectionBadge from "@/components/ui/SectionBadge";
import { events } from "@/lib/content";
import {
  getCollectionPageJsonLd,
  getItemListJsonLd,
  getWebPageJsonLd,
} from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seoTitle = "Eventos C3 | Competencias, hackathons y comunidad tecnica";
const seoDescription =
  "Explora eventos de C3 relacionados con programacion competitiva, hackathons, comunidad, formacion y conexion con oportunidades reales.";

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

      <section className="bg-[#0F203E] py-16 text-white md:py-20">
        <div className="container-shell space-y-5">
          <SectionBadge label="Eventos C3" />
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Iniciativas que activan el ecosistema tecnico joven
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/82 md:text-lg">
            Esta ruta centraliza competencias, hackathons y colaboraciones institucionales para
            mostrar la ejecucion real de C3 y conectar hacia sus sitios satelite.
          </p>
        </div>
      </section>

      <EventsCatalog />
    </PageShell>
  );
}
