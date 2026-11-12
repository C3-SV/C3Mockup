import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Páginas de línea (Tarea 5.1 y ajustes de Fase 5): una h1, sin scroll horizontal, accesibles y con el color de su
 * línea en la cabecera, en el título de eventos y en el foco del teclado sobre la cabecera.
 */

const LINES = [
  {
    route: "/compite",
    title: "Eventos relacionados con Compite",
    text: "rgb(32, 82, 152)",
    band: "rgb(32, 82, 152)",
    onBand: "rgb(255, 255, 255)",
  },
  {
    route: "/crea",
    title: "Eventos relacionados con Crea",
    text: "rgb(15, 118, 110)",
    band: "rgb(51, 190, 172)",
    onBand: "rgb(15, 32, 62)",
  },
  {
    route: "/conecta",
    title: "Eventos relacionados con Conecta",
    text: "rgb(79, 91, 169)",
    band: "rgb(79, 91, 169)",
    onBand: "rgb(255, 255, 255)",
  },
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

  test(`${line.route}: la cabecera es del color pleno de su línea`, async ({ page }) => {
    await page.goto(line.route);
    const band = page.locator(".c3-line-hero");
    const color = await band.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(color).toBe(line.band);
  });

  test(`${line.route}: el foco del teclado sobre la cabecera se ve (color legible sobre la línea)`, async ({ page }) => {
    await page.goto(line.route);
    const cta = page.locator(".c3-line-hero .c3-actions a").first();
    // Foco por teclado (no por ratón): :focus-visible se aplica y el contorno toma el color del foco de la cabecera.
    await cta.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(cta).toBeFocused();
    const outline = await cta.evaluate((el) => getComputedStyle(el).outlineColor);
    expect(outline).toBe(line.onBand);
  });
}
