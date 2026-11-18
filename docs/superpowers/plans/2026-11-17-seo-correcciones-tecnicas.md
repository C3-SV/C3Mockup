# Plan: correcciones técnicas SEO y datos estructurados de eventos (2026-11)

**Estado:** plan aprobado para ejecutar; sin cambios de código todavía.
**Repo:** `C3Mockup` · **Rama base:** `dev` (actualizar con `git fetch origin; git switch dev; git pull --ff-only origin dev`). La rama actual `quienes-somos-foto-equipo` (HEAD `65a584e`) no es la base.
**Rama de trabajo propuesta:** `feat/seo-eventos-2026-11`.
**Auditoría de referencia:** `docs/audits/SEO-AUDIT-C3-2026-11-17.md` (commit `74fce02`, ancestro de HEAD; hay cinco commits posteriores).

Archivos sin seguimiento que no se tocan: `docs/audits/`, `docs/superpowers/specs/2026-11-17-imagekit-media-design.md`.

## 1. Objetivo

Que el sistema genere SEO y datos estructurados correctos al publicar o modificar un evento, sin mantenimiento manual de código por cada edición. Search Console ya está configurado y la indexación solicitada: no tocar su configuración ni forzar indexación.

## 2. Hallazgos

### Confirmados por lectura de código

| # | Hallazgo | Evidencia |
|---|----------|-----------|
| H1 | Fechas civiles `YYYY-MM-DD` se parsean como medianoche UTC y se formatean sin `timeZone`. El catálogo se renderiza en el navegador, así que un usuario en El Salvador ve un día antes; portada y ficha se renderizan en servidor (UTC). | `packages/config/src/events.ts:209` (parseo), `:286-290` (formateador sin zona), `apps/web/components/EventsCatalog.tsx` (cliente); también `apps/web/lib/ds/event-state.ts:24`, `packages/config/src/event-page.ts:497` |
| H2 | Tres reglas distintas de "próximo/finalizado": web en UTC (`max(inicio,fin)+24h`), ficha en día local fijo −6, admin con `reference = fin ?? inicio`. Pueden contradecirse cerca de medianoche. | `apps/web/lib/ds/event-state.ts:33-49`; `packages/config/src/event-page.ts:489,516-548`; `apps/admin/lib/admin-analytics.ts:46-60` |
| H3 | `now` se calcula en tres sitios (servidor en portada, cliente en catálogo, servidor en ficha): riesgo de hidratación distinta. | `apps/web/app/page.tsx:31`; `apps/web/components/EventsCatalog.tsx:34`; `apps/web/app/eventos/[slug]/page.tsx:53` |
| H4 | `America/El_Salvador` no aparece como zona IANA en ningún archivo de código; el código usa un desfase fijo −6 (`event-page.ts:489`). Es correcto para El Salvador sin horario de verano, pero conviene documentarlo y verificarlo. | grep del repo |
| H5 | Sitemap: `lastmod` de las cinco rutas generales es el máximo global de `updatedAt` de todos los eventos (cualquier edición mueve las cinco). Hay un fallback `?? new Date()` que el brief prohíbe. | `apps/web/app/sitemap.ts:76`; `getLatestEventLastModified` en `packages/config/src/events.ts` |
| H6 | JSON-LD sin escapar: `dangerouslySetInnerHTML` con datos de Firestore no escapa `<`, así que un `</script>` podría cerrar el bloque. Explotabilidad no confirmada; la corrección es barata. | `apps/web/components/SeoJsonLd.tsx:9` |
| H7 | C3Mockup no emite `Event` JSON-LD en ninguna ficha (confirmado por grep). Los avisos de Search Console probablemente vienen de `copa.c3.com.sv`, cuyo código está en `AstroLandingCSP`. Es hipótesis: falta la lista de URLs de Search Console. | `grep "@type": "Event"` vacío en C3Mockup; `AstroLandingCSP/landing-csp-astro/src/lib/structured-data.ts:19-42` (Event con fechas fijas, `Place` sin dirección, `Organization` del Copa) |
| H8 | Organization y WebSite se repiten por valor en cada bloque (sin `@id` compartido). La duplicación concreta en `/eventos` no quedó confirmada en HTML renderizado. | `apps/web/lib/structured-data.ts` (stubs con `@id` en `:59-70`, `:33-38`) |
| H9 | Admin: no hay dirección estructurada, hora con zona, URL del organizador, estados de cambio de agenda (cancelado, pospuesto, reprogramado), ponentes, oferta ni fecha de apertura de inscripción. La modalidad solo está en la ficha opcional (`presencial|virtual|hibrida`). La portada no es editable en el formulario. | `packages/config/src/event-page.ts:13,31-43,37-38`; `packages/config/src/events.ts:7-14,43-64`; `apps/admin/components/admin-event-form.tsx:453` |
| H10 | El `href` principal del evento (CTA) no tiene validación de esquema en servidor ni en formulario (solo escritura de admin). | `apps/admin/lib/admin-event.ts:72,76` |
| H11 | `www.c3.com.sv` devuelve 307; C3Mockup no tiene configuración de redirección de dominio. Probablemente viene de Vercel (no verificado). | Sin `.vercel` en C3Mockup; grep de redirects vacío |
| H12 | `/copa` y `/hackathon` devuelven 308; no se sabe si lo define `vercel.json` o `next.config.ts`. | Pendiente de verificar |
| H13 | Metadatos: el canonical de `createPageMetadata` produce barra final en `/`, distinto del default del layout; el override de imágenes por línea pierde dimensiones. | `apps/web/lib/metadata.ts:17` y reglas de override |

