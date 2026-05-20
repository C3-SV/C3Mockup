import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
