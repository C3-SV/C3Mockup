export type LegalDocumentId = "privacidad" | "terminos" | "codigo-de-conducta";

export type LegalDocumentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDocumentData = {
  id: LegalDocumentId;
  title: string;
  version: string;
  reviewedAt: string;
  sections: LegalDocumentSection[];
};

/**
 * Solo incorporar aquí documentos con texto y datos aprobados para publicación.
 * Los borradores de docs/content/legal no se importan en el bundle del sitio.
 */
export const legalDocuments: Partial<Record<LegalDocumentId, LegalDocumentData>> = {};

export function getLegalDocument(id: LegalDocumentId): LegalDocumentData | undefined {
  return legalDocuments[id];
}
