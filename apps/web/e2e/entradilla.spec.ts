import { expect, test } from "@playwright/test";

/**
 * Entradilla bajo el titular de sección (DS, ADR-0013): en escritorio mide hasta 62 caracteres, no 34, para que
 * el texto no quede angosto frente al titular. En el teléfono ocupa el ancho disponible.
 */
test("la entradilla de la evidencia viva es ancha en escritorio y llena el ancho en el teléfono", async ({ page }) => {
  await page.goto("/");

  const ancho = page.viewportSize()?.width ?? 0;
  const anchoEntradilla = await page.$eval(
    "#eventos .c3-lead",
    (el) => el.getBoundingClientRect().width,
  );

  if (ancho >= 900) {
    expect(anchoEntradilla, "entradilla ancha en escritorio").toBeGreaterThanOrEqual(480);
  } else {
    expect(anchoEntradilla, "entradilla a todo el ancho en el teléfono").toBeGreaterThanOrEqual(ancho - 64);
  }
});
