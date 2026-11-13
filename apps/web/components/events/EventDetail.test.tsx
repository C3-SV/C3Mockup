import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatEventSchedule, type EventItem, type PublicEventMemory, type PublicEventPage } from "@c3/config";
import { EventDetail } from "./EventDetail";

/** Detalle público de una edición (T4, spec §6-§7): un h1, secciones solo con contenido, participación según fase. */

const NOW = new Date("2026-07-20T18:00:00Z"); // 20-jul-2026 mediodía en El Salvador

function memory(over: Partial<PublicEventMemory> = {}): PublicEventMemory {
  return { publication: "published", summary: ["Resumen de lo que ocurrió."], learnings: [], results: [], outputs: [], gallery: [], ...over };
}

function page(over: Partial<PublicEventPage> = {}): PublicEventPage {
  return {
    slug: "copa-2026",
    publication: "published",
    overview: ["Primer párrafo.", "Segundo párrafo."],
    resources: [],
    ...over,
  };
}

function event(over: Partial<EventItem> = {}): EventItem {
  return {
    id: "copa-2026",
    title: "Copa Salvadoreña de Programación 2026",
    description: "Competencia nacional de programación.",
    lines: ["compite"],
    status: "Inscripciones abiertas",
    cta: "Ir a la Copa",
    href: "https://copa.c3.com.sv",
    external: true,
    featured: false,
    eventDate: "2026-08-01",
    eventDateEnd: "2026-08-02",
    page: page({ participation: { label: "Inscribirme en la Copa", url: "https://copa.c3.com.sv/inscripcion" } }),
    ...over,
  };
}

const ended = (over: Partial<EventItem> = {}) =>
  event({ status: "Histórico", eventDate: "2026-05-01", eventDateEnd: "2026-05-02", ...over });

