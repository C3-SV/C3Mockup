import { cn } from "@/lib/utils";

type NodePatternProps = {
  className?: string;
};

export function NodePattern({ className }: NodePatternProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute left-[8%] top-16 h-3 w-3 rounded-full bg-c3-teal/60 shadow-[0_0_32px_rgba(51,190,172,0.35)]" />
      <div className="absolute left-[12%] top-24 h-px w-28 bg-gradient-to-r from-c3-teal/70 to-transparent" />
      <div className="absolute right-[10%] top-20 h-3 w-3 rounded-full bg-c3-purple/60 shadow-[0_0_32px_rgba(79,91,169,0.4)]" />
      <div className="absolute right-[16%] top-28 h-px w-24 bg-gradient-to-l from-c3-purple/70 to-transparent" />
      <div className="absolute bottom-16 left-[18%] h-2.5 w-2.5 rounded-full bg-c3-blue/70" />
      <div className="absolute bottom-20 left-[18%] h-24 w-px bg-gradient-to-b from-c3-blue/60 to-transparent" />
    </div>
  );
}
