import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seo = linePageContent.crea;
const ogImage = `${siteConfig.domain}/brand/crea-blanco.png`;

const baseMetadata = createPageMetadata({
  title: seo.seoTitle,
  description: seo.seoDescription,
  path: "/crea",
  keywords: [
    "hackathon El Salvador",
    "Hackathon de Turismo Creativo I",
    "proyectos tecnológicos",
    "builders",
    "prototipos",
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

export default function CreaPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({
          path: "/crea",
          title: seo.seoTitle,
          description: seo.seoDescription,
          type: "WebPage",
        })}
      />
      <SeoJsonLd data={getBreadcrumbJsonLd("/crea")} />
      <LinePageTemplate line="crea" />
    </PageShell>
  );
}
