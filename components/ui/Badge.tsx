import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/10 text-white/80",
        teal: "border-c3-teal/30 bg-c3-teal/12 text-c3-teal",
        blue: "border-c3-blue/30 bg-c3-blue/15 text-blue-100",
        purple: "border-c3-purple/30 bg-c3-purple/15 text-purple-100",
        light: "border-c3-border bg-white text-c3-blue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
