import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * 404 dentro del shell (Tarea 7.4) en 390 y 1280 px: responde 404, conserva cabecera y pie del sitio,
 * tiene una h1 y dos acciones con sus textos, no tiene scroll horizontal y pasa axe.
 */

test("una ruta inexistente responde 404 dentro del shell del sitio", async ({ page }) => {
  const response = await page.goto("/ruta-inexistente");
  expect(response?.status()).toBe(404);

  await expect(page.locator(".c3-site-header")).toBeVisible();
  await expect(page.locator(".c3-footer")).toBeVisible();
  await expect(page.locator("#contenido h1")).toHaveText("No encontramos esta página");
  await expect(page.locator("#contenido").getByText("Error 404", { exact: true })).toBeVisible();

  const explorar = page.getByRole("link", { name: "Explorar eventos", exact: true });
  await expect(explorar).toHaveAttribute("href", "/eventos");
  await expect(explorar).toHaveClass(/c3-btn--primario/);

  const inicio = page.getByRole("link", { name: "Volver al inicio", exact: true });
  await expect(inicio).toHaveAttribute("href", "/");
  await expect(inicio).toHaveClass(/c3-btn--contorno/);
});

test("el 404 no tiene scroll horizontal y pasa axe", async ({ page }) => {
  await page.goto("/ruta-inexistente");
  await expectNoHorizontalScroll(page);
  await expectNoSeriousA11y(page, "#contenido");
});
