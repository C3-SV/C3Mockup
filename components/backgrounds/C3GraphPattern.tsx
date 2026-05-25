"use client";

import { getC3Intensity, getC3LineTheme, getC3MaskStyle, type C3BackgroundIntensity, type C3LineKey, type C3MaskEdge } from "./c3-background-theme";

type C3GraphPatternProps = {
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  className?: string;
  mask?: C3MaskEdge;
};

const graphNodes = [
  { x: 16, y: 26, r: 7 },
  { x: 28, y: 42, r: 5 },
  { x: 39, y: 18, r: 6 },
  { x: 56, y: 30, r: 8 },
  { x: 69, y: 54, r: 6 },
  { x: 78, y: 28, r: 5 },
  { x: 86, y: 48, r: 7 },
  { x: 60, y: 70, r: 5 },
  { x: 24, y: 68, r: 6 },
];

const graphLines = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [3, 7],
  [1, 8],
  [8, 3],
  [7, 6],
] as const;

export default function C3GraphPattern({
  line = "brand",
  intensity = "medium",
  animated = false,
  className = "",
  mask = "both",
}: C3GraphPatternProps) {
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
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${animated ? "c3-bg-graph-dash" : ""}`}>
        <defs>
          <linearGradient id={`c3-graph-${line}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.secondary} stopOpacity="0.15" />
            <stop offset="50%" stopColor={theme.primary} stopOpacity="0.55" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {graphLines.map(([from, to]) => {
          const start = graphNodes[from];
          const end = graphNodes[to];
          return (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={`url(#c3-graph-${line})`}
              strokeOpacity={scale.strokeOpacity}
              strokeWidth="0.8"
              strokeDasharray="0.8 3.4"
            />
          );
        })}

        {graphNodes.map((node, index) => (
          <g key={`${node.x}-${node.y}-${index}`}>
            <circle cx={node.x} cy={node.y} r={node.r + 1.5} fill={theme.glow} opacity="0.18" />
            <circle cx={node.x} cy={node.y} r={node.r} fill={index % 3 === 0 ? theme.primary : index % 3 === 1 ? theme.secondary : theme.accent} opacity="0.82" />
          </g>
        ))}

        <path
          d="M7 88C18 79 28 77 40 80C53 83 63 80 76 72C85 67 92 61 100 56"
          fill="none"
          stroke={`url(#c3-graph-${line})`}
          strokeOpacity="0.4"
          strokeWidth="0.9"
        />
      </svg>
    </div>
  );
}
