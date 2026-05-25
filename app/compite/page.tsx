import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seo = linePageContent.compite;
const ogImage = `${siteConfig.domain}/brand/compite-blanco.png`;

const baseMetadata = createPageMetadata({
  title: seo.seoTitle,
  description: seo.seoDescription,
  path: "/compite",
  keywords: [
    "programación competitiva El Salvador",
    "Copa Salvadoreña de Programación",
    "ICPC El Salvador",
    "entrenamientos programación",
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

export default function CompitePage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({
          path: "/compite",
          title: seo.seoTitle,
          description: seo.seoDescription,
          type: "WebPage",
        })}
      />
      <SeoJsonLd data={getBreadcrumbJsonLd("/compite")} />
      <LinePageTemplate line="compite" />
    </PageShell>
  );
}
