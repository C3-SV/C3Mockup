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

  it("añade un enlace contextual a la guía Empieza en C3", () => {
    render(<AudienceSection />);
    expect(screen.getByRole("link", { name: /Empieza en C3/ })).toHaveAttribute("href", "/empieza-en-c3");
  });
});
