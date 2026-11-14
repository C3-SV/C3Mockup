import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

const title = "Convivencia en actividades y espacios de C3 | Competitive Coding Club";
const description = "Pautas básicas de respeto, privacidad y convivencia en actividades y espacios vinculados a C3.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/codigo-de-conducta",
});

export default function ConductPage() {
  return (
    <LegalPage
      documentId="codigo-de-conducta"
      path="/codigo-de-conducta"
      title={title}
      description={description}
    />
  );
}
