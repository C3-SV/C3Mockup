import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * FAQ y Qué es C3 (Tarea 7.3) en 390 y 1280 px: encabezado de página del DS, una h1, tarjetas c3-card,
 * sin scroll horizontal, axe sin graves, Crea base (#33beac) fuera del color de texto (DS §3) y recorrido
 * con teclado con el contorno de foco de 3 px en cada elemento enfocable.
 */

const CREA_BASE = "rgb(51, 190, 172)";
const PAGINAS = ["/faq", "/que-es-c3"] as const;

/** Color calculado de cada elemento de #contenido que tiene texto propio. */
async function coloresDeTexto(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const colores: string[] = [];
    for (const el of Array.from(document.querySelectorAll("#contenido *"))) {
      const tieneTexto = Array.from(el.childNodes).some(
        (nodo) => nodo.nodeType === Node.TEXT_NODE && (nodo.textContent ?? "").trim() !== "",
      );
      if (tieneTexto) colores.push(getComputedStyle(el).color);
    }
    return colores;
  });
}

/** Avanza con Tab por toda la página y devuelve el grosor del contorno de cada elemento enfocado. */
async function contornosConTeclado(page: Page): Promise<string[]> {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  const contornos: string[] = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    const contorno = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return getComputedStyle(el).outlineWidth;
    });
    if (contorno === null) break;
    contornos.push(contorno);
  }
  return contornos;
}

for (const ruta of PAGINAS) {
  test.describe(ruta, () => {
    test("una h1 en el encabezado de página del DS, tarjetas c3-card, sin scroll horizontal y accesible", async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".c3-page-head h1")).toHaveCount(1);
      await expect(page.locator("#contenido .c3-card").first()).toBeVisible();
      await expectNoHorizontalScroll(page);
      await expectNoSeriousA11y(page, "#contenido");
    });

    test("Crea base no se usa como color de texto", async ({ page }) => {
      await page.goto(ruta);
      expect(await coloresDeTexto(page)).not.toContain(CREA_BASE);
    });

    test("cada elemento enfocable con Tab muestra el contorno de foco de 3 px", async ({ page }) => {
      await page.goto(ruta);
      const contornos = await contornosConTeclado(page);
      expect(contornos.length).toBeGreaterThan(0);
      expect(new Set(contornos)).toEqual(new Set(["3px"]));
    });
  });
}

test("/que-es-c3: cada foto del equipo tiene texto alternativo", async ({ page }) => {
  await page.goto("/que-es-c3");
  const alts = await page.locator("#contenido img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("alt") ?? ""));
  expect(alts.length).toBeGreaterThan(0);
  for (const alt of alts) {
    expect(alt.trim()).not.toBe("");
  }
});
