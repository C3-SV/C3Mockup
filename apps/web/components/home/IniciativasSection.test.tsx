import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IniciativasSection } from "./IniciativasSection";

/** Iniciativas (Tarea 4.2 + logos oscuros de cada línea sobre fondo claro). */
describe("IniciativasSection", () => {
  it("muestra el logo oscuro de su línea con el texto alternativo actual", () => {
    render(<IniciativasSection />);
    const compite = screen.getByRole("img", { name: "Identidad visual de la línea Compite" });
    expect(compite.getAttribute("src")).toContain("compite.png");
    const crea = screen.getByRole("img", { name: "Identidad visual de la línea Crea" });
    expect(crea.getAttribute("src")).toContain("crea.png");
  });

  it("no usa los logos blancos de las líneas (no se verían sobre el fondo claro)", () => {
    const { container } = render(<IniciativasSection />);
    const srcs = Array.from(container.querySelectorAll("img")).map((img) => img.getAttribute("src") ?? "");
    expect(srcs.some((src) => src.includes("-blanco"))).toBe(false);
  });
});
