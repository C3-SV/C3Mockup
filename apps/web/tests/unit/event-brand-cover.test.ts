import { describe, expect, it } from "vitest";
import { defaultEvents } from "@c3/config";
import { BRAND_COVER, coverOrBrand, isBrandCover, toCatalogCard } from "@/lib/ds/event-card";

/**
 * Sin portada, la edición muestra la imagen base de C3 (el logo), no un ícono ni un hueco. Con portada, se usa la
 * portada del evento.
 */
describe("imagen base de C3 cuando no hay portada", () => {
  it("la tarjeta de un evento sin portada usa el logo de C3", () => {
    const event = { ...defaultEvents[1], cover: undefined };
    expect(toCatalogCard(event).cover).toEqual(BRAND_COVER);
    expect(BRAND_COVER.url).toBe("/brand/logo-c3-fondo-azul.png");
  });

  it("con portada, la tarjeta usa la portada del evento", () => {
    const cover = { url: "https://cdn.example.org/p.jpg", alt: "Podio" };
    expect(toCatalogCard({ ...defaultEvents[1], cover }).cover).toEqual(cover);
  });

  it("reconoce la imagen base para mostrarla completa", () => {
    expect(isBrandCover(BRAND_COVER)).toBe(true);
    expect(isBrandCover({ url: "https://cdn.example.org/p.jpg", alt: "x" })).toBe(false);
    expect(coverOrBrand(undefined)).toEqual(BRAND_COVER);
  });
});
