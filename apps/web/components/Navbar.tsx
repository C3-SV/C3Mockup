"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ecosystemNavigation, headerNavigation } from "@/lib/content";
import { ScrollProgress } from "./ui/scroll-progress";

type NavbarProps = {
  showScrollProgress?: boolean;
};

export default function Navbar({ showScrollProgress = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const ecosystemCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearEcosystemTimer = () => {
    if (ecosystemCloseTimer.current) {
      clearTimeout(ecosystemCloseTimer.current);
      ecosystemCloseTimer.current = null;
    }
  };

  const openEcosystem = () => {
    clearEcosystemTimer();
    setIsEcosystemOpen(true);
  };

  const closeEcosystem = () => {
    clearEcosystemTimer();
    ecosystemCloseTimer.current = setTimeout(() => {
      setIsEcosystemOpen(false);
      ecosystemCloseTimer.current = null;
    }, 220);
  };

  const toggleEcosystem = () => {
    clearEcosystemTimer();
    setIsEcosystemOpen((open) => !open);
  };

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/8 bg-[#0F203E]/94 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4 md:py-5">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="flex items-center gap-3 rounded-2xl px-2 py-1"
        >
          <Image
            src="/brand/logo-c3-blanco-monocromatico.png"
            alt="Logo principal de C3"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {headerNavigation.map((item) =>
            "items" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={openEcosystem}
                onMouseLeave={closeEcosystem}
              >
                <button
                  type="button"
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/8 hover:text-white"
                  aria-expanded={isEcosystemOpen}
                  aria-haspopup="menu"
                  onClick={toggleEcosystem}
                >
                  {item.label}
                  <span className="ml-2 text-xs">▾</span>
                </button>

                <div
                  className={`absolute left-1/2 top-[calc(100%-1px)] w-[22rem] -translate-x-1/2 rounded-[1.5rem] border border-white/12 bg-[#102240] p-2 shadow-[0_18px_50px_rgba(2,8,22,0.42)] transition duration-200 ${
                    isEcosystemOpen
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-2 opacity-0"
                  }`}
                  role="menu"
                  onMouseEnter={openEcosystem}
                  onMouseLeave={closeEcosystem}
                >
                  {ecosystemNavigation.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-start justify-between gap-3 rounded-[1.1rem] px-4 py-3 transition hover:bg-white/6"
                      onClick={() => setIsEcosystemOpen(false)}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-white">{link.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-white/68">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold text-white lg:hidden"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          Menú
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-[#0F203E] lg:hidden">
          <div className="container-shell grid gap-5 py-5">
            <div className="grid gap-2">
              {headerNavigation.map((item) =>
                "items" in item ? (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/4 p-3">
                    <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      {item.label}
                    </p>
                    <div className="mt-2 grid gap-2">
                      {ecosystemNavigation.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-xl px-2 py-2 text-sm text-white/90 hover:bg-white/6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showScrollProgress ? <ScrollProgress tone="brand" className="z-[60]" /> : null}
    </header>
  );
}
