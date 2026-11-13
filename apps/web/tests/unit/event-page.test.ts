import { describe, expect, it } from "vitest";
import {
  getEventPageHref,
  getEventPagePhase,
  parseEventPage,
  projectPublicEventPage,
  validateEventPage,
  type EventItem,
  type EventPage,
} from "@c3/config";

/**
 * Modelo de la ficha por edición (T1): validación con límites de la spec §5, proyección pública (§6)
 * y fase temporal en el día local de El Salvador (UTC-6, sin horario de verano).
 */

type Ctx = { event: Pick<EventItem, "status" | "eventDate" | "eventDateEnd">; now: string };

// 20-nov-2026 mediodía en El Salvador. Evento terminado el 12-nov.
const ended: Ctx["event"] = { status: "Histórico", eventDate: "2026-11-10", eventDateEnd: "2026-11-12" };
const upcoming: Ctx["event"] = { status: "Próximamente", eventDate: "2026-12-10", eventDateEnd: "2026-12-11" };
const ctx = (event: Ctx["event"] = upcoming): Ctx => ({ event, now: "2026-11-20T18:00:00.000Z" });

function memory(over: Record<string, unknown> = {}) {
  return {
    publication: "draft",
    summary: ["Resumen de lo que ocurrió."],
    learnings: [],
    results: [],
    outputs: [],
    gallery: [],
    ...over,
  };
}

function page(over: Record<string, unknown> = {}) {
  return {
    slug: "copa-salvadorena-programacion-2026",
    publication: "draft",
    overview: ["Primer párrafo.", "Segundo párrafo."],
    resources: [],
    ...over,
  };
}

function ok(input: unknown, context: Ctx = ctx()): EventPage {
  const result = validateEventPage(input, context);
  if (!result.ok) {
    throw new Error(`Se esperaba válido: ${JSON.stringify(result.errors)}`);
  }
  return result.value;
}

function errors(input: unknown, context: Ctx = ctx()): Record<string, string> {
  const result = validateEventPage(input, context);
  if (result.ok) {
    throw new Error("Se esperaba inválido");
  }
  return result.errors;
}

const text = (length: number, char = "a") => char.repeat(length);

describe("validateEventPage: forma y normalización", () => {
  it("acepta una ficha mínima y normaliza los arrays ausentes a []", () => {
    const value = ok({ slug: "mi-edicion-2026", publication: "draft" });
    expect(value).toEqual({
      slug: "mi-edicion-2026",
      publication: "draft",
      overview: [],
      resources: [],
    });
  });

  it("recorta textos, descarta párrafos en blanco y omite opcionales vacíos (sin undefined)", () => {
    const value = ok(
      page({ overview: ["  Hola  ", "   ", ""], audience: "   ", location: "", requirements: [], modality: undefined }),
    );
    expect(value.overview).toEqual(["Hola"]);
    expect("audience" in value).toBe(false);
    expect("location" in value).toBe(false);
    expect("requirements" in value).toBe(false);
    expect("modality" in value).toBe(false);
    expect(JSON.stringify(value)).not.toContain("undefined");
  });

  it("rechaza lo que no es objeto y page:null", () => {
    expect(errors(null).page).toBeTruthy();
    expect(errors("texto").page).toBeTruthy();
    expect(errors([]).page).toBeTruthy();
  });

  it("memory:null elimina la memoria de forma expresa", () => {
    const value = ok(page({ memory: null }));
    expect("memory" in value).toBe(false);
  });

  it("rechaza publication inválida y modalidad desconocida", () => {
    expect(errors(page({ publication: "publicada" })).publication).toBeTruthy();
    expect(errors(page({ modality: "remota" })).modality).toBeTruthy();
    expect(ok(page({ modality: "hibrida" })).modality).toBe("hibrida");
  });

  it("rechaza tipos incorrectos con mensaje por campo (no los borra en silencio)", () => {
    const result = errors(page({ overview: "no es lista", resources: [{ title: 3, url: "/x" }] }));
    expect(result.overview).toBeTruthy();
    expect(result["resources.0.title"]).toBeTruthy();
  });

  it("el HTML y el Markdown se conservan como texto, sin modificar ni ejecutar", () => {
    const html = '<script>alert("x")</script> **negrita** [enlace](javascript:alert(1))';
    const value = ok(page({ overview: [html], audience: "<b>todos</b>" }));
    expect(value.overview).toEqual([html]);
    expect(value.audience).toBe("<b>todos</b>");
  });

  it("ignora claves desconocidas", () => {
    const value = ok(page({ hack: "x", memory: memory({ extra: 1 }) }));
    expect(value).not.toHaveProperty("hack");
    expect(value.memory).not.toHaveProperty("extra");
  });
});

