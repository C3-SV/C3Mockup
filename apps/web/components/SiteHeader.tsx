import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/content";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#0F203E]/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link
          href="/"
          aria-label="Ir al inicio de C3"
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

        <nav aria-label="Navegación principal" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contacto"
          data-cta="Contactar"
          className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/12 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
        >
          Contactar
        </Link>
      </div>
    </header>
  );
}
