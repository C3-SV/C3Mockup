type SeoJsonLdProps = {
  data: unknown;
};

const UNSAFE_IN_SCRIPT: Record<string, string> = {
  "<": "\\u003C",
  ">": "\\u003E",
  "&": "\\u0026",
  " ": "\\u2028",
  " ": "\\u2029",
};

/**
 * JSON seguro dentro de <script type="application/ld+json">: escapa <, >, & y los separadores Unicode para que
 * un texto de Firestore no pueda cerrar el bloque (H6, auditoría 2026-11-17). Sigue siendo JSON válido.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(new RegExp("[<>&\\u2028\\u2029]", "g"), (char) => UNSAFE_IN_SCRIPT[char] ?? char);
}

export default function SeoJsonLd({ data }: SeoJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}
