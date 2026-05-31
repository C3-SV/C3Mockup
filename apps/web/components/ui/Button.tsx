import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200";
  const variantStyles =
    variant === "primary"
      ? "bg-[#33BEAC] text-[#0F203E] hover:-translate-y-0.5 hover:bg-[#46B8A8]"
      : "border border-white/28 bg-white/12 text-white hover:-translate-y-0.5 hover:bg-white/20";

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </Link>
  );
}
