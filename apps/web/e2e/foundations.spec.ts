import { expect, test } from "@playwright/test";

/** Base del DS (ACTUALIZACION-DS §6): enlace de salto y anillo de foco visible siempre. */

test("el primer Tab enfoca «Saltar al contenido» y lleva a #contenido", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
  await expect(page.locator("main#contenido")).toBeAttached();
});

test("el foco por teclado tiene anillo de 3 px, color de foco y desfase de 2 px", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page.locator(":focus").evaluate((el) => {
    const s = getComputedStyle(el);
    return { width: s.outlineWidth, style: s.outlineStyle, color: s.outlineColor, offset: s.outlineOffset };
  });
  expect(outline).toEqual({
    width: "3px",
    style: "solid",
    color: "rgb(101, 72, 199)",
    offset: "2px",
  });
});
