import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandMark } from "./BrandMark";

describe("BrandMark (logo completo existente, sin recrearlo)", () => {
  it("variante header usa el logo a color del sitio", () => {
    render(<BrandMark variant="header" alt="Logo principal de C3" />);
    const img = screen.getByRole("img", { name: "Logo principal de C3" });
    expect(img.getAttribute("src")).toContain("logo-c3-claro-con-color");
  });

  it("variante footer usa el logo blanco monocromatico", () => {
    render(<BrandMark variant="footer" alt="Logo de C3" />);
    const img = screen.getByRole("img", { name: "Logo de C3" });
    expect(img.getAttribute("src")).toContain("logo-c3-blanco-monocromatico");
  });

  it("envuelve la imagen en el contenedor .c3-brand-mark del DS", () => {
    const { container } = render(<BrandMark variant="footer" alt="" />);
    expect(container.querySelector("span.c3-brand-mark img")).not.toBeNull();
  });

  it("con alt vacio es decorativo (lo nombra el enlace que lo contiene)", () => {
    const { container } = render(<BrandMark variant="header" alt="" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});
