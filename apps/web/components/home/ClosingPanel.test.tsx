import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClosingPanel } from "./ClosingPanel";

const css = readFileSync(join(__dirname, "../../app/ds/c3-public.css"), "utf8");

/** Llamado final: cada anillo decorativo lleva un solo punto de color sobre su circunferencia. */
describe("ClosingPanel · anillos", () => {
  it("cada anillo contiene exactamente un punto, de afuera hacia adentro: Compite, Crea, Conecta", () => {
    const { container } = render(<ClosingPanel />);
    const rings = container.querySelectorAll(".c3-rings > span");
    expect(rings).toHaveLength(3);
    const lines = ["compite", "crea", "conecta"];
    rings.forEach((ring, index) => {
      const dots = ring.querySelectorAll("i");
      expect(dots, `anillo ${index + 1}`).toHaveLength(1);
      expect(dots[0]).toHaveClass(`c3-rings__dot--${lines[index]}`);
    });
    expect(container.querySelectorAll(".c3-rings > i")).toHaveLength(0);
  });

  it("el conjunto sigue siendo decorativo (aria-hidden)", () => {
    const { container } = render(<ClosingPanel />);
    expect(container.querySelector(".c3-rings")).toHaveAttribute("aria-hidden", "true");
  });

  it("el color de cada punto sale del token de su línea", () => {
    for (const line of ["compite", "crea", "conecta"]) {
      expect(css).toMatch(new RegExp(String.raw`\.c3-rings__dot--${line}\s*\{[^}]*background:\s*var\(--c3-${line}\)`));
    }
  });
});
