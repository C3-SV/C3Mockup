import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { getPublicEvents } from "@/lib/events";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seo = linePageContent.conecta;
const ogImage = `${siteConfig.domain}/brand/conecta-blanco.png`;

export const revalidate = 60;

const baseMetadata = createPageMetadata({
  title: seo.seoTitle,
  description: seo.seoDescription,
  path: "/conecta",
  keywords: [
    "comunidad tecnológica El Salvador",
    "talento técnico joven",
    "sponsors tecnología",
    "alianzas educativas",
    "industria tecnológica",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: ogImage,
        alt: seo.seoTitle,
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: [ogImage],
  },
};

export default async function ConectaPage() {
  const events = await getPublicEvents();

  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({
          path: "/conecta",
          title: seo.seoTitle,
          description: seo.seoDescription,
          type: "WebPage",
        })}
      />
      <SeoJsonLd data={getBreadcrumbJsonLd("/conecta")} />
      <LinePageTemplate line="conecta" events={events} />
    </PageShell>
  );
}
