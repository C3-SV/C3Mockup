import { describe, expect, it, vi } from "vitest";

/**
 * H5 (auditoría 2026-11-17): el lastmod de las rutas generales (/, /eventos…) era el máximo global de updatedAt de
 * todos los eventos, así que cualquier edición las movía a todas, y había un fallback `?? new Date()` que inventa
 * fechas. Las rutas generales no llevan lastmod derivado de eventos; las fichas conservan su fecha real.
 */

vi.mock("@/lib/events", () => ({
  getPublicEvents: vi.fn(async () => [
    {
      id: "a",
      title: "A",
      updatedAt: "2026-11-10T10:00:00.000Z",
      createdAt: "2026-10-01T10:00:00.000Z",
      eventDate: "2026-12-01",
    },
  ]),
  FirebaseNotConfiguredError: class extends Error {},
}));

vi.mock("@/lib/event-detail", () => ({
  getPublishedEventPages: vi.fn(async () => []),
}));

describe("sitemap: lastmod", () => {
  it("no atribuye a las rutas generales la fecha de una edición", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const home = entries.find((entry) => entry.url.endsWith("/eventos"));

    expect(home).toBeDefined();
    expect(home?.lastModified).toBeUndefined();
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });
});
