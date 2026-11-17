import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatePill, type PillTone } from "./StatePill";

describe("StatePill (estado siempre con texto, DS §7.7)", () => {
  const tones: PillTone[] = ["neutro", "info", "exito", "advertencia", "error"];

  for (const tone of tones) {
    it(`tono ${tone} aplica c3-pill--${tone} y muestra el texto`, () => {
      render(<StatePill label="Inscripciones abiertas" tone={tone} />);
      const pill = screen.getByText("Inscripciones abiertas");
      expect(pill).toHaveClass("c3-pill", `c3-pill--${tone}`);
    });
  }

  it("el texto del estado nunca depende del color: se lee sin el tono", () => {
    render(<StatePill label="Próximamente" tone="neutro" />);
    expect(screen.getByText("Próximamente")).toBeInTheDocument();
  });
});