describe("EventDetail", () => {
  it("tiene un solo h1 con el título real, ruta de migas y resumen del evento", () => {
    render(<EventDetail event={event()} now={NOW} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Copa Salvadoreña de Programación 2026" })).toBeInTheDocument();

    const crumbs = screen.getByRole("navigation", { name: /ruta/i });
    const links = within(crumbs).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/", "/eventos"]);
    expect(within(crumbs).getByText("Copa Salvadoreña de Programación 2026")).toHaveAttribute("aria-current", "page");

    expect(screen.getByText("Primer párrafo.")).toBeInTheDocument();
    expect(screen.getByText("Segundo párrafo.")).toBeInTheDocument();
    expect(screen.getByText("Compite")).toBeInTheDocument();
  });

  it("muestra la fecha del evento por día; sin fecha no hay línea de fecha", () => {
    const dated = event();
    const expected = formatEventSchedule(dated);
    expect(expected).toMatch(/ago/);
    const { unmount } = render(<EventDetail event={dated} now={NOW} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
    expect(screen.getByText(/Fecha:/)).toBeInTheDocument();
    unmount();

    render(<EventDetail event={event({ eventDate: undefined, eventDateEnd: undefined })} now={NOW} />);
    expect(screen.queryByText(/Fecha:/)).toBeNull();
    expect(screen.queryByText(expected)).toBeNull();
  });

  it("la pastilla sale del helper de la ficha: nunca dice «Histórico» mientras se muestra la inscripción (R23)", () => {
    // 2-ago-2026 18:30 en El Salvador (3-ago 00:30 UTC): último día del evento, la inscripción sigue visible.
    render(<EventDetail event={event()} now={new Date("2026-08-03T00:30:00Z")} />);
    expect(screen.getByRole("link", { name: /Inscribirme en la Copa/ })).toBeInTheDocument();
    expect(screen.queryByText("Histórico")).toBeNull();
    expect(screen.getByText("Inscripciones abiertas")).toHaveClass("c3-pill");
  });

  it("fase terminada: la pastilla dice «Histórico»; con fecha desconocida conserva el estado", () => {
    const { unmount } = render(
      <EventDetail event={event({ eventDate: "2026-05-01", eventDateEnd: "2026-05-02" })} now={NOW} />,
    );
    expect(screen.getByText("Histórico")).toHaveClass("c3-pill");
    expect(screen.queryByText("Inscripciones abiertas")).toBeNull();
    unmount();

    render(<EventDetail event={event({ eventDate: undefined, eventDateEnd: undefined })} now={NOW} />);
    expect(screen.getByText("Inscripciones abiertas")).toBeInTheDocument();
  });

  it("el separador de las migas no lo leen los lectores de pantalla", () => {
    render(<EventDetail event={event()} now={NOW} />);
    const crumbs = screen.getByRole("navigation", { name: /ruta/i });
    const separators = Array.from(crumbs.querySelectorAll("li > span")).filter((node) => node.textContent === "/");
    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("la raíz lleva solo la clase c3-event (sin clase de línea sin regla)", () => {
    const { container } = render(<EventDetail event={event()} now={NOW} />);
    expect((container.firstElementChild as HTMLElement).className).toBe("c3-event");
  });

  it("el sitio del evento abre en pestaña nueva según event.external, no según el esquema del enlace", () => {
    const { unmount } = render(<EventDetail event={event({ external: false, href: "https://c3.com.sv/evento" })} now={NOW} />);
    const internal = screen.getByRole("link", { name: /Ir a la Copa/ });
    expect(internal).toHaveAttribute("href", "https://c3.com.sv/evento");
    expect(internal).not.toHaveAttribute("target");
    unmount();

    render(<EventDetail event={event({ external: true })} now={NOW} />);
    const external = screen.getByRole("link", { name: /Ir a la Copa/ });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("dos materiales con el mismo enlace no repiten clave de React", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <EventDetail
        event={event({
          page: page({
            resources: [
              { title: "Reglamento", url: "https://c3.com.sv/doc.pdf" },
              { title: "Reglamento (copia)", url: "https://c3.com.sv/doc.pdf" },
            ],
          }),
        })}
        now={NOW}
      />,
    );
    expect(screen.getAllByRole("link", { name: /Reglamento/ })).toHaveLength(2);
    expect(spy.mock.calls.flat().join(" ")).not.toMatch(/same key|unique "key"/i);
    spy.mockRestore();
  });

  it("una memoria sin cifras, productos ni fotos no deja encabezados vacíos", () => {
    render(<EventDetail event={ended({ page: page({ memory: memory() }) })} now={NOW} />);

    expect(screen.getByRole("heading", { level: 2, name: /memoria/i })).toBeInTheDocument();
    expect(screen.getByText("Resumen de lo que ocurrió.")).toBeInTheDocument();

    for (const name of [/resultados/i, /aprendizajes/i, /galer/i, /proyectos|entregables/i, /materiales/i, /requisitos/i]) {
      expect(screen.queryByRole("heading", { name })).toBeNull();
    }
    for (const heading of screen.getAllByRole("heading")) {
      expect(heading.textContent?.trim()).toBeTruthy();
    }
  });

  it("sin memoria no hay sección de memoria ni de información práctica vacía", () => {
    const { container } = render(<EventDetail event={event({ eventDate: undefined, eventDateEnd: undefined })} now={NOW} />);
    expect(screen.queryByRole("heading", { name: /memoria/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /información práctica/i })).toBeNull();
    expect(container.querySelectorAll("section:empty")).toHaveLength(0);
  });

  it("memoria completa: cifras con contexto, aprendizajes, proyectos, evidencia y galería con alt", () => {
    render(
      <EventDetail
        event={ended({
          page: page({
            memory: memory({
              learnings: ["Aprendimos a coordinar jueces."],
              results: [{ label: "Equipos", value: "58", context: "Equipos de 12 universidades.", evidenceUrl: "https://copa.c3.com.sv/resultados" }],
              outputs: [{ title: "Plataforma de juez", description: "Proyecto abierto.", url: "https://github.com/c3/juez" }],
              gallery: [{ url: "https://copa.c3.com.sv/foto.jpg", alt: "Equipos resolviendo problemas", caption: "Final" }],
            }),
          }),
        })}
        now={NOW}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: /aprendizajes/i })).toBeInTheDocument();
    expect(screen.getByText("Aprendimos a coordinar jueces.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /resultados/i })).toBeInTheDocument();
    expect(screen.getByText("58")).toBeInTheDocument();
    expect(screen.getByText("Equipos de 12 universidades.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /evidencia.*Equipos/i })).toHaveAttribute("href", "https://copa.c3.com.sv/resultados");
    expect(screen.getByRole("link", { name: /Plataforma de juez/ })).toHaveAttribute("href", "https://github.com/c3/juez");
    expect(screen.getByRole("img", { name: "Equipos resolviendo problemas" })).toBeInTheDocument();
    expect(screen.getByText("Final")).toBeInTheDocument();
  });

  it("evento pasado: oculta la inscripción aunque el estado diga «Inscripciones abiertas»", () => {
    render(<EventDetail event={ended({ status: "Inscripciones abiertas" })} now={NOW} />);
    expect(screen.queryByRole("link", { name: /Inscribirme en la Copa/ })).toBeNull();
    expect(screen.queryByRole("heading", { name: /participa/i })).toBeNull();
  });

  it("evento en estado Histórico: oculta la inscripción", () => {
    render(<EventDetail event={event({ status: "Histórico" })} now={NOW} />);
    expect(screen.queryByRole("link", { name: /Inscribirme en la Copa/ })).toBeNull();
  });

  it("evento próximo con inscripciones abiertas: permite participar", () => {
    render(<EventDetail event={event()} now={NOW} />);
    expect(screen.getByRole("link", { name: /Inscribirme en la Copa/ })).toHaveAttribute("href", "https://copa.c3.com.sv/inscripcion");
  });

  it("evento en curso válido con inscripciones abiertas: permite participar", () => {
    render(<EventDetail event={event()} now={new Date("2026-08-02T18:00:00Z")} />);
    expect(screen.getByRole("link", { name: /Inscribirme en la Copa/ })).toBeInTheDocument();
  });

  it("estado distinto de «Inscripciones abiertas»: no hay acción de participación", () => {
    render(<EventDetail event={event({ status: "Próximamente" })} now={NOW} />);
    expect(screen.queryByRole("link", { name: /Inscribirme en la Copa/ })).toBeNull();
  });

  it("fecha desconocida: no permite participar y conserva el enlace al sitio especial", () => {
    render(<EventDetail event={event({ eventDate: undefined, eventDateEnd: undefined })} now={NOW} />);
    expect(screen.queryByRole("link", { name: /Inscribirme en la Copa/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Ir a la Copa/ })).toHaveAttribute("href", "https://copa.c3.com.sv");
  });

  it("una fecha de inicio pasada sin fecha final tampoco permite participar (fase desconocida)", () => {
    render(<EventDetail event={event({ eventDate: "2026-07-01", eventDateEnd: undefined })} now={NOW} />);
    expect(screen.queryByRole("link", { name: /Inscribirme en la Copa/ })).toBeNull();
  });

  it("conserva el enlace al sitio especial con su texto, destino y apertura externa segura", () => {
    render(<EventDetail event={ended()} now={NOW} />);
    const link = screen.getByRole("link", { name: /Ir a la Copa/ });
    expect(link).toHaveAttribute("href", "https://copa.c3.com.sv");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("muestra información práctica y materiales solo con datos", () => {
    render(
      <EventDetail
        event={event({
          page: page({
            audience: "Estudiantes de bachillerato y universidad.",
            requirements: ["Equipo de tres personas."],
            modality: "hibrida",
            location: "Universidad Don Bosco",
            resources: [{ title: "Reglamento", url: "https://c3.com.sv/reglamento.pdf" }],
          }),
        })}
        now={NOW}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: /información práctica/i })).toBeInTheDocument();
    expect(screen.getByText("Estudiantes de bachillerato y universidad.")).toBeInTheDocument();
    expect(screen.getByText("Equipo de tres personas.")).toBeInTheDocument();
    expect(screen.getByText("Híbrida")).toBeInTheDocument();
    expect(screen.getByText("Universidad Don Bosco")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /materiales/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reglamento" })).toHaveAttribute("href", "https://c3.com.sv/reglamento.pdf");
  });

  it("un payload con HTML se presenta como texto, nunca como marcado", () => {
    const payload = "<img src=x onerror=alert(1)><script>alert(2)</script>";
    const { container } = render(
      <EventDetail event={event({ page: page({ overview: [payload], audience: payload }) })} now={NOW} />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img[src='x']")).toBeNull();
    expect(screen.getAllByText(payload).length).toBeGreaterThan(0);
  });

  it("nunca muestra DEMO", () => {
    const { container } = render(<EventDetail event={event()} now={NOW} />);
    expect(container.textContent).not.toMatch(/DEMO/);
  });

  it("sin ficha publicada no renderiza una ficha", () => {
    expect(() => render(<EventDetail event={event({ page: undefined })} now={NOW} />)).toThrow();
  });
});
