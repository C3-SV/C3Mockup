import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./utils";

type HeaderLink = {
  href: string;
  label: string;
};

type HeaderProps = {
  brandHref: string;
  brandLabel: string;
  brandImageSrc?: string;
  links?: HeaderLink[];
  action?: ReactNode;
  className?: string;
};

export function Header({ brandHref, brandLabel, brandImageSrc, links = [], action, className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 border-b border-white/8 bg-[#0F203E]/95 backdrop-blur", className)}>
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href={brandHref} className="flex items-center gap-3 rounded-2xl px-2 py-1">
          {brandImageSrc ? (
            <Image src={brandImageSrc} alt={brandLabel} width={44} height={44} className="h-11 w-11 object-contain" priority />
          ) : null}
          <span className="text-sm font-semibold text-white">{brandLabel}</span>
        </Link>

        {links.length ? (
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {action}
      </div>
    </header>
  );
}
