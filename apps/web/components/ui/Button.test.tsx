import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button (c3-btn del DS)", () => {
  it("es un button con type=button y variante primario por defecto", () => {
    render(<Button>Guardar</Button>);
    const button = screen.getByRole("button", { name: "Guardar" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("c3-btn", "c3-btn--primario");
  });

  it("aplica la variante y el tamano pequeno", () => {
    render(
      <Button variant="contorno" small>
        Cancelar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Cancelar" });
    expect(button).toHaveClass("c3-btn--contorno", "c3-btn--small");
    expect(button).not.toHaveClass("c3-btn--primario");
  });

  it("con href interno es un enlace sin target", () => {
    render(<Button href="/eventos">Ver eventos</Button>);
    const link = screen.getByRole("link", { name: "Ver eventos" });
    expect(link).toHaveAttribute("href", "/eventos");
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveClass("c3-btn", "c3-btn--primario");
  });

  it("con href externo abre en pestana nueva con rel seguro", () => {
    render(<Button href="https://copa.c3.com.sv">Ir a la Copa</Button>);
    const link = screen.getByRole("link", { name: "Ir a la Copa" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("arrow agrega la flecha ↗ oculta para lectores de pantalla", () => {
    const { container } = render(
      <Button href="/contacto" arrow>
        Contactar
      </Button>,
    );
    const arrow = container.querySelector(".c3-arrow");
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveTextContent("↗");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("no conserva las clases de la pastilla anterior (rounded-full, shimmer)", () => {
    const { container } = render(<Button>Explorar</Button>);
    const className = container.querySelector("button")?.className ?? "";
    expect(className).not.toMatch(/rounded-full|shimmer|gradient/);
  });
});
