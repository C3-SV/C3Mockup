import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { getWebPageJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const seo = linePageContent.conecta;

export const metadata: Metadata = {
  title: seo.seoTitle,
  description: seo.seoDescription,
  alternates: {
    canonical: "/conecta",
  },
  openGraph: {
    title: seo.seoTitle,
    description: seo.seoDescription,
    url: `${siteConfig.domain}/conecta`,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.seoTitle,
    description: seo.seoDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function ConectaPage() {
  return (
    <PageShell backgroundClassName="bg-[#0F203E]">
      <SeoJsonLd
        data={getWebPageJsonLd({
          path: "/conecta",
          title: "Conecta",
          description: seo.seoDescription,
          type: "WebPage",
        })}
      />
      <LinePageTemplate line="conecta" />
    </PageShell>
  );
}
