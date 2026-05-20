import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/Button";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ButtonProps, "asChild">;

export function CTAButton({ href, children, external, ...props }: CTAButtonProps) {
  return (
    <Button asChild {...props}>
      <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {children}
        {external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </Link>
    </Button>
  );
}
