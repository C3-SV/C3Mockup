import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeOrbit } from "./HomeOrbit";

const bubble = () => document.getElementById("c3-orbit-bubble") as HTMLElement;

describe("HomeOrbit (órbita del símbolo, DS §7.13)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tiene un punto por línea, con su nombre accesible y aria-pressed", () => {
    render(<HomeOrbit />);
    for (const name of ["Compite", "Crea", "Conecta"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("el foco en un punto abre su burbuja con el texto de la línea y su enlace", () => {
    render(<HomeOrbit />);
    const compite = screen.getByRole("button", { name: "Compite" });
    act(() => compite.focus());
    expect(compite).toHaveAttribute("aria-pressed", "true");
    expect(bubble()).not.toHaveAttribute("hidden");
    expect(within(bubble()).getByRole("heading", { name: "Compite" })).toBeInTheDocument();
    expect(within(bubble()).getByRole("link", { name: /Conocer Compite/ })).toHaveAttribute("href", "/compite");
  });

  it("al salir del punto la burbuja sigue abierta 159 ms y se cierra a los 160 ms", () => {
    render(<HomeOrbit />);
    const crea = screen.getByRole("button", { name: "Crea" });
    fireEvent.mouseEnter(crea);
    fireEvent.mouseLeave(crea);
    act(() => vi.advanceTimersByTime(159));
    expect(bubble()).not.toHaveAttribute("hidden");
    act(() => vi.advanceTimersByTime(1));
    expect(bubble()).toHaveAttribute("hidden");
    expect(crea).toHaveAttribute("aria-pressed", "false");
  });

  it("pasar a la burbuja antes de los 160 ms la mantiene abierta", () => {
    render(<HomeOrbit />);
    const conecta = screen.getByRole("button", { name: "Conecta" });
    fireEvent.mouseEnter(conecta);
    fireEvent.mouseLeave(conecta);
    fireEvent.mouseEnter(bubble());
    act(() => vi.advanceTimersByTime(500));
    expect(bubble()).not.toHaveAttribute("hidden");
  });

  it("Escape cierra la burbuja abierta", () => {
    render(<HomeOrbit />);
    const crea = screen.getByRole("button", { name: "Crea" });
    act(() => crea.focus());
    fireEvent.keyDown(crea, { key: "Escape" });
    expect(bubble()).toHaveAttribute("hidden");
    expect(crea).toHaveAttribute("aria-pressed", "false");
  });

  it("la burbuja anuncia sus cambios con aria-live", () => {
    render(<HomeOrbit />);
    expect(bubble()).toHaveAttribute("aria-live", "polite");
  });
});
