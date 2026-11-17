# Plan: fotos fuera de la memoria y host libre para imágenes (admin)

- **Fecha:** 2026-11-17 · **Estado:** T1–T6 implementadas en `codex/preparacion-motion` (sin commit); e2e de Playwright pendiente (requiere emulador de Firestore) · **Alcance:** `packages/config`, `apps/admin`, `apps/web` (solo render de la ficha), documentación.
- **Decisiones que cambian:** ADR-0017 (nuevo), que amplía ADR-0014 (ficha por edición) y reemplaza la regla de host de imágenes de ADR-0005 para la galería y las portadas.
- **Alcance:** este plan deja el modelo y el admin listos para fotos por enlace. La subida de archivos (firma, registro, reemplazo) **no** entra aquí.

## 1. Qué cambia y por qué

1. **Host libre para imágenes.** La regla «solo hosts de C3» bloquea enlaces válidos de servicios externos. Se acepta cualquier URL `https://` absoluta sin credenciales ni caracteres de control, de hasta 2048 caracteres. Se mantiene todo lo demás: sin `http:`, sin credenciales, sin rutas relativas para imágenes, sin `javascript:` ni `data:`.
2. **Fotos fuera de la memoria.** Hoy `memory.gallery` obliga a tener memoria para subir fotos. Una foto o arte puede existir antes del evento, así que la galería pasa a `page.gallery`, al nivel de la ficha. La memoria conserva solo texto de cierre (resumen, aprendizajes, resultados, proyectos).
3. **Límite de galería: 20 por edición**, según la decisión del responsable (17-nov-2026). Sustituye el 12 de la guía editorial (§4).
4. **Publicación.** La galería sigue a la ficha: se ve cuando la ficha está publicada, sin necesidad de memoria ni de que la edición haya terminado. Sin `rightsConfirmed` no se publica ninguna foto (guía §3).

## 2. Modelo de datos

```text
EventPage {
  ...
  gallery?: EventPageImage[]      // nuevo, máx. 20
  memory?: EventMemory            // sin gallery
}
EventPageImage = { url: string; alt: string; caption?: string; rightsConfirmed: true }
PublicEventPage.gallery?: { url, alt, caption? }[]   // sin rightsConfirmed
```

- **Lectura de datos guardados.** Si un documento trae `memory.gallery` y no trae `gallery` de nivel superior, se toma como `gallery` (fallback de lectura). Así no se pierde ninguna foto que ya esté en Firestore. Una prueba lo fija. Al guardar, la foto se escribe en el nivel nuevo y `memory.gallery` desaparece.
- `documentBytes` sigue con 500 KiB. Veinte entradas con URL de 2048 y alt de 160 caben de sobra.

## 3. Tareas (TDD: prueba antes del cambio)

**T1. Host libre (`packages/config`).**
- Pruebas que fallan primero: `https://evil.example/x.png` y `https://c3.com.sv.evil.example/x.png` ya son válidas para imagen de galería y portada; `http:`, credenciales, espacios, `ftp:` y rutas relativas siguen siendo errores.
- Cambio: `readImageUrl` (event-page.ts) y `normalizeEventCover` (events.ts) validan con `checkLinkUrl` + `https:`. Se elimina `C3_HOST`.
- Revisar que la web renderiza cualquier host sin `next/image` optimizado (`unoptimized` en `CatalogCard`, `FeaturedRotation`, `EventDetail`). Si algún render optimizado depende de `remotePatterns`, se marca como bloqueo.

**T2. Galería a nivel de ficha (`packages/config`).**
- Pruebas primero: `page.gallery` acepta 20 y rechaza 21; `memory.gallery` ya no existe en el tipo; el fallback lee `memory.gallery` antiguo; la proyección pública omite `rightsConfirmed`; una ficha en borrador no proyecta galería; una memoria sin fotos es válida.
- Cambio: tipos, `EVENT_PAGE_LIMITS.galleryItems = 20`, `normalizePage` lee `gallery` (con fallback), `projectPublicEventPage` la proyecta con independencia de la memoria.

**T3. Render público (`apps/web`).**
- Pruebas primero (`EventDetail.test.tsx`): la sección «Galería» aparece con ficha publicada aunque no haya memoria; sin fotos no aparece; no se muestran fotos sin permiso en borrador.
- Cambio: `EventDetail` muestra la galería desde `page.gallery`, entre «Información práctica» y «Memoria de la edición». Se quita de `Memory`.
- Actualizar fixtures y e2e (`apps/web/e2e/event-detail.spec.ts`) que usan `memory.gallery`.

**T4. Admin.**
- Pruebas primero (`admin-event-page-fields.test.tsx`, `event-draft.test.ts`, `event-page-repository.test.ts`): el borrador tiene `gallery` en la ficha; el payload lleva `page.gallery`; la sección «Fotos» aparece aunque no haya memoria; añadir una foto no crea memoria; el texto de ayuda ya no dice «añade primero la memoria».
- Cambio: `EventPageDraft.gallery` (tipo, normalización y payload), `EventMemoryDraft` sin `gallery`, grupo «Fotos» al nivel de ficha con URL libre, alt obligatorio, pie opcional y confirmación de derechos. Quitar el mensaje de memoria.
- Texto de ayuda: «Imágenes en cualquier host por https. Desde aquí no se suben archivos: pega el enlace de la imagen.»

**T5. Documentación.**
- ADR-0017 (nuevo): fotos fuera de la memoria, host libre, límite 20. Enlaza con ADR-0014 y ADR-0005.
- `PRODUCT.md` regla 4: portadas e imágenes de cualquier host por https con texto alternativo.
- `docs/content/eventos/guia-editorial.md`: §2 (la galería sale de la memoria), §3 (fila «Fotos»), §4 (galería: 20).
- `docs/decisions/README.md`: índice.

**T6. Verificación (AGENTS.md §5).**
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test` en `packages/config` (vía web/admin), `apps/admin` y `apps/web`. Pegar la salida real en el cierre.
- Playwright y axe de `EventDetail` a 390 y 1280 px si el entorno lo permite. Si no, se reporta como no verificado.

## 4. Fuera de alcance (no se toca)

- Subida de archivos, firma de un proveedor de imágenes, registro de medios y reconciliación.
- Foto del equipo en Cloudinary (`apps/web/lib/content.ts:147`).
- Diseño visual del admin más allá de los campos de fotos.

## 5. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Documentos en Firestore con `memory.gallery` | Fallback de lectura (T2) y prueba. Si la producción tiene fotos, no se pierden. |
| Imágenes de hosts arbitrarios fallan en la web | Render sin optimizar (ya es así). Verificado en T1. |
| Fotos sin permiso se publican | `rightsConfirmed` obligatorio por imagen; los borradores no se proyectan. |
| Enlace de imagen roto o no permitido | Se acepta cualquier https; la comprobación de que la imagen carga queda a cargo del editor. |
