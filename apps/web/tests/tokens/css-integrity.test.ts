import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

/**
 * Integridad del CSS publico del DS (app/ds/c3-public.css). Protege que la extraccion:
 * - no arrastre la app, la consola, la cuenta ni el espacio de empresa (ACTUALIZACION-DS §13);
 * - no traiga el modo oscuro ni resets globales de elemento (rompen las paginas sin migrar);
 * - tokenice cada color (ningun hexadecimal suelto) y use solo variables definidas.
 */
const APP = join(__dirname, "..", "..");
const css = readFileSync(join(APP, "app/ds/c3-public.css"), "utf8");
const tokenSources = [
  readFileSync(join(APP, "app/ds/tokens.css"), "utf8"),
  readFileSync(join(APP, "app/ds/tokens-extra.css"), "utf8"),
];

const root = postcss.parse(css);
const selectors: string[] = [];
const declarations: { prop: string; value: string; selector: string }[] = [];
root.walkRules((rule) => {
  for (const sel of rule.selectors) {
    selectors.push(sel);
    rule.each((node) => {
      if (node.type === "decl") declarations.push({ prop: node.prop, value: node.value, selector: sel });
    });
  }
});

const EXCLUDED = /\.c3-(app|cabecera|usuario|requiere|tarea|empresa|admin|perfil|detalle|detail|profile|tray|rubrica|evalua|talento|migas|weight|skeleton|cover|catalog)/;

describe("c3-public.css: alcance", () => {
  it("no tiene selectores de la app, la consola, la cuenta ni el espacio de empresa", () => {
    expect(selectors.filter((s) => EXCLUDED.test(s))).toEqual([]);
  });

  it("no tiene bloques de modo oscuro", () => {
    expect(selectors.filter((s) => s.includes("data-theme"))).toEqual([]);
  });

  it("no tiene resets globales de elemento (preflight y las paginas sin migrar los cubren)", () => {
    const bare = new Set(["*", "*::before", "*::after", "html", "body", "a", "h1", "h2", "h3", "h4", "p"]);
    expect(selectors.map((s) => s.trim()).filter((s) => bare.has(s))).toEqual([]);
  });

  it("tiene las clases clave del DS", () => {
    for (const cls of [
      ".c3-saltar", ".c3-frame", ".c3-sitio", ".c3-btn", ".c3-btn--primario", ".c3-pill--exito",
      ".c3-site-header", ".c3-footer", ".c3-orbit", ".c3-exp", ".c3-cta", ".c3-page-head",
      ".c3-line-intro", ".c3-not-found", ".c3-featured", ".c3-steps", ".c3-campo",
    ]) {
      expect(selectors.some((s) => s.includes(cls)), cls).toBe(true);
    }
  });
});

describe("c3-public.css: tokens", () => {
  it("ningun color es hexadecimal literal (todo va por variable)", () => {
    const hex = /#[0-9a-fA-F]{3,8}\b/;
    expect(declarations.filter((d) => hex.test(d.value)).map((d) => `${d.selector} { ${d.prop}: ${d.value} }`)).toEqual([]);
  });

  it("solo usa variables que existen en los tokens", () => {
    const defined = new Set<string>();
    for (const src of [...tokenSources, css]) {
      for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
    }
    // Las variables con respaldo, var(--x, valor), son intencionales; solo se marcan las que no tienen respaldo.
    const used = [...css.matchAll(/var\((--[a-z0-9-]+)\s*\)/g)].map((m) => m[1]);
    expect([...new Set(used.filter((v) => !defined.has(v)))]).toEqual([]);
  });
});

describe("c3-public.css: accesibilidad y movimiento", () => {
  it("el boton pequeno mide al menos 44 px de alto (DS §6)", () => {
    const small = declarations.find((d) => d.selector.trim() === ".c3-btn--small" && d.prop === "min-height");
    expect(small?.value).toBe("44px");
  });

  it("la orbita se detiene con movimiento reducido", () => {
    const reduced = root.nodes.find(
      (n) => n.type === "atrule" && n.name === "media" && String(n.params).includes("prefers-reduced-motion"),
    );
    const stops = reduced
      ? reduced.toString().includes(".c3-orbit") && reduced.toString().includes("animation: none")
      : false;
    expect(stops).toBe(true);
  });
});
