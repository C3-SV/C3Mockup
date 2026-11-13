import { expect, test } from "@playwright/test";

/**
 * Orden del home (ADR-0011, decisión del 13-nov-2026): el hero, luego la evidencia viva con el destacado, luego
 * el resto. «Próximas iniciativas» ya no existe: sus eventos están en el catálogo.
 */
test("la evidencia viva va justo después del hero y no hay próximas iniciativas", async ({ page }) => {
  await page.goto("/");

  const titulares = await page.$$eval("h1, h2", (els) => els.map((el) => el.textContent?.trim() ?? ""));

  expect(titulares[0]).toBe("C3 desarrolla talento técnico joven a través de competencia, creación y conexión.");
  expect(titulares[1]).toBe("Evidencia viva del ecosistema C3");
  expect(titulares).not.toContain("Próximas iniciativas");
  expect(titulares.indexOf("Datos que respaldan el avance de C3")).toBeGreaterThan(1);
});
