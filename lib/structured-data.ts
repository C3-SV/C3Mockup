import { siteConfig } from "@/lib/site";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "C3 / Competitive Coding Club",
  alternateName: "Competitive Coding Club",
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/icon-512.png`,
  foundingDate: "2024-10-24",
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram].filter(Boolean),
} as const;
