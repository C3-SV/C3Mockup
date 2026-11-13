import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EventItem } from "@c3/config";

/**
 * Ruta /eventos/[slug] (T4, fix R21/R22): generateStaticParams vacío para que revalidate surta efecto, y metadata
 * propia (canonical y Open Graph del evento, no los del layout ni de la home).
 */

const found = vi.hoisted(() => ({ event: null as EventItem | null }));

vi.mock("@/lib/event-detail", () => ({ getPublicEventBySlug: async () => found.event }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

import * as route from "@/app/eventos/[slug]/page";

const SLUG = "copa-salvadorena-programacion-2026";

beforeEach(() => {
  found.event = {
    id: "copa-2026",
    title: "Copa Salvadoreña de Programación 2026",
    description: "Competencia nacional de programación.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: false,
    page: { slug: SLUG, publication: "published", overview: ["Texto."], resources: [] },
  };
});

describe("/eventos/[slug]", () => {
  it("generateStaticParams devuelve [] (ISR bajo demanda) y dynamicParams no se cierra", async () => {
    expect(await route.generateStaticParams()).toEqual([]);
    expect((route as Record<string, unknown>).dynamicParams).toBeUndefined();
    expect(route.revalidate).toBe(60);
  });

  it("metadata: título real, canonical absoluto de la ficha y Open Graph del evento", async () => {
    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: SLUG }) });

    expect(metadata.title).toBe("Copa Salvadoreña de Programación 2026");
    expect(metadata.alternates?.canonical).toBe(`https://c3.com.sv/eventos/${SLUG}`);
    expect(String(metadata.alternates?.canonical)).not.toBe("https://c3.com.sv");

    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.url).toBe(`https://c3.com.sv/eventos/${SLUG}`);
    expect(og.title).toBe("Copa Salvadoreña de Programación 2026");
    expect(og.description).toBe("Competencia nacional de programación.");
    // Imagen institucional por defecto.
    expect(JSON.stringify(og.images)).toContain("/og-image.png");
  });

  it("metadata y página responden 404 si no hay ficha publicada", async () => {
    found.event = null;
    await expect(route.generateMetadata({ params: Promise.resolve({ slug: SLUG }) })).rejects.toThrow("404");
    await expect(route.default({ params: Promise.resolve({ slug: SLUG }) })).rejects.toThrow("404");
  });
});
