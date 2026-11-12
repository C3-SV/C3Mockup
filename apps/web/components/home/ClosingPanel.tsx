import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/Button";

/** Llamado final (antes FinalCtaSection): panel navy con los textos actuales. */
export function ClosingPanel() {
  return (
    <section className="c3-cta" aria-labelledby="cierre">
      <div className="c3-frame">
        <div className="c3-cta__panel">
          <div className="c3-rings" aria-hidden="true">
            <span />
            <span />
            <span />
            <i />
            <i />
            <i />
          </div>
          <div className="c3-cta__text">
            <BrandMark variant="footer" alt="Logo C3 en llamado final" imageClassName="h-14 w-auto" />
            <span className="c3-etiqueta">Plataforma C3 · El Salvador</span>
            <h2 id="cierre">Construyamos la próxima generación técnica de la región.</h2>
            <p>C3 une competencia, creación y conexión para abrir más oportunidades al talento joven.</p>
          </div>
          <div className="c3-cta__action c3-actions">
            <Button href="/eventos" variant="primario">
              Participar en C3
            </Button>
            <Button href="/contacto" variant="blanco">
              Ser aliado
            </Button>
            <Link href="/contacto" className="c3-home-link c3-home-link--claro">
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
