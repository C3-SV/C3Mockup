import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GettingStarted from "./GettingStarted";
import {
  getGettingStartedFaq,
  gettingStartedContent,
  resolveCommunityAction,
} from "@/lib/getting-started-content";
import { siteConfig } from "@/lib/site";

const faqs = getGettingStartedFaq();
const comunidad = resolveCommunityAction(siteConfig.community.inviteUrl);
const contacto = resolveCommunityAction(undefined);

function renderGuia(action = comunidad) {
  return render(
    <GettingStarted content={gettingStartedContent} communityAction={action} faqs={faqs} />,
  );
}

describe("GettingStarted con comunidad disponible", () => {
  it("tiene un único h1 con el título de la guía", () => {
    renderGuia();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Empieza en C3" })).toBeInTheDocument();
  });

  it("la acción de WhatsApp abre en pestaña nueva con noopener noreferrer", () => {
    renderGuia();
    const links = screen.getAllByRole("link", { name: /Unirme a la comunidad/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", siteConfig.community.inviteUrl);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("explica que WhatsApp es un servicio externo y lo asocia al enlace", () => {
    renderGuia();
    const aviso = screen.getByText(/WhatsApp, un servicio externo a C3, en una pestaña nueva/);
    const link = screen.getByRole("link", { name: /Unirme a la comunidad/ });
    expect(link).toHaveAttribute("aria-describedby", aviso.id);
  });

  it("muestra eventos, las tres áreas, las dudas y el contacto alternativo", () => {
    renderGuia();
    expect(screen.getByRole("link", { name: "Explorar eventos" })).toHaveAttribute("href", "/eventos");
    for (const [name, href] of [
      ["Compite", "/compite"],
      ["Crea", "/crea"],
      ["Conecta", "/conecta"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    for (const faq of faqs) {
      expect(screen.getByRole("heading", { name: faq.question })).toBeInTheDocument();
      expect(screen.getByText(faq.answer)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Ver todas las preguntas frecuentes" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Contactar a C3" })).toHaveAttribute("href", "/contacto");
    expect(screen.getByRole("link", { name: siteConfig.contact.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contact.email}`,
    );
  });

  it("los requisitos se leen por evento, no como regla global", () => {
    renderGuia();
    expect(screen.getByText("Lee los requisitos de cada evento.")).toBeInTheDocument();
  });

  it("no enlaza páginas legales", () => {
    const { container } = renderGuia();
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => /privacidad|terminos|legal/i.test(h))).toEqual([]);
  });
});

describe("GettingStarted con comunidad no disponible (fallback)", () => {
  it("no muestra acción externa ni aviso de WhatsApp", () => {
    const { container } = renderGuia(contacto);
    expect(container.querySelector('a[target="_blank"]')).toBeNull();
    expect(screen.queryByText(/servicio externo/)).toBeNull();
    expect(screen.queryByRole("link", { name: /Unirme a la comunidad/ })).toBeNull();
  });

  it("deja una sola acción de contacto, sin botones duplicados ni vacíos", () => {
    const { container } = renderGuia(contacto);
    expect(screen.getAllByRole("link", { name: "Contactar a C3" })).toHaveLength(1);
    const botones = container.querySelectorAll("a.c3-btn");
    const vistos = new Set<string>();
    for (const b of botones) {
      const clave = `${b.getAttribute("href")}|${b.textContent?.trim()}`;
      expect(b.textContent?.trim()).not.toBe("");
      expect(vistos.has(clave)).toBe(false);
      vistos.add(clave);
    }
  });

  it("conserva eventos, áreas y dudas", () => {
    renderGuia(contacto);
    expect(screen.getByRole("link", { name: "Explorar eventos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Compite" })).toBeInTheDocument();
    const dudas = screen.getByRole("heading", { name: "Dudas para empezar" }).closest("section")!;
    expect(within(dudas).getAllByRole("heading", { level: 3 })).toHaveLength(faqs.length);
  });
});
