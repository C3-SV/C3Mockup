import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { c3Hex } from "@/app/ds/tokens";

/**
 * app/ds/tokens.ts guarda los valores literales de la paleta para el manifest y el correo HTML.
 * Debe coincidir con app/ds/tokens.css; si un token cambia, cambia en los dos sitios.
 */
const css = readFileSync(join(__dirname, "../../app/ds/tokens.css"), "utf8");

function valorCss(nombre: string): string | undefined {
  return css.match(new RegExp(`${nombre}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
}

describe("app/ds/tokens.ts espeja tokens.css", () => {
  it("navy coincide con --c3-navy", () => {
    expect(c3Hex.navy).toBe(valorCss("--c3-navy"));
  });

  it("blanco coincide con --c3-fondo", () => {
    expect(c3Hex.blanco).toBe(valorCss("--c3-fondo"));
  });
});
