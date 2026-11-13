"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/Button";
import { ecosystemNavigation, headerNavigation } from "@/lib/content";

/**
 * Cabecera publica (DS §7.1). Mismos enlaces y textos que el sitio actual (lib/content):
 * Qué es C3, Ecosistema (Compite, Crea, Conecta), Eventos, FAQ y Contacto. El logo lleva al inicio.
 * Contacto pasa a ser la accion primaria del DS, no un enlace mas de la lista.
 */
const CONTACT_HREF = "/contacto";
const navItems = headerNavigation.filter((item) => !("href" in item && item.href === CONTACT_HREF));

export default function SiteHeader() {
  const pathname = usePathname();
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const ecosystemButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const ecosystemId = useId();
  const menuId = useId();

  // Escape cierra lo abierto y devuelve el foco a su disparador; un clic fuera cierra Ecosistema.
  useEffect(() => {
    if (!ecosystemOpen && !menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (ecosystemRef.current && !ecosystemRef.current.contains(event.target as Node)) {
        setEcosystemOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (ecosystemOpen) {
        setEcosystemOpen(false);
        ecosystemButton.current?.focus();
      }
      if (menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ecosystemOpen, menuOpen]);

  const isCurrent = (href: string) => (pathname === href ? "page" : undefined);
  const closeMenus = () => {
    setEcosystemOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="c3-site-header">
      <div className="c3-frame c3-site-header__row">
        <Link href="/" aria-label="Ir al inicio" className="c3-site-brand inline-flex items-center" onClick={closeMenus}>
          <BrandMark variant="header" alt="Logo principal de C3" imageClassName="h-[30px] w-auto" priority />
        </Link>

        <nav className="c3-site-nav" aria-label="Principal">
          {navItems.map((item) =>
            "items" in item ? (
              <div key={item.label} className="c3-dropdown" ref={ecosystemRef}>
                <button
                  ref={ecosystemButton}
                  type="button"
                  className="c3-site-link"
                  aria-expanded={ecosystemOpen}
                  aria-controls={ecosystemId}
                  onClick={() => setEcosystemOpen((open) => !open)}
                >
                  {item.label}
                  <span className="c3-chevron" aria-hidden="true" />
                </button>
                <div id={ecosystemId} className="c3-dropdown__panel" hidden={!ecosystemOpen}>
                  {ecosystemNavigation.map((line) => (
                    <Link
                      key={line.href}
                      href={line.href}
                      aria-current={isCurrent(line.href)}
                      onClick={closeMenus}
                    >
                      <span className={`c3-dot c3-dot--${line.label.toLowerCase()}`} aria-hidden="true" />
                      <b>{line.label}</b>
                      <small>{line.description}</small>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="c3-site-link"
                aria-current={isCurrent(item.href)}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="c3-site-actions">
          <Button href={CONTACT_HREF} onClick={closeMenus}>
            Contacto
          </Button>
        </div>

        <button
          ref={menuButton}
          type="button"
          className="c3-site-menu-button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="c3-site-menu-button__icon" aria-hidden="true" />
          Menú
        </button>
      </div>

      <div id={menuId} className="c3-site-mobile-panel" hidden={!menuOpen}>
        <div className="c3-frame">
          {navItems.map((item) =>
            "items" in item ? (
              <div key={item.label}>
                <p className="c3-site-mobile-panel__group">{item.label}</p>
                {ecosystemNavigation.map((line) => (
                  <Link key={line.href} href={line.href} aria-current={isCurrent(line.href)} onClick={closeMenus}>
                    {line.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} aria-current={isCurrent(item.href)} onClick={closeMenus}>
                {item.label}
              </Link>
            ),
          )}
          <div className="c3-site-mobile-panel__buttons">
            <Button href={CONTACT_HREF} onClick={closeMenus}>
              Contacto
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
