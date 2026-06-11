import { cn } from "@/lib/utils";

type SectionBadgeVariant = "neutral" | "line" | "functional";
type SectionBadgeTone = "brand" | "blue" | "turquoise" | "purple";

type SectionBadgeProps = {
  label: string;
  variant?: SectionBadgeVariant;
  tone?: SectionBadgeTone;
  className?: string;
};

const toneStyles: Record<SectionBadgeTone, string> = {
  brand: "#33BEAC",
  blue: "#205298",
  turquoise: "#33BEAC",
  purple: "#4F5BA9",
};

export default function SectionBadge({
  label,
  variant = "neutral",
  tone = "brand",
  className,
}: SectionBadgeProps) {
  const accent = toneStyles[tone];

  if (variant === "line") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur-sm",
          className,
        )}
        style={{
          borderColor: `${accent}4a`,
          backgroundColor: `${accent}10`,
          color: accent,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        {label}
      </span>
    );
  }

  if (variant === "functional") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm",
          className,
        )}
        style={{
          borderColor: `${accent}3a`,
          backgroundColor: "#ffffff0d",
          color: "#f2f6ff",
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm",
        className,
      )}
      style={{
        borderColor: "rgba(255, 255, 255, 0.12)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "rgba(244, 248, 255, 0.78)",
      }}
    >
      {label}
    </span>
  );
}
