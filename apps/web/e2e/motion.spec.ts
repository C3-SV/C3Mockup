import { expect, test } from "@playwright/test";

/** Órbita del símbolo (DS §7.13): con movimiento reducido no gira; en móvil la burbuja va en línea. */

test.describe("movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("los anillos de la órbita no giran", async ({ page }) => {
    await page.goto("/");
    const animation = await page
      .locator(".c3-orbit__spin--outer")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
  });
});

test("en tableta y móvil la burbuja de la órbita se muestra en línea, bajo el símbolo", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 900, "solo tableta y móvil");
  await page.goto("/");
  await page.getByRole("button", { name: "Compite" }).click();
  const bubble = page.locator("#c3-orbit-bubble");
  await expect(bubble).toBeVisible();
  await expect(bubble).toHaveCSS("position", "static");
  await expect(bubble.getByRole("link", { name: /Conocer Compite/ })).toHaveAttribute("href", "/compite");
});
