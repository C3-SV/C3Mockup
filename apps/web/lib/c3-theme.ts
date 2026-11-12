export type C3Context = "general" | "compite" | "crea" | "conecta";

export type C3Surface = "dark" | "light";

export type C3ButtonVariant = "featured" | "primary" | "secondary" | "text";

export type C3ContextTokens = {
  main: string;
  secondary: string;
  tertiary: string;
  glow: string;
  gradient: string;
  gradientCompact: string;
};

export const c3Palette = {
  ink: "#0F203E",
  inkSoft: "#101A31",
  surfaceLight: "#F4F7FB",
  surfaceLighter: "#F8FAFD",
  borderSoft: "#DDE6EF",
  compite: "#205298",
  crea: "#33BEAC",
  conecta: "#4F5BA9",
  white: "#FFFFFF",
} as const;

export const c3ContextTokens: Record<C3Context, C3ContextTokens> = {
  general: {
    main: c3Palette.crea,
    secondary: c3Palette.compite,
    tertiary: c3Palette.conecta,
    glow: "rgba(51, 190, 172, 0.32)",
    gradient: `linear-gradient(90deg, ${c3Palette.compite} 0%, ${c3Palette.crea} 50%, ${c3Palette.conecta} 100%)`,
    gradientCompact: `linear-gradient(90deg, ${c3Palette.crea} 0%, ${c3Palette.compite} 100%)`,
  },
  compite: {
    main: c3Palette.compite,
    secondary: "#2C519B",
    tertiary: c3Palette.conecta,
    glow: "rgba(32, 82, 152, 0.34)",
    gradient: `linear-gradient(90deg, ${c3Palette.compite} 0%, #2C519B 54%, ${c3Palette.conecta} 100%)`,
    gradientCompact: `linear-gradient(90deg, ${c3Palette.compite} 0%, #2C519B 100%)`,
  },
  crea: {
    main: c3Palette.crea,
    secondary: "#46B8A8",
    tertiary: c3Palette.compite,
    glow: "rgba(51, 190, 172, 0.34)",
    gradient: `linear-gradient(90deg, ${c3Palette.crea} 0%, #46B8A8 54%, ${c3Palette.compite} 100%)`,
    gradientCompact: `linear-gradient(90deg, ${c3Palette.crea} 0%, #46B8A8 100%)`,
  },
  conecta: {
    main: c3Palette.conecta,
    secondary: "#6D529E",
    tertiary: c3Palette.crea,
    glow: "rgba(79, 91, 169, 0.34)",
    gradient: `linear-gradient(90deg, ${c3Palette.conecta} 0%, #6D529E 54%, ${c3Palette.crea} 100%)`,
    gradientCompact: `linear-gradient(90deg, ${c3Palette.conecta} 0%, #6D529E 100%)`,
  },
};

export function getC3ContextTokens(context: C3Context) {
  return c3ContextTokens[context];
}