describe("validateEventPage: slug", () => {
  it.each(["abc", "copa-2026", "a1-b2-c3", text(120)])("acepta %s", (slug) => {
    expect(ok(page({ slug })).slug).toBe(slug);
  });

  it.each([
    ["mayúsculas", "Copa-2026"],
    ["dos letras", "ab"],
    ["121 caracteres", text(121)],
    ["guion inicial", "-copa"],
    ["guion final", "copa-"],
    ["guiones dobles", "copa--2026"],
    ["acentos", "edición-2026"],
    ["espacios internos", "copa 2026"],
    ["barra", "copa/2026"],
    ["guion bajo", "copa_2026"],
    ["vacío", ""],
  ])("rechaza slug con %s", (_name, slug) => {
    expect(errors(page({ slug })).slug).toBeTruthy();
  });

  it("no pasa a minúsculas en silencio: «COPA» y «copa» son slugs distintos, el primero es inválido", () => {
    expect(errors(page({ slug: "COPA-2026" })).slug).toBeTruthy();
    expect(ok(page({ slug: "copa-2026" })).slug).toBe("copa-2026");
  });

  it("exige slug textual", () => {
    expect(errors(page({ slug: 12345 })).slug).toBeTruthy();
    expect(errors({ publication: "draft" }).slug).toBeTruthy();
  });
});

