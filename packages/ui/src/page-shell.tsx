import type { ReactNode } from "react";
import { cn } from "./utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("min-h-screen", className)}>{children}</div>;
}
