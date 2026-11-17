import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Protege la decision «el contenido existente se conserva» (AGENTS.md, ADR-0006).
 * Cada titular y enlace de content-baseline.json debe seguir en la pagina.
 * Cambios de texto permitidos (voseo a tu) se declaran en voseo-map.json con motivo en el PR.
 */
type Baseline = Record<string, { headings: string[]; links: { text: string; href: string }[] }>;

const baseline: Baseline = JSON.parse(readFileSync(join(__dirname, "content-baseline.json"), "utf8"));
const voseoMap: Record<string, string> = JSON.parse(readFileSync(join(__dirname, "voseo-map.json"), "utf8"));

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const mapped = (text: string) => norm(voseoMap[text] ?? text);

for (const [route, entry] of Object.entries(baseline)) {
  test(`${route} conserva sus titulares y enlaces`, async ({ page }) => {
    await page.goto(route);
    const bodyText = norm(await page.evaluate(() => document.body.textContent ?? ""));
    const hrefs = await page.$$eval("a[href]", (els) => els.map((e) => e.getAttribute("href") ?? ""));

    for (const heading of entry.headings) {
      expect(bodyText, `titular ausente: ${heading}`).toContain(mapped(heading));
    }
    for (const link of entry.links) {
      expect(hrefs, `destino ausente: ${link.href}`).toContain(link.href);
      expect(bodyText, `texto de enlace ausente: ${link.text}`).toContain(mapped(link.text));
    }
  });
}
