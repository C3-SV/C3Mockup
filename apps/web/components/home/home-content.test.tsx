import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AudienceSection } from "./AudienceSection";
import { ClosingPanel } from "./ClosingPanel";
import { DatosSection } from "./DatosSection";
import { EventosSection } from "./EventosSection";
import { Hero } from "./Hero";
import { IniciativasSection } from "./IniciativasSection";
import { LinesSection } from "./LinesSection";

/**
 * Contenido de la home conservado (Tarea 4.2): mismos titulares, mismo orden y mismos destinos que
 * la home anterior (docs/superpowers/plans, Tarea 4.2; e2e/content-baseline.json).
 */
function renderHome() {
  return render(
    <>
      <Hero />
      <IniciativasSection />
      <DatosSection />
      <LinesSection />
      <EventosSection cards={[]} />
      <AudienceSection />
      <ClosingPanel />
    </>,
  );
}

const HEADINGS_IN_ORDER = [
  "C3 desarrolla talento técnico joven a través de competencia, creación y conexión.",
  "Próximas iniciativas",
  "Copa Salvadoreña de Programación",
  "Hackathon de Turismo Creativo I",
  "Datos que respaldan el avance de C3",
  "Un ecosistema integrado",
  "COMPITE",
  "CREA",
  "CONECTA",
  "Evidencia viva del ecosistema C3",
  "C3 conecta a quienes quieren construir el ecosistema técnico joven",
  "Personas",
  "Instituciones educativas",
  "Empresas y organizaciones",
  "Construyamos la próxima generación técnica de la región.",
];

const LINKS: Array<[string, string]> = [
  ["Explorar eventos", "/eventos"],
  ["Ser aliado", "/contacto"],
  ["Conocer C3", "/que-es-c3"],
  ["Ir a la Copa", "https://copa.c3.com.sv"],
  ["Ver hackathon", "https://hackathon.c3.com.sv"],
  ["Ir a la línea", "/compite"],
  ["Ir a la línea", "/crea"],
  ["Ir a la línea", "/conecta"],
  ["Ver hub completo de eventos", "/eventos"],
  ["Participar en C3", "/eventos"],
  ["Crear una alianza educativa", "/contacto"],
  ["Contactar", "/contacto"],
];

describe("home: contenido conservado", () => {
  it("muestra los titulares actuales en el mismo orden", () => {
    renderHome();
    const headings = screen.getAllByRole("heading").map((heading) => heading.textContent?.trim());
    expect(headings).toEqual(HEADINGS_IN_ORDER);
  });

  it("conserva cada enlace con su texto y su destino", () => {
    renderHome();
    for (const [name, href] of LINKS) {
      const hrefs = screen.getAllByRole("link", { name }).map((link) => link.getAttribute("href"));
      expect(hrefs, name).toContain(href);
    }
  });

  it("tiene una sola h1 y no muestra DEMO, challenge ni cuentas", () => {
    const { container } = renderHome();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\bDEMO\b|challenge|Iniciar sesión|Crear cuenta/i);
  });
});
