import type { ExperienceKind } from "@c3/config";

/** Íconos de trazo por tipo de experiencia (DS §7.9): trazo de 2 px, color de la línea. Solo decorativos. */
const PATHS: Record<ExperienceKind, string> = {
  competencia:
    "M7 4h10v4a5 5 0 0 1-10 0V4z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3 M10 13v3h4v-3 M8 20h8",
  hackathon: "M8 7 3 12l5 5 M16 7l5 5-5 5 M14 4l-4 16",
  taller: "M4 20l4-1 11-11-3-3L5 16l-1 4z",
  charla: "M4 5h16v11H9l-5 4z",
  encuentro:
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20a6 6 0 0 1 12 0 M16 11a3 3 0 1 0 0-6 M18 20a5 5 0 0 0-3-4.6",
  reto:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
};

// Sin tipo declarado (eventos del admin que aún no lo traen).
const FALLBACK = "M12 3v4 M12 17v4 M3 12h4 M17 12h4";

export function KindIcon({ kind, className }: { kind?: ExperienceKind; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={kind ? PATHS[kind] : FALLBACK} />
    </svg>
  );
}
