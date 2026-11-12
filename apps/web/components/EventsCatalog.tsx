"use client";

import { useMemo, useState } from "react";
import { FeaturedGrid } from "@/components/ds/FeaturedGrid";
import { toCatalogCard } from "@/lib/ds/event-card";
import { filterEvents, type AreaFilter, type EstadoFilter } from "@/lib/ds/event-filters";
import type { EventItem, LineKey } from "@c3/config";

type EventsCatalogProps = {
  initialEvents: EventItem[];
};

const areaOptions: { key: AreaFilter; label: string; line?: LineKey }[] = [
  { key: "todas", label: "Todas" },
  { key: "compite", label: "Compite", line: "compite" },
  { key: "crea", label: "Crea", line: "crea" },
  { key: "conecta", label: "Conecta", line: "conecta" },
];

const estadoOptions: { key: EstadoFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "proximos", label: "Próximos" },
  { key: "concluidos", label: "Concluidos" },
];

/**
 * Catálogo de /eventos (Tarea 6.1): dos grupos de filtros (área y estado) con aria-pressed y las tarjetas
 * paginadas de 6 (FeaturedGrid). Al cambiar un filtro, la paginación vuelve a la primera página (la clave
 * reinicia FeaturedGrid).
 */
export default function EventsCatalog({ initialEvents }: EventsCatalogProps) {
  const [area, setArea] = useState<AreaFilter>("todas");
  const [estado, setEstado] = useState<EstadoFilter>("todos");
  const [now] = useState(() => new Date());

  const cards = useMemo(() => initialEvents.map((event) => toCatalogCard(event)), [initialEvents]);
  const visible = useMemo(() => filterEvents(cards, { area, estado }, now), [cards, area, estado, now]);

  return (
    <>
      <div className="c3-filtros">
        <div role="group" aria-labelledby="filtro-area" className="c3-filtros__grupo">
          <span id="filtro-area" className="c3-filtros__etiqueta">
            Área
          </span>
          {areaOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className="c3-filtro"
              aria-pressed={area === option.key}
              onClick={() => setArea(option.key)}
            >
              {option.line ? <span className={`c3-dot c3-dot--${option.line}`} aria-hidden="true" /> : null}
              {option.label}
            </button>
          ))}
        </div>

        <div role="group" aria-labelledby="filtro-estado" className="c3-filtros__grupo">
          <span id="filtro-estado" className="c3-filtros__etiqueta">
            Estado
          </span>
          {estadoOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className="c3-filtro"
              aria-pressed={estado === option.key}
              onClick={() => setEstado(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <FeaturedGrid
          key={`${area}-${estado}`}
          cards={visible}
          emptyMessage={initialEvents.length ? "No hay eventos con estos filtros." : undefined}
        />
      </div>
    </>
  );
}