describe("validateEventPage: límites exactos de la spec §5", () => {
  it("overview: 12 párrafos de 2.000 caracteres sí; 13 o 2.001 no", () => {
    expect(ok(page({ overview: Array.from({ length: 12 }, () => text(2000)) })).overview).toHaveLength(12);
    expect(errors(page({ overview: Array.from({ length: 13 }, () => "a") })).overview).toBeTruthy();
    expect(errors(page({ overview: [text(2001)] }))["overview.0"]).toBeTruthy();
  });

  it("audiencia y ubicación: 300 sí; 301 no", () => {
    expect(ok(page({ audience: text(300), location: text(300) })).audience).toHaveLength(300);
    expect(errors(page({ audience: text(301) })).audience).toBeTruthy();
    expect(errors(page({ location: text(301) })).location).toBeTruthy();
  });

  it("requisitos: 20 de 500 sí; 21 o 501 no", () => {
    expect(ok(page({ requirements: Array.from({ length: 20 }, () => text(500)) })).requirements).toHaveLength(20);
    expect(errors(page({ requirements: Array.from({ length: 21 }, () => "a") })).requirements).toBeTruthy();
    expect(errors(page({ requirements: [text(501)] }))["requirements.0"]).toBeTruthy();
  });

  it("recursos: 20 sí; 21 no; título 160 sí, 161 no; url 2.048 sí, 2.049 no", () => {
    const resource = (i = 0) => ({ title: `Recurso ${i}`, url: "/recursos" });
    expect(ok(page({ resources: Array.from({ length: 20 }, (_, i) => resource(i)) })).resources).toHaveLength(20);
    expect(errors(page({ resources: Array.from({ length: 21 }, (_, i) => resource(i)) })).resources).toBeTruthy();
    expect(ok(page({ resources: [{ title: text(160), url: "/r" }] })).resources[0].title).toHaveLength(160);
    expect(errors(page({ resources: [{ title: text(161), url: "/r" }] }))["resources.0.title"]).toBeTruthy();
    const longUrl = (n: number) => `https://c3.com.sv/${text(n - "https://c3.com.sv/".length)}`;
    expect(ok(page({ resources: [{ title: "t", url: longUrl(2048) }] })).resources[0].url).toHaveLength(2048);
    expect(errors(page({ resources: [{ title: "t", url: longUrl(2049) }] }))["resources.0.url"]).toBeTruthy();
  });

  it("participación: etiqueta 160 sí, 161 no", () => {
    expect(ok(page({ participation: { label: text(160), url: "https://forms.example.com/x" } })).participation).toBeTruthy();
    expect(errors(page({ participation: { label: text(161), url: "/x" } }))["participation.label"]).toBeTruthy();
    expect(errors(page({ participation: { label: "", url: "/x" } }))["participation.label"]).toBeTruthy();
  });

  it("memoria: summary 12×2.000 sí; 13 no; learnings 20×500 sí; 21 no", () => {
    expect(ok(page({ memory: memory({ summary: Array.from({ length: 12 }, () => text(2000)) }) })).memory?.summary).toHaveLength(12);
    expect(errors(page({ memory: memory({ summary: Array.from({ length: 13 }, () => "a") }) }))["memory.summary"]).toBeTruthy();
    expect(errors(page({ memory: memory({ summary: [text(2001)] }) }))["memory.summary.0"]).toBeTruthy();
    expect(ok(page({ memory: memory({ learnings: Array.from({ length: 20 }, () => text(500)) }) })).memory?.learnings).toHaveLength(20);
    expect(errors(page({ memory: memory({ learnings: Array.from({ length: 21 }, () => "a") }) }))["memory.learnings"]).toBeTruthy();
    expect(errors(page({ memory: memory({ learnings: [text(501)] }) }))["memory.learnings.0"]).toBeTruthy();
  });

  it("resultados: 20 sí, 21 no; etiqueta 160; valor 80; contexto 1.000", () => {
    const result = (over: Record<string, unknown> = {}) => ({ label: "Equipos", value: "12", context: "Inscritos.", ...over });
    expect(ok(page({ memory: memory({ results: Array.from({ length: 20 }, () => result()) }) })).memory?.results).toHaveLength(20);
    expect(errors(page({ memory: memory({ results: Array.from({ length: 21 }, () => result()) }) }))["memory.results"]).toBeTruthy();
    expect(ok(page({ memory: memory({ results: [result({ label: text(160), value: text(80), context: text(1000) })] }) })).memory?.results[0].value).toHaveLength(80);
    expect(errors(page({ memory: memory({ results: [result({ label: text(161) })] }) }))["memory.results.0.label"]).toBeTruthy();
    expect(errors(page({ memory: memory({ results: [result({ value: text(81) })] }) }))["memory.results.0.value"]).toBeTruthy();
    expect(errors(page({ memory: memory({ results: [result({ context: text(1001) })] }) }))["memory.results.0.context"]).toBeTruthy();
  });

  it("salidas: 20 sí, 21 no; título 160; descripción 1.000", () => {
    const output = (over: Record<string, unknown> = {}) => ({ title: "Proyecto", description: "Qué se construyó.", ...over });
    expect(ok(page({ memory: memory({ outputs: Array.from({ length: 20 }, () => output()) }) })).memory?.outputs).toHaveLength(20);
    expect(errors(page({ memory: memory({ outputs: Array.from({ length: 21 }, () => output()) }) }))["memory.outputs"]).toBeTruthy();
    expect(errors(page({ memory: memory({ outputs: [output({ title: text(161) })] }) }))["memory.outputs.0.title"]).toBeTruthy();
    expect(errors(page({ memory: memory({ outputs: [output({ description: text(1001) })] }) }))["memory.outputs.0.description"]).toBeTruthy();
    expect(ok(page({ memory: memory({ outputs: [output({ description: text(1000) })] }) })).memory?.outputs[0].description).toHaveLength(1000);
  });

  it("galería: 12 sí, 13 no", () => {
    const image = (i = 0) => ({ url: `https://media.c3.com.sv/foto-${i}.webp`, alt: `Foto ${i}`, rightsConfirmed: true });
    expect(ok(page({ memory: memory({ gallery: Array.from({ length: 12 }, (_, i) => image(i)) }) })).memory?.gallery).toHaveLength(12);
    expect(errors(page({ memory: memory({ gallery: Array.from({ length: 13 }, (_, i) => image(i)) }) }))["memory.gallery"]).toBeTruthy();
  });

  it("los arrays vacíos son válidos en todos los bloques", () => {
    const value = ok(page({ overview: [], resources: [], memory: memory({ summary: [], learnings: [], results: [], outputs: [], gallery: [] }) }));
    expect(value.overview).toEqual([]);
    expect(value.memory?.gallery).toEqual([]);
  });

  it("cuenta caracteres Unicode (no unidades UTF-16): 2.000 emojis caben en un párrafo", () => {
    expect(ok(page({ overview: [text(2000, "😀")] })).overview[0]).toHaveLength(4000);
  });

  it("el documento serializado no puede superar 500 KiB en UTF-8", () => {
    // Cada URL de 2.048 caracteres con emojis pesa ~8 KiB en UTF-8; 20 + 20 + 20 + 12 superan el máximo.
    const bigUrl = `https://c3.com.sv/${text(1000, "😀")}`;
    const heavy = page({
      overview: Array.from({ length: 12 }, () => text(2000, "😀")),
      resources: Array.from({ length: 20 }, () => ({ title: text(160, "😀"), url: bigUrl })),
      memory: memory({
        summary: Array.from({ length: 12 }, () => text(2000, "😀")),
        results: Array.from({ length: 20 }, () => ({
          label: text(160, "😀"),
          value: text(80, "😀"),
          context: text(1000, "😀"),
          evidenceUrl: bigUrl,
        })),
        outputs: Array.from({ length: 20 }, () => ({
          title: text(160, "😀"),
          description: text(1000, "😀"),
          url: bigUrl,
        })),
      }),
    });
    const result = errors(heavy);
    expect(result.page).toMatch(/500 KiB/);
  });
});

