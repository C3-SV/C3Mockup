import type { CSSProperties } from "react";
import type { LineKey } from "@c3/config";

/**
 * Variables de color de una página de línea (DS §9.1). Se aplican en el contenedor de la página y todo lo
 * de la línea las hereda: acento (órbita, puntos, bordes de tarjeta), texto legible sobre fondo claro (titulares de
 * sección) y fondo suave.
 * Crea usa su variante de texto (--c3-crea-texto) sobre fondo claro: el turquesa base no se lee como texto.
 */
export function lineTheme(line: LineKey): CSSProperties {
  const accent = `var(--c3-${line})`;
  const text = line === "crea" ? "var(--c3-crea-texto)" : accent;
  const style: Record<string, string> = {
    "--c3-line-accent": accent,
    "--c3-line-text": text,
    "--c3-line-tint": `var(--c3-pagina-${line})`,
  };
  return style as CSSProperties;
}
