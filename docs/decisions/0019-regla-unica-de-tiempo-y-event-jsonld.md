# 0019 · Regla única de tiempo de los eventos, canonical sin barra y Event JSON-LD verificado

- **Fecha:** 2026-11-17 · **Responsable:** pedido del responsable de C3 · **Estado:** Aceptada. Cambios del admin aprobados por el responsable el 2026-11-17 (ADR-0014). Rama `feat/seo-eventos-2026-11`, PR #28 abierto contra `dev`
- **Plan:** [`docs/superpowers/plans/2026-11-17-seo-correcciones-tecnicas.md`](../superpowers/plans/2026-11-17-seo-correcciones-tecnicas.md) · **Auditoría:** `docs/audits/SEO-AUDIT-C3-2026-11-17.md`

## Contexto

1. La web, la ficha y el admin usaban reglas distintas para decir «próximo», con cortes en UTC y en −6 fijo, y el admin usaba `fin ?? inicio`. Un mismo evento podía aparecer como vigente en un lado y terminado en otro.
2. El canonical de la portada se generaba con barra final (`https://c3.com.sv/`), mientras el sitio sirve `https://c3.com.sv`.
3. La ficha de evento no emitía `Event` JSON-LD, aunque su contenido ya tenía fecha y lugar.

## Decisión

1. **Base de tiempo:** día civil de El Salvador, UTC−6 fijo (sin horario de verano). Un evento es vigente o próximo hasta las **24:00 de El Salvador de su último día** (fin, o inicio si no hay fin). Las funciones viven en `packages/config/src/event-time.ts` y las usan la web, la ficha, el admin y el orden de listas. Se pasa un solo «ahora» por lectura.
2. **Eventos de un día:** dejan de contar como vigentes al terminar su día, no al empezar el siguiente.
3. **Canonical y og:url de la raíz:** `https://c3.com.sv`, sin barra final. El sitemap usa la misma forma (`absoluteUrl` en `apps/web/lib/metadata.ts`).
4. **Imagen social por evento:** la portada del evento, con su texto alternativo. Las medidas solo se declaran si se conocen.
5. **`Event` JSON-LD:** solo con ficha publicada, fecha de inicio válida y lugar verificable (presencial con sede y dirección con calle y localidad, o virtual con enlace https). Sin hora de inicio, la fecha va sin hora. Las horas llevan `-06:00`. Organizador, ponentes y oferta solo si el admin los carga. Ver `apps/web/lib/event-jsonld.ts`.
6. **Campos nuevos de la ficha** (todos opcionales, no bloquean publicar): dirección estructurada, horario, organizador, ponentes, oferta en USD, apertura de inscripción y estado de agenda (programado, cancelado, pospuesto, reprogramado).
7. **Enlace principal del evento (CTA):** solo https absoluto sin espacios, o ruta local de una sola «/». Se valida en servidor (`packages/config/src/admin-event.ts`) y en el formulario.

## Consecuencias

- La Copa 2026 queda con `eventDate: 2026-08-15`, `eventDateEnd: 2026-09-05` y estado «Histórico» en los datos por defecto. Los datos reales en Firestore se corrigen desde el admin.
- El formulario del admin cambia (sección «Logística y agenda»). El cambio funcional del admin requiere la aprobación del responsable antes de fusionar (ADR-0014).
- Las fichas de Copa en `copa.c3.com.sv` (subdominio fuera del repo) no cambian.

## Pendiente

- La sede de la Copa (ESEN) no tiene campo en `EventItem`; la Copa no tiene ficha en este repo, así que no emite `Event` JSON-LD aquí.
- Indicador de completitud SEO en el admin (no implementado en esta rama).
