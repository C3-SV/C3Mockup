import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guarda el registro de cambios de contenido aprobados (content-approved-changes.json; plan eventos-memorias, T6).
 * No consulta el sitio: valida la forma del registro y que cada excepción apunte a un enlace real del baseline,
 * que sigue intacto. El registro puede estar vacío (hoy lo está: no hay excepciones aprobadas).
 */

type Baseline = Record<string, { headings: string[]; links: { text: string; href: string }[] }>;
type Entry = {
  route: string;
  originalText: string;
  originalHref: string;
  eventId: string;
  slug: string;
  adr: string;
};

const baseline: Baseline = JSON.parse(readFileSync(join(__dirname, "content-baseline.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(__dirname, "content-approved-changes.json"), "utf8")) as {
  _comment: unknown;
  entries: Entry[];
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FIELDS = ["route", "originalText", "originalHref", "eventId", "slug", "adr"] as const;

test("el registro documenta su esquema y tiene una lista de entradas", () => {
  expect(registry._comment, "_comment con el esquema").toBeTruthy();
  expect(Array.isArray(registry.entries)).toBe(true);
});

test("cada excepción aprobada tiene todos sus campos y apunta a un enlace del baseline", () => {
  const seen = new Set<string>();

  for (const entry of registry.entries) {
    for (const field of FIELDS) {
      expect(typeof entry[field] === "string" && entry[field].trim() !== "", `${field} en ${JSON.stringify(entry)}`).toBe(true);
    }
    expect(entry.slug, "slug").toMatch(SLUG);
    expect(entry.adr, "referencia al ADR").toMatch(/^ADR-\d{4}$/);

    const link = baseline[entry.route]?.links.find(
      (candidate) => candidate.text === entry.originalText && candidate.href === entry.originalHref,
    );
    expect(link, `el baseline no tiene «${entry.originalText}» → ${entry.originalHref} en ${entry.route}`).toBeTruthy();

    const key = `${entry.route}|${entry.originalText}|${entry.originalHref}`;
    expect(seen.has(key), `entrada repetida: ${key}`).toBe(false);
    seen.add(key);
  }
});
