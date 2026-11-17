import { expect, test } from "@playwright/test";

/**
 * Hero de la home: en un teléfono (640 px o menos) el texto y el símbolo van en una sola columna.
 * Con dos columnas, en 375 px el texto quedaba en unos 155 px de ancho. En escritorio siguen en dos columnas.
 */
test("el hero de la home usa una columna en el teléfono y dos en escritorio", async ({ page }) => {
  await page.goto("/");

  const ancho = page.viewportSize()?.width ?? 0;
  const pistas = await page.$eval(".c3-hero__grid", (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);

  if (ancho <= 640) {
    expect(pistas, "una sola columna en el teléfono").toBe(1);
    const anchoTexto = await page.$eval(".c3-hero__text", (el) => el.getBoundingClientRect().width);
    expect(anchoTexto, "el texto ocupa casi todo el ancho").toBeGreaterThanOrEqual(ancho - 64);
  } else {
    expect(pistas, "dos columnas en escritorio").toBe(2);
  }
});
