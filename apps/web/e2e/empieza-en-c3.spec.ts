import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11y } from "./helpers";

/**
 * Guía «Empieza en C3» (spec 2026-11-13): acceso desde la cabecera, comunidad de WhatsApp sin seguir la invitación,
 * eventos, contacto y FAQ; sin JavaScript; FAQ sigue en el pie. Ninguna prueba abre chat.whatsapp.com: se
 * comprueban solo el destino y los atributos del enlace, y se aborta cualquier petición a ese host.
 */

const GUIDE = "/empieza-en-c3";
const INVITE = "https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA";

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900;

/** Abre la guía desde la cabecera (menú móvil o navegación de escritorio). */
async function openGuideFromHeader(page: Page) {
  await page.goto("/");
  if (!isDesktop(page)) {
    await page.locator(".c3-site-header").getByRole("button", { name: "Menú" }).click();
    await page.locator(".c3-site-mobile-panel").getByRole("link", { name: "Empieza en C3" }).click();
  } else {
    await page.locator(".c3-site-nav").getByRole("link", { name: "Empieza en C3" }).click();
  }
  await expect(page).toHaveURL(new RegExp(`${GUIDE}$`));
}

test.beforeEach(async ({ context }) => {
  // Nunca se visita WhatsApp: cualquier intento se aborta.
  await context.route(/whatsapp\.(com|net)/, (route) => route.abort());
});

test("desde la cabecera se abre la guía con una sola h1 y el título esperado", async ({ page }) => {
  await openGuideFromHeader(page);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Empieza en C3");
  await expect(page).toHaveTitle(/Empieza en C3/);
});

test("el enlace de comunidad apunta a la invitación, abre en pestaña nueva y avisa del servicio externo", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(GUIDE);
  const link = page.locator("#contenido").getByRole("link", { name: /Unirme a la comunidad/ });
  await expect(link).toHaveAttribute("href", INVITE);
  await expect(link).toHaveAttribute("target", "_blank");
  const rel = (await link.getAttribute("rel")) ?? "";
  expect(rel).toContain("noopener");
  expect(rel).toContain("noreferrer");
  const describedBy = await link.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).toContainText("WhatsApp");
  await expect(page.locator(`#${describedBy}`)).toContainText("servicio externo");
  expect(requests.filter((url) => /whatsapp/i.test(url)), "peticiones a WhatsApp").toEqual([]);
});

test("no se carga widget, SDK de terceros ni formulario en la guía", async ({ page }) => {
  await page.goto(GUIDE);
  await expect(page.locator("iframe")).toHaveCount(0);
  const scripts = await page.$$eval("script[src]", (els) => els.map((e) => e.getAttribute("src") ?? ""));
  expect(scripts.filter((src) => /^https?:/.test(src)), "scripts de terceros").toEqual([]);
  await expect(page.locator("#contenido form")).toHaveCount(0);
});

test("la guía lleva a eventos, a contacto y a la FAQ", async ({ page }) => {
  await page.goto(GUIDE);
  await page.locator("#contenido").getByRole("link", { name: "Explorar eventos" }).click();
  await expect(page).toHaveURL(/\/eventos$/);

  await page.goto(GUIDE);
  const contact = page.locator("#contenido").getByRole("link", { name: "Contactar a C3" });
  await expect(contact).toHaveAttribute("href", "/contacto");
  await contact.click();
  await expect(page).toHaveURL(/\/contacto$/);

  await page.goto(GUIDE);
  await page.locator("#contenido").getByRole("link", { name: "Ver todas las preguntas frecuentes" }).click();
  await expect(page).toHaveURL(/\/faq$/);
  await expect(page.locator("h1")).toHaveText("Preguntas frecuentes sobre C3");
});

