import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DecorativeGrid } from "@/components/site/DecorativeGrid";
import { NodePattern } from "@/components/site/NodePattern";

type GradientBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-white/10 bg-c3-dark/40", className)}>
      <DecorativeGrid />
      <NodePattern />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(51,190,172,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(79,91,169,0.2),transparent_30%),radial-gradient(circle_at_bottom,rgba(32,82,152,0.18),transparent_36%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
