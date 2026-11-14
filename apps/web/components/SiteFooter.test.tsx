import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SiteFooter from "./SiteFooter";
import { siteConfig } from "@/lib/site";

describe("SiteFooter (pie navy de cuatro columnas, DS §7.3)", () => {
  it("tiene cuatro columnas: marca, sitio, ecosistema y sitios hermanos", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector(".c3-footer__grid")?.children).toHaveLength(4);
  });

  it("cada columna de enlaces tiene su título, con palabras que ya usa el sitio", () => {
    render(<SiteFooter />);
    for (const title of ["Navegación", "Ecosistema", "Eventos"]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it("ya no muestra la fecha de fundación", () => {
    render(<SiteFooter />);
    expect(screen.queryByText(/Fundado/i)).not.toBeInTheDocument();
  });

  it("muestra el copyright y el origen en la franja inferior", () => {
    const { container } = render(<SiteFooter />);
    const base = within(container.querySelector(".c3-footer__base") as HTMLElement);
    expect(base.getByText("© 2026 C3 · Competitive Coding Club")).toBeInTheDocument();
    expect(base.getByText("Hecho en El Salvador")).toBeInTheDocument();
  });

  it("enlaza los documentos legales desde la franja inferior", () => {
    render(<SiteFooter />);
    const legalNav = within(screen.getByRole("navigation", { name: "Enlaces legales" }));
    for (const [name, href] of [
      ["Privacidad", "/privacidad"],
      ["Términos", "/terminos"],
      ["Convivencia", "/codigo-de-conducta"],
    ] as const) {
      expect(legalNav.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });
  it("conserva los enlaces del sitio actual con sus destinos", () => {
    const { container } = render(<SiteFooter />);
    const footer = within(container as HTMLElement);
    for (const [name, href] of [
      ["Inicio", "/"],
      ["Qué es C3", "/que-es-c3"],
      ["Eventos", "/eventos"],
      ["FAQ", "/faq"],
      ["Contacto", "/contacto"],
      ["Compite", "/compite"],
      ["Crea", "/crea"],
      ["Conecta", "/conecta"],
    ] as const) {
      expect(footer.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("muestra el correo de contacto como mailto", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: siteConfig.contact.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contact.email}`,
    );
  });

  it("los sitios hermanos y las redes abren en pestana nueva con rel seguro", () => {
    render(<SiteFooter />);
    for (const name of [
      "Copa Salvadoreña de Programación",
      "Hackathon de Turismo Creativo I",
      "LinkedIn de C3",
      "Instagram de C3",
      "TikTok de C3",
    ]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("usa el logo blanco monocromatico y no muestra cuentas ni textos nuevos del DS", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector("img")?.getAttribute("src")).toContain("logo-c3-blanco-monocromatico");
    expect(container.textContent ?? "").not.toMatch(/Tu cuenta|Iniciar sesión|Crear cuenta|challenge/i);
  });
});
