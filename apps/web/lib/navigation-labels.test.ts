import { describe, expect, it } from "vitest";
import { headerNavigation, mainNavigation } from "./content";

describe("navegación · nombre de /que-es-c3", () => {
  it("el enlace se llama «Quiénes somos» y conserva su destino", () => {
    const principal = mainNavigation.find((item) => item.href === "/que-es-c3");
    const cabecera = headerNavigation.find((item) => "href" in item && item.href === "/que-es-c3");
    expect(principal?.label).toBe("Quiénes somos");
    expect(cabecera?.label).toBe("Quiénes somos");
  });
});
