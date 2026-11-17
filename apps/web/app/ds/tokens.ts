/**
 * Valores literales de la paleta C3 para los pocos sitios donde no llegan las variables CSS:
 * el manifest y el correo HTML de /contacto. Espejo de app/ds/tokens.css (tests/tokens/c3-hex.test.ts).
 * Esta carpeta es la única de apps/web con hexadecimales (tests/tokens/hex-scan.test.ts, ADR-0002).
 */
export const c3Hex = {
  /** --c3-navy y --c3-texto. */
  navy: "#0f203e",
  /** --c3-fondo. */
  blanco: "#ffffff",
  /**
   * Correo HTML. Son valores fijos heredados del correo anterior: no son tokens del DS y los
   * clientes de correo no leen variables CSS. Pendiente de decisión: alinearlos con tokens o no.
   */
  correo: {
    fondo: "#f4f7fb",
    borde: "#d5deea",
    etiqueta: "#6b7280",
    pie: "#64748b",
    cabecera: "#a7c0ff",
  },
} as const;
