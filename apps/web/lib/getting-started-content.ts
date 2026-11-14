import { faqItems } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/**
 * Contenido de la guía «Empieza en C3» (docs/content/empieza-en-c3.md). Texto de propuesta sujeto a revisión
 * del responsable. No afirma admisión, gratuidad, edad, frecuencia ni requisitos generales.
 */
export type GettingStartedStep = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type GettingStartedContent = {
  title: string;
  intro: string;
  steps: GettingStartedStep[];
  faqQuestions: readonly string[];
};

export const gettingStartedContent: GettingStartedContent = {
  title: "Empieza en C3",
  intro:
    "C3 · Competitive Coding Club reúne talento técnico joven en El Salvador y la región. Esta guía te muestra qué puedes encontrar y cómo dar tu primer paso.",
  steps: [
    {
      id: "que-puedes-encontrar",
      title: "Qué puedes encontrar",
      paragraphs: [
        "Compite: programación competitiva, ICPC, entrenamientos y la Copa Salvadoreña de Programación.",
        "Crea: hackathons, prototipos, builders, software y proyectos reales.",
        "Conecta: comunidad, industria, mentoría y alianzas.",
      ],
    },
    {
      id: "primer-paso",
      title: "Tu primer paso: la comunidad",
      paragraphs: [
        "La comunidad de C3 está en WhatsApp. Es un buen lugar para conocer la siguiente actividad disponible.",
      ],
    },
    {
      id: "participar",
      title: "Cómo participar en una experiencia",
      paragraphs: [
        "Explora los eventos.",
        "Lee los requisitos de cada evento.",
        "Sigue su enlace de participación cuando exista.",
      ],
    },
    {
      id: "sin-experiencia",
      title: "Si todavía no hay una próxima experiencia",
      paragraphs: [
        "A veces no hay una experiencia abierta. Mientras tanto, puedes unirte a la comunidad, revisar las experiencias anteriores o escribirnos.",
      ],
    },
  ],
  faqQuestions: [
    "¿Qué es C3?",
    "¿C3 es solo programación competitiva?",
    "¿Quiénes pueden participar en C3?",
    "¿Cómo me uno o participo en C3?",
  ],
};

export type CommunityAction = {
  href: string;
  label: string;
  external: boolean;
};

const COMMUNITY_HOST = "chat.whatsapp.com";

const CONTACT_FALLBACK: CommunityAction = {
  href: "/contacto",
  label: "Contactar a C3",
  external: false,
};

/** Invitación válida: https en chat.whatsapp.com con código. Cualquier otra cosa cae a /contacto. */
export function resolveCommunityAction(inviteUrl: string | undefined): CommunityAction {
  const raw = inviteUrl?.trim();
  if (!raw) return { ...CONTACT_FALLBACK };
  try {
    const url = new URL(raw);
    const code = url.pathname.replace(/^\/+|\/+$/g, "");
    if (url.protocol === "https:" && url.hostname === COMMUNITY_HOST && code.length > 0) {
      return { href: raw, label: "Unirme a la comunidad", external: true };
    }
  } catch {
    // URL mal formada: se usa el contacto.
  }
  return { ...CONTACT_FALLBACK };
}

/** Respuestas de faqItems seleccionadas por pregunta exacta; nunca se copian. */
export function getGettingStartedFaq(
  questions: readonly string[] = gettingStartedContent.faqQuestions,
): ReadonlyArray<{ question: string; answer: string }> {
  return questions.map((question) => {
    const item = faqItems.find((i) => i.question === question);
    if (!item) {
      throw new Error(`Empieza en C3: la pregunta «${question}» no existe en faqItems.`);
    }
    return { question: item.question, answer: item.answer };
  });
}

export function getCommunityAction(): CommunityAction {
  return resolveCommunityAction(siteConfig.community.inviteUrl);
}
