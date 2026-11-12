import { expect, test } from "@playwright/test";

/**
 * El marco comun no debe cambiar el color de los titulares de las secciones que aun no se migran:
 * el hero es oscuro y su titular hereda blanco. Regresion encontrada al cambiar PageShell.
 */
test("el titular del hero sigue blanco sobre su fondo oscuro", async ({ page }) => {
  await page.goto("/");
  const color = await page.locator("#inicio h1").evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe("rgb(255, 255, 255)");
});
