import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seo = linePageContent.crea;

export const metadata: Metadata = {
  title: seo.seoTitle,
  description: seo.seoDescription,
  alternates: {
    canonical: "/crea",
  },
  openGraph: {
    title: seo.seoTitle,
    description: seo.seoDescription,
    url: `${siteConfig.domain}/crea`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.seoTitle,
    description: seo.seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function CreaPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({
          path: "/crea",
          title: "Crea",
          description: seo.seoDescription,
          type: "WebPage",
        })}
      />
      <LinePageTemplate line="crea" />
    </PageShell>
  );
}
