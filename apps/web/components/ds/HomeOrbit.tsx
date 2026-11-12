"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeLines, type HomeLineKey } from "@/lib/content";

/** Tiempo para pasar el puntero del punto a la burbuja sin que se cierre (DS §7.13). */
const HIDE_DELAY_MS = 160;

/**
 * Símbolo de C3 en órbita: los dos anillos giran (con movimiento reducido se quedan quietos, en CSS).
 * Cada punto del símbolo abre una burbuja con el texto de su línea. Se abre con foco, puntero o clic,
 * y se cierra con Escape o al salir.
 */
export function HomeOrbit() {
  const [active, setActive] = useState<HomeLineKey | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const show = (key: HomeLineKey) => {
    cancelHide();
    setActive(key);
  };

  const scheduleHide = () => {
    cancelHide();
    hideTimer.current = setTimeout(() => {
      setActive(null);
      hideTimer.current = null;
    }, HIDE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const line = active ? homeLines.find((item) => item.key === active) : undefined;

  return (
    <div
      className="c3-orbit-visual"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          cancelHide();
          setActive(null);
        }
      }}
    >
      <div className="c3-orbit">
        <span className="c3-orbit__ring c3-orbit__ring--outer" aria-hidden="true" />
        <span className="c3-orbit__ring c3-orbit__ring--inner" aria-hidden="true" />
        <span className="c3-orbit__spin c3-orbit__spin--outer" aria-hidden="true">
          <span className="c3-orbit__satellite" />
          <span className="c3-orbit__satellite c3-orbit__satellite--bottom c3-orbit__satellite--compite" />
        </span>
        <span className="c3-orbit__spin c3-orbit__spin--inner" aria-hidden="true">
          <span className="c3-orbit__satellite c3-orbit__satellite--bottom c3-orbit__satellite--crea" />
        </span>
        <div className="c3-orbit__mark">
          <Image src="/brand/c3/c3-symbol.png" alt="" width={520} height={540} priority />
          {homeLines.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`c3-orbit__hotspot c3-orbit__hotspot--${item.key}`}
              aria-label={item.name}
              aria-pressed={active === item.key}
              aria-controls="c3-orbit-bubble"
              onMouseEnter={() => show(item.key)}
              onFocus={() => show(item.key)}
              onClick={() => show(item.key)}
              onMouseLeave={scheduleHide}
              onBlur={scheduleHide}
            />
          ))}
        </div>
      </div>

      <div
        className="c3-bubble"
        id="c3-orbit-bubble"
        aria-live="polite"
        hidden={!line}
        onMouseEnter={cancelHide}
        onFocus={cancelHide}
        onMouseLeave={scheduleHide}
        onBlur={scheduleHide}
      >
        {line ? (
          <>
            <h3>{line.name}</h3>
            <p>{line.description}</p>
            <Link href={line.href}>
              Conocer {line.name} <span aria-hidden="true">↗</span>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
