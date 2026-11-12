import Link from "next/link";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { BrandMark } from "@/components/brand/BrandMark";
import { ecosystemNavigation, mainNavigation } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/**
 * Pie navy de cuatro columnas (DS §7.3). Mismo contenido que el pie actual del sitio: correo,
 * redes, navegacion principal, las tres lineas y los dos sitios hermanos. El DS trae titulos de
 * columna y lineas de marca («Fundado en octubre de 2024», «Hecho en El Salvador») que el sitio
 * no tiene; no se agregan sin decision del responsable.
 */
const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn de C3", icon: FaLinkedinIn },
  { href: siteConfig.social.instagram, label: "Instagram de C3", icon: FaInstagram },
  { href: siteConfig.social.tiktok, label: "TikTok de C3", icon: FaTiktok },
];

const satelliteLinks = [
  { href: siteConfig.sites.copa, label: "Copa Salvadoreña de Programación" },
  { href: siteConfig.sites.hackathon, label: "Hackathon de Turismo Creativo I" },
];

export default function SiteFooter() {
  return (
    <footer className="c3-footer">
      <div className="c3-frame">
        <div className="c3-footer__grid">
          <div className="c3-footer__brand">
            <BrandMark variant="footer" alt="" />
            <p>{siteConfig.displayName}</p>
            <p>Fundado el 24 de octubre de 2024.</p>
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            <div className="c3-footer__redes">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="c3-footer__red"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2>Navegación</h2>
            <ul>
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Ecosistema</h2>
            <ul>
              {ecosystemNavigation.map((line) => (
                <li key={line.href}>
                  <Link href={line.href}>{line.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Eventos</h2>
            <ul>
              {satelliteLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="c3-footer__base">
          <span>© 2026 C3 · Competitive Coding Club</span>
        </div>
      </div>
    </footer>
  );
}
