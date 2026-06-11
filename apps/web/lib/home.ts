import { formatEventSchedule, type EventItem } from "@c3/config";
import { lineVisuals, type LineKey } from "@/lib/content";

export type HomeMetric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  accent: string;
};

export type FeaturedHomeEvent = {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  cta: string;
  status: EventItem["status"];
  primaryLine: LineKey;
  secondaryLines: LineKey[];
  schedule?: string;
};

export type CommunityPortrait = {
  src: string;
  alt: string;
  name: string;
  role: string;
  accent: string;
};

export type CommunityHighlight = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  cta: string;
  status: EventItem["status"];
  line: LineKey;
  schedule?: string;
};

export const homeMetrics: HomeMetric[] = [
  {
    value: 60,
    prefix: "+",
    label: "Miembros de comunidad",
    description: "Talento joven conectado al ecosistema C3.",
    accent: lineVisuals.compite.color,
  },
  {
    value: 150,
    prefix: "+",
    label: "Personas alcanzadas",
    description: "Alcance real en experiencias, activaciones y eventos.",
    accent: lineVisuals.crea.color,
  },
  {
    value: 130,
    prefix: "+",
    label: "Participantes en Copa 2025",
    description: "Competencia que ya se volvió punto de entrada al ecosistema.",
    accent: lineVisuals.conecta.color,
  },
  {
    value: 5,
    suffix: "+",
    label: "Eventos organizados o apoyados",
    description: "Programación, hackathons y espacios de conexión ya en marcha.",
    accent: "#46B8A8",
  },
];

export const communityPortraits: CommunityPortrait[] = [
  {
    src: "/team_members/team_c3_oscar.jpg",
    alt: "Óscar Pleités de C3",
    name: "Óscar Pleités",
    role: "Problem Setter",
    accent: lineVisuals.compite.color,
  },
  {
    src: "/team_members/team_c3_christopher.jpeg",
    alt: "Christopher Marroquín de C3",
    name: "Christopher Marroquín",
    role: "General Lead",
    accent: lineVisuals.conecta.color,
  },
  {
    src: "/team_members/team_c3_roberto.jpg",
    alt: "Roberto Morán de C3",
    name: "Roberto Morán",
    role: "Tech Lead",
    accent: lineVisuals.crea.color,
  },
  {
    src: "/team_members/team_c3_celeste.jpeg",
    alt: "Celeste Aparicio de C3",
    name: "Celeste Aparicio",
    role: "Operations Co-Lead",
    accent: lineVisuals.conecta.color,
  },
  {
    src: "/team_members/team_c3_fiorella.jpg",
    alt: "Fiorella Guzmán de C3",
    name: "Fiorella Guzmán",
    role: "Marketing Co-Lead",
    accent: lineVisuals.crea.color,
  },
  {
    src: "/team_members/team_c3_javier.jpg",
    alt: "Javier Galdámez de C3",
    name: "Javier Galdámez",
    role: "Community Lead",
    accent: lineVisuals.compite.color,
  },
];

export function getFeaturedHomeEvents(events: ReadonlyArray<EventItem>): FeaturedHomeEvent[] {
  const sorted = [...events];
  const active = sorted.filter((event) => event.status !== "Histórico").slice(0, 2);
  const source = active.length >= 2 ? active : sorted.slice(0, 2);

  return source.map((event) => {
    const primaryLine = event.lines[0] ?? "conecta";

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      href: event.href,
      external: event.external,
      cta: event.cta,
      status: event.status,
      primaryLine,
      secondaryLines: event.lines.slice(1),
      schedule: event.eventDate ? formatEventSchedule(event) : undefined,
    };
  });
}

export function getCommunityHighlights(events: ReadonlyArray<EventItem>): CommunityHighlight[] {
  return events.slice(0, 5).map((event) => ({
    title: event.title,
    description: event.description,
    href: event.href,
    external: event.external,
    cta: event.cta,
    status: event.status,
    line: event.lines[0] ?? "conecta",
    schedule: event.eventDate ? formatEventSchedule(event) : undefined,
  }));
}
