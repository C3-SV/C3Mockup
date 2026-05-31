export const lineKeys = ["compite", "crea", "conecta"] as const;

export type LineKey = (typeof lineKeys)[number];

export const eventStatuses = [
  "Inscripciones abiertas",
  "Próximamente",
  "Histórico",
  "Apoyo institucional",
] as const;

export type EventStatus = (typeof eventStatuses)[number];

export type EventItem = {
  id: string;
  title: string;
  description: string;
  lines: LineKey[];
  status: EventStatus;
  cta: string;
  href: string;
  external?: boolean;
  featured?: boolean;
};

export const defaultEvents: EventItem[] = [
  {
    id: "copa-salvadorena-programacion",
    title: "Copa Salvadoreña de Programación",
    description:
      "La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: true,
  },
  {
    id: "hackathon-turismo-creativo-i",
    title: "Hackathon de Turismo Creativo I",
    description:
      "Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde tecnología, turismo y cultura.",
    lines: ["crea"],
    status: "Inscripciones abiertas",
    cta: "Ver hackathon",
    href: "https://hackathon.c3.com.sv",
    external: true,
    featured: true,
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

export type FirestoreEventDocument = EventItem & {
  createdAt?: string;
  updatedAt?: string;
};

export function normalizeEventLines(input: unknown): LineKey[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((line): line is LineKey => lineKeys.includes(line as LineKey));
}

export function normalizeEventStatus(input: unknown): EventStatus {
  return eventStatuses.includes(input as EventStatus) ? (input as EventStatus) : "Próximamente";
}

export function toFirestoreEventDocument(event: EventItem): FirestoreEventDocument {
  return {
    ...event,
    featured: Boolean(event.featured),
  };
}
