import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents } from "@c3/config";
import { toCatalogCard, type CatalogCardData } from "@/lib/ds/event-card";
import { FeaturedGrid } from "./FeaturedGrid";

function makeCards(count: number): CatalogCardData[] {
  return Array.from({ length: count }, (_, i) => ({
    ...toCatalogCard(defaultEvents[0]),
    id: `evento-${i + 1}`,
    title: `Evento ${i + 1}`,
  }));
}

const articles = (container: HTMLElement) => container.querySelectorAll("article.c3-exp");

describe("FeaturedGrid (destacadas paginadas de 6, DS §7.16)", () => {
  it("sin eventos muestra el mensaje de vacio y ninguna paginacion", () => {
    const { container } = render(<FeaturedGrid cards={[]} />);
    expect(screen.getByText("Todavía no hay eventos publicados. Vuelve pronto.")).toBeInTheDocument();
    expect(articles(container)).toHaveLength(0);
    expect(screen.queryByRole("navigation", { name: "Paginación" })).toBeNull();
  });

  it("el mensaje de vacío se anuncia a lectores de pantalla y puede cambiarse", () => {
    const { rerender } = render(<FeaturedGrid cards={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Todavía no hay eventos publicados. Vuelve pronto.");
    rerender(<FeaturedGrid cards={[]} emptyMessage="No hay eventos de esta línea todavía." />);
    expect(screen.getByRole("status")).toHaveTextContent("No hay eventos de esta línea todavía.");
  });

  it("con 6 eventos muestra todos y no pagina", () => {
    const { container } = render(<FeaturedGrid cards={makeCards(6)} />);
    expect(articles(container)).toHaveLength(6);
    expect(screen.queryByRole("navigation", { name: "Paginación" })).toBeNull();
  });

  it("con 7 eventos muestra 6 y pagina a 2; la pagina 2 muestra el septimo", () => {
    const { container } = render(<FeaturedGrid cards={makeCards(7)} />);
    expect(articles(container)).toHaveLength(6);
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    fireEvent.click(within(nav).getByRole("button", { name: "Página 2" }));
    expect(articles(container)).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Evento 7" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "Página 2" })).toHaveAttribute("aria-current", "page");
  });

  it("con 13 eventos hay 3 paginas; «‹» y «›» se deshabilitan en los extremos", () => {
    render(<FeaturedGrid cards={makeCards(13)} />);
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    expect(within(nav).getAllByRole("button", { name: /^Página \d+$/ })).toHaveLength(3);
    const prev = within(nav).getByRole("button", { name: "Página anterior" });
    const next = within(nav).getByRole("button", { name: "Página siguiente" });
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    fireEvent.click(within(nav).getByRole("button", { name: "Página 3" }));
    expect(within(nav).getByRole("button", { name: "Página siguiente" })).toBeDisabled();
  });

  it("el tamano de pagina se puede cambiar", () => {
    const { container } = render(<FeaturedGrid cards={makeCards(5)} pageSize={2} />);
    expect(articles(container)).toHaveLength(2);
  });
});
