import { readFileSync } from "node:fs";
import { join } from "node:path";

/** tokens.css del paquete DS (fuente de verdad de los valores, no de la copia de la app). */
const DS_TOKENS_CSS = join(__dirname, "../../../../docs/design-system/source/tokens/tokens.css");

/** Valores del tema claro: bloque :root de tokens.css. */
export function readLightTokens(): Record<string, string> {
  const css = readFileSync(DS_TOKENS_CSS, "utf8");
  const root = css.slice(0, css.indexOf("[data-theme"));
  const tokens: Record<string, string> = {};
  for (const m of root.matchAll(/--c3-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    tokens[m[1]] = m[2].toLowerCase();
  }
  return tokens;
}

/** Valores del tema oscuro: bloque [data-theme="oscuro"] de tokens.css. */
export function readDarkTokens(): Record<string, string> {
  const css = readFileSync(DS_TOKENS_CSS, "utf8");
  const dark = css.slice(css.indexOf('[data-theme="oscuro"]'));
  const tokens: Record<string, string> = {};
  for (const m of dark.matchAll(/--c3-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    tokens[m[1]] = m[2].toLowerCase();
  }
  return tokens;
}
