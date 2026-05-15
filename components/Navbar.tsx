import Image from "next/image";
import Button from "./ui/Button";

const links = [
  { href: "#mision", label: "Misión" },
  { href: "#vision", label: "Visión" },
  { href: "#proyectos", label: "Proyectos" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0F203E]/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <a
          href="#inicio"
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
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button href="#proyectos" variant="secondary" className="px-5 py-2.5">
          Conoce más
        </Button>
      </div>
    </header>
  );
}
