import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { getPublicEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site";
import { getLatestEventLastModified } from "@c3/config";

export const dynamic = "force-dynamic";

const routePriority: Record<(typeof publicRoutes)[number], number> = {
  "/": 1,
  "/que-es-c3": 0.8,
  "/compite": 0.8,
  "/crea": 0.8,
  "/conecta": 0.8,
  "/eventos": 0.9,
  "/faq": 0.6,
  "/contacto": 0.6,
};

const eventAwareRoutes = new Set<(typeof publicRoutes)[number]>([
  "/",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPublicEvents();
  const lastModified = getLatestEventLastModified(events) ?? new Date();

  return publicRoutes.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${siteConfig.domain}${path}`,
      changeFrequency: eventAwareRoutes.has(path) ? "weekly" : "monthly",
      priority: routePriority[path],
      images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
    };

    if (eventAwareRoutes.has(path)) {
      entry.lastModified = lastModified;
    }

    return entry;
  });
}
