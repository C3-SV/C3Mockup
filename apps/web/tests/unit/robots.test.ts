import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** robots.txt público: sin la directiva Host (solo la entiende un buscador) y con el mapa del sitio. */
const robots = readFileSync(join(__dirname, "..", "..", "public", "robots.txt"), "utf8");

describe("robots.txt", () => {
  it("no lleva la directiva Host, que no sirve a los buscadores habituales", () => {
    const hostLines = robots.split(/\r?\n/).filter((line) => /^host:/i.test(line.trim()));
    expect(hostLines).toEqual([]);
  });

  it("permite el rastreo público y apunta al mapa del sitio", () => {
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toContain("Sitemap: https://c3.com.sv/sitemap.xml");
  });
});
