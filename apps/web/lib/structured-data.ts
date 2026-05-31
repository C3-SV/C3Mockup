import { faqItems, publicRoutes } from "@/lib/content";
import { siteConfig } from "@/lib/site";

type WebPageType = "WebPage" | "AboutPage" | "CollectionPage" | "FAQPage" | "ContactPage";

const organizationId = `${siteConfig.domain}/#organization`;
const websiteId = `${siteConfig.domain}/#website`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: "C3 / Competitive Coding Club",
  alternateName: siteConfig.fullName,
  url: siteConfig.domain,
  email: siteConfig.contact.email,
  logo: `${siteConfig.domain}/brand/logo-c3-fondo-azul.png`,
  slogan: siteConfig.tagline,
  areaServed: siteConfig.region,
  sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram, siteConfig.social.tiktok],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: "C3 / Competitive Coding Club",
  url: siteConfig.domain,
  inLanguage: "es-SV",
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    "@id": organizationId,
    name: "C3 / Competitive Coding Club",
    url: siteConfig.domain,
  },
};

export function getWebPageJsonLd({
  path,
  title,
  description,
  type = "WebPage",
}: {
  path: string;
  title: string;
  description: string;
  type?: WebPageType;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${siteConfig.domain}${path}#webpage`,
    name: title,
    description,
    url: `${siteConfig.domain}${path}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": websiteId,
      name: "C3 / Competitive Coding Club",
      url: siteConfig.domain,
    },
    about: {
      "@type": "Organization",
      "@id": organizationId,
      name: "C3 / Competitive Coding Club",
      url: siteConfig.domain,
    },
    inLanguage: "es-SV",
  };
}

export function getAboutPageJsonLd(path: string, title: string, description: string) {
  return getWebPageJsonLd({ path, title, description, type: "AboutPage" });
}

export function getContactPageJsonLd(path: string, title: string, description: string) {
  return {
    ...getWebPageJsonLd({ path, title, description, type: "ContactPage" }),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Consultas generales",
        email: siteConfig.contact.email,
        availableLanguage: ["es-SV"],
      },
    ],
  };
}

export function getCollectionPageJsonLd(path: string, title: string, description: string) {
  return getWebPageJsonLd({ path, title, description, type: "CollectionPage" });
}

export function getItemListJsonLd(
  path: string,
  items: Array<{ name: string; url: string; description: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eventos C3",
    url: `${siteConfig.domain}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      item: {
        "@type": "Thing",
        name: item.name,
        description: item.description,
        url: item.url,
      },
    })),
  };
}

export function createFaqJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }> = faqItems,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getFaqPageJsonLd(path: string, title: string, description: string) {
  return {
    ...getWebPageJsonLd({ path, title, description, type: "FAQPage" }),
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

export function getBreadcrumbJsonLd(path: string) {
  const routeLabels: Record<string, string> = {
    "que-es-c3": "Qué es C3",
    compite: "Compite",
    crea: "Crea",
    conecta: "Conecta",
    eventos: "Eventos",
    faq: "FAQ",
    contacto: "Contacto",
  };
  const routeParts = path.split("/").filter(Boolean);
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: siteConfig.domain,
    },
  ];

  routeParts.forEach((segment, index) => {
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: routeLabels[segment] ?? segment,
      item: `${siteConfig.domain}/${routeParts.slice(0, index + 1).join("/")}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function getSiteNavigationJsonLd() {
  const routeLabels: Record<(typeof publicRoutes)[number], string> = {
    "/": "Inicio",
    "/que-es-c3": "Qué es C3",
    "/compite": "Compite",
    "/crea": "Crea",
    "/conecta": "Conecta",
    "/eventos": "Eventos",
    "/faq": "FAQ",
    "/contacto": "Contacto",
  };

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publicRoutes.map((route, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: routeLabels[route],
      url: `${siteConfig.domain}${route}`,
    })),
  };
}
