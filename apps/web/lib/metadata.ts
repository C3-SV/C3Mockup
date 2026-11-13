import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  /**
   * Imagen propia para compartir (p. ej. la portada autorizada de un evento). Sin ella se usa la institucional.
   * Sin dimensiones no se declaran width/height: no se inventan.
   */
  image?: { url: string; alt: string };
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${siteConfig.domain}${path}`;
  const imageUrl = image?.url ?? `${siteConfig.domain}${siteConfig.defaultOgImage}`;
  const openGraphImage = image
    ? { url: image.url, alt: image.alt }
    : {
        url: imageUrl,
        width: siteConfig.defaultOgImageSize.width,
        height: siteConfig.defaultOgImageSize.height,
        alt: title,
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
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
