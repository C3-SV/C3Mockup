import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

const title = "Términos de uso | C3 / Competitive Coding Club";
const description = "Pautas básicas para el uso del sitio institucional de C3 y sus enlaces a actividades.";

export const metadata: Metadata = createPageMetadata({ title, description, path: "/terminos" });

export default function TermsPage() {
  return <LegalPage documentId="terminos" path="/terminos" title={title} description={description} />;
}
