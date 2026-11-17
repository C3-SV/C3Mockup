import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { scanForbidden, stripComments } from "./scan";

/**
 * La interfaz publica va en «tu» (PRODUCT.md, decision del 4-nov-2026) y sin los terminos
 * prohibidos por ADR-0006. Esta prueba lee el texto de la interfaz y exige que no haya ninguno.
 */
const APP_ROOT = join(__dirname, "..", "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Archivos cuyo texto llega al visitante: contenido, formulario, paginas, componentes y llms.txt. */
function interfaceFiles(): string[] {
  const rel = (f: string) => relative(APP_ROOT, f).split(sep).join("/");
  const inApp = walk(join(APP_ROOT, "app")).filter((f) => /\.tsx$/.test(f));
  const inComponents = walk(join(APP_ROOT, "components")).filter((f) => /\.tsx$/.test(f));
  const direct = ["lib/content.ts", "lib/contact-form.ts", "public/llms.txt"].map((p) => join(APP_ROOT, p));
  return [...inApp, ...inComponents, ...direct]
    .filter((f) => !/\.test\.tsx?$/.test(f))
    .map(rel)
    .sort();
}

describe("scanForbidden", () => {
  it("detecta voseo y devuelve la forma en minusculas", () => {
    expect(scanForbidden("Podés integrarte")).toEqual(["podés"]);
    expect(scanForbidden("Elegí una opción")).toEqual(["elegí"]);
    expect(scanForbidden("Ingresá un correo")).toEqual(["ingresá"]);
    expect(scanForbidden("Contanos quién sos, qué buscás")).toEqual(["contanos", "sos", "buscás"]);
  });

  it("detecta emojis", () => {
    expect(scanForbidden("Hola 🚀")).toEqual(["🚀"]);
  });

  it("no marca la flecha de enlace ni los signos de marca", () => {
    expect(scanForbidden("Explorar eventos ↗")).toEqual([]);
    expect(scanForbidden("© 2026 C3")).toEqual([]);
  });

  it("no marca el voseo dentro de otras palabras ni el tu correcto", () => {
    expect(scanForbidden("Tu experiencia")).toEqual([]);
    expect(scanForbidden("Escribe una pregunta y envía tu mensaje")).toEqual([]);
    expect(scanForbidden("Podrás elegir la vía")).toEqual([]);
  });

  it("detecta vocabulario prohibido, DEMO y precios", () => {
    expect(scanForbidden("Proponer un challenge")).toEqual(["challenge"]);
    expect(scanForbidden("Iniciar sesión")).toEqual(["iniciar sesión"]);
    expect(scanForbidden("Crear cuenta")).toEqual(["crear cuenta"]);
    expect(scanForbidden("Etiqueta DEMO")).toEqual(["demo"]);
    expect(scanForbidden("Desde $ 25")).toEqual(["$ 25"]);
    expect(scanForbidden("Cuota de 20 USD")).toEqual(["usd"]);
  });
});

describe("texto de la interfaz", () => {
  it("no contiene voseo, vocabulario prohibido, DEMO, precios ni emojis", () => {
    const violations: Record<string, string[]> = {};
    for (const file of interfaceFiles()) {
      const raw = readFileSync(join(APP_ROOT, file), "utf8");
      const text = /\.tsx?$/.test(file) ? stripComments(raw) : raw;
      const hits = scanForbidden(text);
      if (hits.length > 0) violations[file] = hits;
    }
    expect(violations).toEqual({});
  });
});
