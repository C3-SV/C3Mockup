import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { ecosystemNavigation, mainNavigation } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const socialLinks = [
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn de C3",
    icon: FaLinkedinIn,
  },
  {
    href: siteConfig.social.instagram,
    label: "Instagram de C3",
    icon: FaInstagram,
  },
  {
    href: siteConfig.social.tiktok,
    label: "TikTok de C3",
    icon: FaTiktok,
  },
];

const satelliteLinks = [
  {
    href: siteConfig.sites.copa,
    label: "Copa Salvadoreña de Programación",
  },
  {
    href: siteConfig.sites.hackathon,
    label: "Hackathon de Turismo Creativo I",
  },
];

export default function SiteFooter() {
  return (
    <footer className="section-divider bg-[#08111f] py-14 text-white/72">
      <div className="container-shell space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/12 bg-white/6 p-2">
                <Image
                  src="/brand/logo-c3-blanco-monocromatico.png"
                  alt="Logo principal de C3"
                  fill
                  sizes="56px"
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <p className="font-semibold text-white">{siteConfig.displayName}</p>
                <p className="text-sm text-white/56">Competitive Coding Club · El Salvador</p>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/64">
              Potenciar talento joven mediante experiencias de alto nivel que integran competencia,
              creación y conexión.
            </p>

            <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex text-sm font-medium text-white/82 hover:text-white">
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
              Navegación
            </p>
            <div className="grid gap-3 text-sm">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex w-fit rounded-md text-white/74 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
              Ecosistema
            </p>
            <div className="grid gap-3 text-sm">
              {ecosystemNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex w-fit rounded-md text-white/74 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex flex-wrap gap-3 text-sm">
            {satelliteLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-start gap-3 lg:justify-center">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/74 transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/10 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-sm text-white/52 lg:text-right">
            Construido para abrir camino al talento técnico joven en la región.
          </p>
        </div>
      </div>
    </footer>
  );
}
