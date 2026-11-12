import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import { toCatalogCard } from "@/lib/ds/event-card";
import { EventosSection } from "./EventosSection";

function cardsFrom(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const event: EventItem = { ...defaultEvents[0], id: `evento-${index + 1}`, title: `Evento ${index + 1}` };
    return toCatalogCard(event);
  });
}

describe("EventosSection (evidencia viva, destacadas paginadas)", () => {
  it("sin eventos muestra el mensaje de vacío y ninguna paginación", () => {
    render(<EventosSection cards={[]} />);
    expect(screen.getByText("Todavía no hay eventos publicados. Vuelve pronto.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Paginación" })).toBeNull();
  });

  it("con 7 eventos muestra 6 y deja la segunda página con el séptimo", () => {
    const { container } = render(<EventosSection cards={cardsFrom(7)} />);
    expect(container.querySelectorAll("article.c3-exp")).toHaveLength(6);
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    fireEvent.click(within(nav).getByRole("button", { name: "Página 2" }));
    expect(container.querySelectorAll("article.c3-exp")).toHaveLength(1);
  });

  it("enlaza el hub completo de eventos", () => {
    render(<EventosSection cards={[]} />);
    expect(screen.getByRole("link", { name: /Ver hub completo de eventos/ })).toHaveAttribute("href", "/eventos");
  });
});
