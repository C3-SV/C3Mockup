import type { ReactNode } from "react";
import type { LegalDocumentData, LegalDocumentSection } from "@/lib/legal-content";

type LegalDocumentProps = {
  document: LegalDocumentData;
};

type SectionAnchors = {
  section: LegalDocumentSection;
  sectionId: string;
  headingId: string;
};

const EMAIL_PATTERN =
  /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/gi;

function formatReviewedAt(reviewedAt: string): string {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(reviewedAt);
  if (!date) return reviewedAt;
  return `${date[3]}/${date[2]}/${date[1]}`;
}

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "seccion"
  );
}

function takeUniqueId(base: string, usedIds: Set<string>): string {
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function getSectionAnchors(sections: LegalDocumentSection[]): SectionAnchors[] {
  const usedIds = new Set<string>(["c3-legal-title", "contenido"]);

  return sections.map((section, index) => {
    const requestedId = slugify(section.id || `seccion-${index + 1}`);
    const sectionId = takeUniqueId(requestedId, usedIds);
    const headingId = takeUniqueId(`legal-heading-${sectionId}`, usedIds);
    return { section, sectionId, headingId };
  });
}

function linkApprovedEmails(text: string): ReactNode {
  const content: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(EMAIL_PATTERN)) {
    const email = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) content.push(text.slice(lastIndex, start));
    content.push(
      <a className="c3-legal__email" href={`mailto:${email}`} key={`email-${start}`}>
        {email}
      </a>,
    );
    lastIndex = start + email.length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) content.push(text.slice(lastIndex));
  return content;
}

export default function LegalDocument({ document }: LegalDocumentProps) {
  const sections = getSectionAnchors(document.sections);

  return (
    <article aria-labelledby="c3-legal-title" className="c3-legal">
      <header className="c3-legal__header">
        <h1 className="c3-legal__title" id="c3-legal-title">
          {document.title}
        </h1>
        <p className="c3-legal__metadata">
          <span>Versión {document.version}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={document.reviewedAt}>{formatReviewedAt(document.reviewedAt)}</time>
        </p>
        {document.introduction ? (
          <p className="c3-legal__introduction">{document.introduction}</p>
        ) : null}
      </header>

      {sections.length > 1 ? (
        <nav aria-label="Índice del documento" className="c3-legal__index">
          <h2 className="c3-legal__index-title">Contenido del documento</h2>
          <ol>
            {sections.map(({ section, sectionId }) => (
              <li key={sectionId}>
                <a href={`#${sectionId}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="c3-legal__sections">
        {sections.map(({ section, sectionId, headingId }) => (
          <section
            aria-labelledby={headingId}
            className="c3-legal__section"
            id={sectionId}
            key={sectionId}
          >
            <h2 className="c3-legal__section-title" id={headingId}>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{linkApprovedEmails(paragraph)}</p>
            ))}
            {section.items?.length ? (
              <ul>
                {section.items.map((item, index) => (
                  <li key={index}>{linkApprovedEmails(item)}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {document.references?.length ? (
        <section aria-labelledby="c3-legal-references-title" className="c3-legal__references">
          <h2 className="c3-legal__section-title" id="c3-legal-references-title">
            Fuentes relacionadas
          </h2>
          <ul>
            {document.references.map((reference) => (
              <li key={reference.href}>
                <a
                  className="c3-legal__reference"
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {reference.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
