import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteHeader from "./SiteHeader";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

describe("SiteHeader (cabecera blanca del DS, §7.1)", () => {
  beforeEach(() => {
    pathname = "/";
  });

  it("muestra el logo al inicio, los enlaces del sitio y Contacto como accion primaria", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Principal" });
    for (const [name, href] of [
      ["Inicio", "/"],
      ["Qué es C3", "/que-es-c3"],
      ["Eventos", "/eventos"],
      ["FAQ", "/faq"],
    ] as const) {
      expect(within(nav).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto");
  });

  it("Ecosistema empieza cerrado y al abrirse muestra Compite, Crea y Conecta con su descripcion", () => {
    render(<SiteHeader />);
    const trigger = screen.getByRole("button", { name: "Ecosistema" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Compite/ })).toHaveAttribute("href", "/compite");
    expect(screen.getByRole("link", { name: /Crea/ })).toHaveAttribute("href", "/crea");
    expect(screen.getByRole("link", { name: /Conecta/ })).toHaveAttribute("href", "/conecta");
    expect(screen.getByText("Programación competitiva y excelencia técnica.")).toBeInTheDocument();
  });

  it("Escape cierra Ecosistema y devuelve el foco al disparador", () => {
    render(<SiteHeader />);
    const trigger = screen.getByRole("button", { name: "Ecosistema" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("un clic fuera de Ecosistema lo cierra", () => {
    render(<SiteHeader />);
    const trigger = screen.getByRole("button", { name: "Ecosistema" });
    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("marca la pagina actual con aria-current y no marca las demas", () => {
    pathname = "/eventos";
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(within(nav).getByRole("link", { name: "Eventos" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("Menu abre el panel movil con los mismos enlaces y Contacto", () => {
    render(<SiteHeader />);
    const menu = screen.getByRole("button", { name: "Menú" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(menu.getAttribute("aria-controls") ?? "");
    expect(panel).not.toBeNull();
    expect(within(panel as HTMLElement).getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto");
    expect(within(panel as HTMLElement).getByRole("link", { name: "Compite" })).toHaveAttribute("href", "/compite");
  });

  it("no muestra acceso de cuentas ni la palabra challenge", () => {
    const { container } = render(<SiteHeader />);
    expect(container.textContent ?? "").not.toMatch(/Iniciar sesión|Crear cuenta|challenge/i);
  });
});
