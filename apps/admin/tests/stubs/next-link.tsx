import type { AnchorHTMLAttributes } from "react";

/**
 * Sustituto de next/link para las pruebas de componentes: un enlace simple. Los componentes que se prueban aquí no
 * navegan; así las pruebas no dependen del enrutador de Next ni de que `next` esté completo en el entorno.
 */
export default function Link({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
