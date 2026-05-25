import { siteConfig } from "@/lib/site";

export type LineKey = "compite" | "crea" | "conecta";

export type EventStatus =
  | "Inscripciones abiertas"
  | "Proximamente"
  | "Historico"
  | "Apoyo institucional";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  lines: LineKey[];
  status: EventStatus;
  cta: string;
  href: string;
  external?: boolean;
};

export const publicRoutes = [
  "/",
  "/que-es-c3",
  "/compite",
  "/crea",
  "/conecta",
  "/eventos",
  "/faq",
  "/contacto",
] as const;

export const mainNavigation = [
  { href: "/", label: "Inicio" },
  { href: "/que-es-c3", label: "Que es C3" },
  { href: "/eventos", label: "Eventos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const navItems = mainNavigation;

export const ecosystemNavigation = [
  {
    href: "/compite",
    label: "Compite",
    description: "Programacion competitiva y excelencia tecnica.",
  },
  {
    href: "/crea",
    label: "Crea",
    description: "Hackathons, software y proyectos reales.",
  },
  {
    href: "/conecta",
    label: "Conecta",
    description: "Comunidad, industria y oportunidades.",
  },
] as const;

export const headerNavigation = [
  { href: "/", label: "Inicio" },
  { href: "/que-es-c3", label: "Que es C3" },
  { label: "Ecosistema", items: ecosystemNavigation },
  { href: "/eventos", label: "Eventos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const lineVisuals: Record<
  LineKey,
  {
    key: LineKey;
    name: string;
    color: string;
    logo: string;
    shortDescription: string;
    softBg: string;
  }
> = {
  compite: {
    key: "compite",
    name: "Compite",
    color: "#205298",
    logo: "/brand/compite-blanco.png",
    shortDescription: "Programacion competitiva, excelencia tecnica y entrenamiento algoritmico.",
    softBg: "rgba(32,82,152,0.28)",
  },
  crea: {
    key: "crea",
    name: "Crea",
    color: "#33BEAC",
    logo: "/brand/crea-blanco.png",
    shortDescription: "Hackathons, prototipos y proyectos de tecnologia con impacto real.",
    softBg: "rgba(51,190,172,0.28)",
  },
  conecta: {
    key: "conecta",
    name: "Conecta",
    color: "#4F5BA9",
    logo: "/brand/conecta-blanco.png",
    shortDescription: "Comunidad, industria y oportunidades para talento tecnico joven.",
    softBg: "rgba(79,91,169,0.30)",
  },
};

export const events: EventItem[] = [
  {
    id: "copa-salvadorena-programacion",
    title: "Copa Salvadorena de Programacion",
    description:
      "La iniciativa principal de C3 para impulsar programacion competitiva, pensamiento algoritmico y excelencia tecnica en estudiantes de El Salvador.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: siteConfig.sites.copa,
    external: true,
  },
  {
    id: "hackathon-turismo-creativo-i",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creacion, colaboracion, prototipos y solucion de retos reales desde tecnologia, turismo y cultura.",
    lines: ["crea"],
    status: "Proximamente",
    cta: "Ver hackathon",
    href: siteConfig.sites.hackathon,
    external: true,
  },
  {
    id: "icpc-centroamerica-el-salvador",
    title: "ICPC Centroamerica · sede El Salvador",
    description:
      "C3 apoya la articulacion de comunidad, visibilidad y conexiones alrededor de la sede salvadorena.",
    lines: ["compite", "conecta"],
    status: "Apoyo institucional",
    cta: "Explorar eventos",
    href: "/eventos",
  },
  {
    id: "hackatlatam-fiesta-el-salvador",
    title: "Hack@Latam · Fiesta El Salvador",
    description:
      "Participacion y apoyo en experiencias de creacion tecnologica con enfoque regional.",
    lines: ["crea", "conecta"],
    status: "Historico",
    cta: "Explorar eventos",
    href: "/eventos",
  },
  {
    id: "duelo-programacion-c3-software-week-esen-2025",
    title: "Duelo de Programacion C3 · Software Week ESEN 2025",
    description:
      "Actividad tecnica orientada a resolver problemas en formato competitivo dentro del ecosistema universitario.",
    lines: ["compite"],
    status: "Historico",
    cta: "Explorar eventos",
    href: "/eventos",
  },
];

export const initiatives = events.slice(0, 2);

export const linePageContent: Record<
  LineKey,
  {
    heroTitle: string;
    heroDescription: string;
    seoTitle: string;
    seoDescription: string;
    pillars: string[];
    primaryCta: { label: string; href: string; external?: boolean };
    secondaryCta: { label: string; href: string };
  }
> = {
  compite: {
    heroTitle: "Compite: programacion competitiva y excelencia tecnica",
    heroDescription:
      "La linea Compite desarrolla pensamiento algoritmico, resolucion de problemas y rigor tecnico a traves de competencias, entrenamientos e iniciativas de alto nivel.",
    seoTitle: "Compite | Programacion competitiva y excelencia tecnica - C3",
    seoDescription:
      "La linea Compite de C3 impulsa programacion competitiva, torneos, entrenamiento algoritmico, Copa Salvadorena de Programacion e ICPC para estudiantes y talento joven.",
    pillars: ["Programacion competitiva", "ICPC", "Copa Salvadorena", "Entrenamientos"],
    primaryCta: { label: "Ir a la Copa", href: siteConfig.sites.copa, external: true },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
  crea: {
    heroTitle: "Crea: hackathons, software y proyectos reales",
    heroDescription:
      "La linea Crea impulsa experiencias builder donde el talento tecnico joven transforma conocimiento en prototipos, productos y soluciones para retos reales.",
    seoTitle: "Crea | Hackathons y proyectos tecnologicos - C3",
    seoDescription:
      "La linea Crea de C3 impulsa hackathons, builders, innovacion, prototipos y proyectos tecnologicos creados por talento joven.",
    pillars: ["Hackathons", "Builders", "Desarrollo de software", "Proyectos reales"],
    primaryCta: {
      label: "Ver hackathon",
      href: siteConfig.sites.hackathon,
      external: true,
    },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
  conecta: {
    heroTitle: "Conecta: comunidad, industria y oportunidades",
    heroDescription:
      "La linea Conecta crea puentes entre talento emergente, instituciones educativas, empresas y organizaciones para multiplicar oportunidades tecnicas reales.",
    seoTitle: "Conecta | Comunidad, industria y oportunidades - C3",
    seoDescription:
      "La linea Conecta de C3 acerca talento tecnico joven con comunidad, universidades, empresas, startups, sponsors y oportunidades reales.",
    pillars: ["Comunidad", "Industria", "Mentoria", "Alianzas"],
    primaryCta: { label: "Contactar para colaborar", href: "/contacto" },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
};

export const faqItems = [
  {
    question: "Que es C3?",
    answer:
      "C3 / Competitive Coding Club es una plataforma institucional de talento tecnico joven que conecta competencia, creacion y conexion en El Salvador y la region.",
  },
  {
    question: "Que significa C3?",
    answer: "C3 significa Competitive Coding Club.",
  },
  {
    question: "Cual es el tagline de C3?",
    answer: "Compite. Crea. Conecta.",
  },
  {
    question: "C3 es solo programacion competitiva?",
    answer:
      "No. C3 nacio desde programacion competitiva y hoy integra tambien hackathons, comunidad, alianzas y oportunidades.",
  },
  {
    question: "Que es Compite?",
    answer:
      "Compite es la linea de excelencia tecnica enfocada en programacion competitiva, ICPC, entrenamientos y la Copa Salvadorena de Programacion.",
  },
  {
    question: "Que es Crea?",
    answer:
      "Crea es la linea de hackathons, prototipos y proyectos tecnologicos para resolver retos reales en equipo.",
  },
  {
    question: "Que es Conecta?",
    answer:
      "Conecta es la linea que une talento joven con comunidad, instituciones, industria y oportunidades reales.",
  },
  {
    question: "Quienes pueden participar en C3?",
    answer:
      "Principalmente estudiantes, builders y talento tecnico joven. Tambien pueden participar instituciones educativas y organizaciones aliadas.",
  },
  {
    question: "Como me uno a C3?",
    answer:
      "Puedes integrarte participando en eventos y escribiendo por los canales oficiales para conocer la siguiente actividad disponible.",
  },
  {
    question: "Cual es la relacion entre C3 y la Copa Salvadorena de Programacion?",
    answer: "La Copa es una iniciativa principal de C3 dentro de la linea Compite.",
  },
  {
    question: "Cual es la relacion entre C3 y el Hackathon de Turismo Creativo?",
    answer:
      "Es una iniciativa de C3 dentro de la linea Crea, enfocada en colaboracion, prototipos y solucion de retos reales.",
  },
  {
    question: "Como puede una institucion educativa colaborar con C3?",
    answer:
      "Puede colaborar como sede o aliada para competencias, hackathons, charlas, talleres y experiencias tecnicas para estudiantes.",
  },
  {
    question: "Como puede una empresa u organizacion apoyar C3?",
    answer:
      "Puede apoyar con alianzas, mentorias, patrocinio de experiencias, retos aplicados y oportunidades para talento tecnico joven.",
  },
  {
    question: "Donde opera C3?",
    answer: "C3 opera desde El Salvador con enfoque de crecimiento regional.",
  },
  {
    question: "Como contacto a C3?",
    answer:
      "Por Instagram, LinkedIn y correo oficial competitivecodingclub.sv@gmail.com, o desde la ruta /contacto.",
  },
] as const;

export const updateNote = "Datos actualizados a mayo de 2026";

