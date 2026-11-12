/**
 * Escaner del texto de interfaz (AGENTS.md §3, PRODUCT.md «Voz y vocabulario», ADR-0006).
 * Devuelve las coincidencias prohibidas en orden de aparicion, en minusculas.
 */

/**
 * Voseo que el sitio ya no puede usar. La lista base es la de AGENTS.md (Global Constraints);
 * se amplia con las formas de voseo verbal que aparecen en el propio sitio (p. ej. «Ingresá»).
 */
const VOSEO = [
  "podés",
  "tenés",
  "querés",
  "sabés",
  "necesitás",
  "buscás",
  "elegí",
  "intentá",
  "enviá",
  "ingresá",
  "contanos",
  "escribinos",
  "escribí",
  "completá",
  "revisá",
  "llená",
  "decí",
  "fijate",
  "mirá",
  "probá",
  "usá",
  "seguí",
  "sos",
];

const TERMS = ["challenges?", "iniciar\\s+sesi[oó]n", "crear\\s+cuenta", "tu\\s+cuenta", "demo", "USD"];

/** Simbolos con la propiedad Extended_Pictographic que no son emojis: la flecha de los enlaces del DS y los signos de marca. */
const SYMBOLS_ALLOWED = new Set(["↗", "©", "®"]);

const RULES: RegExp[] = [
  new RegExp(`(?<!\\p{L})(?:${VOSEO.join("|")})(?!\\p{L})`, "giu"),
  new RegExp(`(?<!\\p{L})(?:${TERMS.join("|")})(?!\\p{L})`, "giu"),
  /\$\s?\d[\d.,]*/g,
];

const PICTOGRAPHIC = /\p{Extended_Pictographic}/gu;

export function scanForbidden(text: string): string[] {
  const hits: { index: number; match: string }[] = [];

  for (const re of RULES) {
    for (const m of text.matchAll(re)) hits.push({ index: m.index ?? 0, match: m[0] });
  }
  for (const m of text.matchAll(PICTOGRAPHIC)) {
    if (!SYMBOLS_ALLOWED.has(m[0])) hits.push({ index: m.index ?? 0, match: m[0] });
  }

  return hits.sort((a, b) => a.index - b.index).map((h) => h.match.toLowerCase());
}

/**
 * Quita comentarios de TS/TSX antes de escanear: el texto de codigo no llega al visitante
 * (p. ej. una nota «Sin etiqueta DEMO» no es interfaz). Respeta «https://» en el texto.
 */
export function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\w])\/\/.*$/gm, "$1");
}
