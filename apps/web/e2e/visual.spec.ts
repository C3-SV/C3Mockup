import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "@playwright/test";

/**
 * Tarea 8.3, Step 1: capturas de línea base por página y viewport (DS §15.5, comparativo antes/después).
 * No bloqueante: no afirma nada sobre el diseño; las imágenes van a CAPTURAS_DIR (por defecto,
 * test-results/capturas, que no se versiona) para revisarlas a mano o con los skills de diseño.
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
] as const;

const DIRECTORIO = process.env.CAPTURAS_DIR ?? join(__dirname, "..", "test-results", "capturas");

test.beforeAll(() => {
  mkdirSync(DIRECTORIO, { recursive: true });
});

for (const ruta of RUTAS) {
  test(`captura de ${ruta}`, async ({ page }, testInfo) => {
    await page.goto(ruta, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const nombre = `${testInfo.project.name}_${ruta === "/" ? "inicio" : ruta.slice(1)}.png`;
    await page.screenshot({ path: join(DIRECTORIO, nombre), fullPage: true, animations: "disabled" });
  });
}
