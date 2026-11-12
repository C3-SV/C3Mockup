import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PageShellProps = {
  children: ReactNode;
};

/** Marco comun de las paginas publicas: cabecera, contenido en <main id="contenido"> y pie (DS §7). */
export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="c3-sitio">
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </div>
  );
}
