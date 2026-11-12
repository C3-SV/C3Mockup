import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PageShellProps = {
  children: ReactNode;
};

/**
 * Marco comun de las paginas publicas: cabecera, contenido en <main id="contenido"> y pie (DS §7).
 * No lleva la clase .c3-sitio: su regla de titulares (navy) pisaria el color heredado de las
 * secciones oscuras que aun no se migran. Cada pagina que se migre al DS agrega .c3-sitio a su
 * propio contenedor (Fase 4 en adelante).
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
