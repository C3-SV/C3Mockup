"use client";

import { getC3Intensity, getC3LineTheme, getC3MaskStyle, type C3BackgroundIntensity, type C3LineKey, type C3MaskEdge } from "./c3-background-theme";

type C3OrbitalPatternProps = {
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  className?: string;
  mask?: C3MaskEdge;
};

export default function C3OrbitalPattern({
  line = "brand",
  intensity = "medium",
  animated = true,
  className = "",
  mask = "both",
}: C3OrbitalPatternProps) {
  const theme = getC3LineTheme(line);
  const scale = getC3Intensity(intensity);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        opacity: scale.opacity,
        ...getC3MaskStyle(mask),
      }}
    >
      <svg
        viewBox="0 0 1440 920"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${animated ? "c3-bg-drift" : ""}`}
      >
        <defs>
          <linearGradient id={`c3-orbit-${line}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.secondary} stopOpacity="0.35" />
            <stop offset="52%" stopColor={theme.primary} stopOpacity="0.55" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.42" />
          </linearGradient>
          <radialGradient id={`c3-orbit-glow-${line}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.glow} stopOpacity="0.9" />
            <stop offset="100%" stopColor={theme.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="250" cy="220" rx="190" ry="132" fill="none" stroke={`url(#c3-orbit-${line})`} strokeOpacity={scale.strokeOpacity} strokeWidth="2" />
        <ellipse cx="1090" cy="180" rx="220" ry="146" fill="none" stroke={`url(#c3-orbit-${line})`} strokeOpacity={scale.strokeOpacity} strokeWidth="1.6" strokeDasharray="11 14" />
        <path
          d="M180 740C330 640 438 642 560 716C648 769 745 772 878 707C983 656 1088 633 1290 700"
          fill="none"
          stroke={`url(#c3-orbit-${line})`}
          strokeOpacity={scale.strokeOpacity}
          strokeWidth="2"
        />
        <path
          d="M100 610C268 520 364 515 498 567C620 615 744 610 880 548C1035 478 1170 472 1380 548"
          fill="none"
          stroke={theme.glow}
          strokeOpacity={0.55}
          strokeWidth="1.5"
        />
        <circle cx="300" cy="206" r="118" fill={`url(#c3-orbit-glow-${line})`} opacity={scale.glowOpacity} />
        <circle cx="1110" cy="190" r="136" fill={`url(#c3-orbit-glow-${line})`} opacity={scale.glowOpacity} />
        <circle cx="716" cy="632" r="150" fill={`url(#c3-orbit-glow-${line})`} opacity={scale.glowOpacity * 0.85} />
        <path
          d="M585 290a86 86 0 0 1 170 0"
          fill="none"
          stroke={`url(#c3-orbit-${line})`}
          strokeOpacity={0.5}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M690 150a160 160 0 0 1 0 320"
          fill="none"
          stroke={`url(#c3-orbit-${line})`}
          strokeOpacity={0.3}
          strokeWidth="1.5"
          strokeDasharray="4 14"
        />
      </svg>
    </div>
  );
}
