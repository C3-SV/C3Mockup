import { cn } from "@/lib/utils";

type DecorativeGridProps = {
  className?: string;
};

export function DecorativeGrid({ className }: DecorativeGridProps) {
  return <div aria-hidden="true" className={cn("surface-grid absolute inset-0 opacity-30", className)} />;
}
