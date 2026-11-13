import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinesSection } from "./LinesSection";

/** «Un ecosistema integrado»: la entradilla va dentro del encabezado de sección, que le da su ancho (ADR-0013). */
describe("LinesSection", () => {
  it("la entradilla va dentro del encabezado de la sección", () => {
    const { container } = render(<LinesSection />);
    expect(container.querySelector(".c3-section-head > .c3-lead")).not.toBeNull();
  });
});
