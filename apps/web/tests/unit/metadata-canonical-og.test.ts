import { describe, expect, it } from "vitest";
import { createPageMetadata, absoluteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

/**
 * H13 (auditoría 2026-11-17). La portada tiene una sola forma canónica: https://c3.com.sv, sin barra final (la que
 * sirve el sitio hoy). Las fichas de evento usan su portada como imagen de Open Graph, con su texto alternativo, y
 * declaran medidas solo si se conocen.
 */
describe("absoluteUrl", () => {
  it("la raíz no lleva barra final", () => {
    expect(absoluteUrl("/")).toBe("https://c3.com.sv");
  });

  it("las demás rutas conservan su ruta exacta", () => {
    expect(absoluteUrl("/eventos/copa")).toBe("https://c3.com.sv/eventos/copa");
  });
});

describe("createPageMetadata: canonical y Open Graph", () => {
  it("el canonical de la portada coincide con el HTML en vivo (sin barra final)", () => {
    const meta = createPageMetadata({ title: "Inicio", description: "d", path: "/" });
    expect(meta.alternates?.canonical).toBe("https://c3.com.sv");
    expect(meta.openGraph && "url" in meta.openGraph ? meta.openGraph.url : undefined).toBe("https://c3.com.sv");
  });

  it("sin imagen propia usa la imagen institucional con sus medidas", () => {
    const meta = createPageMetadata({ title: "T", description: "d", path: "/eventos" });
    const images = meta.openGraph && "images" in meta.openGraph ? meta.openGraph.images : undefined;
    expect(images).toEqual([
      {
        url: `${siteConfig.domain}${siteConfig.defaultOgImage}`,
        width: siteConfig.defaultOgImageSize.width,
        height: siteConfig.defaultOgImageSize.height,
        alt: "T",
      },
    ]);
  });

  it("con portada de evento usa esa imagen, con su texto alternativo y sin medidas inventadas", () => {
    const meta = createPageMetadata({
      title: "Evento",
      description: "d",
      path: "/eventos/evento",
      image: { url: "https://cdn.example.org/portada.jpg", alt: "Portada del evento" },
    });
    const images = meta.openGraph && "images" in meta.openGraph ? meta.openGraph.images : undefined;
    expect(images).toEqual([{ url: "https://cdn.example.org/portada.jpg", alt: "Portada del evento" }]);
    expect(meta.twitter && "images" in meta.twitter ? meta.twitter.images : undefined).toEqual([
      "https://cdn.example.org/portada.jpg",
    ]);
  });

  it("declara medidas de la portada solo si se conocen", () => {
    const meta = createPageMetadata({
      title: "Evento",
      description: "d",
      path: "/eventos/evento",
      image: { url: "https://cdn.example.org/p.jpg", alt: "p", width: 1200, height: 630 },
    });
    const images = meta.openGraph && "images" in meta.openGraph ? meta.openGraph.images : undefined;
    expect(images).toEqual([{ url: "https://cdn.example.org/p.jpg", alt: "p", width: 1200, height: 630 }]);
  });
});
