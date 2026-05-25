import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "C3 / Competitive Coding Club",
    short_name: "C3",
    description: "Plataforma institucional de talento técnico joven en El Salvador.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F203E",
    theme_color: "#0F203E",
    lang: siteConfig.language,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/brand/logo-c3-fondo-azul.png",
        sizes: "3508x2481",
        type: "image/png",
      },
    ],
  };
}
