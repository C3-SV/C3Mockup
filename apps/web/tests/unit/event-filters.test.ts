import { describe, expect, it } from "vitest";
import { defaultEvents } from "@c3/config";
import { toCatalogCard, type CatalogCardData } from "@/lib/ds/event-card";
import { filterEvents } from "@/lib/ds/event-filters";

/**
 * Filtros del catálogo de /eventos (Tarea 6.1). El estado sale de isUpcomingEvent (fecha y estado del evento),
 * no del texto de la pastilla. Fecha de referencia para los datos por defecto: 1 de junio de 2026.
 */

const NOW = new Date("2026-06-01T12:00:00Z");
const cards = defaultEvents.map((event) => toCatalogCard(event));
const ids = (list: CatalogCardData[]) => list.map((card) => card.id);

const COPA = "copa-salvadorena-programacion";
const HACKATHON = "hackathon-turismo-creativo-i";
const ICPC = "icpc-centroamerica-el-salvador";
const HACK_LATAM = "hackatlatam-fiesta-el-salvador";
const DUELO = "duelo-programacion-c3-software-week-esen-2025";

describe("filterEvents (Tarea 6.1)", () => {
  it("sin filtros (Todas y Todos) devuelve los 5 eventos en su orden", () => {
    expect(ids(filterEvents(cards, { area: "todas", estado: "todos" }, NOW))).toEqual(
      defaultEvents.map((event) => event.id),
    );
  });

  it("área Compite devuelve 3: la Copa, el ICPC (también Conecta) y el Duelo", () => {
    expect(ids(filterEvents(cards, { area: "compite", estado: "todos" }, NOW))).toEqual([COPA, ICPC, DUELO]);
  });

  it("área Conecta incluye los eventos que la tienen como línea secundaria", () => {
    expect(ids(filterEvents(cards, { area: "conecta", estado: "todos" }, NOW))).toEqual([ICPC, HACK_LATAM]);
  });

  it("estado concluidos devuelve Hack@Latam (histórico, 15-may-2026) y el Duelo (12-sep-2025)", () => {
    expect(ids(filterEvents(cards, { area: "todas", estado: "concluidos" }, NOW))).toEqual([HACK_LATAM, DUELO]);
  });

  it("estado próximos devuelve los eventos que todavía no terminan", () => {
    expect(ids(filterEvents(cards, { area: "todas", estado: "proximos" }, NOW))).toEqual([COPA, HACKATHON, ICPC]);
  });

  it("combina área y estado", () => {
    expect(ids(filterEvents(cards, { area: "crea", estado: "proximos" }, NOW))).toEqual([HACKATHON]);
    expect(ids(filterEvents(cards, { area: "compite", estado: "concluidos" }, NOW))).toEqual([DUELO]);
  });

  it("una combinación sin resultados devuelve []", () => {
    // Con la fecha del 11-nov-2026, ninguno de los eventos por defecto sigue próximo.
    const later = new Date("2026-11-11T12:00:00Z");
    expect(filterEvents(cards, { area: "todas", estado: "proximos" }, later)).toEqual([]);
    // Solo eventos de Compite sin línea secundaria: ninguno es de Crea.
    const onlyCompite = cards.filter((card) => card.line === "compite" && card.otherLines.length === 0);
    expect(filterEvents(onlyCompite, { area: "crea", estado: "todos" }, NOW)).toEqual([]);
  });

  it("una fecha inválida cuenta como próximo", () => {
    const card = toCatalogCard({ ...defaultEvents[0], eventDate: "no-es-fecha" });
    expect(ids(filterEvents([card], { area: "todas", estado: "proximos" }, NOW))).toEqual([COPA]);
    expect(filterEvents([card], { area: "todas", estado: "concluidos" }, NOW)).toEqual([]);
  });

  it("un evento histórico es concluido aunque su fecha sea futura", () => {
    const card = toCatalogCard({ ...defaultEvents[3], eventDate: "2027-01-01", eventDateEnd: undefined });
    expect(filterEvents([card], { area: "todas", estado: "concluidos" }, NOW)).toHaveLength(1);
    expect(filterEvents([card], { area: "todas", estado: "proximos" }, NOW)).toEqual([]);
  });

  it("no modifica la lista de entrada", () => {
    const before = [...cards];
    filterEvents(cards, { area: "compite", estado: "proximos" }, NOW);
    expect(cards).toEqual(before);
  });
});
