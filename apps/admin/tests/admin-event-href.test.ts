import { describe, expect, it } from "vitest";
import { buildAdminEventRecord } from "@c3/config";

/**
 * H10 (auditoría 2026-11-17): el enlace principal del evento solo acepta https absoluto o una ruta local que empiece
 * con una sola «/». Antes solo se exigía que no estuviera vacío.
 */

const base = {
  title: "Evento de prueba",
  description: "Descripción.",
  cta: "Ver evento",
  lines: ["compite"],
  status: "Próximamente",
};

const NOW = "2026-11-17T12:00:00.000Z";

const build = (href: string) => buildAdminEventRecord({ ...base, href }, { now: NOW });

describe("enlace principal del evento", () => {
  it.each(["https://copa.c3.com.sv", "/eventos/copa-2026"])("acepta %s", (href) => {
    expect(build(href).href).toBe(href);
  });

  it.each([
    "javascript:alert(1)",
    "http://c3.com.sv",
    "//evil.example.org",
    "/\\evil.example.org",
    "ftp://c3.com.sv",
    "https://c3.com.sv/con espacio",
    "https://user@c3.com.sv/eventos",
  ])("rechaza %s", (href) => {
    expect(() => build(href)).toThrow(/href/);
  });
});
