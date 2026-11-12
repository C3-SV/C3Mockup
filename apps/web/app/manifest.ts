import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { c3Hex } from "@/app/ds/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "C3 / Competitive Coding Club",
    short_name: "C3",
    description: siteConfig.shortDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: c3Hex.navy,
    theme_color: c3Hex.navy,
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