describe("validateEventPage: URL", () => {
  const withUrl = (url: unknown) => page({ resources: [{ title: "Material", url }] });

  it.each([
    "https://c3.com.sv/material.pdf",
    "https://forms.example.com/inscripcion?x=1#y",
    "/eventos",
    "/copa/reglas",
    "/",
  ])("acepta %s", (url) => {
    expect(ok(withUrl(url)).resources[0].url).toBe(url);
  });

  it.each([
    ["javascript:", "javascript:alert(1)"],
    ["JavaScript con mayúsculas", "JaVaScRiPt:alert(1)"],
    ["data:", "data:text/html;base64,PHNjcmlwdD4="],
    ["http sin TLS", "http://c3.com.sv/x"],
    ["// protocolo relativo", "//evil.example/x"],
    ["/\\ equivalente a //", "/\\evil.example/x"],
    ["credenciales usuario", "https://user@c3.com.sv/x"],
    ["credenciales con clave", "https://user:pass@c3.com.sv/x"],
    ["relativa sin barra", "eventos/copa"],
    ["mailto:", "mailto:a@b.co"],
    ["ftp:", "ftp://c3.com.sv/x"],
    ["con espacios", "https://c3.com.sv/a b"],
    ["con salto de línea", "https://c3.com.sv/a\nb"],
    ["sin host", "https://"],
    ["https sin //", "https:c3.com.sv/x"],
    ["vacía", ""],
    ["no textual", 42],
  ])("rechaza URL con %s", (_name, url) => {
    expect(errors(withUrl(url))["resources.0.url"]).toBeTruthy();
  });

  it("aplica también a participación, evidencia y salidas", () => {
    expect(errors(page({ participation: { label: "Inscribirme", url: "javascript:x" } }))["participation.url"]).toBeTruthy();
    expect(
      errors(page({ memory: memory({ results: [{ label: "a", value: "1", context: "c", evidenceUrl: "data:x" }] }) }))[
        "memory.results.0.evidenceUrl"
      ],
    ).toBeTruthy();
    expect(
      errors(page({ memory: memory({ outputs: [{ title: "t", description: "d", url: "//x.y" }] }) }))["memory.outputs.0.url"],
    ).toBeTruthy();
  });

  it("la URL opcional vacía se omite sin error", () => {
    const value = ok(
      page({
        memory: memory({
          results: [{ label: "a", value: "1", context: "c", evidenceUrl: "  " }],
          outputs: [{ title: "t", description: "d", url: "" }],
        }),
      }),
    );
    expect("evidenceUrl" in (value.memory?.results[0] ?? {})).toBe(false);
    expect("url" in (value.memory?.outputs[0] ?? {})).toBe(false);
  });
});

