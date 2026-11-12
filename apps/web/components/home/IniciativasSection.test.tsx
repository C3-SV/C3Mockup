import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import { IniciativasSection } from "./IniciativasSection";

/**
 * Próximas iniciativas: sale de los eventos del catálogo, no de textos fijos. Si no hay eventos próximos,
 * muestra los destacados, con la pastilla que corresponde a su fecha (nunca «Inscripciones abiertas» si ya pasó).
 */
const NOW = new Date("2026-11-12T12:00:00Z");
const copa = defaultEvents[0];
const hackathon = defaultEvents[1];
const copaSiguiente: EventItem = {
  ...copa,
  id: "copa-2027",
  title: "Copa 2027",
  eventDate: "2027-03-01",
  eventDateEnd: "2027-03-02",
  status: "Inscripciones abiertas",
  featured: false,
};

describe("IniciativasSection", () => {
  it("muestra los eventos próximos con su propio título y estado", () => {
    render(<IniciativasSection events={[copaSiguiente, copa]} now={NOW} />);
    expect(screen.getByRole("heading", { level: 2, name: "Próximas iniciativas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Copa 2027" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: copa.title })).toBeNull();
    expect(screen.getByText("Inscripciones abiertas")).toBeInTheDocument();
  });

  it("sin eventos próximos, muestra los destacados con «Histórico», no con un estado abierto", () => {
    render(<IniciativasSection events={[copa, hackathon]} now={NOW} />);
    expect(screen.getByText(/Por ahora no hay iniciativas próximas/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: copa.title })).toBeInTheDocument();
    expect(screen.getAllByText("Histórico")).toHaveLength(2);
    expect(screen.queryByText("Inscripciones abiertas")).toBeNull();
  });

  it("sin próximos ni destacados, no muestra la sección", () => {
    const { container } = render(<IniciativasSection events={[{ ...copa, featured: false }]} now={NOW} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("usa el logo oscuro de la línea de cada evento, con su texto alternativo", () => {
    render(<IniciativasSection events={[copa, hackathon]} now={NOW} />);
    const compite = screen.getByRole("img", { name: "Identidad visual de la línea Compite" });
    expect(compite.getAttribute("src")).toContain("compite.png");
    const crea = screen.getByRole("img", { name: "Identidad visual de la línea Crea" });
    expect(crea.getAttribute("src")).toContain("crea.png");
  });

  it("no usa los logos blancos de las líneas (no se verían sobre el fondo claro)", () => {
    const { container } = render(<IniciativasSection events={[copa, hackathon]} now={NOW} />);
    const srcs = Array.from(container.querySelectorAll("img")).map((img) => img.getAttribute("src") ?? "");
    expect(srcs.some((src) => src.includes("-blanco"))).toBe(false);
  });
});
