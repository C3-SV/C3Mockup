import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonTone = "brand" | "blue" | "turquoise" | "purple" | "white" | "black";
type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

const baseClasses =
  "relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[1rem] border border-transparent text-sm font-semibold outline-none transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-300 will-change-transform focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const toneClasses: Record<ButtonTone, Record<ButtonVariant, string>> = {
  brand: {
    default:
      "bg-[linear-gradient(135deg,#205298_0%,#33BEAC_100%)] text-[#F8FAFD] shadow-[0_18px_40px_rgba(32,82,152,0.28)] hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-[0_26px_52px_rgba(32,82,152,0.38)] focus-visible:ring-[#33BEAC]/45 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-white/16 bg-white/6 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:border-[#33BEAC]/40 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(51,190,172,0.12),0_18px_36px_rgba(2,8,22,0.22)] focus-visible:ring-[#33BEAC]/35 active:scale-[0.985]",
    secondary:
      "border border-white/16 bg-white/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:border-[#33BEAC]/40 hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(51,190,172,0.12),0_18px_36px_rgba(2,8,22,0.22)] focus-visible:ring-[#33BEAC]/35 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-white/88 hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-white/8 hover:text-white focus-visible:ring-[#33BEAC]/25 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-white/88 underline-offset-4 hover:underline focus-visible:ring-[#33BEAC]/25",
  },
  blue: {
    default:
      "bg-[#205298] text-white shadow-[0_18px_40px_rgba(32,82,152,0.28)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#1B4B89] hover:shadow-[0_24px_48px_rgba(32,82,152,0.34)] focus-visible:ring-[#33BEAC]/45 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-[#205298]/35 bg-[#205298]/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:border-[#205298]/55 hover:bg-[#205298]/14 hover:shadow-[0_0_0_1px_rgba(32,82,152,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#205298]/35 active:scale-[0.985]",
    secondary:
      "border border-[#205298]/45 bg-[#205298]/10 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#205298]/18 hover:shadow-[0_0_0_1px_rgba(32,82,152,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#205298]/35 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-[#dbe8ff] hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-[#205298]/12 hover:text-white focus-visible:ring-[#205298]/25 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-[#a7c8ff] underline-offset-4 hover:underline focus-visible:ring-[#205298]/25",
  },
  turquoise: {
    default:
      "bg-[#33BEAC] text-[#0F203E] shadow-[0_18px_40px_rgba(51,190,172,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#28ad9d] hover:shadow-[0_24px_48px_rgba(51,190,172,0.32)] focus-visible:ring-[#33BEAC]/45 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-[#33BEAC]/40 bg-[#33BEAC]/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:border-[#33BEAC]/60 hover:bg-[#33BEAC]/14 hover:shadow-[0_0_0_1px_rgba(51,190,172,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#33BEAC]/35 active:scale-[0.985]",
    secondary:
      "border border-[#33BEAC]/40 bg-[#33BEAC]/10 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#33BEAC]/16 hover:shadow-[0_0_0_1px_rgba(51,190,172,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#33BEAC]/35 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-[#c7fff7] hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-[#33BEAC]/12 hover:text-white focus-visible:ring-[#33BEAC]/25 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-[#a5f3eb] underline-offset-4 hover:underline focus-visible:ring-[#33BEAC]/25",
  },
  purple: {
    default:
      "bg-[#4F5BA9] text-white shadow-[0_18px_40px_rgba(79,91,169,0.28)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#434d97] hover:shadow-[0_24px_48px_rgba(79,91,169,0.34)] focus-visible:ring-[#8aa0ff]/35 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-[#4F5BA9]/40 bg-[#4F5BA9]/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:border-[#4F5BA9]/60 hover:bg-[#4F5BA9]/14 hover:shadow-[0_0_0_1px_rgba(79,91,169,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#8aa0ff]/35 active:scale-[0.985]",
    secondary:
      "border border-[#4F5BA9]/40 bg-[#4F5BA9]/10 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#4F5BA9]/16 hover:shadow-[0_0_0_1px_rgba(79,91,169,0.18),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-[#8aa0ff]/35 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-[#dddffb] hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-[#4F5BA9]/12 hover:text-white focus-visible:ring-[#8aa0ff]/25 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-[#cfd4ff] underline-offset-4 hover:underline focus-visible:ring-[#8aa0ff]/25",
  },
  white: {
    default:
      "bg-white text-[#0F203E] shadow-[0_18px_40px_rgba(2,8,22,0.16)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#f4f7fb] hover:shadow-[0_24px_48px_rgba(2,8,22,0.2)] focus-visible:ring-white/55 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-white/18 bg-white/6 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-white/40 active:scale-[0.985]",
    secondary:
      "border border-white/18 bg-white/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/14 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-white/40 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-white/88 hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-white/8 hover:text-white focus-visible:ring-white/30 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-white/88 underline-offset-4 hover:underline focus-visible:ring-white/30",
  },
  black: {
    default:
      "bg-[#091122] text-white shadow-[0_18px_40px_rgba(2,8,22,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#111d35] hover:shadow-[0_24px_48px_rgba(2,8,22,0.32)] focus-visible:ring-white/30 active:scale-[0.985]",
    destructive:
      "bg-[#b42318] text-white shadow-[0_18px_36px_rgba(180,35,24,0.24)] hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-[#a21c12] hover:shadow-[0_22px_44px_rgba(180,35,24,0.28)] focus-visible:ring-[#ff8f7c]/35 active:scale-[0.985]",
    outline:
      "border border-white/14 bg-white/6 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-white/30 active:scale-[0.985]",
    secondary:
      "border border-white/14 bg-white/8 text-white hover:-translate-y-0.5 hover:scale-[1.015] hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_36px_rgba(2,8,22,0.2)] focus-visible:ring-white/30 active:scale-[0.985]",
    ghost:
      "border border-transparent bg-transparent text-white/88 hover:-translate-y-0.5 hover:scale-[1.012] hover:bg-white/8 hover:text-white focus-visible:ring-white/25 active:scale-[0.985]",
    link:
      "h-auto border border-transparent bg-transparent px-0 py-0 text-white/88 underline-offset-4 hover:underline focus-visible:ring-white/25",
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 rounded-[0.95rem] px-4 py-2 has-[>svg]:px-3",
  xs: "h-6 gap-1 rounded-[0.75rem] px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm: "h-8 gap-1.5 rounded-[0.9rem] px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-[1rem] px-6 has-[>svg]:px-4",
  icon: "size-9 rounded-[0.95rem]",
  "icon-xs": "size-6 rounded-[0.8rem] [&_svg:not([class*='size-'])]:size-3",
  "icon-sm": "size-8 rounded-[0.9rem]",
  "icon-lg": "size-10 rounded-[1rem]",
};

type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
};

function Button({
  className,
  variant = "default",
  tone = "brand",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn(baseClasses, sizeClasses[size], toneClasses[tone][variant], className)}
      {...props}
    />
  );
}

export { Button };
