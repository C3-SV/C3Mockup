import { siteConfig } from "@/lib/site";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.fullName,
  alternateName: [
    "Competitive Coding Club",
    "C3 El Salvador",
    "Competitive Coding Club El Salvador",
  ],
  url: siteConfig.domain,
  logo: `${siteConfig.domain}/icon.svg`,
  description:
    "C3, también conocido como Competitive Coding Club, es una organización que potencia talento técnico joven mediante experiencias de alto nivel que integran competencia, creación, comunidad y conexión con oportunidades reales.",
  slogan: siteConfig.tagline,
  foundingLocation: {
    "@type": "Place",
    name: "El Salvador",
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
    {
      "@type": "Place",
      name: "Latinoamérica",
    },
  ],
  sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  subOrganization: [
    {
      "@type": "Organization",
      name: "C3 Compite",
      description:
        "Línea de C3 enfocada en programación competitiva, ICPC, entrenamientos, rankings, problemas y retos.",
    },
    {
      "@type": "Organization",
      name: "C3 Crea",
      description:
        "Línea de C3 enfocada en hackathons, builders, software, proyectos, prototipos, innovación y producto.",
    },
    {
      "@type": "Organization",
      name: "C3 Conecta",
      description:
        "Línea de C3 enfocada en comunidad, networking, industria, mentoría, speakers, oportunidades y alianzas.",
    },
  ],
} as const;
