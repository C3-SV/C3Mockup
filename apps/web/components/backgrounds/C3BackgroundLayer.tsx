"use client";

import C3DotPattern from "./C3DotPattern";
import C3GraphPattern from "./C3GraphPattern";
import C3GridPattern from "./C3GridPattern";
import C3OrbitalPattern from "./C3OrbitalPattern";
import C3Particles from "./C3Particles";
import {
  getC3Intensity,
  getC3LineTheme,
  type C3BackgroundIntensity,
  type C3BackgroundVariant,
  type C3LineKey,
  type C3MaskEdge,
} from "./c3-background-theme";

type C3BackgroundLayerProps = {
  variant: C3BackgroundVariant;
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  mask?: C3MaskEdge;
  className?: string;
};

export default function C3BackgroundLayer({
  variant,
  line = "brand",
  intensity = "medium",
  animated = false,
  mask = "both",
  className = "",
}: C3BackgroundLayerProps) {
  const theme = getC3LineTheme(line);
  const scale = getC3Intensity(intensity);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {variant === "glow" ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              opacity: scale.glowOpacity,
              backgroundImage: [
                `radial-gradient(circle at 18% 20%, ${theme.glow}, transparent 30%)`,
                `radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.08), transparent 34%)`,
                `radial-gradient(circle at 54% 82%, ${theme.glow}, transparent 38%)`,
              ].join(", "),
              WebkitMaskImage:
                mask === "none"
                  ? undefined
                  : mask === "top"
                    ? "linear-gradient(to bottom, transparent, black 18%, black 100%)"
                    : mask === "bottom"
                      ? "linear-gradient(to top, transparent, black 18%, black 100%)"
                      : mask === "both"
                        ? "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
                        : "radial-gradient(circle at center, black 46%, transparent 100%)",
              maskImage:
                mask === "none"
                  ? undefined
                  : mask === "top"
                    ? "linear-gradient(to bottom, transparent, black 18%, black 100%)"
                    : mask === "bottom"
                      ? "linear-gradient(to top, transparent, black 18%, black 100%)"
                      : mask === "both"
                        ? "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
                        : "radial-gradient(circle at center, black 46%, transparent 100%)",
            }}
          />
        </>
      ) : null}

      {variant === "dots" ? (
        <C3DotPattern line={line} intensity={intensity} animated={animated} mask={mask} />
      ) : null}
      {variant === "grid" ? (
        <C3GridPattern line={line} intensity={intensity} animated={animated} mask={mask} />
      ) : null}
      {variant === "orbit" ? (
        <C3OrbitalPattern line={line} intensity={intensity} animated={animated} mask={mask} />
      ) : null}
      {variant === "graph" ? (
        <C3GraphPattern line={line} intensity={intensity} animated={animated} mask={mask} />
      ) : null}
      {variant === "particles" ? (
        <C3Particles line={line} intensity={intensity} animated={animated} mask={mask} />
      ) : null}
    </div>
  );
}
