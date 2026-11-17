"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { experienceKindLabels } from "@c3/config";
import { KindIcon } from "@/components/ds/KindIcon";
import { StatePill } from "@/components/ui/StatePill";
import { lineVisuals } from "@/lib/content";
import type { CatalogCardData } from "@/lib/ds/event-card";
import { ROTATION_INTERVAL_MS } from "@/lib/ds/featured-rotation";

/**
 * Destacado rotativo del home: un evento grande que rota entre los destacados vigentes.
 * Pausa: el botón la fija hasta reanudarla; el puntero (ratón) o el foco dentro del bloque la pausan
 * mientras dure; fuera de pantalla también se pausa. Con movimiento reducido no rota.
 * Sin JavaScript se ve el primer evento; los controles aparecen al montar.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY).matches
    : false;
}

const noopSubscribe = () => () => undefined;

export function FeaturedRotation({ items, intervalMs = ROTATION_INTERVAL_MS }: { items: CatalogCardData[]; intervalMs?: number }) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  // Verdadero solo en el navegador: sin JavaScript no se muestran los controles.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [offscreenPaused, setOffscreenPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setOffscreenPaused(!entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const active = Math.min(index, Math.max(count - 1, 0));
  const paused = manualPaused || hoverPaused || focusPaused || offscreenPaused;
  const canRotate = count > 1 && !reduceMotion && !paused;

  useEffect(() => {
    if (!canRotate) {
      return;
    }

    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => window.clearTimeout(timer);
  }, [canRotate, active, count, intervalMs]);

  if (count === 0) {
    return null;
  }

  function goTo(target: number) {
    const next = ((target % count) + count) % count;
    setIndex(next);
    setAnnouncement(`Diapositiva ${next + 1} de ${count}: ${items[next].title}`);
  }

  function handleControlsKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  }

  function handlePointer(event: PointerEvent<HTMLElement>, inside: boolean) {
    if (event.pointerType === "mouse") {
      setHoverPaused(inside);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusPaused(false);
    }
  }

  const showControls = mounted && count > 1;

  return (
    <section
      ref={rootRef}
      className="c3-spotlight"
      aria-roledescription="carrusel"
      aria-label="Eventos destacados"
      onPointerEnter={(event) => handlePointer(event, true)}
      onPointerLeave={(event) => handlePointer(event, false)}
      onFocus={() => setFocusPaused(true)}
      onBlur={handleBlur}
    >
      {items.map((card, position) => {
        const visual = lineVisuals[card.line];
        const kindLabel = card.kind ? experienceKindLabels[card.kind] : undefined;

        return (
          <article
            key={card.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${position + 1} de ${count}: ${card.title}`}
            hidden={position !== active}
            className={`c3-spotlight__slide c3-exp--${card.line}`}
          >
            <div className="c3-spotlight__media">
              {card.cover ? (
                <Image
                  src={card.cover.url}
                  alt={card.cover.alt}
                  fill
                  sizes="(min-width: 900px) 1040px, 100vw"
                  unoptimized
                  priority={position === 0}
                  className="c3-exp__cover"
                />
              ) : (
                <KindIcon kind={card.kind} className="c3-spotlight__icon" />
              )}
            </div>

            <div className="c3-spotlight__panel">
              <div className="c3-spotlight__meta">
                <span className="c3-spotlight__line">
                  <span className={`c3-dot c3-dot--${card.line}`} aria-hidden="true" />
                  {visual.name}
                </span>
                {kindLabel ? <span className="c3-spotlight__kind">{kindLabel}</span> : null}
                <span className="c3-spotlight__state">
                  <StatePill label={card.state.label} tone={card.state.tone} />
                </span>
              </div>

              <h3 className="c3-spotlight__title">{card.title}</h3>
              <p className="c3-spotlight__summary">{card.summary}</p>
              {card.detail ? <p className="c3-spotlight__detail">{card.detail}</p> : null}

              {card.external ? (
                <a className="c3-spotlight__cta" href={card.href} target="_blank" rel="noopener noreferrer">
                  {card.action} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> de {card.title}, se abre en una pestaña nueva</span>
                </a>
              ) : (
                <Link className="c3-spotlight__cta" href={card.href}>
                  {card.action} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> de {card.title}</span>
                </Link>
              )}
            </div>
          </article>
        );
      })}

      {showControls ? (
        <div className="c3-spotlight__controls" role="group" aria-label="Controles del carrusel" onKeyDown={handleControlsKey}>
          <button
            type="button"
            className="c3-spotlight__nav"
            aria-label="Evento destacado anterior"
            onClick={() => goTo(active - 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="c3-spotlight__dots">
            {items.map((card, position) => (
              <button
                key={card.id}
                type="button"
                className="c3-spotlight__dot"
                aria-label={`Mostrar evento ${position + 1} de ${count}: ${card.title}`}
                aria-current={position === active ? "true" : undefined}
                onClick={() => goTo(position)}
              />
            ))}
          </div>

          <button
            type="button"
            className="c3-spotlight__nav"
            aria-label="Evento destacado siguiente"
            onClick={() => goTo(active + 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <button type="button" className="c3-spotlight__pause" onClick={() => setManualPaused((current) => !current)}>
            {manualPaused ? "Reanudar" : "Pausar"}
          </button>
        </div>
      ) : null}

      {/* Solo cambia con acciones del usuario; la rotación automática no anuncia nada. */}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
