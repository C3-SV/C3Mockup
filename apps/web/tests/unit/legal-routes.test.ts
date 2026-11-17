import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/events", () => {
  class FirebaseNotConfiguredError extends Error {}
  return { FirebaseNotConfiguredError, getPublicEvents: async () => [] };
});
vi.mock("@/lib/event-detail", () => ({ getPublishedEventPages: async () => [] }));

import PrivacyPage, { metadata as privacyMetadata } from "@/app/privacidad/page";
import TermsPage, { metadata as termsMetadata } from "@/app/terminos/page";
import ConductPage, { metadata as conductMetadata } from "@/app/codigo-de-conducta/page";
import sitemap from "@/app/sitemap";
import { publicRoutes } from "@/lib/content";
import { getSiteNavigationJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

const pages = [
  {
    path: "/privacidad",
    title: "Privacidad",
    Page: PrivacyPage,
    metadata: privacyMetadata,
  },
  {
    path: "/terminos",
    title: "Términos de uso del sitio",
    Page: TermsPage,
    metadata: termsMetadata,
  },
  {
    path: "/codigo-de-conducta",
    title: "Convivencia en actividades y espacios de C3",
    Page: ConductPage,
    metadata: conductMetadata,
  },
];

describe("rutas legales", () => {
  it.each(pages)("$path tiene canonical propio, h1 y versión del texto base", ({ path, title, Page, metadata }) => {
    expect(metadata.alternates?.canonical).toBe(siteConfig.domain + path);

    const { unmount } = render(createElement(Page));
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText("Versión 0.2")).toBeInTheDocument();
    unmount();
  });

  it("incluye las rutas legales una sola vez en navegación y datos públicos", () => {
    const legalRoutes = pages.map((page) => page.path);
    const navigation = getSiteNavigationJsonLd();

    expect(new Set(publicRoutes).size).toBe(publicRoutes.length);
    expect(publicRoutes.slice(-legalRoutes.length)).toEqual(legalRoutes);
    for (const path of legalRoutes) {
      expect(navigation.itemListElement.filter((item) => item.url === siteConfig.domain + path)).toHaveLength(1);
    }
  });

  it("incluye las rutas legales en el sitemap sin duplicados", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const page of pages) {
      expect(urls.filter((url) => url === siteConfig.domain + page.path)).toHaveLength(1);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });
});
