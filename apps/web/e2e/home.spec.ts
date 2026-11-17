import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/** Home (Tarea 4.2): una sola h1, sin scroll horizontal, accesible, con foco visible y sin DEMO ni cuentas. */

test("la home tiene una sola h1 y no tiene scroll horizontal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expectNoHorizontalScroll(page);
});

test("la home no tiene violaciones serias de accesibilidad", async ({ page }) => {
  await page.goto("/");
  await expectNoSeriousA11y(page, "#contenido");
});

test("los botones del hero muestran el anillo de foco por teclado", async ({ page }) => {
  await page.goto("/");
  const explore = page.getByRole("link", { name: "Explorar eventos" }).first();
  await explore.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(explore).toBeFocused();
  const outline = await explore.evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(outline).toBe("3px");
});

// La sección de eventos viene de datos: su descripción puede citar nombres propios (p. ej. «International
// Cybersecurity Challenge»). La regla se aplica al texto propio de la home.
test("la home no muestra DEMO, challenge ni acceso de cuentas en su texto propio", async ({ page }) => {
  await page.goto("/");
  const all = await page.locator("#contenido").innerText();
  const events = await page.locator("#eventos").innerText();
  const copy = all.replace(events, "");
  expect(copy).not.toMatch(/\bDEMO\b|challenge|Iniciar sesión|Crear cuenta/i);
});
