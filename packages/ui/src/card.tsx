import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

/** Superficie de contenido: borde suave, sin sombra. El relleno lo pone quien la usa. */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface", className)} {...props}>
      {children}
    </div>
  );
}
