import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinesSection } from "./LinesSection";

/** «Un ecosistema integrado»: el texto de introducción usa todo el ancho de su columna, no la medida estrecha por defecto. */
describe("LinesSection", () => {
  it("el encabezado de la sección tiene el ancho ampliado del texto", () => {
    const { container } = render(<LinesSection />);
    expect(container.querySelector(".c3-section-head.c3-section-head--ancho")).not.toBeNull();
  });
});
