import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AudienceSection } from "./AudienceSection";

describe("AudienceSection", () => {
  it("conserva el encabezado, el texto y las llamadas a la acción actuales", () => {
    render(<AudienceSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "C3 conecta a quienes quieren construir el ecosistema técnico joven" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Desde estudiantes que quieren crecer/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Participar en C3" })).toHaveAttribute("href", "/eventos");
    expect(screen.getByRole("link", { name: "Crear una alianza educativa" })).toHaveAttribute("href", "/contacto");
    expect(screen.getByRole("link", { name: "Ser aliado" })).toHaveAttribute("href", "/contacto");
  });

  it("destaca «Primera vez en C3» con un encabezado, la guía y tres rutas a las líneas", () => {
    const { container } = render(<AudienceSection />);
    expect(screen.getByRole("heading", { level: 3, name: "¿Primera vez en C3?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Empieza en C3" })).toHaveAttribute("href", "/empieza-en-c3");
    const routes = Array.from(container.querySelectorAll(".c3-primera__ruta")).map((link) => link.getAttribute("href"));
    expect(routes).toEqual(["/compite", "/crea", "/conecta"]);
  });

  it("ningún encabezado de la sección termina en punto", () => {
    const { container } = render(<AudienceSection />);
    const headings = Array.from(container.querySelectorAll("h1, h2, h3")).map((h) => h.textContent?.trim() ?? "");
    expect(headings.length).toBeGreaterThan(0);
    for (const text of headings) expect(text.endsWith("."), text).toBe(false);
  });
});
