import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { siteConfig } from "@/lib/site";

const socialLinks = [
  {
    href: siteConfig.social.instagram,
    label: "Instagram de C3",
    icon: FaInstagram,
  },
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn de C3",
    icon: FaLinkedinIn,
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
    <footer className="section-divider bg-white py-8">
      <div className="container-shell space-y-6 text-sm text-[#5c6a82]">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p>{siteConfig.displayName}</p>
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

        <div className="grid gap-2 text-xs text-[#31405c] md:grid-cols-2">
          {satelliteLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit rounded-md px-1 py-1 transition hover:text-[#205298]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
