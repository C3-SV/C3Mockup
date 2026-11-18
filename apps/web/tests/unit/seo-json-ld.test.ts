import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/components/SeoJsonLd";

/**
 * H6 (auditoría 2026-11-17): el JSON-LD se inyecta con dangerouslySetInnerHTML sin escapar. Un texto de Firestore
 * con «</script>» cerraría el bloque. La serialización debe escapar <, >, & y los separadores U+2028/U+2029 y seguir
 * siendo JSON válido que devuelve el mismo dato.
 */
describe("serializeJsonLd", () => {
  it("no deja cerrar el bloque <script> desde el contenido", () => {
    const html = serializeJsonLd({ name: "x</script><script>alert(1)</script>" });
    expect(html).not.toContain("</script");
    expect(html).not.toContain("<script");
  });

  it("escapa &, > y los separadores de línea Unicode", () => {
    const html = serializeJsonLd({ name: "a&b>c d e" });
    for (const char of ["&", ">", " ", " "]) {
      expect(html).not.toContain(char);
    }
  });

  it("produce JSON que se lee igual que el original", () => {
    const data = { name: "C3 <Copa> &   'comillas' \"dobles\"", n: [1, true, null] };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
