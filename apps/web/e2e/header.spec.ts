import { expect, test } from "@playwright/test";
import { expectNoSeriousA11y } from "./helpers";

/** Cabecera publica (DS §7.1): menu Ecosistema en escritorio, menu Menu en movil (quiebre 900 px). */

const header = (page: import("@playwright/test").Page) => page.locator(".c3-site-header");

test("la cabecera no tiene violaciones serias de accesibilidad", async ({ page }) => {
  await page.goto("/");
  await expectNoSeriousA11y(page, ".c3-site-header");
});

test("la pagina actual lleva aria-current en la navegacion", async ({ page }) => {
  await page.goto("/eventos");
  await expect(header(page).locator('.c3-site-nav a[aria-current="page"]')).toHaveText("Eventos");
});

test("escritorio: Ecosistema abre con clic, Escape cierra y devuelve el foco", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 900, "solo escritorio");
  await page.goto("/");
  const trigger = header(page).getByRole("button", { name: "Ecosistema" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(header(page).getByRole("link", { name: /Compite/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("movil: Menu abre el panel con Contacto y Escape lo cierra devolviendo el foco", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 900, "solo movil");
  await page.goto("/");
  const menu = header(page).getByRole("button", { name: "Menú" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".c3-site-mobile-panel").getByRole("link", { name: "Contacto" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});
