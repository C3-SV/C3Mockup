import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/que-es-c3", "/eventos", "/aliados", "/faq", "/contacto"];

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.domain}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
  ];
}
