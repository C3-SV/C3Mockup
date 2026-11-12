import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/** Páginas de línea (Tarea 5.1): una h1, sin scroll horizontal, accesibles y con el color de su línea. */

const LINES = [
  { route: "/compite", title: "Eventos relacionados con Compite", color: "rgb(32, 82, 152)" },
  { route: "/crea", title: "Eventos relacionados con Crea", color: "rgb(15, 118, 110)" },
  { route: "/conecta", title: "Eventos relacionados con Conecta", color: "rgb(79, 91, 169)" },
] as const;

for (const line of LINES) {
  test(`${line.route}: una h1, sin scroll horizontal y accesible`, async ({ page }) => {
    await page.goto(line.route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoHorizontalScroll(page);
    await expectNoSeriousA11y(page, "#contenido");
  });

  test(`${line.route}: el título de eventos usa el color legible de su línea`, async ({ page }) => {
    await page.goto(line.route);
    const heading = page.getByRole("heading", { level: 2, name: line.title });
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe(line.color);
  });
}
