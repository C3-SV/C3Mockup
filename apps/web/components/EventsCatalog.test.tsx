import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import EventsCatalog from "./EventsCatalog";

/** Catálogo de /eventos (Tarea 6.1): filtros con aria-pressed, paginación de 6 y aviso sin resultados. */

const articles = (container: HTMLElement) => container.querySelectorAll("article.c3-exp");

function evento(i: number, lines: EventItem["lines"], eventDate = "2027-03-01"): EventItem {
  return { ...defaultEvents[0], id: `evento-${i}`, title: `Evento ${i}`, lines, eventDate, eventDateEnd: undefined };
}

describe("EventsCatalog (Tarea 6.1)", () => {
  it("sin eventos publicados muestra el aviso por defecto", () => {
    render(<EventsCatalog initialEvents={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Todavía no hay eventos publicados. Vuelve pronto.");
  });

  it("cambiar de filtro vuelve a la primera página", () => {
    const eventos = [1, 2, 3, 4, 5, 6].map((i) => evento(i, ["compite"])).concat(evento(7, ["crea"]));
    const { container } = render(<EventsCatalog initialEvents={eventos} />);
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    fireEvent.click(within(nav).getByRole("button", { name: "Página 2" }));
    expect(articles(container)).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Crea" }));
    expect(screen.getByRole("button", { name: "Crea" })).toHaveAttribute("aria-pressed", "true");
    expect(articles(container)).toHaveLength(1);
    expect(screen.queryByRole("navigation", { name: "Paginación" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(articles(container)).toHaveLength(6);
    expect(within(screen.getByRole("navigation", { name: "Paginación" })).getByRole("button", { name: "Página 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("un filtro sin resultados muestra el aviso y marca el botón activo", () => {
    const pasados = [evento(1, ["compite"], "2020-01-01"), evento(2, ["crea"], "2020-02-01")];
    const { container } = render(<EventsCatalog initialEvents={pasados} />);
    fireEvent.click(screen.getByRole("button", { name: "Próximos" }));
    expect(screen.getByRole("button", { name: "Próximos" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
    expect(articles(container)).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent("No hay eventos con estos filtros.");
  });
});
