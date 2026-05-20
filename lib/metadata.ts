import type { Metadata } from "next";
import { siteConfig, type SiteRoute } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path: SiteRoute;
};

export function createPageMetadata({
  title,
  description,
  path,
}: MetadataInput): Metadata {
  const canonical = path === "/" ? "/" : path;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}${path === "/" ? "" : path}`,
      siteName: siteConfig.displayName,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          alt: siteConfig.displayName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.defaultOgImage],
    },
  };
}
