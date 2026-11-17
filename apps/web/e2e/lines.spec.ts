import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Páginas de línea: una h1, sin scroll horizontal, accesibles. La cabecera va sobre el tinte de la página, sin banda
 * de color; el color de la línea llega con los puntos de la órbita y el título de eventos. El foco del teclado es el
 * violeta del DS, que se lee sobre el tinte.
 */

const FOCUS_VIOLET = "rgb(101, 72, 199)";

const LINES = [
  { route: "/compite", title: "Eventos relacionados con Compite", text: "rgb(32, 82, 152)", accent: "rgb(32, 82, 152)" },
  { route: "/crea", title: "Eventos relacionados con Crea", text: "rgb(15, 118, 110)", accent: "rgb(51, 190, 172)" },
  { route: "/conecta", title: "Eventos relacionados con Conecta", text: "rgb(79, 91, 169)", accent: "rgb(79, 91, 169)" },
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
    expect(color).toBe(line.text);
  });

  test(`${line.route}: la cabecera no tiene banda de color`, async ({ page }) => {
    await page.goto(line.route);
    const hero = page.locator(".c3-line-hero");
    const background = await hero.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(background).toBe("rgba(0, 0, 0, 0)");
  });

  test(`${line.route}: la órbita lleva el color de la línea en sus puntos`, async ({ page }) => {
    await page.goto(line.route);
    const dot = page.locator(".c3-line-hero .c3-orbit__satellite").first();
    const color = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(color).toBe(line.accent);
  });

  test(`${line.route}: el foco del teclado en la cabecera es el violeta del DS`, async ({ page }) => {
    await page.goto(line.route);
    const cta = page.locator(".c3-line-hero .c3-actions a").first();
    // Foco por teclado (no por ratón): :focus-visible se aplica y el contorno toma el color del foco global.
    await cta.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(cta).toBeFocused();
    const outline = await cta.evaluate((el) => getComputedStyle(el).outlineColor);
    expect(outline).toBe(FOCUS_VIOLET);
  });
}