describe("validateEventPage: galería (derechos, alt y host de C3)", () => {
  const gallery = (image: Record<string, unknown>) => page({ memory: memory({ gallery: [image] }) });
  const good = { url: "https://media.c3.com.sv/foto.webp", alt: "Equipo en la final", rightsConfirmed: true };

  it("acepta una imagen de host C3 con alt y derechos", () => {
    const value = ok(gallery({ ...good, caption: "Final" }));
    expect(value.memory?.gallery[0]).toEqual({ ...good, caption: "Final" });
  });

  it("rechaza imagen sin alt o con alt en blanco", () => {
    expect(errors(gallery({ ...good, alt: "   " }))["memory.gallery.0.alt"]).toBeTruthy();
    expect(errors(gallery({ ...good, alt: undefined }))["memory.gallery.0.alt"]).toBeTruthy();
  });

  it("rechaza imagen sin confirmación de derechos (ausente, false o texto)", () => {
    for (const value of [undefined, false, "true", 1, null]) {
      expect(errors(gallery({ ...good, rightsConfirmed: value }))["memory.gallery.0.rightsConfirmed"]).toBeTruthy();
    }
  });

  it("rechaza host ajeno, http y credenciales (sin hosts nuevos)", () => {
    expect(errors(gallery({ ...good, url: "https://evil.example/x.png" }))["memory.gallery.0.url"]).toBeTruthy();
    expect(errors(gallery({ ...good, url: "http://c3.com.sv/x.png" }))["memory.gallery.0.url"]).toBeTruthy();
    expect(errors(gallery({ ...good, url: "https://u:p@c3.com.sv/x.png" }))["memory.gallery.0.url"]).toBeTruthy();
    expect(errors(gallery({ ...good, url: "/imagenes/x.png" }))["memory.gallery.0.url"]).toBeTruthy();
    expect(errors(gallery({ ...good, url: "https://c3.com.sv.evil.example/x.png" }))["memory.gallery.0.url"]).toBeTruthy();
  });

  it("alt: 160 sí, 161 no; leyenda: 1.000 sí, 1.001 no", () => {
    expect(ok(gallery({ ...good, alt: text(160) })).memory?.gallery[0].alt).toHaveLength(160);
    expect(errors(gallery({ ...good, alt: text(161) }))["memory.gallery.0.alt"]).toBeTruthy();
    expect(errors(gallery({ ...good, caption: text(1001) }))["memory.gallery.0.caption"]).toBeTruthy();
  });
});

