import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 | C3",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <PageShell ds>
      <section className="c3-frame c3-404">
        <div className="c3-404__texto">
          <p className="c3-etiqueta">Error 404</p>
          <h1>No encontramos esta página</h1>
          <p>Puede que el contenido ya no esté disponible o que la dirección esté mal escrita.</p>
          <div className="c3-404__acciones">
            <Button variant="primario" href="/eventos">
              Explorar eventos
            </Button>
            <Button variant="contorno" href="/">
              Volver al inicio
            </Button>
          </div>
          <p className="c3-404__pie">C3 · Compite. Crea. Conecta.</p>
        </div>
      </section>
    </PageShell>
  );
}
