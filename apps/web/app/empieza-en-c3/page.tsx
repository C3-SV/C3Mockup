import type { Metadata } from "next";
import GettingStarted from "@/components/getting-started/GettingStarted";
import PageShell from "@/components/PageShell";
import {
  getCommunityAction,
  getGettingStartedFaq,
  gettingStartedContent,
} from "@/lib/getting-started-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Empieza en C3 | Competitive Coding Club",
  description:
    "Guía para dar tu primer paso en C3: qué puedes encontrar en Compite, Crea y Conecta, cómo unirte a la comunidad y cómo explorar eventos.",
  path: "/empieza-en-c3",
  keywords: ["empezar en C3", "comunidad C3", "cómo participar en C3", "Compite Crea Conecta"],
});

/** Contenido estático: no depende de getPublicEvents ni de Firestore. */
export default function GettingStartedPage() {
  return (
    <PageShell ds>
      <GettingStarted
        content={gettingStartedContent}
        communityAction={getCommunityAction()}
        faqs={getGettingStartedFaq()}
      />
    </PageShell>
  );
}
