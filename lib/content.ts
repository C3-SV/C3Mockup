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
    title: "Duelo de Programación C3 · Software Week ESEN 2025",
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
    seoTitle: "Compite | Programación competitiva y excelencia técnica — C3",
    seoDescription:
      "La línea Compite de C3 impulsa programación competitiva, ICPC, entrenamientos, pensamiento algorítmico y la Copa Salvadoreña de Programación.",
    pillars: ["Programación competitiva", "ICPC", "Copa Salvadoreña de Programación", "Entrenamientos"],
    primaryCta: { label: "Ir a la Copa", href: siteConfig.sites.copa, external: true },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
  crea: {
    heroTitle: "Crea: hackathons, software y proyectos reales",
    heroDescription:
      "La línea Crea impulsa experiencias builder donde el talento técnico joven transforma conocimiento en prototipos, productos y soluciones para retos reales.",
    seoTitle: "Crea | Hackathons y proyectos tecnológicos — C3",
    seoDescription:
      "La línea Crea de C3 impulsa hackathons, prototipos, builders, software y proyectos tecnológicos para resolver retos reales.",
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
    seoTitle: "Conecta | Comunidad, industria y oportunidades — C3",
    seoDescription:
      "La línea Conecta de C3 une talento técnico joven con comunidad, instituciones educativas, empresas, aliados, sponsors y oportunidades reales.",
    pillars: ["Comunidad", "Industria", "Mentoría", "Alianzas"],
    primaryCta: { label: "Contactar para colaborar", href: "/contacto" },
    secondaryCta: { label: "Ver eventos C3", href: "/eventos" },
  },
};

export const faqItems = [
  {
    question: "¿Qué es C3?",
    answer:
      "C3 / Competitive Coding Club es una plataforma institucional de talento técnico joven que conecta competencia, creación y oportunidades reales en El Salvador y la región.",
  },
  {
    question: "¿Qué significa C3 y cuál es su enfoque?",
    answer:
      "C3 significa Competitive Coding Club. Su enfoque se resume en tres líneas: Compite, Crea y Conecta.",
  },
  {
    question: "¿C3 es solo programación competitiva?",
    answer:
      "No. C3 nació desde la programación competitiva, pero hoy también impulsa hackathons, comunidad, alianzas, eventos y conexión con oportunidades reales.",
  },
  {
    question: "¿Qué son Compite, Crea y Conecta?",
    answer:
      "Compite impulsa programación competitiva, ICPC, entrenamientos y la Copa Salvadoreña de Programación. Crea desarrolla hackathons, prototipos y proyectos tecnológicos para resolver retos reales. Conecta une talento joven con comunidad, instituciones, industria y oportunidades.",
  },
  {
    question: "¿Quiénes pueden participar en C3?",
    answer:
      "Principalmente estudiantes, builders y talento técnico joven. También pueden colaborar instituciones educativas, empresas, sponsors y organizaciones aliadas.",
  },
  {
    question: "¿Cómo me uno o participo en C3?",
    answer:
      "Podés integrarte participando en eventos, siguiendo nuestras convocatorias y escribiendo por los canales oficiales para conocer la siguiente actividad disponible.",
  },
  {
    question: "¿Cuál es la relación entre C3, la Copa y el Hackathon?",
    answer:
      "La Copa Salvadoreña de Programación es una iniciativa principal de C3 dentro de la línea Compite. El Hackathon de Turismo Creativo I es una iniciativa de C3 dentro de la línea Crea, enfocada en colaboración, prototipos y solución de retos reales.",
  },
  {
    question: "¿Cómo puede colaborar una institución, empresa u organización?",
    answer:
      "Puede colaborar como sede, aliada educativa, sponsor, mentora, promotora de retos o apoyo estratégico para crear experiencias técnicas de alto impacto.",
  },
  {
    question: "¿Cómo contacto a C3?",
    answer:
      "Podés contactar a C3 por Instagram, LinkedIn, correo oficial competitivecodingclub.sv@gmail.com o desde la página de contacto.",
  },
] as const;

export const updateNote = "Datos actualizados a mayo de 2026";
