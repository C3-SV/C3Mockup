import { describe, expect, it } from "vitest";
import {
  buildAdminEventRecord,
  normalizeFeaturedOrder,
  normalizeFirebasePrivateKey,
  type EventItem,
} from "@c3/config";
import { parseEventDocument } from "@/lib/events-parse";
import { ROTATION_MAX, selectRotation, splitForHome } from "@/lib/ds/featured-rotation";

const now = new Date("2026-11-12T12:00:00.000Z");

function ev(id: string, over: Partial<EventItem> = {}): EventItem {
  return {
    id,
    title: `Evento ${id}`,
    description: "Descripción del evento",
    lines: ["compite"],
    status: "Próximamente",
    cta: "Ver evento",
    href: "/eventos",
    featured: true,
    eventDate: "2026-12-01",
    ...over,
  };
}

describe("selectRotation (destacado rotativo)", () => {
  it("solo entran los destacados vigentes", () => {
    const events = [
      ev("vigente"),
      ev("pasado", { eventDate: "2026-08-01", status: "Inscripciones abiertas" }),
      ev("no-destacado", { featured: false }),
    ];
    expect(selectRotation(events, now).map((e) => e.id)).toEqual(["vigente"]);
  });

  it("ordena por featuredOrder y, sin orden, por fecha; los que tienen orden van primero", () => {
    const events = [
      ev("sin-orden-tarde", { eventDate: "2026-12-20" }),
      ev("orden-2", { featuredOrder: 2, eventDate: "2026-11-30" }),
      ev("sin-orden-temprano", { eventDate: "2026-11-25" }),
      ev("orden-1", { featuredOrder: 1, eventDate: "2026-12-15" }),
    ];
    expect(selectRotation(events, now).map((e) => e.id)).toEqual([
      "orden-1",
      "orden-2",
      "sin-orden-temprano",
      "sin-orden-tarde",
    ]);
  });

  it(`muestra como máximo ${ROTATION_MAX}`, () => {
    const events = Array.from({ length: 7 }, (_, index) =>
      ev(`e${index + 1}`, { eventDate: `2026-12-${String(index + 1).padStart(2, "0")}` }),
    );
    expect(selectRotation(events, now)).toHaveLength(ROTATION_MAX);
  });

  it("sin destacados vigentes, rotan los destacados que ya terminaron, el más reciente primero", () => {
    const events = [
      ev("hackathon", { eventDate: "2026-07-11", eventDateEnd: "2026-07-12", status: "Histórico" }),
      ev("copa", { eventDate: "2026-08-01", eventDateEnd: "2026-09-05", status: "Histórico" }),
      ev("otro", { eventDate: "2026-05-15", status: "Histórico", featured: false }),
    ];
    expect(selectRotation(events, now).map((e) => e.id)).toEqual(["copa", "hackathon"]);
  });

  it("sin destacados ni eventos, no hay rotación", () => {
    expect(selectRotation([ev("solo-normal", { featured: false })], now)).toEqual([]);
  });
});

describe("splitForHome", () => {
  it("el resto del catálogo no repite los eventos del destacado y conserva su orden", () => {
    const destacado = ev("destacado", { eventDate: "2026-12-01" });
    const otro = ev("otro", { featured: false, eventDate: "2026-12-10" });
    const pasado = ev("pasado", { featured: false, eventDate: "2026-08-01", status: "Histórico" });

    const { rotation, rest } = splitForHome([destacado, otro, pasado], now);

    expect(rotation.map((e) => e.id)).toEqual(["destacado"]);
    expect(rest.map((e) => e.id)).toEqual(["otro", "pasado"]);
  });
});

describe("featuredOrder y clave privada", () => {
  it("normaliza el orden a un entero de 1 a 99 y descarta lo demás", () => {
    expect(normalizeFeaturedOrder(3)).toBe(3);
    expect(normalizeFeaturedOrder("3")).toBe(3);
    expect(normalizeFeaturedOrder("")).toBeUndefined();
    expect(normalizeFeaturedOrder(0)).toBeUndefined();
    expect(normalizeFeaturedOrder(100)).toBeUndefined();
    expect(normalizeFeaturedOrder(2.5)).toBeUndefined();
    expect(normalizeFeaturedOrder("abc")).toBeUndefined();
  });

  it("convierte los saltos de línea escritos como texto en saltos reales", () => {
    expect(normalizeFirebasePrivateKey("linea1\\nlinea2")).toBe("linea1\nlinea2");
    expect(normalizeFirebasePrivateKey("linea1\nlinea2")).toBe("linea1\nlinea2");
  });

  it("el documento de Firestore conserva featuredOrder", () => {
    const parsed = parseEventDocument("doc-1", {
      title: "T",
      description: "D",
      lines: ["crea"],
      cta: "Ver",
      href: "/eventos",
      featured: true,
      featuredOrder: 2,
    });
    expect(parsed?.featuredOrder).toBe(2);
  });
});

describe("buildAdminEventRecord (lo que guarda el admin)", () => {
  const base = {
    id: "mi-evento",
    title: "Mi evento",
    description: "Descripción",
    href: "https://mi.c3.com.sv",
    cta: "Ver",
    lines: ["compite"],
    status: "Próximamente",
    eventDate: "2026-12-01",
  };
  const stamp = now.toISOString();

  it("conserva kind, source y cover; no deja valores undefined", () => {
    const record = buildAdminEventRecord(
      {
        ...base,
        kind: "hackathon",
        source: "admin",
        cover: { url: "https://media.c3.com.sv/a.webp", alt: "Equipo en la hackathon" },
      },
      { now: stamp },
    );
    expect(record.kind).toBe("hackathon");
    expect(record.source).toBe("admin");
    expect(record.cover).toEqual({ url: "https://media.c3.com.sv/a.webp", alt: "Equipo en la hackathon" });
    expect(Object.values(record)).not.toContain(undefined);
  });

  it("un tipo desconocido se descarta", () => {
    const record = buildAdminEventRecord({ ...base, kind: "otro" }, { now: stamp });
    expect(record.kind).toBeUndefined();
  });

  it("una portada inválida (http o sin texto alternativo) se descarta", () => {
    const record = buildAdminEventRecord(
      { ...base, cover: { url: "http://c3.com.sv/a.jpg", alt: "x" } },
      { now: stamp },
    );
    expect(record.cover).toBeUndefined();
  });

  it("featuredOrder solo se guarda si el evento está destacado", () => {
    expect(buildAdminEventRecord({ ...base, featured: true, featuredOrder: "2" }, { now: stamp }).featuredOrder).toBe(2);
    expect(
      buildAdminEventRecord({ ...base, featured: false, featuredOrder: "2" }, { now: stamp }).featuredOrder,
    ).toBeUndefined();
  });

  it("sin título, descripción, enlace, CTA o línea lanza error", () => {
    expect(() => buildAdminEventRecord({ ...base, title: "" }, { now: stamp })).toThrow();
    expect(() => buildAdminEventRecord({ ...base, lines: [] }, { now: stamp })).toThrow();
  });
});