### Contradicciones y no verificado

- Canonical de la portada: un lector afirmó un canonical con barra final, pero el HTML en vivo y el prerender local muestran `https://c3.com.sv` sin barra. Revisar antes de tocar.
- Logo de Organization: el lector lo citó como relativo; `structured-data.ts:19` lo construye absoluto. Tomar el código como fuente.
- Calendario de fechas del Copa: `docs/content/eventos/inventario-ediciones.md:11,37` dice "pendiente", pero Astro emite fechas 2026 y sede. Confirmar fechas oficiales antes de publicar cualquier `Event` de Copa.
- Zona del servidor de producción: desconocida (depende de Vercel). Afecta la magnitud de H1 en servidor.
- Hidratación de `EventsCatalog`: no reproducida en navegador.
- Datos reales de PyloCTF, Instituto RETOS y Copa 2026 en Firestore: no inspeccionados; solo lo que dice la auditoría.
- Reglas de Firestore de `events` y `eventPageSlugs`: no localizadas en el checkout.
- Migración `apps/admin/lib/event-page-migration.ts` (618 líneas) y `apps/admin/scripts/migrate-event-pages.ts`: solo leído el encabezado; confirmar que no borra nada.
- Gasto por petición del sitemap (dos lecturas completas más lecturas por evento): no medido.

## 3. Decisiones previas a implementar

1. **Copa 2026 (`copa.c3.com.sv`):** el `Event` vive en `AstroLandingCSP`, un subdominio fuera del repo. El brief prohíbe tocar subdominios fuera del repo sin autorización. Opciones: (a) autorizar el cambio en `AstroLandingCSP` en una rama aparte; (b) dejarlo como pendiente y documentarlo.
2. **Fechas oficiales de Copa 2026:** necesarias antes de cualquier `Event` de Copa.
3. **Evento de un solo día:** ¿pasa a "Histórico" al terminar su día o conserva el estado?
4. **Lista de URLs de Search Console** con los nueve avisos `Event`: exportar desde Search Console (no tengo acceso).
5. **Campos nuevos del admin:** confirmar cuáles son requeridos para publicar y cuáles son opcionales de enriquecimiento. El spec vigente (`docs/superpowers/specs/2026-11-13-eventos-memorias-design.md` §8) no pide todos los campos del brief.

## 4. Plan de ejecución

### Fase 0 — Preparación
- `git fetch origin`, crear `feat/seo-eventos-2026-11` desde `dev` actualizado. No tocar `docs/audits/` ni el spec de ImageKit.
- Reproducir H1 con `TZ=UTC` y `TZ=America/El_Salvador` en tests antes de cambiar código.

