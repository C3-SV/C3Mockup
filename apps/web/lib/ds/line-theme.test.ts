import { describe, expect, it } from "vitest";
import { lineTheme } from "@/lib/ds/line-theme";

/** Colores de cada línea en su página (DS §9.1): acento, texto legible y fondo suave, siempre como variables. */

const read = (style: Record<string, string>, name: string) => style[name];

describe("lineTheme", () => {
  it("crea usa su variante de texto (crea-texto), no el turquesa base, para texto", () => {
    const style = lineTheme("crea") as unknown as Record<string, string>;
    expect(read(style, "--c3-line-accent")).toBe("var(--c3-crea)");
    expect(read(style, "--c3-line-text")).toBe("var(--c3-crea-texto)");
    expect(read(style, "--c3-line-tint")).toBe("var(--c3-pagina-crea)");
  });

  it("compite y conecta usan su color base también como texto", () => {
    const compite = lineTheme("compite") as unknown as Record<string, string>;
    expect(read(compite, "--c3-line-text")).toBe(read(compite, "--c3-line-accent"));
    const conecta = lineTheme("conecta") as unknown as Record<string, string>;
    expect(read(conecta, "--c3-line-text")).toBe("var(--c3-conecta)");
  });

  it("el texto sobre el color de la línea es blanco en compite y conecta, y navy en crea (turquesa)", () => {
    expect(read(lineTheme("compite") as unknown as Record<string, string>, "--c3-line-on-fill")).toBe("var(--c3-texto-inverso)");
    expect(read(lineTheme("conecta") as unknown as Record<string, string>, "--c3-line-on-fill")).toBe("var(--c3-texto-inverso)");
    expect(read(lineTheme("crea") as unknown as Record<string, string>, "--c3-line-on-fill")).toBe("var(--c3-navy)");
  });

  it("nunca devuelve un hexadecimal literal", () => {
    for (const line of ["compite", "crea", "conecta"] as const) {
      expect(JSON.stringify(lineTheme(line))).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });
});
