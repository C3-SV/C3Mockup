import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AudienceSection } from "./AudienceSection";

const home = readFileSync(join(__dirname, "../../app/ds/home.css"), "utf8");

/** Públicos: los tres botones quedan a la misma altura aunque las filas de etiquetas difieran. */
describe("AudienceSection · alineación de botones", () => {
  it("el botón de cada tarjeta va en un contenedor de acción que se empuja al pie", () => {
    const { container } = render(<AudienceSection />);
    const cards = container.querySelectorAll("article.c3-home-card");
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      const actions = card.querySelector(".c3-home-card__cta");
      expect(actions).not.toBeNull();
      expect(actions?.querySelector("a")).not.toBeNull();
    });
  });

  it("el contenedor de acción usa margin-top:auto dentro de la tarjeta en columna", () => {
    expect(home).toMatch(/\.c3-home-card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column/);
    expect(home).toMatch(/\.c3-home-card__cta\s*\{[^}]*margin-top:\s*auto/);
  });
});
