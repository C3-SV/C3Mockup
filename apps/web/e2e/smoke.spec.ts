import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll } from "./helpers";

const ROUTES = ["/", "/compite", "/crea", "/conecta", "/eventos", "/contacto", "/faq", "/que-es-c3"];

for (const route of ROUTES) {
  test(`${route} responde y no tiene scroll horizontal`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expectNoHorizontalScroll(page);
  });
}

test("ruta inexistente responde 404 sin scroll horizontal", async ({ page }) => {
  const response = await page.goto("/ruta-inexistente");
  expect(response?.status()).toBe(404);
  await expectNoHorizontalScroll(page);
});
