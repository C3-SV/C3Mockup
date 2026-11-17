import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultEvents, type EventItem } from "@c3/config";
import { toCatalogCard } from "@/lib/ds/event-card";
import { FeaturedRotation } from "./FeaturedRotation";

const now = new Date("2026-11-12T12:00:00Z");

function cardsFrom(count: number, over: Partial<EventItem> = {}) {
  return Array.from({ length: count }, (_, index) => {
    const event: EventItem = {
      ...defaultEvents[0],
      id: `evento-${index + 1}`,
      title: `Evento ${index + 1}`,
      status: "Próximamente",
      eventDate: "2026-12-01",
      eventDateEnd: undefined,
      featured: true,
      external: false,
      href: "/eventos",
      cover: undefined,
      ...over,
    };
    return toCatalogCard(event, now);
  });
}

function stubMotion(reduce: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

function visibleSlideTitles(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[aria-roledescription="diapositiva"]'))
    .filter((slide) => !slide.hidden)
    .map((slide) => slide.querySelector("h3")?.textContent);
}

describe("FeaturedRotation (destacado rotativo)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el primer evento y deja los demás ocultos para lectores de pantalla", () => {
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    expect(visibleSlideTitles(container)).toEqual(["Evento 1"]);
    expect(screen.getByRole("group", { name: "1 de 3: Evento 1" })).toBeInTheDocument();
  });

  it("rota sola cada 8 segundos", () => {
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 2"]);
  });

  it("Pausar detiene la rotación y Reanudar la vuelve a iniciar", () => {
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));
    act(() => {
      vi.advanceTimersByTime(16000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 1"]);

    fireEvent.click(screen.getByRole("button", { name: "Reanudar" }));
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 2"]);
  });

  it("el foco dentro del bloque pausa la rotación y al salir se reanuda", () => {
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    const next = screen.getByRole("button", { name: "Evento destacado siguiente" });
    fireEvent.focus(next);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 1"]);

    fireEvent.blur(next, { relatedTarget: null });
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 2"]);
  });

  it("con movimiento reducido no rota, pero los controles funcionan", () => {
    stubMotion(true);
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    act(() => {
      vi.advanceTimersByTime(16000);
    });
    expect(visibleSlideTitles(container)).toEqual(["Evento 1"]);

    fireEvent.click(screen.getByRole("button", { name: "Evento destacado siguiente" }));
    expect(visibleSlideTitles(container)).toEqual(["Evento 2"]);
  });

  it("siguiente y anterior cambian de evento y lo anuncian", () => {
    const { container } = render(<FeaturedRotation items={cardsFrom(3)} />);
    fireEvent.click(screen.getByRole("button", { name: "Evento destacado siguiente" }));
    expect(visibleSlideTitles(container)).toEqual(["Evento 2"]);
    expect(screen.getByRole("status")).toHaveTextContent("Diapositiva 2 de 3: Evento 2");

    fireEvent.click(screen.getByRole("button", { name: "Evento destacado anterior" }));
    expect(visibleSlideTitles(container)).toEqual(["Evento 1"]);
  });

  it("con un solo evento no muestra controles ni rota", () => {
    render(<FeaturedRotation items={cardsFrom(1)} />);
    expect(screen.queryByRole("button", { name: "Pausar" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Evento destacado siguiente" })).toBeNull();
  });

  it("muestra la portada con su texto alternativo y el tipo como texto", () => {
    const [card] = cardsFrom(1, {
      cover: { url: "https://media.c3.com.sv/copa.webp", alt: "Participantes de la Copa" },
    });
    render(<FeaturedRotation items={[card]} />);
    expect(screen.getByRole("img", { name: "Participantes de la Copa" })).toBeInTheDocument();
    expect(screen.getByText("Competencia")).toBeInTheDocument();
  });
});
