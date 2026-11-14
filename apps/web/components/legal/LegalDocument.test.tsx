import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LegalDocument from "./LegalDocument";
import type { LegalDocumentData } from "@/lib/legal-content";

const fixture: LegalDocumentData = {
  id: "privacidad",
  title: "Política de privacidad",
  version: "0.1",
  reviewedAt: "2026-11-13",
  introduction: "Versión informativa preliminar; algunos detalles siguen en revisión.",
  references: [
    {
      label: "Privacidad de Vercel Web Analytics",
      href: "https://vercel.com/docs/analytics/privacy-policy",
    },
  ],
  sections: [
    {
      id: "responsable",
      title: "Responsable",
      paragraphs: [
        "Este texto incluye <script>alert(1)</script> como texto literal y legal-contacto+privacidad@ejemplo.org.",
      ],
    },
    {
      id: "responsable",
      title: "Responsable adicional",
      paragraphs: ["Segunda sección para comprobar que las anclas no se repiten."],
      items: ["Primer punto", "Segundo punto"],
    },
  ],
};

describe("LegalDocument", () => {
  it("muestra un único título principal, versión y fecha editorial", () => {
    render(<LegalDocument document={fixture} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Política de privacidad" })).toBeInTheDocument();
    expect(screen.getByText("Versión 0.1")).toBeInTheDocument();
    expect(screen.getByText("13/11/2026")).toHaveAttribute("dateTime", "2026-11-13");
  });

  it("muestra la introducción del borrador y referencias externas seguras", () => {
    render(<LegalDocument document={fixture} />);

    expect(screen.getByText(fixture.introduction as string)).toBeInTheDocument();
    const references = screen.getByRole("region", { name: "Fuentes relacionadas" });
    const link = within(references).getByRole("link", { name: "Privacidad de Vercel Web Analytics" });
    expect(link).toHaveAttribute("href", "https://vercel.com/docs/analytics/privacy-policy");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("enlaza el índice a ids únicos y conserva el primer id solicitado", () => {
    render(<LegalDocument document={fixture} />);

    const index = screen.getByRole("navigation", { name: "Índice del documento" });
    const links = within(index).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["#responsable", "#responsable-2"]);
    expect(document.getElementById("responsable")).toHaveTextContent("Este texto incluye");
    expect(document.getElementById("responsable-2")).toHaveTextContent("Segunda sección");
  });

  it("convierte el correo del documento en mailto y permite envolverlo en móvil", () => {
    render(<LegalDocument document={fixture} />);

    const email = screen.getByRole("link", {
      name: "legal-contacto+privacidad@ejemplo.org",
    });
    expect(email).toHaveAttribute("href", "mailto:legal-contacto+privacidad@ejemplo.org");
    expect(email).toHaveClass("c3-legal__email");
  });

  it("muestra etiquetas HTML como texto y nunca crea markup desde el contenido", () => {
    const { container } = render(<LegalDocument document={fixture} />);

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector(".c3-legal__section")).toHaveTextContent(
      "Este texto incluye <script>alert(1)</script> como texto literal",
    );
  });

  it("omite el índice cuando el documento tiene una sola sección", () => {
    render(
      <LegalDocument
        document={{
          ...fixture,
          sections: [fixture.sections[0]],
        }}
      />,
    );

    expect(screen.queryByRole("navigation", { name: "Índice del documento" })).not.toBeInTheDocument();
  });
});
