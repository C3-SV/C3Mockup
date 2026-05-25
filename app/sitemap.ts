import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.domain}/`,
      lastModified: new Date("2026-05-21T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
    },
  ];
}
