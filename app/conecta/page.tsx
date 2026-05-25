import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";

const seo = linePageContent.conecta;

export const metadata: Metadata = createPageMetadata({
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

export default function ConectaPage() {
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
      <LinePageTemplate line="conecta" />
    </PageShell>
  );
}