### Fase 1 — Fechas (prioridad 1)
- `packages/config/src/events.ts`: parseo civil y formateador con `timeZone: "America/El_Salvador"`; regla única de orden y "próximo".
- `packages/config/src/event-page.ts`: un solo helper de día civil en lugar de `readDay`/`localDay`; conservar el desfase −6 documentado.
- `apps/web/lib/ds/event-state.ts`, `event-card.ts`, `event-filters.ts`, `featured-rotation.ts`: usar la regla única.
- `apps/web/components/EventsCatalog.tsx`: formato determinista; `now` estable entre servidor y cliente.
- `apps/admin/lib/admin-analytics.ts`: misma regla para "próximos".
- Tests: `apps/web/tests/unit/event-state.test.ts`, `apps/web/tests/unit/event-page.test.ts`, nuevos tests con zona fija UTC y El Salvador, casos PyloCTF, Instituto RETOS y Copa 2026.

### Fase 1 — JSON-LD (prioridad 1)
- `apps/web/components/SeoJsonLd.tsx`: escapar `<`, `>`, `&` y U+2028/2029 al serializar.
- `apps/web/lib/structured-data.ts`, `apps/web/app/layout.tsx`: Organization y WebSite con `@id` compartido; eliminar copias por valor.
- Nuevo generador `Event` para `apps/web/app/eventos/[slug]/page.tsx` (módulo nuevo sugerido `apps/web/lib/event-jsonld.ts`), emitido solo con datos verificados: nombre, fechas civiles con desfase, URL, lugar presencial con `PostalAddress` solo si existe dirección; sin `offers`, `performer` ni `validFrom` salvo datos reales.
- `packages/config/src/event-page.ts` y formulario (`apps/admin/components/admin-event-form.tsx`, `admin-event-page-fields.tsx`): campos opcionales nuevos (modalidad, dirección, zona horaria, organizador y URL, estado, ponentes, oferta); indicador de completitud SEO que no bloquea publicar; validación de `href` con esquema https en `apps/admin/lib/admin-event.ts`.

### Fase 2 — Sitemap y metadatos
- `apps/web/app/sitemap.ts`: `lastmod` real por URL; quitar `?? new Date()`; omitir si no hay fecha; solo publicadas e indexables.
- `packages/config/src/events.ts`: retirar `getLatestEventLastModified` de las rutas generales.
- `apps/web/lib/metadata.ts`, `apps/web/app/eventos/[slug]/page.tsx`: OG y Twitter por evento (portada/galería como prioridad, dimensiones) con fallback institucional; canonical unificado.
- Tests: `apps/web/tests/unit/` de sitemap, metadata y cover-image; `apps/web/e2e/event-detail.spec.ts`.
- Redirección `www`: sin cambio en el repo; documentar pasos en Vercel (`apps/web` o dashboard del proyecto) para 301 o 308.

### Fase 3 — Rendimiento (por inspeccionar)
- Medir antes: uso de `unoptimized` en portadas, tarjetas y galerías. No introducir servicios de pago ni cambios de infraestructura sin aprobación.

### Documentación
- Nuevo: `docs/seo/seo-fixes-2026-11.md` con problemas solucionados, mejoras, pendientes y datos que faltan.
- Actualizar `docs/PRODUCTO-Y-NAVEGACION.md` si cambian rutas o criterios (no se esperan cambios de ruta).

## 5. Verificación

- `npm run typecheck`, `npm run lint`, `npm test` (unitarias), `npm run build`, y E2E aplicables en escritorio y móvil.
- Tests de zona horaria con `TZ` fijo.
- Ejemplos de JSON-LD generado para presencial, virtual, híbrido, evento propio y aliado.
- Rich Results Test y Schema Markup Validator: requieren URLs públicas y acceso externo; los ejecutas tú o se documenta como pendiente.

## 6. Fuera de alcance

- Modificar la configuración de Search Console o forzar indexación.
- Modificar `AstroLandingCSP` (subdominio) sin autorización explícita (decisión 1).
- Migrar eventos históricos, cambiar slugs o eliminar datos de Firestore.
- Inventar horas, direcciones, precios, fechas de apertura, responsables o participantes.
- Commit, push o PR sin orden explícita.
