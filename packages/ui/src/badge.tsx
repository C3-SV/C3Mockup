import type { ReactNode } from "react";
import { cn } from "./utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#4a5b77]",
        className,
      )}
    >
      {children}
    </span>
  );
}
