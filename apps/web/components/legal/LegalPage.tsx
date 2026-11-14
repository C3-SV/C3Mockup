import PageShell from "@/components/PageShell";
import SeoJsonLd from "@/components/SeoJsonLd";
import LegalDocument from "@/components/legal/LegalDocument";
import { getLegalDocument, type LegalDocumentId } from "@/lib/legal-content";
import { getBreadcrumbJsonLd, getWebPageJsonLd } from "@/lib/structured-data";

type LegalPageProps = {
  documentId: LegalDocumentId;
  path: string;
  title: string;
  description: string;
};

export default function LegalPage({ documentId, path, title, description }: LegalPageProps) {
  const document = getLegalDocument(documentId);

  return (
    <PageShell ds>
      <SeoJsonLd data={getWebPageJsonLd({ path, title, description })} />
      <SeoJsonLd data={getBreadcrumbJsonLd(path, document.title)} />
      <div className="c3-frame">
        <LegalDocument document={document} />
      </div>
    </PageShell>
  );
}
