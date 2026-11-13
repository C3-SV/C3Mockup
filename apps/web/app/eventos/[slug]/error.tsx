"use client";

import { useEffect } from "react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/Button";

/**
 * Error recuperable de la ficha (spec §6): Firestore u otro fallo de infraestructura. No es un 404 y no muestra
 * el error interno; el detalle va a la consola del servidor/cliente con su `digest`.
 */
export default function EventDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell ds>
      <section className="c3-frame c3-404" aria-labelledby="evento-error">
        <div className="c3-404__texto">
          <p className="c3-etiqueta">Error temporal</p>
          <h1 id="evento-error">No pudimos cargar este evento</h1>
          <p>Ocurrió un problema de nuestro lado. Inténtalo de nuevo en unos segundos.</p>
          <div className="c3-404__acciones">
            <Button variant="primario" onClick={() => unstable_retry()}>
              Intentar de nuevo
            </Button>
            <Button variant="contorno" href="/eventos">
              Ver eventos
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
