import type { CSSProperties } from "react";

type C3SectionTransitionHeight = "sm" | "md" | "lg";
type C3SectionTransitionVariant = "darkToDark" | "darkToLight" | "lightToDark";

type C3SectionTransitionProps = {
  from?: string;
  to?: string;
  height?: C3SectionTransitionHeight;
  variant?: C3SectionTransitionVariant;
  className?: string;
};

const heightClasses: Record<C3SectionTransitionHeight, string> = {
  sm: "h-12 md:h-16",
  md: "h-14 md:h-18",
  lg: "h-16 md:h-20",
};

const variantPresets: Record<
  C3SectionTransitionVariant,
  {
    from: string;
    via: string;
    to: string;
    glowTop: string;
    glowBottom: string;
  }
> = {
  darkToDark: {
    from: "#0F203E",
    via: "#112642",
    to: "#0F203E",
    glowTop: "rgba(51, 190, 172, 0.06)",
    glowBottom: "rgba(79, 91, 169, 0.07)",
  },
  darkToLight: {
    from: "#0F203E",
    via: "#132443",
    to: "#F4F7FB",
    glowTop: "rgba(51, 190, 172, 0.05)",
    glowBottom: "rgba(255, 255, 255, 0.14)",
  },
  lightToDark: {
    from: "#F4F7FB",
    via: "#E2EAF4",
    to: "#0F203E",
    glowTop: "rgba(255, 255, 255, 0.12)",
    glowBottom: "rgba(32, 82, 152, 0.06)",
  },
};

export default function C3SectionTransition({
  from,
  to,
  height = "md",
  variant = "darkToDark",
  className = "",
}: C3SectionTransitionProps) {
  const preset = variantPresets[variant];
  const style = {
    backgroundImage: [
      `linear-gradient(180deg, ${from ?? preset.from} 0%, ${preset.via} 52%, ${to ?? preset.to} 100%)`,
      `radial-gradient(circle at 40% 0%, ${preset.glowTop} 0%, transparent 42%)`,
      `radial-gradient(circle at 40% 100%, ${preset.glowBottom} 0%, transparent 42%)`,
    ].join(", "),
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
    maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
  } satisfies CSSProperties;

  return (
    <div aria-hidden="true" className={`pointer-events-none relative isolate overflow-hidden ${heightClasses[height]} ${className}`}>
      <div className="absolute inset-0" style={style} />
      <div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 28%, rgba(51, 190, 172, 0.03), transparent 20%), radial-gradient(circle at 50% 72%, rgba(32, 82, 152, 0.04), transparent 30%)",
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}
