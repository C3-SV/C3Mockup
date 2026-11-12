import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const reducedMotion = process.env.PLAYWRIGHT_REDUCED_MOTION === "reduce" ? "reduce" : "no-preference";

export default defineConfig({
  testDir: "e2e",
  // axe tarda más de 30 s en páginas grandes cuando corren dos workers (Chromium compartido): 60 s por prueba.
  timeout: 60_000,
  // Contra build de produccion: `pnpm build:web` antes de correr las pruebas.
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion,
    trace: "on-first-retry",
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  projects: [
    {
      name: "mobile-390",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "desktop-1280",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
});
