"use client";

import { useState } from "react";
import type { CatalogCardData } from "@/lib/ds/event-card";
import { CatalogCard } from "@/components/ds/CatalogCard";

/** Destacadas paginadas (DS §7.16): tarjetas por pagina, sin carga por lotes. Los datos ya vienen del servidor. */
export function FeaturedGrid({ cards, pageSize = 6 }: { cards: CatalogCardData[]; pageSize?: number }) {
  const [page, setPage] = useState(1);

  if (cards.length === 0) {
    return <p className="c3-ayuda">Todavía no hay eventos publicados. Vuelve pronto.</p>;
  }

  const totalPages = Math.ceil(cards.length / pageSize);
  const current = Math.min(page, totalPages);
  const visible = cards.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      <div className="c3-featured__grid">
        {visible.map((card) => (
          <CatalogCard key={card.id} card={card} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="c3-pagination" aria-label="Paginación">
          <button
            type="button"
            className="c3-pagination__button"
            aria-label="Página anterior"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              className="c3-pagination__button"
              aria-label={`Página ${number}`}
              aria-current={number === current ? "page" : undefined}
              onClick={() => setPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className="c3-pagination__button"
            aria-label="Página siguiente"
            disabled={current === totalPages}
            onClick={() => setPage(current + 1)}
          >
            ›
          </button>
        </nav>
      ) : null}
    </>
  );
}
