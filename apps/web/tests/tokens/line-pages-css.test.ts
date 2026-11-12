import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Páginas de línea (app/ds/line-pages.css): ningún color es hexadecimal literal y solo se usan variables que
 * existen en los tokens (las --c3-line-* tienen valor por defecto en tokens-extra.css, por si no las fija la plantilla).
 */
const APP = join(__dirname, "..", "..");
const css = readFileSync(join(APP, "app/ds/line-pages.css"), "utf8");
const defined = new Set<string>();
for (const file of ["app/ds/tokens.css", "app/ds/tokens-extra.css"]) {
  const src = readFileSync(join(APP, file), "utf8");
  for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
}

describe("line-pages.css", () => {
  it("ningún color es hexadecimal literal (todo va por variable)", () => {
    expect(css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).toEqual([]);
  });

  it("solo usa variables definidas en los tokens", () => {
    const used = [...css.matchAll(/var\((--[a-z0-9-]+)\s*\)/g)].map((m) => m[1]);
    expect([...new Set(used.filter((v) => !defined.has(v)))]).toEqual([]);
  });
});
