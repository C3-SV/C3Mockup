import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tarea 8.1: el sistema anterior no debe quedar en el repositorio. Cada ruta se comprueba
 * sin importadores (grep en apps y packages) antes de borrarla; ver el registro de la Fase 8.
 */
const WEB = join(__dirname, "..", "..");
const UI = join(WEB, "..", "..", "packages", "ui");

const archivosRetirados = [
  "components/Navbar.tsx",
  "components/C3SectionTransition.tsx",
  "components/ProjectCard.tsx",
  "components/ui/ScrollProgress.tsx",
  "components/ui/SectionBadge.tsx",
  "components/ui/LegacyButton.tsx",
  "components/backgrounds/C3BackgroundLayer.tsx",
  "components/backgrounds/C3DotPattern.tsx",
  "components/backgrounds/C3GraphPattern.tsx",
  "components/backgrounds/C3GridPattern.tsx",
  "components/backgrounds/C3OrbitalPattern.tsx",
  "components/backgrounds/C3Particles.tsx",
  "components/backgrounds/c3-background-theme.ts",
  "lib/c3-theme.ts",
  "public/icon-48.png",
  "public/brand/logo-c3-claro-con-color.png",
];

const exportacionesRetiradas = ["header", "footer", "page-shell", "seo-json-ld"];

const globalsCss = readFileSync(join(WEB, "app/globals.css"), "utf8");
const publicCss = readFileSync(join(WEB, "app/ds/c3-public.css"), "utf8");
const packageJson = JSON.parse(readFileSync(join(WEB, "package.json"), "utf8")) as {
  dependencies: Record<string, string>;
};

describe("código y assets del sistema anterior", () => {
  it.each(archivosRetirados)("no existe %s", (ruta) => {
    expect(existsSync(join(WEB, ruta))).toBe(false);
  });

  it.each(exportacionesRetiradas)("packages/ui no exporta %s", (nombre) => {
    expect(existsSync(join(UI, "src", `${nombre}.tsx`))).toBe(false);
    const index = readFileSync(join(UI, "src", "index.ts"), "utf8");
    expect(index).not.toContain(`./${nombre}"`);
    const pkg = JSON.parse(readFileSync(join(UI, "package.json"), "utf8")) as {
      exports: Record<string, string>;
    };
    expect(Object.keys(pkg.exports)).not.toContain(`./${nombre}`);
  });

  it.each([".container-shell", ".section-shell", ".section-stack", ".section-divider", ".c3-bg-", ".c3-button-shimmer"])(
    "globals.css no define %s",
    (selector) => {
      expect(globalsCss).not.toContain(selector);
    },
  );

  it("c3-public.css no conserva .c3-line-intro__dot (sin uso tras la Fase 5)", () => {
    expect(publicCss).not.toContain(".c3-line-intro__dot");
  });

  it("no hay dependencias de partículas (solo las usaba C3Particles)", () => {
    expect(Object.keys(packageJson.dependencies).filter((d) => d.startsWith("@tsparticles/"))).toEqual([]);
  });
});
