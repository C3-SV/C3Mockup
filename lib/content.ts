import type { SiteRoute } from "@/lib/site";

export type LineKey = "compite" | "crea" | "conecta";
export type EventStatus = "Activo / público" | "Histórico / apoyado" | "Apoyo institucional";

export type LineDefinition = {
  key: LineKey;
  name: string;
  href: SiteRoute;
  cta: string;
  accent: string;
  accentText: string;
  logo: string;
  label: string;
  description: string;
  detail: string;
  visual: string;
};

export type Metric = {
  value: string;
  label: string;
  note: string;
};

export type EventItem = {
  slug: string;
  name: string;
  line: LineKey;
  status: EventStatus;
  statusTone: "teal" | "blue" | "purple";
  dateLabel: string;
  location: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  isConfirmedPublic: boolean;
  schema?: {
    startDate: string;
    endDate?: string;
    url: string;
  };
};

export type Audience = {
  name: string;
  message: string;
  benefit: string;
  href: SiteRoute;
  cta: string;
};

export type Partner = {
  name: string;
  category: "Universidad" | "Empresa" | "Comunidad" | "Sponsor";
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type ContactPath = {
  title: string;
  detail: string;
  cta: string;
  href: string;
  external?: boolean;
  status: "Disponible" | "En actualización";
};

export const lines: LineDefinition[] = [
  {
    key: "compite",
    name: "Compite",
    href: "/compite",
    cta: "Explorar Compite",
    accent: "from-c3-blue/30 via-c3-blueSoft/20 to-transparent",
    accentText: "text-c3-blue",
    logo: "/brand/compite-blanco.png",
    label: "Precisión competitiva",
    description:
      "Programación competitiva, torneos, entrenamiento algorítmico y excelencia técnica.",
    detail:
      "Compite impulsa la excelencia técnica de C3 a través de Copa, preparación ICPC, retos y entrenamiento riguroso para estudiantes y talento joven.",
    visual: "Scoreboards, nodos ordenados y estructuras lógicas.",
  },
  {
    key: "crea",
    name: "Crea",
    href: "/crea",
    cta: "Explorar Crea",
    accent: "from-c3-teal/30 via-c3-tealSoft/20 to-transparent",
    accentText: "text-c3-teal",
    logo: "/brand/crea-blanco.png",
    label: "Builders en acción",
    description:
      "Hackathons, builders, proyectos tecnológicos, prototipos e innovación aplicada.",
    detail:
      "Crea convierte el rigor técnico en construcción real mediante hackathons, laboratorios y un framework liviano para llevar ideas a demos funcionales.",
    visual: "Wireframes, dashboards y módulos de producto.",
  },
  {
    key: "conecta",
    name: "Conecta",
    href: "/conecta",
    cta: "Explorar Conecta",
    accent: "from-c3-purple/30 via-c3-purpleSoft/20 to-transparent",
    accentText: "text-c3-purple",
    logo: "/brand/conecta-blanco.png",
    label: "Red con propósito",
    description:
      "Comunidad, industria, universidades, startups, mentoría, sponsors y oportunidades reales.",
    detail:
      "Conecta explica cómo C3 crea puentes entre talento, universidades, empresas, mentores y sponsors para abrir oportunidades reales con una narrativa institucional clara.",
    visual: "Redes suaves, perfiles y nodos conectados.",
  },
];

export const metrics: Metric[] = [
  {
    value: "+60",
    label: "Miembros de comunidad",
    note: "Datos actualizados a mayo de 2026.",
  },
  {
    value: "+150",
    label: "Personas alcanzadas en eventos",
    note: "Cifra conservadora consolidada para actividades públicas.",
  },
  {
    value: "+130",
    label: "Participantes en Copa 2025",
    note: "Primera edición con fases y final presencial en ESEN.",
  },
  {
    value: "5+",
    label: "Eventos organizados o apoyados",
    note: "Incluye Copa, ICPC, Duelo C3 y Hack@Latam.",
  },
];

export const events: EventItem[] = [
  {
    slug: "copa-salvadorena-programacion-2026",
    name: "Copa Salvadoreña de Programación 2026",
    line: "compite",
    status: "Activo / público",
    statusTone: "blue",
    dateLabel: "1 de agosto · 15 de agosto · 5 de septiembre de 2026",
    location: "ESEN",
    description:
          "Segunda edición pública de la Copa con fase virtual, final colegial y final universitaria para conectar talento joven con competencia de alto nivel.",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    isConfirmedPublic: true,
    schema: {
      startDate: "2026-08-01",
      endDate: "2026-09-05",
      url: "https://copa.c3.com.sv",
    },
  },
  {
    slug: "hackatam-fiesta-el-salvador",
    name: "Hack@Latam · fiesta El Salvador",
    line: "crea",
    status: "Histórico / apoyado",
    statusTone: "teal",
    dateLabel: "Hito público confirmado",
    location: "El Salvador",
    description:
      "Hackathon regional de impacto social con participación y apoyo desde El Salvador como primer hito público visible de la línea Crea.",
    cta: "Conocer Crea",
    href: "/crea",
    isConfirmedPublic: true,
  },
  {
    slug: "icpc-centroamerica-sede-el-salvador",
    name: "ICPC Centroamérica · sede El Salvador",
    line: "conecta",
    status: "Apoyo institucional",
    statusTone: "purple",
    dateLabel: "Apoyo activo desde finales de 2025",
    location: "UCA / El Salvador",
    description:
      "C3 apoya a ICPC Centroamérica en la sede de El Salvador con storytelling, alcance digital y búsqueda de patrocinadores.",
    cta: "Ver Conecta",
    href: "/conecta",
    isConfirmedPublic: true,
  },
  {
    slug: "duelo-programacion-software-week-2025",
    name: "Duelo de Programación C3 · Software Week ESEN 2025",
    line: "compite",
    status: "Histórico / apoyado",
    statusTone: "blue",
    dateLabel: "Software Week ESEN 2025",
    location: "ESEN",
    description:
      "Actividad técnica de programación organizada dentro de Software Week ESEN 2025 para fortalecer visibilidad y comunidad alrededor de Compite.",
    cta: "Ver eventos",
    href: "/eventos",
    isConfirmedPublic: true,
  },
];

export const audiences: Audience[] = [
  {
    name: "Estudiantes",
    message:
      "Participa en eventos C3, entra a la comunidad y encuentra espacios para crecer técnicamente.",
    benefit:
      "Competencia, proyectos, networking y acceso temprano a oportunidades reales.",
    href: "/comunidad",
    cta: "Únete a la comunidad",
  },
  {
    name: "Universidades y colegios",
    message:
      "C3 puede colaborar con competencias, hackathons, charlas, activaciones y conexión con talento.",
    benefit:
      "Programación de alto valor para estudiantes y mayor visibilidad institucional.",
    href: "/aliados",
    cta: "Conversemos una alianza",
  },
  {
    name: "Empresas y sponsors",
    message:
      "C3 produce experiencias con visibilidad, comunidad y acceso a talento técnico joven.",
    benefit:
      "Branding con propósito, conexión con talento y fortalecimiento del ecosistema.",
    href: "/aliados",
    cta: "Sé aliado de C3",
  },
  {
    name: "Medios y prensa",
    message:
      "Consulta definiciones oficiales, factsheet, datos de impacto y recursos de marca listos para referencia.",
    benefit: "Información clara y reutilizable para cobertura y búsquedas asistidas por IA.",
    href: "/prensa",
    cta: "Ver media kit",
  },
];

export const partners: Partner[] = [
  { name: "ESEN", category: "Universidad" },
  { name: "UCA", category: "Universidad" },
  { name: "Google", category: "Sponsor" },
  { name: "OmegaUp", category: "Comunidad" },
  { name: "RSM US El Salvador", category: "Empresa" },
  { name: "TechyWe", category: "Empresa" },
  { name: "Applaudo", category: "Empresa" },
  { name: "Ravn", category: "Empresa" },
  { name: "Kodigo", category: "Empresa" },
  { name: "PoliÉdrica", category: "Empresa" },
  { name: "Quantaroot", category: "Empresa" },
  { name: "FUSADES", category: "Empresa" },
  { name: "Boxful", category: "Empresa" },
];

export const timeline: TimelineItem[] = [
  {
    year: "2024",
    title: "Fundación de C3 en ESEN",
    description:
      "C3 nace el 24 de octubre de 2024 con una primera sesión para introducir programación competitiva, Codeforces y resolución de problemas clásicos.",
  },
  {
    year: "2025",
    title: "Primera expansión pública",
    description:
      "La Copa Salvadoreña de Programación 2025 marca el crecimiento de C3 como plataforma capaz de producir eventos técnicos con impacto visible.",
  },
  {
    year: "Finales 2025",
    title: "Apoyo a ICPC Centroamérica",
    description:
      "C3 comienza a apoyar la sede de El Salvador con comunicación, storytelling y activación de sponsors dentro del ecosistema competitivo.",
  },
  {
    year: "2026",
    title: "Compite, Crea y Conecta en consolidación",
    description:
      "Copa 2026, Hack@Latam y nuevas rutas para comunidad, industria y universidades consolidan la narrativa institucional del sitio.",
  },
];

export const faqItems = [
  {
    question: "¿Qué es C3?",
    answer:
      "C3 / Competitive Coding Club es una plataforma de desarrollo de talento técnico joven que conecta programación competitiva, hackathons, comunidad, formación e industria para abrir oportunidades reales.",
  },
  {
    question: "¿Qué significa C3?",
    answer: "C3 significa Competitive Coding Club.",
  },
  {
    question: "¿Cuál es el tagline de C3?",
    answer: "El tagline oficial de C3 es: Compite. Crea. Conecta.",
  },
  {
    question: "¿C3 es solo programación competitiva?",
    answer:
      "No. C3 nació desde la programación competitiva, pero hoy integra hackathons, proyectos tecnológicos, comunidad, formación, alianzas y conexión con oportunidades reales.",
  },
  {
    question: "¿Qué son Compite, Crea y Conecta?",
    answer:
      "Son las tres líneas estratégicas de C3: excelencia competitiva, creación de proyectos y conexión con comunidad, universidades, empresas y sponsors.",
  },
  {
    question: "¿Quiénes pueden participar?",
    answer:
      "Principalmente estudiantes y talento técnico joven interesado en programación, tecnología, competencias, creación de proyectos, comunidad y oportunidades.",
  },
  {
    question: "¿Cómo me uno?",
    answer:
      "Participar en eventos u oportunidades C3 ya te acerca a la comunidad. El canal actual opera por WhatsApp y el ingreso web estructurado está en actualización.",
  },
  {
    question: "¿Cómo puede colaborar una universidad?",
    answer:
      "Puede colaborar como sede, aliada de difusión u organización de competencias, hackathons, charlas, talleres o activaciones para estudiantes.",
  },
  {
    question: "¿Cómo puede patrocinar una empresa?",
    answer:
      "Una empresa puede apoyar eventos, mentorías, premios, contenido o iniciativas de comunidad para conectar con talento técnico joven y fortalecer el ecosistema.",
  },
  {
    question: "¿Cuál es la relación entre C3 y la Copa Salvadoreña de Programación?",
    answer:
      "La Copa Salvadoreña de Programación es una iniciativa de C3 dentro de la línea Compite.",
  },
  {
    question: "¿Dónde contacto a C3?",
    answer:
      "El sitio centraliza contacto por Instagram, LinkedIn y rutas institucionales. El correo y formulario oficial permanecen en actualización hasta validación pública final.",
  },
] as const;

export const contactPaths: ContactPath[] = [
  // TODO(c3): Reemplazar esta descripción por el flujo oficial cuando exista un enlace público validado.
  {
    title: "Comunidad y estudiantes",
    detail:
      "La comunidad actual se articula desde eventos y un canal operativo por WhatsApp. La entrada pública estructurada está en actualización.",
    cta: "Ver comunidad",
    href: "/comunidad",
    status: "En actualización",
  },
  // TODO(c3): Sustituir por correo o formulario institucional cuando esté autorizado para publicación.
  {
    title: "Universidades y colegios",
    detail:
      "Ruta recomendada para explorar competencias, charlas, activaciones y alianzas educativas con C3.",
    cta: "Explorar aliados",
    href: "/aliados",
    status: "Disponible",
  },
  {
    title: "Empresas y sponsors",
    detail:
      "Canal institucional para visibilidad, sponsors, activaciones y conexión con talento técnico joven.",
    cta: "Conocer propuesta",
    href: "/aliados",
    status: "Disponible",
  },
  {
    title: "Prensa y medios",
    detail:
      "Usa el factsheet, los recursos oficiales de marca y los enlaces institucionales mientras se confirma el contacto directo de prensa.",
    cta: "Ver prensa",
    href: "/prensa",
    status: "Disponible",
  },
  {
    title: "Instagram oficial",
    detail: "Canal social confirmado para seguimiento, visibilidad y contacto inicial.",
    cta: "Abrir Instagram",
    href: "https://www.instagram.com/c3.elsalvador",
    external: true,
    status: "Disponible",
  },
  {
    title: "LinkedIn oficial",
    detail:
      "Canal institucional ideal para alianzas, updates organizacionales y presencia profesional.",
    cta: "Abrir LinkedIn",
    href: "https://www.linkedin.com/company/c3-sv",
    external: true,
    status: "Disponible",
  },
];

export const pressFacts = [
  { label: "Nombre", value: "C3 / Competitive Coding Club" },
  { label: "Fundación", value: "24 de octubre de 2024" },
  { label: "Base", value: "El Salvador" },
  { label: "Alcance", value: "El Salvador con proyección hacia Centroamérica" },
  {
    label: "Misión",
    value:
      "Potenciar talento joven mediante experiencias de alto nivel que integran competencia, creación y conexión.",
  },
  {
    label: "Visión",
    value:
      "Ser el referente regional de una nueva generación técnica con pertenencia, oportunidades e impacto.",
  },
  { label: "Tagline", value: "Compite. Crea. Conecta." },
  { label: "Líneas", value: "Compite, Crea y Conecta" },
];
