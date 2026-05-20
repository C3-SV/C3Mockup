import { faqItems, type EventItem } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.fullName,
    alternateName: ["C3", "Competitive Coding Club", "C3 El Salvador"],
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/brand/logo-c3-fondo-azul.png`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: siteConfig.foundedAt,
    foundingLocation: {
      "@type": "Place",
      name: siteConfig.country,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "El Salvador",
      },
      {
        "@type": "Place",
        name: "Centroamérica",
      },
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.displayName,
    url: siteConfig.domain,
    inLanguage: siteConfig.language,
    description: siteConfig.description,
  };
}

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getEventJsonLd(event: EventItem) {
  if (!event.schema) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.schema.startDate,
    endDate: event.schema.endDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: "SV",
      },
    },
    organizer: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.domain,
    },
    url: event.schema.url,
  };
}
