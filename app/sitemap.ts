import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date("2026-05-23T00:00:00.000Z"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
    images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
  }));
}
