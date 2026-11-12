import { expect, test } from "@playwright/test";

/**
 * La home está migrada al DS: lleva .c3-sitio y su titular toma el color navy del DS.
 * (Antes, con el hero oscuro anterior, la regla .c3-sitio pisaba el blanco heredado: ver el registro de la Fase 2.)
 */
test("el titular de la home usa el color navy del DS", async ({ page }) => {
  await page.goto("/");
  const color = await page.locator("main h1").evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe("rgb(15, 32, 62)");
});