describe("validateEventPage: reglas de publicación", () => {
  it("publicar la ficha exige overview no vacío", () => {
    expect(errors(page({ publication: "published", overview: [] })).overview).toBeTruthy();
    expect(errors(page({ publication: "published", overview: ["  "] })).overview).toBeTruthy();
    expect(ok(page({ publication: "published" })).publication).toBe("published");
  });

  it("un borrador puede estar incompleto", () => {
    expect(ok(page({ overview: [] })).publication).toBe("draft");
  });

  it("publicar la memoria exige ficha publicada", () => {
    const result = errors(page({ publication: "draft", memory: memory({ publication: "published" }) }), ctx(ended));
    expect(result["memory.publication"]).toBeTruthy();
  });

  it("publicar la memoria exige summary no vacío", () => {
    const result = errors(
      page({ publication: "published", memory: memory({ publication: "published", summary: [] }) }),
      ctx(ended),
    );
    expect(result["memory.summary"]).toBeTruthy();
  });

  it("publicar la memoria no exige cifras ni fotos", () => {
    const value = ok(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(ended));
    expect(value.memory?.publication).toBe("published");
    expect(value.memory?.results).toEqual([]);
    expect(value.memory?.gallery).toEqual([]);
  });

  it("publicar la memoria de una edición futura se rechaza", () => {
    const result = errors(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(upcoming));
    expect(result["memory.publication"]).toBeTruthy();
  });

  it("memoria sin fecha y sin estado Histórico no es publicable", () => {
    const noDate = { status: "Próximamente", eventDate: undefined, eventDateEnd: undefined } as Ctx["event"];
    const result = errors(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(noDate));
    expect(result["memory.publication"]).toBeTruthy();
  });

  it("memoria con fecha inválida y sin Histórico no es publicable", () => {
    const bad = { status: "Próximamente", eventDate: "mañana" } as Ctx["event"];
    const result = errors(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(bad));
    expect(result["memory.publication"]).toBeTruthy();
  });

  it("estado Histórico sin fecha basta para publicar la memoria", () => {
    const historic = { status: "Histórico" } as Ctx["event"];
    const value = ok(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(historic));
    expect(value.memory?.publication).toBe("published");
  });

  it("fecha final pasada basta aunque el estado no sea Histórico", () => {
    const past = { status: "Inscripciones abiertas", eventDate: "2026-11-01", eventDateEnd: "2026-11-02" } as Ctx["event"];
    expect(ok(page({ publication: "published", memory: memory({ publication: "published" }) }), ctx(past)).memory?.publication).toBe("published");
  });

  it("una memoria en borrador se prepara en cualquier momento", () => {
    expect(ok(page({ publication: "draft", memory: memory({ summary: [] }) }), ctx(upcoming)).memory?.publication).toBe("draft");
  });

  it("resultado sin contexto o sin valor es error (una cifra sin contexto engaña)", () => {
    expect(errors(page({ memory: memory({ results: [{ label: "a", value: "1", context: "" }] }) }))["memory.results.0.context"]).toBeTruthy();
    expect(errors(page({ memory: memory({ results: [{ label: "a", value: "", context: "c" }] }) }))["memory.results.0.value"]).toBeTruthy();
  });

  it("las filas completamente vacías se descartan (no hay contenido que perder)", () => {
    const value = ok(page({ memory: memory({ results: [{ label: "", value: "", context: "" }] }) }));
    expect(value.memory?.results).toEqual([]);
  });
});

