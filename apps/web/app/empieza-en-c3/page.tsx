import type { Metadata } from "next";
import GettingStarted from "@/components/getting-started/GettingStarted";
import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import {
  getCommunityAction,
  getGettingStartedFaq,
  gettingStartedContent,
} from "@/lib/getting-started-content";
import { createPageMetadata } from "@/lib/metadata";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";

const seoTitle = "Empieza en C3 | Competitive Coding Club";
const seoDescription =
  "Guía para dar tu primer paso en C3: qué puedes encontrar en Compite, Crea y Conecta, cómo unirte a la comunidad y cómo explorar eventos.";

export const metadata: Metadata = createPageMetadata({
  title: seoTitle,
  description: seoDescription,
  path: "/empieza-en-c3",
  keywords: ["empezar en C3", "comunidad C3", "cómo participar en C3", "Compite Crea Conecta"],
});

/** Contenido estático: no depende de getPublicEvents ni de Firestore. */
export default function GettingStartedPage() {
  return (
    <PageShell ds>
      <SeoJsonLd data={getWebPageJsonLd({ path: "/empieza-en-c3", title: seoTitle, description: seoDescription })} />
      <SeoJsonLd data={getBreadcrumbJsonLd("/empieza-en-c3")} />
      <GettingStarted
        content={gettingStartedContent}
        communityAction={getCommunityAction()}
        faqs={getGettingStartedFaq()}
      />
    </PageShell>
  );
}
