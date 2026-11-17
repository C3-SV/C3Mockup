import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import allowlist from "./hex-allowlist.json";

/**
 * Ningun componente nuevo puede traer hexadecimales sueltos: los colores vienen de tokens
 * --c3-* (ADR-0002). Los archivos que hoy tienen hex estan en hex-allowlist.json; la lista solo
 * puede encogerse. Al terminar la Fase 8 debe quedar vacia.
 */
const APP_ROOT = join(__dirname, "..", "..");
const SCAN_DIRS = ["app", "components", "lib"];
const EXCLUDED_PREFIX = `app${sep}ds${sep}`;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|css)$/.test(entry)) out.push(full);
  }
  return out;
}

function filesWithHex(): string[] {
  return SCAN_DIRS.flatMap((d) => walk(join(APP_ROOT, d)))
    .map((f) => relative(APP_ROOT, f).split(sep).join("/"))
    .filter((f) => !f.startsWith(EXCLUDED_PREFIX.split(sep).join("/")))
    .filter((f) => HEX.test(readFileSync(join(APP_ROOT, f), "utf8")))
    .sort();
}

describe("hexadecimales sueltos", () => {
  const current = filesWithHex();
  const allowed = new Set<string>(allowlist as string[]);

  it("ningun archivo nuevo tiene hexadecimales sueltos", () => {
    expect(current.filter((f) => !allowed.has(f))).toEqual([]);
  });

  it("la allowlist no conserva archivos que ya no tienen hexadecimales", () => {
    expect([...allowed].filter((f) => !current.includes(f))).toEqual([]);
  });
});
