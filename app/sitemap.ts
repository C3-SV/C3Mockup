import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/eventos" ? "weekly" : "monthly",
    priority: routePriority[path],
    images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
  }));
}