describe("getEventPagePhase (día local de El Salvador, UTC-6)", () => {
  const event = { status: "Próximamente", eventDate: "2026-11-13", eventDateEnd: "2026-11-14" } as const;
  const at = (iso: string) => new Date(iso);

  it("el día anterior al inicio (23:59:59 locales) es upcoming", () => {
    expect(getEventPagePhase(event, at("2026-11-13T05:59:59.000Z"))).toBe("upcoming");
  });

  it("el día de inicio, desde las 00:00 locales, es ongoing", () => {
    expect(getEventPagePhase(event, at("2026-11-13T06:00:00.000Z"))).toBe("ongoing");
  });

  it("el día final completo sigue en curso (hasta 23:59:59 locales)", () => {
    expect(getEventPagePhase(event, at("2026-11-15T05:59:59.000Z"))).toBe("ongoing");
  });

  it("el día siguiente al final es ended", () => {
    expect(getEventPagePhase(event, at("2026-11-15T06:00:00.000Z"))).toBe("ended");
  });

  it("un evento de un solo día termina al cambiar de día local", () => {
    const single = { status: "Próximamente", eventDate: "2026-11-13" } as const;
    expect(getEventPagePhase(single, at("2026-11-14T05:59:59.000Z"))).toBe("ongoing");
    expect(getEventPagePhase(single, at("2026-11-14T06:00:00.000Z"))).toBe("ended");
  });

  it("usa el día local y no el UTC: 02:00 UTC del 14 sigue siendo el 13 en El Salvador", () => {
    const single = { status: "Próximamente", eventDate: "2026-11-13" } as const;
    expect(getEventPagePhase(single, at("2026-11-14T02:00:00.000Z"))).toBe("ongoing");
  });

  it("sin fecha, o con fecha inválida, es unknown", () => {
    const now = at("2026-11-20T12:00:00.000Z");
    expect(getEventPagePhase({ status: "Próximamente" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDate: "" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDate: "pronto" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDate: "2026-13-40" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDate: "2026-02-30" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDate: "2026-11-13", eventDateEnd: "xx" }, now)).toBe("unknown");
    expect(getEventPagePhase({ status: "Próximamente", eventDateEnd: "2026-11-13" }, now)).toBe("unknown");
  });

  it("una fecha final anterior al inicio es unknown", () => {
    expect(
      getEventPagePhase({ status: "Próximamente", eventDate: "2026-11-14", eventDateEnd: "2026-11-13" }, at("2026-11-20T12:00:00.000Z")),
    ).toBe("unknown");
  });

  it("un «now» inválido es unknown", () => {
    expect(getEventPagePhase(event, new Date("no-es-fecha"))).toBe("unknown");
  });

  it("el estado Histórico es ended aun sin fechas o con fechas dudosas", () => {
    const now = at("2026-11-13T12:00:00.000Z");
    expect(getEventPagePhase({ status: "Histórico" }, now)).toBe("ended");
    expect(getEventPagePhase({ status: "Histórico", eventDate: "xx" }, now)).toBe("ended");
    expect(getEventPagePhase({ status: "Histórico", eventDate: "2027-01-01" }, now)).toBe("ended");
  });

  it("un evento con inscripciones abiertas pero fecha pasada es ended", () => {
    expect(getEventPagePhase({ status: "Inscripciones abiertas", eventDate: "2026-08-01" }, at("2026-11-20T12:00:00.000Z"))).toBe("ended");
  });
});

