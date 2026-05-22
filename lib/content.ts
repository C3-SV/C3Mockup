import { siteConfig } from "@/lib/site";

export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/que-es-c3", label: "Qué es C3" },
  { href: "/eventos", label: "Eventos" },
  { href: "/aliados", label: "Aliados" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const impactStats = [
  { value: "+60", label: "miembros de comunidad" },
  { value: "+150", label: "personas alcanzadas" },
  { value: "+130", label: "participantes en Copa 2025" },
  { value: "5+", label: "eventos organizados o apoyados" },
  { value: "2024", label: "fundación" },
] as const;

export const c3Lines = [
  {
    name: "Compite",
    description:
      "Programación competitiva, torneos y entrenamiento algorítmico para desarrollar excelencia técnica.",
    cta: "Ver Copa",
    href: siteConfig.sites.copa,
  },
  {
    name: "Crea",
    description:
      "Hackathons, builders y experiencias de creación para convertir ideas en proyectos tecnológicos reales.",
    cta: "Ver hackathon",
    href: siteConfig.sites.hackathon,
  },
  {
    name: "Conecta",
    description:
      "Comunidad, mentoría, aliados e industria para abrir oportunidades reales a talento joven.",
    cta: "Conocer aliados",
    href: "/aliados",
  },
] as const;

export const initiatives = [
  {
    title: "Copa Salvadoreña de Programación",
    line: "Compite",
    status: "Inscripciones abiertas",
    description:
      "Iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    cta: "Ir a la Copa",
    href: siteConfig.sites.copa,
  },
  {
    title: "Hackathon de Turismo Creativo I",
    line: "Crea",
    status: "Próximamente",
    description:
      "Iniciativa de C3 enfocada en creación, colaboración, prototipos y solución de retos reales desde tecnología, turismo y cultura.",
    cta: "Ver hackathon",
    href: siteConfig.sites.hackathon,
  },
  {
    title: "ICPC Centroamérica · Sede El Salvador",
    line: "Compite / Conecta",
    status: "Apoyo institucional",
    description:
      "C3 apoya la articulación de comunidad, visibilidad y conexiones alrededor de la sede salvadoreña.",
    cta: "Ver eventos",
    href: "/eventos",
  },
  {
    title: "Hack@Latam · Fiesta El Salvador",
    line: "Crea",
    status: "Histórico",
    description:
      "Participación y apoyo en experiencias de creación tecnológica con enfoque regional.",
    cta: "Ver eventos",
    href: "/eventos",
  },
  {
    title: "Duelo de Programación C3 · Software Week ESEN 2025",
    line: "Compite",
    status: "Histórico",
    description:
      "Actividad técnica orientada a resolver problemas en formato competitivo dentro del ecosistema universitario.",
    cta: "Ver eventos",
    href: "/eventos",
  },
] as const;

export const audiencePaths = [
  {
    title: "Estudiantes",
    description:
      "Participa en eventos C3, entra a la comunidad y encuentra espacios para crecer técnicamente.",
  },
  {
    title: "Universidades y colegios",
    description:
      "C3 puede colaborar con competencias, hackathons, charlas, activaciones y conexión con talento.",
  },
  {
    title: "Empresas y sponsors",
    description:
      "C3 produce experiencias de alto impacto con visibilidad, comunidad y acceso a talento técnico joven.",
  },
  {
    title: "Medios y prensa",
    description:
      "Consulta definiciones oficiales, cifras, rutas de contacto y contexto institucional de C3.",
  },
] as const;

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
    question: "¿C3 es solo un club de programación competitiva?",
    answer:
      "No. C3 nació desde la programación competitiva, pero hoy integra hackathons, proyectos tecnológicos, comunidad, formación, alianzas y conexión con oportunidades reales.",
  },
  {
    question: "¿Quiénes pueden participar en C3?",
    answer:
      "C3 está dirigido principalmente a estudiantes y talento técnico joven interesado en programación, tecnología, competencias, creación de proyectos, comunidad y oportunidades.",
  },
  {
    question: "¿Necesito experiencia previa para participar?",
    answer:
      "Depende de la actividad. Algunos eventos son introductorios y otros requieren conocimientos técnicos básicos. C3 busca abrir rutas para distintos niveles.",
  },
  {
    question: "¿Cómo me uno a C3?",
    answer:
      "Participando en eventos u oportunidades C3 ya formas parte de la comunidad. Puedes escribir por canales oficiales para conocer la siguiente actividad disponible.",
  },
  {
    question: "¿Cuál es la relación entre C3 y la Copa Salvadoreña de Programación?",
    answer:
      "La Copa Salvadoreña de Programación es una iniciativa de C3 dentro de la línea Compite.",
  },
  {
    question: "¿Cuál es la relación entre C3 y el hackathon?",
    answer:
      "El hackathon es una iniciativa vinculada a la línea Crea, enfocada en creación, colaboración, prototipos, retos reales y construcción de proyectos tecnológicos.",
  },
  {
    question: "¿Cómo puede una universidad colaborar con C3?",
    answer:
      "Una universidad puede colaborar como sede, aliada de difusión, organizadora de competencias, hackathons, charlas, talleres o activaciones para estudiantes.",
  },
  {
    question: "¿Cómo puede una empresa patrocinar C3?",
    answer:
      "Una empresa puede apoyar eventos, hackathons, competencias, mentorías, premios, contenido o iniciativas de comunidad para conectar con talento joven y fortalecer el ecosistema tecnológico.",
  },
  {
    question: "¿Dónde opera C3?",
    answer:
      "C3 tiene base en El Salvador y proyecta crecimiento regional hacia Centroamérica.",
  },
  {
    question: "¿Dónde contacto a C3?",
    answer:
      "Puedes escribir por Instagram o LinkedIn oficiales de C3 y usar la ruta de contacto del sitio para estudiantes, universidades, empresas y medios.",
  },
] as const;

export const keyCtas = [
  { href: "/que-es-c3", label: "Conocer C3" },
  { href: "/eventos", label: "Explorar eventos" },
  { href: "/aliados", label: "Ser aliado" },
  { href: "/contacto", label: "Contactar" },
] as const;

export const updateNote = "Datos actualizados a mayo de 2026";
