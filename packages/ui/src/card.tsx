import type { ReactNode } from "react";
import { cn } from "./utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-[1.8rem] border border-[#d5deea] bg-white shadow-[0_12px_30px_rgba(15,32,62,0.08)]", className)}>
      {children}
    </div>
  );
}
