import { test } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Regenera la linea base de contenido (docs/superpowers/plans, Tarea 0.4).
 * Solo corre con CAPTURE_CONTENT=1. Usar SOLO sobre el sitio sin cambios de DS.
 */
const ROUTES = ["/", "/compite", "/crea", "/conecta", "/eventos", "/contacto", "/faq", "/que-es-c3"];

/**
 * Titulos de eventos: son datos (defaultEvents o Firestore), no copy. Se excluyen de la
 * linea base para que editar un evento en el admin no rompa la prueba de conservacion.
 */
const EVENT_TITLES = new Set([
  "Copa Salvadoreña de Programación",
  "Hackathon de Turismo Creativo I",
  "ICPC Centroamérica · sede El Salvador",
  "Hack@Latam · Fiesta El Salvador",
  "Duelo de Programación C3 · Software Week ESEN 2025",
  "Capture The Flag: Del Aula al ICC",
]);

test.skip(!process.env.CAPTURE_CONTENT, "solo para regenerar la linea base de contenido");

test("captura titulares y enlaces del sitio actual", async ({ page }) => {
  const out: Record<string, { headings: string[]; links: { text: string; href: string }[] }> = {};

  for (const route of ROUTES) {
    await page.goto(route);
    const headings = await page.$$eval("h1, h2, h3", (els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean),
    );
    const links = await page.$$eval("a[href]", (els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => ({
          text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
          href: el.getAttribute("href") ?? "",
        }))
        .filter((l) => l.text),
    );
    out[route] = {
      headings: [...new Set(headings)].filter((h) => !EVENT_TITLES.has(h)),
      links: links.filter((l) => !EVENT_TITLES.has(l.text)),
    };
  }

  writeFileSync(join(__dirname, "content-baseline.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(Object.entries(out).map(([r, v]) => `${r}: ${v.headings.length} titulares, ${v.links.length} enlaces`).join("\n"));
});
