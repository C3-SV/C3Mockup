import { expect, test } from "@playwright/test";
import { expectNoSeriousA11y } from "./helpers";

/** Pie navy (DS §7.3): accesible en las dos anchuras y con los enlaces del sitio. */

test("el pie no tiene violaciones serias de accesibilidad", async ({ page }) => {
  await page.goto("/eventos");
  await expectNoSeriousA11y(page, ".c3-footer");
});

test("el pie lleva a las paginas principales", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator(".c3-footer");
  await expect(footer.getByRole("link", { name: "Eventos" })).toHaveAttribute("href", "/eventos");
  await expect(footer.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto");
  await expect(footer.getByRole("link", { name: "Conecta" })).toHaveAttribute("href", "/conecta");
});

test("el pie conserva FAQ y enlaza la guía Empieza en C3", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator(".c3-footer");
  await expect(footer.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  await expect(footer.getByRole("link", { name: "Empieza en C3" })).toHaveAttribute("href", "/empieza-en-c3");
});
