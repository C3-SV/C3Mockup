import type { Metadata } from "next";
import LinePageTemplate from "@/components/LinePageTemplate";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import { linePageContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";

const seo = linePageContent.crea;

export const metadata: Metadata = createPageMetadata({
  title: seo.seoTitle,
  description: seo.seoDescription,
  path: "/crea",
  keywords: [
    "hackathon El Salvador",
    "Hackathon de Turismo Creativo",
    "proyectos tecnológicos",
    "builders",
    "prototipos",
  ],
});

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
