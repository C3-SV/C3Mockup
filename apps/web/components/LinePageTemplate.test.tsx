import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import LinePageTemplate from "./LinePageTemplate";

/** Plantilla de línea (Tarea 5.1): textos actuales, eventos de la línea y colores por variable. */

const cremaEvent: EventItem = { ...defaultEvents[1], id: "crea-1", lines: ["crea"] };
const compiteEvent: EventItem = { ...defaultEvents[0], id: "compite-1", lines: ["compite"] };

describe("LinePageTemplate (Crea)", () => {
  it("muestra el titular, la descripción y las acciones actuales de la línea", () => {
    render(<LinePageTemplate line="crea" events={[]} />);
    expect(screen.getByRole("heading", { level: 1, name: "Crea: hackathons, software y proyectos reales" })).toBeInTheDocument();
    expect(screen.getByText(/La línea Crea impulsa experiencias builder/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver hackathon/ })).toHaveAttribute("href", "https://hackathon.c3.com.sv");
    expect(screen.getByRole("link", { name: "Ver eventos C3" })).toHaveAttribute("href", "/eventos");
  });

  it("solo lista los eventos que incluyen su línea", () => {
    render(<LinePageTemplate line="crea" events={[compiteEvent, cremaEvent]} />);
    expect(screen.getByRole("heading", { level: 3, name: cremaEvent.title })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: compiteEvent.title })).toBeNull();
  });

  it("sin eventos de su línea dice que todavía no hay, con la línea por nombre", () => {
    render(<LinePageTemplate line="crea" events={[compiteEvent]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Todavía no hay eventos de Crea.");
  });

  it("el acento de la línea llega como variables, con el texto de Crea en su variante legible", () => {
    const { container } = render(<LinePageTemplate line="crea" events={[]} />);
    const page = container.querySelector(".c3-line-page") as HTMLElement;
    expect(page.style.getPropertyValue("--c3-line-text")).toBe("var(--c3-crea-texto)");
    expect(page.style.getPropertyValue("--c3-line-accent")).toBe("var(--c3-crea)");
  });

  it("usa el logo de su línea dentro de la órbita del DS, no el símbolo de C3, y no muestra DEMO ni cuentas", () => {
    const { container } = render(<LinePageTemplate line="crea" events={[]} />);
    const logo = container.querySelector(".c3-line-hero .c3-orbit__mark img") as HTMLImageElement;
    expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain("/brand/lines/crea.png");
    expect(container.querySelector("img[src*='c3-symbol']")).toBeNull();
    expect(container.textContent ?? "").not.toMatch(/\bDEMO\b|Iniciar sesión|Crear cuenta/);
  });

  it("la cabecera muestra la órbita del DS y no muestra etiquetas (los colores se comprueban en E2E)", () => {
    const { container } = render(<LinePageTemplate line="crea" events={[]} />);
    expect(container.querySelector(".c3-line-page > .c3-line-hero .c3-orbit-visual")).not.toBeNull();
    expect(container.querySelector(".c3-home-tags")).toBeNull();
  });

  it("enlaza las acciones de cierre actuales", () => {
    render(<LinePageTemplate line="crea" events={[]} />);
    const closing = screen.getByText("Ver todos los eventos").closest("div") as HTMLElement;
    expect(within(closing).getByRole("link", { name: "Revisar FAQ" })).toHaveAttribute("href", "/faq");
    expect(within(closing).getByRole("link", { name: "Contactar a C3" })).toHaveAttribute("href", "/contacto");
  });
});
