import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import { IniciativasSection } from "./IniciativasSection";

/**
 * Próximas iniciativas: eventos con fecha por venir, nunca terminados. El encabezado se conserva siempre;
 * si no hay tarjetas, el texto explica dónde están o que por ahora no hay ninguna.
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
const hackathonSiguiente: EventItem = {
  ...hackathon,
  id: "hackathon-2027",
  title: "Hackathon 2027",
  eventDate: "2027-05-01",
  eventDateEnd: undefined,
  status: "Próximamente",
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

  it("sin eventos próximos, conserva el encabezado y no muestra eventos terminados", () => {
    render(<IniciativasSection events={[copa, hackathon]} now={NOW} />);
    expect(screen.getByRole("heading", { level: 2, name: "Próximas iniciativas" })).toBeInTheDocument();
    expect(screen.getByText("Por ahora no hay iniciativas próximas.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.queryByText("Histórico")).toBeNull();
  });

  it("si el destacado rotativo tiene eventos, lo dice en lugar de decir que no hay", () => {
    render(<IniciativasSection events={[]} now={NOW} spotlightCount={2} />);
    expect(screen.getByText(/se destacan más abajo, en Evidencia viva/)).toBeInTheDocument();
  });

  it("usa el logo oscuro de la línea de cada evento, con su texto alternativo", () => {
    render(<IniciativasSection events={[copaSiguiente, hackathonSiguiente]} now={NOW} />);
    const compite = screen.getByRole("img", { name: "Identidad visual de la línea Compite" });
    expect(compite.getAttribute("src")).toContain("compite.png");
    const crea = screen.getByRole("img", { name: "Identidad visual de la línea Crea" });
    expect(crea.getAttribute("src")).toContain("crea.png");
  });

  it("no usa los logos blancos de las líneas (no se verían sobre el fondo claro)", () => {
    const { container } = render(<IniciativasSection events={[copaSiguiente, hackathonSiguiente]} now={NOW} />);
    const srcs = Array.from(container.querySelectorAll("img")).map((img) => img.getAttribute("src") ?? "");
    expect(srcs.length).toBeGreaterThan(0);
    expect(srcs.some((src) => src.includes("-blanco"))).toBe(false);
  });
});
