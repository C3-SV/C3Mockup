"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FiChevronLeft,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiShield,
  FiX,
} from "react-icons/fi";
import { Button, Card, cn } from "@c3/ui";
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
  eyebrow?: string;
  subtitle?: ReactNode;
}) {
  return <PageHeader {...props} />;
}

export function AdminMain({ children }: { children: ReactNode }) {
  return <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>;
}

function SidebarFooter({
  session,
  collapsed,
  onSignOut,
}: {
  session: AdminSession;
  collapsed: boolean;
  onSignOut: () => Promise<void>;
}) {
  return (
    <div className="border-t border-[#dbe5ef] px-4 py-4">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-[#d5deea] bg-[#f8fbfe] p-3",
          collapsed ? "justify-center px-2" : "",
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#205298_0%,#33beac_100%)] text-sm font-bold text-white">
          {session.name?.[0]?.toUpperCase() || session.email?.[0]?.toUpperCase() || "C"}
        </div>
        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#0f203e]">{session.name}</p>
            <p className="truncate text-xs text-[#5c6a82]">{session.email}</p>
          </div>
        ) : null}
      </div>

      <Button
        variant="ghost"
        onClick={onSignOut}
        className={cn(
          "mt-3 w-full justify-start gap-3 rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] px-3 py-2.5 text-[#b42318] hover:bg-[#ffeaea]",
          collapsed ? "justify-center px-2" : "",
        )}
      >
        <FiLogOut />
        {!collapsed ? "Cerrar sesión" : null}
      </Button>
    </div>
  );
}

export function AdminSidebar({
  session,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
  onSignOut,
}: {
  session: AdminSession;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onSignOut: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar navegación"
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-30 bg-[#0f203e]/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[19rem] max-w-[88vw] flex-col border-r border-[#d5deea] bg-white shadow-[0_24px_64px_rgba(15,32,62,0.16)] transition-transform duration-200 lg:static lg:z-auto lg:shadow-none",
          collapsed ? "lg:w-[5.5rem]" : "lg:w-[18.5rem]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#dbe5ef] px-4 py-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1" onClick={onCloseMobile}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f203e_0%,#205298_55%,#33beac_100%)] text-white shadow-[0_10px_24px_rgba(32,82,152,0.18)]">
              <FiShield className="text-lg" />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5c6a82]">C3 Admin</p>
                <p className="truncate text-sm font-semibold text-[#0f203e]">Panel administrativo</p>
              </div>
            ) : null}
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#d5deea] bg-white text-[#0f203e] transition hover:border-[#205298] hover:bg-[#f4f7fb] lg:inline-flex"
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <FiChevronLeft className={cn("transition", collapsed ? "rotate-180" : "")} />
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5deea] bg-white text-[#0f203e] transition hover:border-[#205298] hover:bg-[#f4f7fb] lg:hidden"
              aria-label="Cerrar menú"
            >
              <FiX />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {adminModules.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#205298]/12",
                  active
                    ? "border-[#cfe0f6] bg-[#eef4ff] text-[#205298]"
                    : "border-transparent text-[#40506b] hover:border-[#d5deea] hover:bg-[#f8fbfe] hover:text-[#0f203e]",
                  collapsed ? "justify-center" : "",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="shrink-0 text-lg" />
                {!collapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
              </Link>
            );
          })}

          <Card className="mt-4 overflow-hidden border-[#d5deea] bg-[linear-gradient(180deg,#f8fbfe_0%,#eef4ff_100%)] p-4">
            <div className={cn("space-y-3", collapsed ? "text-center" : "")}>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#205298_0%,#33beac_100%)] text-white shadow-[0_10px_24px_rgba(32,82,152,0.14)]">
                <FiMoon />
              </div>
              {!collapsed ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c6a82]">
                    Arquitectura lista para crecer
                  </p>
                  <p className="text-sm leading-6 text-[#364765]">
                    El sidebar se alimenta desde una configuración central para agregar módulos sin rehacer el layout.
                  </p>
                </>
              ) : null}
            </div>
          </Card>
        </nav>

        <SidebarFooter session={session} collapsed={collapsed} onSignOut={onSignOut} />
      </aside>
    </>
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
  return <AdminShellFrame key={pathname} session={session} onSignOut={onSignOut}>{children}</AdminShellFrame>;
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("c3-admin-sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("c3-admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

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
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-[#0f203e] lg:flex">
      <AdminSidebar
        session={session}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onSignOut={onSignOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[#dbe5ef] bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5deea] bg-white text-[#0f203e] shadow-[0_6px_18px_rgba(15,32,62,0.05)]"
            aria-label="Abrir menú"
          >
            <FiMenu />
          </button>
          <div className="text-right">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#5c6a82]">C3 Admin</p>
            <p className="text-sm font-semibold text-[#0f203e]">Panel administrativo</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
