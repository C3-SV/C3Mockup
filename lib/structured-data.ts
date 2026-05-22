import { siteConfig } from "@/lib/site";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "C3 / Competitive Coding Club",
  alternateName: "Competitive Coding Club",
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/icon.svg`,
  description: siteConfig.shortDescription,
  slogan: siteConfig.tagline,
  foundingDate: siteConfig.foundingDate,
  foundingLocation: {
    "@type": "Place",
    name: siteConfig.region,
  },
  areaServed: [
    {
      "@type": "Country",
      name: "El Salvador",
    },
    {
      "@type": "Place",
      name: "Central America",
    },
  ],
  sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
} as const;

export function createFaqJsonLd(
  questions: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
