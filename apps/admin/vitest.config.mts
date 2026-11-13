import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mismo alias que tsconfig (`@/*` → raíz de apps/admin).
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // Las pruebas de componentes no usan el enrutador: un enlace simple basta (ver tests/stubs/next-link.tsx).
      "next/link": fileURLToPath(new URL("./tests/stubs/next-link.tsx", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    // react-icons llega vía node (externalizado) y resuelve `react` desde el almacén de pnpm. Procesarlo con Vite lo
    // resuelve con el mismo criterio que el resto del código y no depende de los enlaces del almacén.
    server: { deps: { inline: [/react-icons/] } },
  },
});
