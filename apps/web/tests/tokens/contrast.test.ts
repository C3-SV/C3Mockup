import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { readDarkTokens, readLightTokens } from "./ds-tokens";

/**
 * Verifica los contrastes del DS (ACTUALIZACION-DS-C3 §3) con los valores de tokens.css.
 * Los umbrales son los minimos WCAG AA (texto 4.5:1; componentes y bordes 3:1), con un
 * margen de 0.02 sobre el valor calculado para no fallar por redondeo.
 */
const light = readLightTokens();
const dark = readDarkTokens();
const WHITE = "#ffffff";

describe("tokens claros: texto sobre fondo", () => {
  it("texto principal sobre fondo", () => {
    expect(contrastRatio(light["texto"], light["fondo"])).toBeGreaterThanOrEqual(4.5);
  });

  it("boton primario: blanco sobre accion (6.35:1)", () => {
    expect(contrastRatio(WHITE, light["accion"])).toBeGreaterThanOrEqual(6.3);
  });

  it("boton primario en hover: blanco sobre accion-intensa (8.36:1)", () => {
    expect(contrastRatio(WHITE, light["accion-intensa"])).toBeGreaterThanOrEqual(8.3);
  });

  it("texto de Crea usa crea-texto, no la base (crea-texto sobre blanco 5.47:1)", () => {
    expect(contrastRatio(light["crea-texto"], WHITE)).toBeGreaterThanOrEqual(5.4);
  });

  it("regla: la base de Crea no es texto sobre blanco (2.31:1)", () => {
    expect(contrastRatio(light["crea"], WHITE)).toBeLessThan(3);
  });

  it("sobre relleno Crea el texto es navy (7.02:1); el blanco no alcanza", () => {
    expect(contrastRatio(light["navy"], light["crea"])).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(WHITE, light["crea"])).toBeLessThan(4.5);
  });

  it("texto suave sobre blanco (6.27:1)", () => {
    expect(contrastRatio(light["texto-suave"], WHITE)).toBeGreaterThanOrEqual(6.2);
  });

  it("borde fuerte de campos sobre blanco (3:1 minimo para componentes)", () => {
    expect(contrastRatio(light["borde-fuerte"], WHITE)).toBeGreaterThanOrEqual(3.4);
  });
});

describe("estados claros: texto legible sobre su fondo suave", () => {
  const pairs: [string, string, string][] = [
    ["exito", "exito", "e0f2ea"],
    ["advertencia", "advertencia", "fbefdd"],
    ["error", "error", "fae6e3"],
    ["info", "info", "e3ecf8"],
  ];
  for (const [name, fg, bg] of pairs) {
    it(`${name} sobre su fondo suave >= 4.5:1`, () => {
      expect(contrastRatio(light[fg], `#${bg}`)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe("tema oscuro: conocido como no conforme (no activo, DS §3.3 y §12.1 #4)", () => {
  // Si alguien corrige el boton oscuro, esta prueba pasaria y hay que quitar `.fails`.
  it.fails("texto claro sobre accion oscuro cumple 4.5:1 (hoy 4.13:1)", () => {
    expect(contrastRatio(dark["texto"], dark["accion"])).toBeGreaterThanOrEqual(4.5);
  });
});
