import type { AdminEventRecord, EventPage } from "@c3/config";

/** Datos de prueba (no son contenido real de C3): ficha publicada con memoria completa, edición ya terminada. */
export function makePublishedPage(): EventPage {
  return {
    slug: "hackathon-prueba-2025",
    publication: "published",
    overview: ["Primer párrafo de prueba.", "Segundo párrafo de prueba."],
    audience: "Estudiantes de prueba",
    requirements: ["Traer laptop de prueba"],
    modality: "presencial",
    location: "Sede de prueba",
    participation: { label: "Participar", url: "https://c3.com.sv/inscripcion" },
    resources: [
      { title: "Guía de prueba", url: "https://c3.com.sv/guia" },
      { title: "Bases locales", url: "/bases" },
    ],
    memory: {
      publication: "published",
      summary: ["Resumen de prueba."],
      learnings: ["Aprendizaje de prueba."],
      results: [
        { label: "Equipos", value: "12", context: "Contexto de prueba", evidenceUrl: "https://c3.com.sv/evidencia" },
        { label: "Proyectos", value: "5", context: "Otro contexto" },
      ],
      outputs: [{ title: "Proyecto de prueba", description: "Descripción de prueba", url: "https://c3.com.sv/proyecto" }],
      gallery: [
        {
          url: "https://c3.com.sv/img/foto-prueba.jpg",
          alt: "Texto alternativo de prueba",
          caption: "Pie de prueba",
          rightsConfirmed: true,
        },
      ],
    },
  };
}

export function makeAdminEvent(overrides: Partial<AdminEventRecord> = {}): AdminEventRecord {
  return {
    id: "evento-prueba",
    title: "Evento de prueba",
    description: "Descripción de prueba del evento.",
    lines: ["compite", "crea"],
    status: "Histórico",
    cta: "Ver evento",
    href: "https://hackathon.c3.com.sv",
    external: true,
    featured: true,
    featuredOrder: 3,
    eventDate: "2025-05-10",
    eventDateEnd: "2025-05-11",
    kind: "hackathon",
    cover: { url: "https://c3.com.sv/img/portada-prueba.jpg", alt: "Portada de prueba" },
    source: "seed:prueba",
    page: makePublishedPage(),
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z",
    ...overrides,
  };
}
