import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "C3 / Competitive Coding Club",
    short_name: "C3",
    description: "Plataforma institucional de talento t\u00E9cnico joven en El Salvador.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0F203E",
    theme_color: "#0F203E",
    lang: siteConfig.language,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
