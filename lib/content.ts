import { siteConfig } from "@/lib/site";

export type LineKey = "compite" | "crea" | "conecta";

export type EventStatus =
  | "Inscripciones abiertas"
  | "Próximamente"
  | "Histórico"
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
  { href: "/que-es-c3", label: "Qué es C3" },
  { href: "/eventos", label: "Eventos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const navItems = mainNavigation;

export const ecosystemNavigation = [
  {
    href: "/compite",
    label: "Compite",
    description: "Programación competitiva y excelencia técnica.",
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
  { href: "/que-es-c3", label: "Qué es C3" },
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
    shortDescription: "Programación competitiva, excelencia técnica y entrenamiento algorítmico.",
    softBg: "rgba(32,82,152,0.28)",
  },
  crea: {
    key: "crea",
    name: "Crea",
    color: "#33BEAC",
    logo: "/brand/crea-blanco.png",
    shortDescription: "Hackathons, prototipos y proyectos de tecnología con impacto real.",
    softBg: "rgba(51,190,172,0.28)",
  },
  conecta: {
    key: "conecta",
    name: "Conecta",
    color: "#4F5BA9",
    logo: "/brand/conecta-blanco.png",
    shortDescription: "Comunidad, industria y oportunidades para talento técnico joven.",
    softBg: "rgba(79,91,169,0.30)",
  },
};

export const events: EventItem[] = [
  {
    id: "copa-salvadorena-programacion",
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
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
      "Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde tecnología, turismo y cultura.",
    lines: ["crea"],
    status: "Inscripciones abiertas",
    cta: "Ver hackathon",
    href: siteConfig.sites.hackathon,
    external: true,
  },
  {
    id: "icpc-centroamerica-el-salvador",
    title: "ICPC Centroamérica · sede El Salvador",
    description:
      "C3 apoya la articulación de comunidad, visibilidad y conexiones alrededor de la sede salvadoreña.",
    lines: ["compite", "conecta"],
    status: "Apoyo institucional",
    cta: "Explorar eventos",
    href: "/eventos",
  },
  {
    id: "hackatlatam-fiesta-el-salvador",
    title: "Hack@Latam · Fiesta El Salvador",
    description:
      "Participación y apoyo en experiencias de creación tecnológica con enfoque regional.",
    lines: ["crea", "conecta"],
    status: "Histórico",
    cta: "Explorar eventos",
    href: "/eventos",
  },
  {
    id: "duelo-programacion-c3-software-week-esen-2025",
    title: "Duelo de Programacion C3 · Software Week ESEN 2025",
    description:
      "Actividad técnica orientada a resolver problemas en formato competitivo dentro del ecosistema universitario.",
    lines: ["compite"],
    status: "Histórico",
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
    heroTitle: "Compite: programación competitiva y excelencia técnica",
    heroDescription:
      "La línea Compite desarrolla pensamiento algorítmico, resolución de problemas y rigor técnico a través de competencias, entrenamientos e iniciativas de alto nivel.",
    seoTitle: "Compite | Programación competitiva y excelencia técnica - C3",
    seoDescription:
      "La línea Compite de C3 impulsa programación competitiva, torneos, entrenamiento algorítmico, Copa Salvadoreña de Programación e ICPC para estudiantes y talento joven.",
    pillars: ["Programación competitiva", "ICPC", "Copa Salvadoreña", "Entrenamientos"],
    primaryCta: { label: "Ir a la Copa", href: siteConfig.sites.copa, external: true },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
  crea: {
    heroTitle: "Crea: hackathons, software y proyectos reales",
    heroDescription:
      "La línea Crea impulsa experiencias builder donde el talento técnico joven transforma conocimiento en prototipos, productos y soluciones para retos reales.",
    seoTitle: "Crea | Hackathons y proyectos tecnológicos - C3",
    seoDescription:
      "La línea Crea de C3 impulsa hackathons, builders, innovación, prototipos y proyectos tecnológicos creados por talento joven.",
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
      "La línea Conecta crea puentes entre talento emergente, instituciones educativas, empresas y organizaciones para multiplicar oportunidades técnicas reales.",
    seoTitle: "Conecta | Comunidad, industria y oportunidades - C3",
    seoDescription:
      "La línea Conecta de C3 acerca talento técnico joven con comunidad, universidades, empresas, startups, sponsors y oportunidades reales.",
    pillars: ["Comunidad", "Industria", "Mentoría", "Alianzas"],
    primaryCta: { label: "Contactar para colaborar", href: "/contacto" },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
};

export const faqItems = [
  {
    question: "¿Qué es C3?",
    answer:
      "C3 / Competitive Coding Club es una plataforma institucional de talento técnico joven que conecta competencia, creación y conexión en El Salvador y la región.",
  },
  {
    question: "¿Qué significa C3?",
    answer: "C3 significa Competitive Coding Club.",
  },
  {
    question: "¿Cuál es el tagline de C3?",
    answer: "Compite. Crea. Conecta.",
  },
  {
    question: "¿C3 es solo programación competitiva?",
    answer:
      "No. C3 nació desde programación competitiva y hoy integra también hackathons, comunidad, alianzas y oportunidades.",
  },
  {
    question: "¿Qué es Compite?",
    answer:
      "Compite es la línea de excelencia técnica enfocada en programación competitiva, ICPC, entrenamientos y la Copa Salvadoreña de Programación.",
  },
  {
    question: "¿Qué es Crea?",
    answer:
      "Crea es la línea de hackathons, prototipos y proyectos tecnológicos para resolver retos reales en equipo.",
  },
  {
    question: "¿Qué es Conecta?",
    answer:
      "Conecta es la línea que une talento joven con comunidad, instituciones, industria y oportunidades reales.",
  },
  {
    question: "¿Quiénes pueden participar en C3?",
    answer:
      "Principalmente estudiantes, builders y talento técnico joven. También pueden participar instituciones educativas y organizaciones aliadas.",
  },
  {
    question: "¿Cómo me uno a C3?",
    answer:
      "Puedes integrarte participando en eventos y escribiendo por los canales oficiales para conocer la siguiente actividad disponible.",
  },
  {
    question: "¿Cuál es la relación entre C3 y la Copa Salvadoreña de Programación?",
    answer: "La Copa es una iniciativa principal de C3 dentro de la línea Compite.",
  },
  {
    question: "¿Cuál es la relación entre C3 y el Hackathon de Turismo Creativo?",
    answer:
      "Es una iniciativa de C3 dentro de la línea Crea, enfocada en colaboración, prototipos y solución de retos reales.",
  },
  {
    question: "¿Cómo puede una institución educativa colaborar con C3?",
    answer:
      "Puede colaborar como sede o aliada para competencias, hackathons, charlas, talleres y experiencias técnicas para estudiantes.",
  },
  {
    question: "¿Cómo puede una empresa u organización apoyar C3?",
    answer:
      "Puede apoyar con alianzas, mentorías, patrocinio de experiencias, retos aplicados y oportunidades para talento técnico joven.",
  },
  {
    question: "¿Dónde opera C3?",
    answer: "C3 opera desde El Salvador con enfoque de crecimiento regional.",
  },
  {
    question: "¿Cómo contacto a C3?",
    answer:
      "Por Instagram, LinkedIn y correo oficial competitivecodingclub.sv@gmail.com, o desde la ruta /contacto.",
  },
] as const;

export const updateNote = "Datos actualizados a mayo de 2026";
