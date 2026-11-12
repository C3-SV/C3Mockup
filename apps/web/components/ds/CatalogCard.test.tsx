import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents } from "@c3/config";
import { toCatalogCard } from "@/lib/ds/event-card";
import { CatalogCard } from "./CatalogCard";

describe("CatalogCard (tarjeta de experiencia, DS §7.9)", () => {
  it("muestra titulo, resumen, linea, pastilla de estado y fecha", () => {
    render(<CatalogCard card={toCatalogCard(defaultEvents[0])} />);
    expect(screen.getByRole("heading", { level: 3, name: "Copa Salvadoreña de Programación" })).toBeInTheDocument();
    expect(screen.getByText("La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.")).toBeInTheDocument();
    expect(screen.getByText("Compite")).toBeInTheDocument();
    expect(screen.getByText("Inscripciones abiertas")).toHaveClass("c3-pill", "c3-pill--exito");
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("la accion lleva el texto del evento y abre fuera del sitio con rel seguro", () => {
    render(<CatalogCard card={toCatalogCard(defaultEvents[0])} />);
    const action = screen.getByRole("link", { name: /Ir a la Copa/ });
    expect(action).toHaveAttribute("href", "https://copa.c3.com.sv");
    expect(action).toHaveAttribute("target", "_blank");
    expect(action).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("una accion interna no abre pestana nueva", () => {
    render(<CatalogCard card={toCatalogCard(defaultEvents[2])} />);
    expect(screen.getByRole("link", { name: /Explorar eventos/ })).not.toHaveAttribute("target");
  });

  it("las lineas adicionales aparecen como texto", () => {
    render(<CatalogCard card={toCatalogCard(defaultEvents[2])} />);
    expect(screen.getByText("Conecta")).toBeInTheDocument();
  });

  it("sin portada muestra el ícono del tipo, oculto para lectores de pantalla", () => {
    const { container } = render(<CatalogCard card={toCatalogCard(defaultEvents[0])} />);
    expect(container.querySelector("img")).toBeNull();
    const icon = container.querySelector(".c3-exp__media svg");
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("con portada muestra la imagen con su texto alternativo", () => {
    const card = toCatalogCard({
      ...defaultEvents[0],
      cover: { url: "https://copa.c3.com.sv/portada.png", alt: "Portada de la Copa" },
    });
    render(<CatalogCard card={card} />);
    const img = screen.getByRole("img", { name: "Portada de la Copa" });
    expect(img).toHaveClass("c3-exp__cover");
  });

  it("aplica el tono de su linea a la tarjeta", () => {
    const { container } = render(<CatalogCard card={toCatalogCard(defaultEvents[1])} />);
    expect(container.querySelector("article")).toHaveClass("c3-exp", "c3-exp--crea");
  });

  it("nunca muestra la palabra DEMO", () => {
    const { container } = render(<CatalogCard card={toCatalogCard(defaultEvents[0])} />);
    expect(within(container as HTMLElement).queryByText(/DEMO/)).toBeNull();
  });
});
