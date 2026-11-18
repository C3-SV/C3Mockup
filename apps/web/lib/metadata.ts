import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

/** Imagen propia de la página (p. ej. la portada de un evento). Las medidas solo se declaran si se conocen. */
export type PageImage = { url: string; alt: string; width?: number; height?: number };

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  image?: PageImage;
};

/**
 * URL absoluta de una ruta. La raíz no lleva barra final: es la forma que sirve el sitio (H13, auditoría 2026-11-17),
 * y el canonical, og:url y el sitemap deben usar la misma.
 */
export function absoluteUrl(path: string): string {
  return path === "/" || path === "" ? siteConfig.domain : `${siteConfig.domain}${path}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const ogImage: PageImage = image ?? {
    url: `${siteConfig.domain}${siteConfig.defaultOgImage}`,
    alt: title,
    width: siteConfig.defaultOgImageSize.width,
    height: siteConfig.defaultOgImageSize.height,
  };

  return {
    title,
    description,
    keywords: keywords ? [...new Set(keywords)] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.displayName,
      title,
      description,
      images: [{ ...ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
