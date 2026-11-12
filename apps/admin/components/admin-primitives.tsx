"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiChevronRight, FiInbox } from "react-icons/fi";
import { Button, Card, cn } from "@c3/ui";
import type { AdminFeedback } from "@/lib/admin-types";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined} className={cn(isLast ? "text-ink" : "")}>
                {item.label}
              </span>
            )}
            {!isLast ? <FiChevronRight className="text-xs" aria-hidden="true" /> : null}
          </span>
        );
      })}
    </nav>
  );
}

/** Encabezado de página: título, descripción breve y acciones. Sin decoración. */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
}: {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-subtle", className)} aria-hidden="true" />;
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
    <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-subtle text-muted">
        {icon ?? <FiInbox className="text-lg" aria-hidden="true" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="max-w-md text-sm text-muted">{description}</p>
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </Card>
  );
}

export function ErrorState({
  title = "No se pudo cargar la información",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <FiAlertCircle className="mt-0.5 shrink-0 text-lg text-danger" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </Card>
  );
}

export function InlineFeedback({ feedback }: { feedback: AdminFeedback }) {
  if (feedback.kind === "idle" || !feedback.text) {
    return null;
  }

  const isSuccess = feedback.kind === "success";
  const Icon = isSuccess ? FiCheckCircle : FiAlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        isSuccess ? "border-success/25 bg-success-soft text-success" : "border-danger/25 bg-danger-soft text-danger",
      )}
    >
      <Icon className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{feedback.text}</span>
    </div>
  );
}
