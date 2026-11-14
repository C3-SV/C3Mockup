import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import QueEsC3Page, { metadata } from "./page";

/** El nombre visible pasa a «Quiénes somos»; la ruta /que-es-c3 y la pregunta «¿Qué es C3?» no cambian. */
describe("página Quiénes somos", () => {
  it("el encabezado de la primera sección y el título SEO dicen «Quiénes somos»", () => {
    render(<QueEsC3Page />);
    expect(screen.getByRole("heading", { level: 2, name: "Quiénes somos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "Qué es C3" })).toBeNull();
    expect(String(metadata.title)).toContain("Quiénes somos");
  });

  it("conserva la ruta canónica /que-es-c3 y el h1 actual", () => {
    render(<QueEsC3Page />);
    expect(screen.getByRole("heading", { level: 1, name: "C3 / Competitive Coding Club" })).toBeInTheDocument();
    expect(metadata.alternates?.canonical).toContain("/que-es-c3");
  });
});
