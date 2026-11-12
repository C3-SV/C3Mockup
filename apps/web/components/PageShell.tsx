import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PageShellProps = {
  children: ReactNode;
  /**
   * true en las páginas ya migradas al DS: agrega .c3-sitio (tipografía y color de titulares del DS).
   * Las páginas sin migrar no lo llevan: su regla de titulares pisaría el color heredado de sus
   * secciones oscuras.
   */
  ds?: boolean;
};

/** Marco común de las páginas públicas: cabecera, contenido en <main id="contenido"> y pie (DS §7). */
export default function PageShell({ children, ds = false }: PageShellProps) {
  return (
    <div className={ds ? "c3-sitio" : "flex min-h-screen flex-col"}>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
