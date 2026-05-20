"use client";

import Image from "next/image";
import Link from "next/link";
import { lines } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { CTAButton } from "@/components/site/CTAButton";
import { Container } from "@/components/site/Container";
import { MobileNav } from "@/components/site/MobileNav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-c3-navy/85 backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="Ir al inicio" className="flex items-center gap-3">
          <Image
            src="/brand/logo-c3-blanco-monocromatico.png"
            alt="Logo principal de C3"
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
            priority
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">{siteConfig.name}</p>
            <p className="text-xs text-white/58">{siteConfig.tagline}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {siteConfig.nav.slice(0, 2).map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} className={cn(navigationMenuTriggerStyle())}>
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Líneas</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid min-w-[420px] gap-3 md:grid-cols-3">
                    {lines.map((line) => (
                      <li key={line.key}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={line.href}
                            className="block rounded-[1.25rem] border border-white/8 bg-white/5 p-4 hover:bg-white/8"
                          >
                            <p className="text-sm font-semibold text-white">{line.name}</p>
                            <p className="mt-2 text-sm leading-6 text-white/68">{line.description}</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {siteConfig.nav.slice(2).map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} className={cn(navigationMenuTriggerStyle())}>
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <CTAButton href="/contacto" variant="default" size="sm">
            Sé aliado
          </CTAButton>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
