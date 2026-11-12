import type { CSSProperties } from "react";
import type { LineKey } from "@c3/config";

/**
 * Variables de color de una página de línea (DS §9.1). Se aplican en el contenedor de la página y todo lo
 * de la línea las hereda: acento (cabecera, bordes de tarjeta), texto legible sobre fondo claro (titulares de
 * sección), texto sobre el color pleno (cabecera) y fondo suave.
 * Crea usa su variante de texto (--c3-crea-texto) sobre fondo claro; sobre su turquesa pleno el texto es navy
 * (DS: sobre relleno Crea, texto navy). Compite y Conecta llevan texto blanco sobre su color pleno.
 */
export function lineTheme(line: LineKey): CSSProperties {
  const accent = `var(--c3-${line})`;
  const text = line === "crea" ? "var(--c3-crea-texto)" : accent;
  const onFill = line === "crea" ? "var(--c3-navy)" : "var(--c3-texto-inverso)";
  const style: Record<string, string> = {
    "--c3-line-accent": accent,
    "--c3-line-text": text,
    "--c3-line-on-fill": onFill,
    "--c3-line-tint": `var(--c3-pagina-${line})`,
  };
  return style as CSSProperties;
}
