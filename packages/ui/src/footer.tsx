import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./utils";

type FooterColumn = {
  title?: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
};

type FooterProps = {
  brand: string;
  description?: string;
  columns?: FooterColumn[];
  action?: ReactNode;
  className?: string;
};

export function Footer({ brand, description, columns = [], action, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-[#d5deea] bg-white py-10 text-sm text-[#5c6a82]", className)}>
      <div className="container-shell space-y-7">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <p className="font-semibold text-[#0F203E]">{brand}</p>
            {description ? <p className="max-w-2xl text-xs leading-6 text-[#5c6a82]">{description}</p> : null}
          </div>
          {action}
        </div>

        {columns.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {columns.map((column, index) => (
              <div key={`${column.title ?? "col"}-${index}`} className="grid gap-2 text-xs text-[#31405c]">
                {column.title ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5c6a82]">{column.title}</p> : null}
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="inline-flex w-fit rounded-md transition hover:text-[#205298]">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
