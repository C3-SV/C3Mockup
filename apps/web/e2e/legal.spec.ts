import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

const documents = [
  { label: "Privacidad", path: "/privacidad", title: "Privacidad" },
  { label: "Términos", path: "/terminos", title: "Términos de uso del sitio" },
  {
    label: "Convivencia",
    path: "/codigo-de-conducta",
    title: "Convivencia en actividades y espacios de C3",
  },
] as const;

test.describe("documentos legales base 0.1", () => {
  for (const document of documents) {
    test(`${document.path} abre desde el pie con versión y secciones enlazadas`, async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("navigation", { name: "Enlaces legales" })
        .getByRole("link", { name: document.label })
        .click();

      await expect(page).toHaveURL(new RegExp(`${document.path.replaceAll("/", "\\/")}$`));
      await expect(page.getByRole("heading", { level: 1, name: document.title })).toBeVisible();
      await expect(page.locator(".c3-legal__metadata").getByText("Versión 0.1", { exact: true })).toBeVisible();
      await expect(page.locator(".c3-legal__introduction")).toBeVisible();

      const sectionIds = await page.locator(".c3-legal__section").evaluateAll((sections) =>
        sections.map((section) => section.id),
      );
      const anchorTargets = await page.locator(".c3-legal__index a").evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).hash.slice(1)),
      );
      expect(anchorTargets).toEqual(sectionIds);
      expect(new Set(sectionIds).size).toBe(sectionIds.length);

      await expectNoHorizontalScroll(page);
      await expectNoSeriousA11y(page);
    });
  }

  test("el aviso de privacidad del formulario lleva al documento base", async ({ page }) => {
    await page.goto("/contacto");
    await page.getByRole("link", { name: "aviso de privacidad, versión 0.1" }).click();

    await expect(page).toHaveURL(/\/privacidad$/);
    await expect(page.getByRole("heading", { level: 1, name: "Privacidad" })).toBeVisible();
    await expect(page.locator(".c3-legal__metadata").getByText("Versión 0.1", { exact: true })).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectNoSeriousA11y(page);
  });
});
