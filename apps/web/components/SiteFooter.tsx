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
    <footer className="section-divider bg-white py-10">
      <div className="container-shell space-y-7 text-sm text-[#5c6a82]">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-[#0F203E]">{siteConfig.displayName}</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-xs hover:text-[#205298]">
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5c6a82]/30 text-[#5c6a82] transition hover:border-[#5c6a82]/50 hover:text-[#0F203E]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-wrap gap-3 text-xs">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#205298]">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-2 text-xs text-[#31405c] sm:grid-cols-3">
            {ecosystemNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex w-fit rounded-md transition hover:text-[#205298]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-2 text-xs text-[#31405c]">
            {satelliteLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-md transition hover:text-[#205298]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
