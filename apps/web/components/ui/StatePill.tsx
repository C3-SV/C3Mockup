/** Pastilla de estado del DS (§7.7). El texto siempre va visible; el punto solo refuerza el tono. */
export type PillTone = "neutro" | "info" | "exito" | "advertencia" | "error";

type StatePillProps = {
  label: string;
  tone: PillTone;
};

export function StatePill({ label, tone }: StatePillProps) {
  return <span className={`c3-pill c3-pill--${tone}`}>{label}</span>;
}
