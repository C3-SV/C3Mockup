import Link from "next/link";
import { HomeOrbit } from "@/components/ds/HomeOrbit";
import { Button } from "@/components/ui/Button";

/** Hero de la home (DS §7.14): texto a la izquierda y la órbita del símbolo a la derecha. Textos actuales. */
export function Hero() {
  return (
    <section className="c3-hero">
      <div className="c3-frame c3-hero__grid">
        <div className="c3-hero__text">
          <h1>C3 desarrolla talento técnico joven a través de competencia, creación y conexión.</h1>
          <p className="c3-lead">
            Competitive Coding Club conecta programación competitiva, hackathons, comunidad e industria para abrir
            oportunidades reales a la próxima generación técnica de El Salvador y la región.
          </p>
          <div className="c3-actions">
            <Button href="/eventos" variant="primario">
              Explorar eventos
            </Button>
            <Button href="/contacto" variant="contorno">
              Ser aliado
            </Button>
            <Link href="/que-es-c3" className="c3-home-link">
              Conocer C3
            </Link>
          </div>
        </div>
        <HomeOrbit />
      </div>
    </section>
  );
}
