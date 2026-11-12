import { expect, test, type Page } from "@playwright/test";

/**
 * Objetivo táctil de al menos 44 px (AGENTS.md §3, DS): cada control visible de la cabecera, y los enlaces del
 * menú Ecosistema cuando está desplegado, miden al menos 44 px de alto y de ancho.
 */

const MIN_PX = 44;

async function expectTargetsAtLeast44(page: Page, selector: string) {
  const items = page.locator(selector);
  const count = await items.count();
  const small: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const item = items.nth(index);
    if (!(await item.isVisible())) continue;
    const box = await item.boundingBox();
    if (!box) continue;
    if (box.width < MIN_PX || box.height < MIN_PX) {
      const label = ((await item.textContent()) ?? "").trim() || (await item.getAttribute("aria-label")) || selector;
      small.push(`${label}: ${Math.round(box.width)}×${Math.round(box.height)}`);
    }
  }
  expect(small, "controles por debajo de 44 px").toEqual([]);
}

test("la cabecera: logo, enlaces, Contacto y Menú miden al menos 44 px", async ({ page }) => {
  await page.goto("/");
  await expectTargetsAtLeast44(page, "header a:not(.c3-saltar), header button");
});

test("el menú Ecosistema desplegado: sus enlaces miden al menos 44 px", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator("header .c3-dropdown button");
  if (!(await trigger.isVisible())) {
    test.skip(true, "En móvil, Ecosistema va dentro del panel del menú, que se prueba en la cabecera");
  }
  await trigger.click();
  await expectTargetsAtLeast44(page, "header .c3-dropdown__panel a");
});
