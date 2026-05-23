import Image from "next/image";
import Link from "next/link";
import { mainNavigation } from "@/lib/content";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0F203E]/92 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="flex items-center gap-3 rounded-2xl px-3 py-2"
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

        <nav className="hidden items-center gap-6 lg:flex">
          {mainNavigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contacto"
          className="inline-flex items-center justify-center rounded-full border border-white/28 bg-white/12 px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
        >
          Contactar
        </Link>
      </div>
    </header>
  );
}