test("JSON-LD de la guía: WebPage y BreadcrumbList con canónica propia, sin FAQPage", async ({ page }) => {
  await page.goto(GUIDE);
  const blocks = await page.$$eval('script[type="application/ld+json"]', (els) =>
    els.map((el) => JSON.parse(el.textContent ?? "{}")),
  );
  const types = blocks.map((block) => block["@type"]);
  expect(types).toContain("WebPage");
  expect(types).toContain("BreadcrumbList");
  expect(types).not.toContain("FAQPage");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/empieza-en-c3$/);
  const webPage = blocks.find((block) => block["@type"] === "WebPage");
  expect(webPage.url).toBe(canonical);
});

test("/faq conserva su canónica y su FAQPage", async ({ page }) => {
  await page.goto("/faq");
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/\/faq$/);
  const types = await page.$$eval('script[type="application/ld+json"]', (els) =>
    els.map((el) => JSON.parse(el.textContent ?? "{}")["@type"]),
  );
  expect(types).toContain("FAQPage");
});

test("la cabecera ya no enlaza FAQ; el pie sigue enlazándola y enlaza la guía", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".c3-site-nav").getByRole("link", { name: "FAQ" })).toHaveCount(0);
  await expect(page.locator(".c3-site-mobile-panel").getByRole("link", { name: "FAQ" })).toHaveCount(0);
  const footer = page.locator(".c3-footer");
  await expect(footer.getByRole("link", { name: "FAQ" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  await expect(footer.getByRole("link", { name: "Empieza en C3" })).toHaveAttribute("href", GUIDE);
});

test("la home enlaza la guía desde la sección de audiencias", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section.c3-featured").filter({ has: page.locator("#audiencias") }).getByRole("link", { name: "Empieza en C3" })).toHaveAttribute(
    "href",
    GUIDE,
  );
});

test("sin scroll horizontal, axe sin graves y cabecera sin desbordar", async ({ page }) => {
  await page.goto(GUIDE);
  await expectNoHorizontalScroll(page);
  await expectNoSeriousA11y(page);
  const overflowing = await page.evaluate(() => {
    const header = document.querySelector(".c3-site-header");
    if (!header) return ["sin cabecera"];
    const limit = document.documentElement.clientWidth;
    return Array.from(header.querySelectorAll("a, button"))
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && (box.right > limit + 0.5 || box.left < -0.5);
      })
      .map((el) => (el.textContent ?? "").trim());
  });
  expect(overflowing, "controles de la cabecera fuera del viewport").toEqual([]);
});

test("texto al 200 %: la guía no desborda horizontalmente", async ({ page }) => {
  await page.goto(GUIDE);
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await expectNoHorizontalScroll(page);
});

test("teclado: la guía recorre sus controles con contorno de foco de 3 px", async ({ page }) => {
  await page.goto(GUIDE);
  const widths: string[] = [];
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press("Tab");
    const width = await page.evaluate(() => {
      const el = document.activeElement;
      return !el || el === document.body ? null : getComputedStyle(el).outlineWidth;
    });
    if (width === null) break;
    widths.push(width);
  }
  expect(widths.length).toBeGreaterThan(0);
  expect(new Set(widths)).toEqual(new Set(["3px"]));
});

test("menús: la guía figura como página actual y Escape devuelve el foco", async ({ page }) => {
  await page.goto(GUIDE);
  if (isDesktop(page)) {
    await expect(page.locator(".c3-site-nav").getByRole("link", { name: "Empieza en C3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const trigger = page.locator(".c3-site-header").getByRole("button", { name: "Ecosistema" });
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  } else {
    const menu = page.locator(".c3-site-header").getByRole("button", { name: "Menú" });
    await menu.click();
    await expect(page.locator(".c3-site-mobile-panel").getByRole("link", { name: "Empieza en C3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
  }
});

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("la guía muestra enlaces reales a comunidad, eventos y contacto", async ({ page }) => {
    const response = await page.goto(GUIDE);
    expect(response?.status()).toBe(200);
    const main = page.locator("#contenido");
    await expect(main.locator(`a[href="${INVITE}"]`)).toHaveCount(1);
    await expect(main.locator('a[href="/eventos"]').first()).toBeVisible();
    await expect(main.locator('a[href="/contacto"]').first()).toBeVisible();
    await expect(main.locator('a[href="/faq"]').first()).toBeVisible();
  });
});
