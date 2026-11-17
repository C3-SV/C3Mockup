import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./utils";

const fieldStyles =
  "w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-[3px] focus:ring-brand/15 disabled:opacity-60";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldStyles, "h-10", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldStyles, "h-10 pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldStyles, "min-h-24 py-2.5", className)} {...props} />;
}

/**
 * Campo con su etiqueta visible. La etiqueta envuelve al control, así que queda asociada sin ids.
 * El error va fuera de la etiqueta: quien usa el campo lo enlaza con aria-describedby = errorId.
 */
export function Field({
  label,
  hint,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-ink">{label}</span>
        {children}
      </label>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
