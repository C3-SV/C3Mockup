import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Tarea 8.3 (DS §15.5). Ocho páginas públicas y la 404 (la novena). Cada una se prueba a 390 y 1280 px
 * (proyectos de playwright.config.ts), a 320 px (Review Focus 4) y con movimiento reducido.
 */
const RUTAS = [
  "/",
  "/que-es-c3",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
  "/faq",
  "/contacto",
  "/ruta-inexistente",
] as const;

function estadoEsperado(ruta: string): number {
  return ruta === "/ruta-inexistente" ? 404 : 200;
}

/** El primer Tab enfoca un elemento con contorno sólido de 3 px (DS §6). */
async function expectFocoDeTecladoVisible(page: Page) {
  await page.keyboard.press("Tab");
  const foco = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const estilo = getComputedStyle(el);
    return { elemento: el.tagName, estilo: estilo.outlineStyle, grosor: estilo.outlineWidth };
  });
  expect(foco, "primer elemento enfocable de la página").not.toBeNull();
  expect(foco?.estilo, `contorno de ${foco?.elemento}`).toBe("solid");
  expect(foco?.grosor, `grosor de ${foco?.elemento}`).toBe("3px");
}

for (const ruta of RUTAS) {
  test(`${ruta}: respuesta, sin scroll horizontal, axe sin graves ni críticas y foco visible`, async ({ page }) => {
    const respuesta = await page.goto(ruta);
    expect(respuesta?.status()).toBe(estadoEsperado(ruta));
    await expectNoHorizontalScroll(page);
    await expectNoSeriousA11y(page);
    await expectFocoDeTecladoVisible(page);
  });
}

test.describe("320 px", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const ruta of RUTAS) {
    test(`${ruta} a 320 px: sin scroll horizontal y axe sin graves ni críticas`, async ({ page }, testInfo) => {
      testInfo.skip(testInfo.project.name !== "mobile-390", "320 px se prueba una vez, en el proyecto móvil");
      const respuesta = await page.goto(ruta);
      expect(respuesta?.status()).toBe(estadoEsperado(ruta));
      await expectNoHorizontalScroll(page);
      await expectNoSeriousA11y(page);
    });
  }
});

test.describe("movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  for (const ruta of RUTAS) {
    test(`${ruta} con movimiento reducido no tiene animaciones infinitas`, async ({ page }, testInfo) => {
      testInfo.skip(testInfo.project.name !== "desktop-1280", "movimiento reducido se prueba una vez, en escritorio");
      await page.goto(ruta);
      const infinitas = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations === Infinity)
          .map((a) => (a instanceof CSSAnimation ? a.animationName : a.id || "sin nombre")),
      );
      expect(infinitas, "animaciones infinitas en marcha").toEqual([]);
    });
  }
});
