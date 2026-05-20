import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/site/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-c3-navy/90 py-10">
      <Container className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-c3-blanco-monocromatico.png"
              alt="Logo principal de C3"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <div>
              <p className="font-semibold text-white">{siteConfig.displayName}</p>
              <p className="text-sm text-white/60">{siteConfig.tagline}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/68">{siteConfig.description}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">Explorar</h2>
          <div className="grid gap-2 text-sm text-white/68">
            {[...siteConfig.nav, ...siteConfig.footerRoutes].map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">Contacto</h2>
          <div className="grid gap-2 text-sm text-white/68">
            <Link href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </Link>
            <Link href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
              LinkedIn
            </Link>
            <Link href={siteConfig.sites.copa} target="_blank" rel="noreferrer" className="hover:text-white">
              Sitio oficial de la Copa
            </Link>
            <span className="text-white/45">Correo institucional: en actualización</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
