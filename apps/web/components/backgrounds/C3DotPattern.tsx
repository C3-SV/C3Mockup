"use client";

import type { CSSProperties } from "react";
import { getC3Intensity, getC3LineTheme, getC3MaskStyle, type C3BackgroundIntensity, type C3LineKey, type C3MaskEdge } from "./c3-background-theme";

type C3DotPatternProps = {
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  className?: string;
  mask?: C3MaskEdge;
  size?: number;
  opacity?: number;
};

export default function C3DotPattern({
  line = "brand",
  intensity = "medium",
  animated = false,
  className = "",
  mask = "both",
  size = 34,
  opacity,
}: C3DotPatternProps) {
  const theme = getC3LineTheme(line);
  const scale = getC3Intensity(intensity);
  const style = {
    opacity: opacity ?? scale.opacity,
    backgroundImage: [
      `radial-gradient(circle at 1px 1px, ${theme.primary} 1px, transparent 0)`,
      `radial-gradient(circle at 50% 50%, ${theme.glow}, transparent 68%)`,
    ].join(", "),
    backgroundSize: `${size}px ${size}px, 100% 100%`,
    ...getC3MaskStyle(mask),
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${animated ? "c3-bg-drift" : ""} ${className}`}
      style={style}
    />
  );
}
