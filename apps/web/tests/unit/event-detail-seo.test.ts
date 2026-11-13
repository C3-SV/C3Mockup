import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import type { EventItem } from "@c3/config";

/**
 * SEO de la ficha de evento (T5, spec §8): metadata y canonical propios, imagen institucional de respaldo,
 * JSON-LD WebPage + BreadcrumbList (sin Event, R6) y listas JSON-LD que enlazan lo mismo que las tarjetas.
 */

const found = vi.hoisted(() => ({ event: null as EventItem | null }));

vi.mock("@/lib/event-detail", () => ({ getPublicEventBySlug: async () => found.event }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

import * as route from "@/app/eventos/[slug]/page";
import SeoJsonLd from "@/components/SeoJsonLd";
import { toCatalogCard } from "@/lib/ds/event-card";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import {
  getBreadcrumbJsonLd,
  getEventBreadcrumbJsonLd,
  getEventItemListEntry,
  getEventWebPageJsonLd,
  getItemListJsonLd,
} from "@/lib/structured-data";

const SLUG = "copa-salvadorena-programacion-2026";
const TITLE = "Copa Salvadoreña de Programación 2026";

function makeEvent(over: Partial<EventItem> = {}): EventItem {
  return {
    id: "copa-2026",
    title: TITLE,
    description: "Competencia nacional de programación.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: false,
    page: { slug: SLUG, publication: "published", overview: ["Texto."], resources: [] },
    ...over,
  };
}

beforeEach(() => {
  found.event = makeEvent();
});

describe("metadata de la ficha", () => {
  it("canonical y og:url corresponden al slug de la ficha, con el título real del evento", async () => {
    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: SLUG }) });

    expect(metadata.title).toBe(TITLE);
    expect(metadata.alternates?.canonical).toBe(`https://c3.com.sv/eventos/${SLUG}`);
    expect((metadata.openGraph as { url: string }).url).toBe(`https://c3.com.sv/eventos/${SLUG}`);
  });

  it("sin portada autorizada usa la imagen institucional (OG y Twitter)", async () => {
    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: SLUG }) });
    const og = metadata.openGraph as { images: Array<{ url: string; width?: number; height?: number }> };
    const institutional = `${siteConfig.domain}${siteConfig.defaultOgImage}`;

    expect(og.images).toHaveLength(1);
    expect(og.images[0]).toMatchObject({ url: institutional, ...siteConfig.defaultOgImageSize });
    expect((metadata.twitter as { images: string[] }).images).toEqual([institutional]);
  });

  it("con portada autorizada la usa como imagen con su descripción alternativa, sin inventar dimensiones", async () => {
    found.event = makeEvent({ cover: { url: "https://cdn.c3.com.sv/copa.jpg", alt: "Podio de la Copa" } });

    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: SLUG }) });
    const og = metadata.openGraph as { images: Array<Record<string, unknown>> };

    expect(og.images).toEqual([{ url: "https://cdn.c3.com.sv/copa.jpg", alt: "Podio de la Copa" }]);
    expect((metadata.twitter as { images: string[] }).images).toEqual(["https://cdn.c3.com.sv/copa.jpg"]);
  });

  it("createPageMetadata sin opción de imagen se comporta como siempre", () => {
    const metadata = createPageMetadata({ title: "Inicio", description: "Descripción", path: "/" });
    const og = metadata.openGraph as { images: Array<{ url: string }> };
    expect(og.images[0].url).toBe(`${siteConfig.domain}${siteConfig.defaultOgImage}`);
  });
});

describe("JSON-LD de la ficha", () => {
  it("WebPage con la URL canónica del slug y el título real; sin Event", () => {
    const event = makeEvent();
    const webPage = getEventWebPageJsonLd(event);

    expect(webPage["@type"]).toBe("WebPage");
    expect(webPage.url).toBe(`https://c3.com.sv/eventos/${SLUG}`);
    expect(webPage.name).toBe(TITLE);
    expect(webPage.description).toBe(event.description);
  });

  it("BreadcrumbList Inicio → Eventos → título real, con las URL canónicas", () => {
    const crumbs = getEventBreadcrumbJsonLd(makeEvent());

    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement.map((item) => [item.position, item.name, item.item])).toEqual([
      [1, "Inicio", "https://c3.com.sv"],
      [2, "Eventos", "https://c3.com.sv/eventos"],
      [3, TITLE, `https://c3.com.sv/eventos/${SLUG}`],
    ]);
  });

  it("getBreadcrumbJsonLd sigue igual sin etiqueta final", () => {
    const crumbs = getBreadcrumbJsonLd("/eventos");
    expect(crumbs.itemListElement.map((item) => item.name)).toEqual(["Inicio", "Eventos"]);
  });

  it("la página emite WebPage y BreadcrumbList, y ningún Event", async () => {
    const element = (await route.default({ params: Promise.resolve({ slug: SLUG }) })) as ReactElement;
    const payloads: Array<Record<string, unknown>> = [];
    const visit = (node: ReactNode): void => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }
      const el = node as ReactElement<{ children?: ReactNode; data?: Record<string, unknown> }>;
      if (el.type === SeoJsonLd && el.props.data) payloads.push(el.props.data);
      visit(el.props?.children);
    };
    visit(element);

    expect(payloads.map((p) => p["@type"]).sort()).toEqual(["BreadcrumbList", "WebPage"]);
    expect(JSON.stringify(payloads)).not.toContain('"@type":"Event"');
  });
});

describe("listas JSON-LD y tarjetas enlazan lo mismo", () => {
  it("con ficha publicada la entrada apunta a la ficha, igual que la tarjeta", () => {
    const event = makeEvent();
    const entry = getEventItemListEntry(event);

    expect(entry.url).toBe(`${siteConfig.domain}${toCatalogCard(event).href}`);
    expect(entry.url).toBe(`https://c3.com.sv/eventos/${SLUG}`);
    expect(entry.name).toBe(TITLE);
  });

  it("sin ficha conserva el enlace original: externo tal cual, interno con dominio", () => {
    const external = makeEvent({ page: undefined });
    expect(getEventItemListEntry(external).url).toBe(toCatalogCard(external).href);

    const internal = makeEvent({ page: undefined, href: "/contacto", external: false });
    expect(getEventItemListEntry(internal).url).toBe(`${siteConfig.domain}/contacto`);
  });

  it("getItemListJsonLd conserva el nombre que se le da (P9 sigue pendiente)", () => {
    const list = getItemListJsonLd("/", [getEventItemListEntry(makeEvent())], "Eventos destacados C3");
    expect(list.name).toBe("Eventos destacados C3");
    expect(list.itemListElement[0].url).toBe(`https://c3.com.sv/eventos/${SLUG}`);
  });
});
