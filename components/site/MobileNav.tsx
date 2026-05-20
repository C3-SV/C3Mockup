"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Separator } from "@/components/ui/Separator";
import { CTAButton } from "@/components/site/CTAButton";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-c3-blanco-monocromatico.png"
              alt="Logo principal de C3"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <SheetTitle>{siteConfig.displayName}</SheetTitle>
              <SheetDescription>{siteConfig.tagline}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col gap-2">
          {[...siteConfig.nav, ...siteConfig.footerRoutes].map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="rounded-2xl px-3 py-3 text-sm font-medium text-white/80 hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <CTAButton href="/contacto">Participar con C3</CTAButton>
      </SheetContent>
    </Sheet>
  );
}
