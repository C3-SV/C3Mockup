export type C3LineKey = "brand" | "compite" | "crea" | "conecta";

export type C3BackgroundVariant = "dots" | "grid" | "orbit" | "graph" | "particles" | "glow";

export type C3BackgroundIntensity = "low" | "medium" | "high";

export type C3MaskEdge = "none" | "top" | "bottom" | "both" | "center";

export const c3BackgroundTheme: Record<
  C3LineKey,
  {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    glow: string;
  }
> = {
  brand: {
    primary: "#33BEAC",
    secondary: "#205298",
    accent: "#4F5BA9",
    background: "#0F203E",
    glow: "rgba(51, 190, 172, 0.35)",
  },
  compite: {
    primary: "#205298",
    secondary: "#2C519B",
    accent: "#4F5BA9",
    background: "#0F203E",
    glow: "rgba(32, 82, 152, 0.35)",
  },
  crea: {
    primary: "#33BEAC",
    secondary: "#46B8A8",
    accent: "#4F5BA9",
    background: "#0F203E",
    glow: "rgba(51, 190, 172, 0.35)",
  },
  conecta: {
    primary: "#4F5BA9",
    secondary: "#6D529E",
    accent: "#33BEAC",
    background: "#0F203E",
    glow: "rgba(79, 91, 169, 0.35)",
  },
};

const intensityScale: Record<
  C3BackgroundIntensity,
  {
    opacity: number;
    accentOpacity: number;
    glowOpacity: number;
    strokeOpacity: number;
    particleCount: number;
    scale: number;
  }
> = {
  low: {
    opacity: 0.26,
    accentOpacity: 0.08,
    glowOpacity: 0.42,
    strokeOpacity: 0.35,
    particleCount: 8,
    scale: 0.95,
  },
  medium: {
    opacity: 0.38,
    accentOpacity: 0.12,
    glowOpacity: 0.55,
    strokeOpacity: 0.5,
    particleCount: 12,
    scale: 1,
  },
  high: {
    opacity: 0.52,
    accentOpacity: 0.16,
    glowOpacity: 0.68,
    strokeOpacity: 0.68,
    particleCount: 16,
    scale: 1.05,
  },
};

export function getC3LineTheme(line: C3LineKey) {
  return c3BackgroundTheme[line];
}

export function getC3Intensity(intensity: C3BackgroundIntensity) {
  return intensityScale[intensity];
}

export function getC3MaskStyle(mask: C3MaskEdge = "none") {
  if (mask === "none") {
    return undefined;
  }

  const maskValue =
    mask === "top"
      ? "linear-gradient(to bottom, transparent, black 18%, black 100%)"
      : mask === "bottom"
        ? "linear-gradient(to top, transparent, black 18%, black 100%)"
        : mask === "both"
          ? "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
          : "radial-gradient(circle at center, black 46%, transparent 100%)";

  return {
    WebkitMaskImage: maskValue,
    maskImage: maskValue,
  } as const;
}
