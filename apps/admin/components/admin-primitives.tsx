"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiChevronRight, FiInbox } from "react-icons/fi";
import { Badge, Button, Card } from "@c3/ui";
import type { AdminFeedback } from "@/lib/admin-types";
import { cn } from "@c3/ui";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition hover:text-[#205298]">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-[#0f203e]" : "")}>{item.label}</span>
            )}
            {!isLast ? <FiChevronRight className="text-[0.8rem]" /> : null}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  eyebrow,
  subtitle,
}: {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="rounded-[1.6rem] border border-[#d5deea] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,32,62,0.06)] sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Breadcrumbs items={breadcrumbs} />
          {eyebrow ? (
            <Badge className="w-fit border-[#dce7f4] bg-[#f4f7fb] text-[#205298]">{eyebrow}</Badge>
          ) : null}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f203e] sm:text-[2rem]">{title}</h1>
            {description ? (
              <p className="max-w-3xl text-sm leading-7 text-[#5c6a82]">{description}</p>
            ) : null}
            {subtitle ? <div className="text-sm text-[#364765]">{subtitle}</div> : null}
          </div>
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
      </div>
    </header>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-[#e7eef6]", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d5deea] bg-[#f8fbfe] text-[#205298]">
          {icon ?? <FiInbox className="text-xl" />}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#0f203e]">{title}</h3>
          <p className="max-w-2xl text-sm leading-7 text-[#5c6a82]">{description}</p>
        </div>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function ErrorState({
  title = "Algo salió mal",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#b42318]">
            <FiAlertCircle />
            Error
          </div>
          <h3 className="text-lg font-semibold text-[#0f203e]">{title}</h3>
          <p className="max-w-2xl text-sm leading-7 text-[#5c6a82]">{description}</p>
        </div>
        {onRetry ? (
          <Button variant="ghost" onClick={onRetry} className="border border-[#d5deea] bg-white text-[#0f203e]">
            Reintentar
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export function InlineFeedback({ feedback }: { feedback: AdminFeedback }) {
  if (feedback.kind === "idle" || !feedback.text) {
    return null;
  }

  const tone =
    feedback.kind === "success"
      ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#0f7a5f]"
      : "border-[#f5c2c7] bg-[#fff5f5] text-[#b42318]";

  const icon = feedback.kind === "success" ? <FiCheckCircle /> : <FiAlertCircle />;

  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", tone)} role="status" aria-live="polite">
      <span className="inline-flex items-center gap-2">
        {icon}
        {feedback.text}
      </span>
    </div>
  );
}
