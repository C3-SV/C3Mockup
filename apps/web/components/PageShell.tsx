import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

type PageShellProps = {
  children: ReactNode;
  backgroundClassName?: string;
};

export default function PageShell({ children, backgroundClassName = "bg-[#0F203E]" }: PageShellProps) {
  return (
    <div className={`min-h-screen ${backgroundClassName}`}>
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
