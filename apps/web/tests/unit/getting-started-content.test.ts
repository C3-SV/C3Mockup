import { describe, expect, it } from "vitest";
import { faqItems } from "@/lib/content";
import {
  getGettingStartedFaq,
  gettingStartedContent,
  resolveCommunityAction,
} from "@/lib/getting-started-content";
import { siteConfig } from "@/lib/site";

const INVITE = "https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA";

describe("siteConfig.community", () => {
  it("usa el destino exacto facilitado por el responsable, sin parámetros añadidos", () => {
    expect(siteConfig.community.label).toBe("WhatsApp");
    expect(siteConfig.community.inviteUrl).toBe(INVITE);
    expect(new URL(siteConfig.community.inviteUrl).search).toBe("");
  });
});

describe("resolveCommunityAction", () => {
  it("una invitación https de chat.whatsapp.com abre la comunidad en pestaña externa", () => {
    expect(resolveCommunityAction(INVITE)).toEqual({
      href: INVITE,
      label: "Unirme a la comunidad",
      external: true,
    });
  });

  it("conserva el destino configurado tal cual si se sustituye la invitación", () => {
    const otra = "https://chat.whatsapp.com/OtraInvitacion123";
    expect(resolveCommunityAction(otra).href).toBe(otra);
  });

  it.each([
    undefined,
    "",
    "   ",
    "no es una url",
    "http://chat.whatsapp.com/abc",
    "https://example.com/abc",
    "https://chat.whatsapp.com.evil.test/abc",
    "https://chat.whatsapp.com/",
    "javascript:alert(1)",
  ])("invitación inválida (%s) cae a /contacto sin acción externa", (valor) => {
    expect(resolveCommunityAction(valor)).toEqual({
      href: "/contacto",
      label: "Contactar a C3",
      external: false,
    });
  });
});

describe("gettingStartedContent", () => {
  it("define título, introducción y los pasos de la guía", () => {
    expect(gettingStartedContent.title).toBe("Empieza en C3");
    expect(gettingStartedContent.intro).toContain("Competitive Coding Club");
    const ids = gettingStartedContent.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining(["que-puedes-encontrar", "primer-paso", "participar", "sin-experiencia"]),
    );
    for (const step of gettingStartedContent.steps) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.paragraphs.length).toBeGreaterThan(0);
    }
  });

  it("no afirma admisión, gratuidad, edad, frecuencia ni requisitos generales", () => {
    const texto = JSON.stringify(gettingStartedContent).toLowerCase();
    for (const prohibido of ["gratis", "gratuit", "sin costo", "años", "cada semana", "mensual", "semanal", "aprobación", "requisito general"]) {
      expect(texto).not.toContain(prohibido);
    }
    // Los requisitos se consultan por evento.
    expect(texto).toContain("requisitos de cada");
  });

  it("no usa voseo ni el término challenge", () => {
    const texto = JSON.stringify(gettingStartedContent);
    expect(texto).not.toMatch(/\b(vos|podés|tenés|querés|unite|escribinos)\b/i);
    expect(texto.toLowerCase()).not.toContain("challenge");
  });
});

describe("getGettingStartedFaq", () => {
  it("devuelve las dudas seleccionadas con la respuesta idéntica a faqItems", () => {
    const faqs = getGettingStartedFaq();
    expect(faqs.map((f) => f.question)).toEqual([...gettingStartedContent.faqQuestions]);
    for (const faq of faqs) {
      const fuente = faqItems.find((i) => i.question === faq.question);
      expect(fuente).toBeDefined();
      expect(faq.answer).toBe(fuente!.answer);
    }
  });

  it("cada pregunta referenciada existe en faqItems", () => {
    for (const q of gettingStartedContent.faqQuestions) {
      expect(faqItems.some((i) => i.question === q)).toBe(true);
    }
  });

  it("falla de forma explícita si se pide una pregunta inexistente", () => {
    expect(() => getGettingStartedFaq(["¿Pregunta inventada?"])).toThrow(/Pregunta inventada/);
  });
});