describe("projectPublicEventPage", () => {
  const published = () => ok(page({ publication: "published" }), ctx(ended));

  it("un borrador no tiene proyección pública", () => {
    const draft = ok(page({ publication: "draft" }));
    expect(projectPublicEventPage(draft)).toBeUndefined();
  });

  it("sin ficha no hay proyección", () => {
    expect(projectPublicEventPage(undefined)).toBeUndefined();
  });

  it("una ficha publicada con memoria en borrador se proyecta sin memoria", () => {
    const value = ok(page({ publication: "published", memory: memory({ publication: "draft" }) }), ctx(ended));
    const projected = projectPublicEventPage(value);
    expect(projected).toBeDefined();
    expect(projected).not.toHaveProperty("memory");
    expect(JSON.stringify(projected)).not.toContain("Resumen de lo que ocurrió");
  });

  it("la memoria publicada se proyecta y la galería no contiene rightsConfirmed", () => {
    const value = ok(
      page({
        publication: "published",
        memory: memory({
          publication: "published",
          gallery: [{ url: "https://media.c3.com.sv/foto.webp", alt: "Equipo", caption: "Final", rightsConfirmed: true }],
        }),
      }),
      ctx(ended),
    );
    const projected = projectPublicEventPage(value);
    expect(projected?.memory?.publication).toBe("published");
    expect(projected?.memory?.gallery).toEqual([{ url: "https://media.c3.com.sv/foto.webp", alt: "Equipo", caption: "Final" }]);
    expect(JSON.stringify(projected)).not.toContain("rightsConfirmed");
  });

  it("la proyección publicada marca publication:\"published\" y no filtra claves desconocidas", () => {
    const value = { ...published(), internalNote: "no" } as unknown as EventPage;
    const projected = projectPublicEventPage(value);
    expect(projected?.publication).toBe("published");
    expect(projected).not.toHaveProperty("internalNote");
  });

  it("no incluye claves con undefined", () => {
    const projected = projectPublicEventPage(published());
    expect(JSON.stringify(projected)).not.toContain("undefined");
    expect(Object.values(projected ?? {})).not.toContain(undefined);
  });

  it("proyecta contenido práctico, participación y recursos", () => {
    const value = ok(
      page({
        publication: "published",
        audience: "Estudiantes",
        requirements: ["Laptop"],
        modality: "presencial",
        location: "San Salvador",
        participation: { label: "Inscribirme", url: "https://forms.example.com/x" },
        resources: [{ title: "Bases", url: "/bases" }],
      }),
      ctx(ended),
    );
    const projected = projectPublicEventPage(value);
    expect(projected).toMatchObject({
      slug: "copa-salvadorena-programacion-2026",
      audience: "Estudiantes",
      requirements: ["Laptop"],
      modality: "presencial",
      location: "San Salvador",
      participation: { label: "Inscribirme", url: "https://forms.example.com/x" },
      resources: [{ title: "Bases", url: "/bases" }],
    });
  });
});

describe("parseEventPage (lectura tolerante de Firestore)", () => {
  it("un documento válido se parsea igual que validate", () => {
    const input = page({ publication: "published" });
    expect(parseEventPage(input)).toEqual(ok(input, ctx(ended)));
  });

  it("devuelve undefined si la ficha es inválida", () => {
    expect(parseEventPage(page({ slug: "MAL" }))).toBeUndefined();
    expect(parseEventPage(page({ publication: "published", overview: [] }))).toBeUndefined();
    expect(parseEventPage(null)).toBeUndefined();
    expect(parseEventPage("x")).toBeUndefined();
  });

  it("una memoria inválida se omite pero la ficha sigue", () => {
    const parsed = parseEventPage(
      page({ publication: "published", memory: memory({ publication: "published", gallery: [{ url: "https://evil.example/x.png", alt: "a", rightsConfirmed: true }] }) }),
    );
    expect(parsed).toBeDefined();
    expect(parsed?.memory).toBeUndefined();
  });

  it("una memoria publicada con ficha en borrador es inválida y se omite", () => {
    const parsed = parseEventPage(page({ publication: "draft", memory: memory({ publication: "published" }) }));
    expect(parsed?.memory).toBeUndefined();
  });
});

describe("getEventPageHref", () => {
  it("apunta a /eventos/{slug} cuando hay ficha pública", () => {
    const projected = projectPublicEventPage(ok(page({ publication: "published" }), ctx(ended)));
    expect(getEventPageHref({ page: projected })).toBe("/eventos/copa-salvadorena-programacion-2026");
  });

  it("sin ficha no hay enlace", () => {
    expect(getEventPageHref({})).toBeUndefined();
    expect(getEventPageHref({ page: undefined })).toBeUndefined();
  });

  it("no construye enlaces con slugs inválidos", () => {
    const bad = { page: { slug: "../admin", publication: "published", overview: ["x"], resources: [] } } as unknown as Pick<EventItem, "page">;
    expect(getEventPageHref(bad)).toBeUndefined();
  });
});
