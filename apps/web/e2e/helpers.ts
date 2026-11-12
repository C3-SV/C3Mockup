import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"];

/** Falla si la página tiene scroll horizontal (DS §15.5). */
export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "scroll horizontal").toBeLessThanOrEqual(0);
}

/** Falla solo con violaciones de impacto serious o critical (WCAG 2.0 A/AA, 2.1 AA). `scope` limita el analisis a un selector. */
export async function expectNoSeriousA11y(page: Page, scope?: string) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (scope) builder = builder.include(scope);
  const results = await builder.analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodo(s)`),
    "violaciones serias o criticas de axe",
  ).toEqual([]);
}
