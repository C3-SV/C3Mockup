import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Contacto (Tarea 7.2) en 390 y 1280 px: una h1, sin scroll horizontal, axe sin graves, formulario
 * usable con teclado y mensajes de envío con rol status o alert. La API se intercepta: no se envía correo.
 */

const MENSAJE_OK = "Mensaje enviado correctamente. Gracias por contactar a C3.";
const MENSAJE_ERROR = "No pudimos enviar el mensaje. Intenta de nuevo o escríbenos por correo.";

async function llenarFormulario(page: Page) {
  await page.getByLabel("Nombre completo").fill("Ana Pérez");
  await page.getByLabel("Correo electrónico").fill("ana@example.com");
  await page.getByLabel("Tipo de consulta").selectOption({ label: "Consulta general" });
  await page.getByLabel("Mensaje", { exact: true }).fill("Quisiera saber cómo participar en C3.");
}

test("/contacto: una h1, sin scroll horizontal y accesible", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Habla con nosotros");
  await expectNoHorizontalScroll(page);
  await expectNoSeriousA11y(page, "#contenido");
});

test("/contacto: un envío correcto muestra el mensaje en role=status", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: MENSAJE_OK }) }),
  );
  await page.goto("/contacto");
  await llenarFormulario(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator("form").getByRole("status")).toContainText(MENSAJE_OK);
});

test("/contacto: un error del servidor muestra el mensaje en role=alert", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, message: MENSAJE_ERROR }) }),
  );
  await page.goto("/contacto");
  await llenarFormulario(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(MENSAJE_ERROR);
});

test("/contacto: los campos se recorren con Tab, el honeypot queda fuera y el foco es visible", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByLabel("Nombre completo").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Correo electrónico")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel(/Institución \/ organización/)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Tipo de consulta")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Mensaje", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Enviar mensaje" })).toBeFocused();

  await expect(page.locator('input[name="honeypot"]')).toBeHidden();

  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Shift+Tab");
  }
  await expect(page.getByLabel("Nombre completo")).toBeFocused();
  const outline = await page.getByLabel("Nombre completo").evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(outline).toBe("3px");
});

test("/contacto: los campos miden al menos 44 px de alto", async ({ page }) => {
  await page.goto("/contacto");
  for (const etiqueta of ["Nombre completo", "Correo electrónico", "Tipo de consulta"]) {
    const caja = await page.getByLabel(etiqueta).boundingBox();
    expect(caja?.height ?? 0, etiqueta).toBeGreaterThanOrEqual(44);
  }
});

test("/contacto: los enlaces externos de ayuda abren en pestaña nueva con rel seguro", async ({ page }) => {
  await page.goto("/contacto");
  for (const href of ["https://copa.c3.com.sv", "https://hackathon.c3.com.sv"]) {
    const enlace = page.locator(`#contenido a[href="${href}"]`);
    await expect(enlace).toHaveAttribute("target", "_blank");
    await expect(enlace).toHaveAttribute("rel", /noopener/);
  }
});
