import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Catálogo de /eventos (Tarea 6.1): una h1, sin scroll horizontal, accesible y filtros por teclado.
 * Los datos son los de Firestore cuando el entorno lo configura (.env.local) y, si no, los 5 de defaultEvents.
 * Por eso las pruebas no fijan cuántos eventos hay: comprueban propiedades que valen para cualquier conjunto
 * (los filtros reparten el catálogo sin solaparse, cada área muestra solo sus eventos y la paginación aparece
 * solo con más de 6). Los casos de fecha y de «sin resultados» están en tests/unit y components/EventsCatalog.test.tsx.
 */

const CARD = "article.c3-exp";
const PAGINACION = "Paginación";

type Tarjeta = { titulo: string; lineas: string };

/** Recorre todas las páginas del catálogo desde la página 1 y devuelve título y líneas de cada tarjeta. */
async function tarjetasDelCatalogo(page: Page): Promise<Tarjeta[]> {
  const nav = page.getByRole("navigation", { name: PAGINACION });
  const paginas = (await nav.count()) ? await nav.getByRole("button", { name: /^Página \d+$/ }).count() : 1;
  const tarjetas: Tarjeta[] = [];

  for (let pagina = 1; pagina <= paginas; pagina++) {
    if (pagina > 1) {
      await nav.getByRole("button", { name: `Página ${pagina}` }).click();
    }
    const cards = page.locator(CARD);
    const total = await cards.count();
    for (let i = 0; i < total; i++) {
      tarjetas.push({
        titulo: (await cards.nth(i).locator("h3").textContent()) ?? "",
        lineas: (await cards.nth(i).locator(".c3-exp__lines").textContent()) ?? "",
      });
    }
  }

  return tarjetas;
}

test("/eventos: una h1, sin scroll horizontal y accesible", async ({ page }) => {
  await page.goto("/eventos");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Iniciativas que activan el ecosistema técnico joven");
  await expectNoHorizontalScroll(page);
  await expectNoSeriousA11y(page, "#contenido");
});

test("/eventos: al cargar, Todas y Todos están activos y la página muestra como mucho 6 eventos", async ({ page }) => {
  await page.goto("/eventos");
  await expect(page.getByRole("button", { name: "Todas", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Todos", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(CARD).first()).toBeVisible();
  expect(await page.locator(CARD).count()).toBeLessThanOrEqual(6);
});

test("/eventos: el filtro de área se activa con el teclado y solo muestra eventos de esa área", async ({ page }) => {
  await page.goto("/eventos");
  const todas = await tarjetasDelCatalogo(page);
  await page.goto("/eventos");

  const compite = page.getByRole("button", { name: "Compite", exact: true });
  await compite.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(compite).toBeFocused();
  const outline = await compite.evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(outline).toBe("3px");

  await page.keyboard.press("Enter");
  await expect(compite).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Todas", exact: true })).toHaveAttribute("aria-pressed", "false");

  const deCompite = await tarjetasDelCatalogo(page);
  expect(deCompite.length).toBeLessThanOrEqual(todas.length);
  for (const tarjeta of deCompite) {
    expect(tarjeta.lineas, tarjeta.titulo).toContain("Compite");
    expect(todas.map((t) => t.titulo), tarjeta.titulo).toContain(tarjeta.titulo);
  }
  await expectNoHorizontalScroll(page);
  await expectNoSeriousA11y(page, "#contenido");
});

test("/eventos: Próximos y Concluidos reparten el catálogo sin solaparse", async ({ page }) => {
  await page.goto("/eventos");
  const todos = await tarjetasDelCatalogo(page);

  await page.goto("/eventos");
  await page.getByRole("button", { name: "Próximos", exact: true }).click();
  await expect(page.getByRole("button", { name: "Próximos", exact: true })).toHaveAttribute("aria-pressed", "true");
  const proximos = await tarjetasDelCatalogo(page);

  await page.getByRole("button", { name: "Concluidos", exact: true }).click();
  await expect(page.getByRole("button", { name: "Concluidos", exact: true })).toHaveAttribute("aria-pressed", "true");
  const concluidos = await tarjetasDelCatalogo(page);

  expect(proximos.length + concluidos.length).toBe(todos.length);
  const titulosConcluidos = concluidos.map((t) => t.titulo);
  for (const tarjeta of proximos) {
    expect(titulosConcluidos, tarjeta.titulo).not.toContain(tarjeta.titulo);
  }
});

test("/eventos: la paginación aparece solo con más de 6 eventos y lleva a la página siguiente", async ({ page }) => {
  await page.goto("/eventos");
  const total = (await tarjetasDelCatalogo(page)).length;

  await page.goto("/eventos");
  const nav = page.getByRole("navigation", { name: PAGINACION });
  if (total > 6) {
    await expect(nav).toBeVisible();
    await nav.getByRole("button", { name: "Página 2" }).click();
    await expect(nav.getByRole("button", { name: "Página 2" })).toHaveAttribute("aria-current", "page");
    await expect(page.locator(CARD)).toHaveCount(total - 6);
  } else {
    await expect(nav).toHaveCount(0);
  }
  await expectNoHorizontalScroll(page);
});
