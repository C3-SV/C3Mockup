import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

const title = "Privacidad | C3 / Competitive Coding Club";
const description =
  "Información sobre los datos que recibimos al usar el sitio de C3, el formulario de contacto, la analítica y los servicios externos.";

export const metadata: Metadata = createPageMetadata({ title, description, path: "/privacidad" });

export default function PrivacyPage() {
  return <LegalPage documentId="privacidad" path="/privacidad" title={title} description={description} />;
}
