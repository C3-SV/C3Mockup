import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";
import sitemap from "@/app/sitemap";
import { publicRoutes } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import * as jsonLd from "@/lib/structured-data";

// El sitemap lee eventos de Firestore; aquí solo importan las rutas.
vi.mock("@/lib/events", () => ({ getPublicEvents: async () => [] }));

const WEB = join(__dirname, "..", "..");

/** Ancho y alto de un PNG, leídos de su cabecera IHDR (bytes 16 a 23, big-endian). */
function dimensionesPng(ruta: string): { width: number; height: number } {
  const bytes = readFileSync(join(WEB, ruta));
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("imagen para compartir (Open Graph)", () => {
  it("las dimensiones declaradas coinciden con las de public/og-image.png", () => {
    const real = dimensionesPng("public/og-image.png");
    const metadata = createPageMetadata({ title: "Inicio", description: "Descripción", path: "/" });
    const imagenes = metadata.openGraph?.images;
    const imagen = (Array.isArray(imagenes) ? imagenes[0] : imagenes) as { width: number; height: number };

    expect({ width: imagen.width, height: imagen.height }).toEqual(real);
    expect(siteConfig.defaultOgImageSize).toEqual(real);
  });
});

describe("manifest", () => {
  it("usa blanco como theme_color y background_color (tokens --c3-fondo)", () => {
    const m = manifest();
    expect(m.theme_color).toBe("#ffffff");
    expect(m.background_color).toBe("#ffffff");
  });
});

describe("sitemap", () => {
  it("incluye las rutas públicas del sitio", async () => {
    const entradas = await sitemap();
    expect(entradas.map((e) => e.url)).toEqual(publicRoutes.map((p) => `${siteConfig.domain}${p}`));
  });
});

describe("JSON-LD", () => {
  const bloques: Array<[string, object]> = [
    ["organización", jsonLd.organizationJsonLd],
    ["sitio web", jsonLd.websiteJsonLd],
    ["navegación", jsonLd.getSiteNavigationJsonLd()],
    ["migas de pan", jsonLd.getBreadcrumbJsonLd("/compite")],
    ["preguntas frecuentes", jsonLd.getFaqPageJsonLd("/faq", "Preguntas frecuentes", "Descripción")],
  ];

  it.each(bloques)("%s se serializa y vuelve a leerse igual", (_nombre, bloque) => {
    const texto = JSON.stringify(bloque);
    expect(JSON.parse(texto)).toEqual(bloque);
    expect(JSON.parse(texto)["@context"]).toBe("https://schema.org");
  });
});
