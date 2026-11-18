import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { headerNavigation, mainNavigation, publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { getBreadcrumbJsonLd, getSiteNavigationJsonLd, getWebPageJsonLd } from "@/lib/structured-data";

vi.mock("@/lib/events", () => ({ getPublicEvents: async () => [] }));
vi.mock("@/lib/event-detail", () => ({ getPublishedEventPages: async () => [] }));

const GUIDE = "/empieza-en-c3";

/** Rutas públicas previas a la guía: ninguna puede desaparecer. */
const previousRoutes = ["/", "/que-es-c3", "/compite", "/crea", "/conecta", "/eventos", "/faq", "/contacto"];

describe("navegación de la guía Empieza en C3", () => {
  it("publicRoutes conserva las rutas actuales y añade la guía", () => {
    for (const route of previousRoutes) expect(publicRoutes).toContain(route);
    expect(publicRoutes).toContain(GUIDE);
  });

  it("la cabecera enlaza la guía y ya no enlaza FAQ", () => {
    const links = headerNavigation.flatMap((item) => ("href" in item ? [item] : []));
    expect(links).toContainEqual({ href: GUIDE, label: "Empieza en C3" });
    expect(links.map((item) => item.href)).not.toContain("/faq");
    expect(links.map((item) => item.href)).toEqual(expect.arrayContaining(["/que-es-c3", "/eventos", "/contacto"]));
  });

  it("la navegación del pie conserva FAQ y añade la guía", () => {
    const hrefs = mainNavigation.map((item) => item.href);
    expect(hrefs).toContain("/faq");
    expect(hrefs).toContain(GUIDE);
  });
});

describe("SEO de la guía Empieza en C3", () => {
  it("el sitemap conserva todas las rutas actuales y añade la guía con su canónica", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const route of [...previousRoutes, GUIDE]) {
      expect(urls).toContain(route === "/" ? siteConfig.domain : `${siteConfig.domain}${route}`);
    }
  });

  it("las etiquetas de navegación JSON-LD nombran la guía de forma legible", () => {
    const entry = getSiteNavigationJsonLd().itemListElement.find((i) => i.url === `${siteConfig.domain}${GUIDE}`);
    expect(entry?.name).toBe("Empieza en C3");
  });

  it("las migas de la guía terminan en «Empieza en C3» con su URL propia", () => {
    const last = getBreadcrumbJsonLd(GUIDE).itemListElement.at(-1);
    expect(last?.name).toBe("Empieza en C3");
    expect(last?.item).toBe(`${siteConfig.domain}${GUIDE}`);
  });

  it("el WebPage de la guía usa su propia URL canónica", () => {
    const data = getWebPageJsonLd({ path: GUIDE, title: "Empieza en C3", description: "Guía." });
    expect(data["@type"]).toBe("WebPage");
    expect(data.url).toBe(`${siteConfig.domain}${GUIDE}`);
  });
});
