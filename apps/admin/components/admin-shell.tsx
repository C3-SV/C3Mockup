"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Button, cn } from "@c3/ui";
import { adminModules } from "@/lib/admin-navigation";
import type { AdminSession } from "@/lib/admin-types";
import { PageHeader, type BreadcrumbItem } from "./admin-primitives";

function isActiveRoute(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminTopbar(props: {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return <PageHeader {...props} />;
}

/** Área de contenido: ancho máximo y separación uniforme entre bloques. */
export function AdminMain({ children }: { children: ReactNode }) {
  return (
    <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6">{children}</div>
    </main>
  );
}

function SidebarContent({
  session,
  onNavigate,
  onSignOut,
}: {
  session: AdminSession;
  onNavigate?: () => void;
  onSignOut: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          C3
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">Panel administrativo</p>
          <p className="truncate text-xs text-muted">Competitive Coding Club</p>
        </div>
      </div>

      <nav aria-label="Principal" className="flex-1 space-y-1 p-3">
        {adminModules.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40",
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-subtle hover:text-ink",
              )}
            >
              <Icon className="shrink-0 text-base" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <div className="mb-2 min-w-0 px-3">
          <p className="truncate text-sm font-medium text-ink">{session.name || session.email}</p>
          {session.name ? <p className="truncate text-xs text-muted">{session.email}</p> : null}
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onSignOut}>
          <FiLogOut aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export function AdminShell({
  session,
  onSignOut,
  children,
}: {
  session: AdminSession;
  onSignOut: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <AdminShellFrame key={pathname} session={session} onSignOut={onSignOut}>
      {children}
    </AdminShellFrame>
  );
}

function AdminShellFrame({
  session,
  onSignOut,
  children,
}: {
  session: AdminSession;
  onSignOut: () => Promise<void>;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-surface lg:block">
        <SidebarContent session={session} onSignOut={onSignOut} />
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      ) : null}
      <aside
        inert={!mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-line bg-surface shadow-xl transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          session={session}
          onNavigate={() => setMobileOpen(false)}
          onSignOut={onSignOut}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink hover:bg-subtle"
            aria-label="Abrir menú"
          >
            <FiMenu aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-ink">Panel administrativo</span>
        </header>

        {children}
      </div>
    </div>
  );
}
