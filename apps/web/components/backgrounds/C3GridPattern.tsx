"use client";

import type { CSSProperties } from "react";
import { getC3Intensity, getC3LineTheme, getC3MaskStyle, type C3BackgroundIntensity, type C3LineKey, type C3MaskEdge } from "./c3-background-theme";

type C3GridPatternProps = {
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  className?: string;
  mask?: C3MaskEdge;
  size?: number;
  opacity?: number;
};

export default function C3GridPattern({
  line = "brand",
  intensity = "medium",
  animated = false,
  className = "",
  mask = "both",
  size = 48,
  opacity,
}: C3GridPatternProps) {
  const theme = getC3LineTheme(line);
  const scale = getC3Intensity(intensity);
  const style = {
    opacity: opacity ?? scale.opacity,
    backgroundImage: [
      `linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
      `linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
      `radial-gradient(circle at 18% 18%, ${theme.glow}, transparent 28%)`,
      `radial-gradient(circle at 84% 14%, rgba(255, 255, 255, 0.06), transparent 32%)`,
    ].join(", "),
    backgroundSize: `${size}px ${size}px, ${size}px ${size}px, 100% 100%, 100% 100%`,
    backgroundPosition: "0 0, 0 0, 0 0, 0 0",
    ...getC3MaskStyle(mask),
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${animated ? "c3-bg-grid-pan" : ""} ${className}`}
      style={style}
    />
  );
}
