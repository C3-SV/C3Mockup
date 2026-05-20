export type SiteRoute =
  | "/"
  | "/que-es-c3"
  | "/compite"
  | "/crea"
  | "/conecta"
  | "/eventos"
  | "/aliados"
  | "/impacto"
  | "/comunidad"
  | "/faq"
  | "/contacto"
  | "/prensa";

export const siteConfig = {
  name: "C3",
  fullName: "Competitive Coding Club",
  displayName: "C3 | Competitive Coding Club",
  tagline: "Compite. Crea. Conecta.",
  language: "es",
  locale: "es_SV",
  domain: "https://c3.com.sv",
  country: "El Salvador",
  foundedAt: "2024-10-24",
  foundedLabel: "24 de octubre de 2024",
  description:
    "C3 / Competitive Coding Club desarrolla talento técnico joven conectando programación competitiva, hackathons, comunidad, formación e industria en El Salvador y la región.",
  shortDefinition:
    "C3 desarrolla talento técnico joven conectando competencia, creación y oportunidades reales.",
  longDefinition:
    "C3 / Competitive Coding Club es una plataforma de desarrollo de talento técnico joven que conecta programación competitiva, hackathons, comunidad, formación, industria, startups y oportunidades reales bajo una misma visión: Compite. Crea. Conecta.",
  mission:
    "Potenciar talento joven mediante experiencias de alto nivel que integran competencia, creación y conexión.",
  vision:
    "Ser el referente regional de una nueva generación técnica con pertenencia, oportunidades e impacto.",
  keywords: [
    "C3 El Salvador",
    "Competitive Coding Club",
    "programación competitiva El Salvador",
    "comunidad tech El Salvador",
    "hackathons El Salvador",
    "talento técnico joven",
    "eventos de tecnología El Salvador",
    "Copa Salvadoreña de Programación",
  ],
  defaultOgImage: "/brand/logo-c3-fondo-azul.png",
  social: {
    instagram: "https://www.instagram.com/c3.elsalvador",
    linkedin: "https://www.linkedin.com/company/c3-sv",
  },
  sites: {
    main: "https://c3.com.sv",
    copa: "https://copa.c3.com.sv",
  },
  nav: [
    { href: "/" as SiteRoute, label: "Inicio" },
    { href: "/que-es-c3" as SiteRoute, label: "Qué es C3" },
    { href: "/eventos" as SiteRoute, label: "Eventos" },
    { href: "/aliados" as SiteRoute, label: "Aliados" },
    { href: "/impacto" as SiteRoute, label: "Impacto" },
    { href: "/comunidad" as SiteRoute, label: "Comunidad" },
    { href: "/contacto" as SiteRoute, label: "Contacto" },
  ],
  footerRoutes: [
    { href: "/compite" as SiteRoute, label: "Compite" },
    { href: "/crea" as SiteRoute, label: "Crea" },
    { href: "/conecta" as SiteRoute, label: "Conecta" },
    { href: "/faq" as SiteRoute, label: "FAQ" },
    { href: "/prensa" as SiteRoute, label: "Prensa" },
  ],
} as const;

export const publicRoutes: SiteRoute[] = [
  "/",
  "/que-es-c3",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
  "/aliados",
  "/impacto",
  "/comunidad",
  "/faq",
  "/contacto",
  "/prensa",
];
