# Correcciones técnicas SEO · noviembre 2026

Plan: [`docs/superpowers/plans/2026-11-17-seo-correcciones-tecnicas.md`](../superpowers/plans/2026-11-17-seo-correcciones-tecnicas.md) · Auditoría de referencia: `docs/audits/SEO-AUDIT-C3-2026-11-17.md` · Decisión: [ADR-0019](../decisions/0019-regla-unica-de-tiempo-y-event-jsonld.md) · Rama: `feat/seo-eventos-2026-11`.

## Solucionado

| Hallazgo | Qué se hizo | Prueba |
| --- | --- | --- |
| H1 · fechas desplazadas un día en El Salvador | El formateador de fechas civiles usa `timeZone: "UTC"`. Las fechas se parsean como medianoche UTC y se formatean en UTC. El admin también (`getCompactDateLabel`). | `event-dates-timezone.test.ts` |
| H2 / H3 · tres reglas de "próximo" y `now` en varios sitios | Regla única en `packages/config/src/event-time.ts`: vigente hasta las 24:00 de El Salvador del último día. La web, la ficha, el admin y el orden la usan. Un solo «ahora» por lectura; la portada y el catálogo reciben el mismo instante del servidor. | `event-time-rule.test.ts`, `revision-fixes.test.ts` |
| H5 · `lastmod` compartido en rutas generales | El sitemap ya no asigna `lastmod` a `/`, `/eventos`, `/compite`, `/crea` y `/conecta`, y no hay fallback `?? new Date()`. Las fichas conservan su fecha real. | `sitemap-lastmod.test.ts` |
| H6 · JSON-LD sin escapar | `serializeJsonLd` escapa `<`, `>`, `&` y U+2028/2029. | `seo-json-ld.test.ts` |
| H7 · sin `Event` JSON-LD | Las fichas emiten `Event` solo con ficha publicada, fecha válida y lugar verificable (presencial con sede y dirección, o virtual con enlace https). Sin hora, la fecha va sola. Organizador, ponentes y oferta solo si existen. | `event-jsonld.test.ts` |
| H9 · campos del admin | Dirección, horario, organizador, ponentes, oferta en USD, apertura de inscripción y estado de agenda. Opcionales; no bloquean publicar. | `event-page-logistica.test.ts`, `event-draft-logistica.test.ts` |
| H10 · validación del enlace principal | Solo https absoluto sin espacios ni credenciales, o ruta local de una sola «/». Se valida en servidor y en el formulario. | `admin-event-href.test.ts` |
| H13 · canonical y Open Graph | Canonical de la raíz sin barra final (igual que el HTML en vivo y el sitemap). Open Graph de cada evento con su portada; sin portada, el logo de C3 como imagen base. | `metadata-canonical-og.test.ts`, `event-brand-cover.test.ts` |
| Portada por enlace (admin) | URL https y texto alternativo, como las fotos de la galería. Sin enlace se envía `cover: null` y el servidor borra la portada guardada. | `event-cover-link.test.ts` |
| Copa 2026 | `eventDate` 2026-08-15, `eventDateEnd` 2026-09-05, estado Histórico (datos por defecto). Los datos de Firestore se corrigen desde el admin. | `event-card.test.ts` |
| Revisión independiente (19 hallazgos confirmados) | Orden total de la lista con eventos sin fecha; rango invertido; país y modalidad del JSON-LD; enlaces de listas sin dominio duplicado; pastilla de la ficha igual que el catálogo; fechas inexistentes rechazadas; portada y dirección que se pueden vaciar; avisos de ponentes en su campo; texto escrito durante el guardado no se pierde. | `revision-fixes.test.ts` y pruebas del admin |

## Pendiente, con motivo

| Hallazgo | Estado | Motivo |
| --- | --- | --- |
| H8 · Organization y WebSite repetidos por valor | Sin cambio | La duplicación en `/eventos` no quedó confirmada en HTML renderizado. |
| H11 · `www.c3.com.sv` devuelve 307 | Fuera del repo | Redirección de dominio en Vercel. |
| H12 · `/copa` y `/hackathon` devuelven 308 | Sin verificar | No se sabe si lo define `vercel.json` o `next.config.ts`. |
| Sede ESEN de la Copa | Campos listos | La ubicación se llena desde el admin cuando la Copa esté publicada como ficha. |
| Hackathon (fecha pasada, estado «Inscripciones abiertas») | Lo corrige el responsable desde el admin | Los datos por defecto del código solo se usan si Firestore está vacío. |
| Indicador visual de completitud en el admin | No se implementa | Decisión del responsable: el JSON-LD ya sale solo cuando la ficha está completa. |
| Fase 3 · rendimiento (`unoptimized`) | Solo inspección | No medido. Sin servicios de pago ni cambios de infraestructura sin aprobación. |
| Copa 2026 (`copa.c3.com.sv`) | Fuera de alcance | Vive en `AstroLandingCSP`, subdominio fuera del repo. |

### Hallazgos de bajo impacto de la revisión, sin corregir

- Lectura pública de eventos sin validar esquema del enlace (`apps/web/lib/events-parse.ts`). Las escrituras del admin sí validan; el riesgo es bajo.
- La proyección pública no vuelve a comprobar la fase temporal de la memoria. La memoria solo se valida al guardar.
- Título que no produce identificador (solo símbolos): el servidor responde en inglés sin campo asociado.

## Datos que faltan

1. Lista de URLs de Search Console con los nueve avisos `Event`.
2. Dirección completa de la ESEN (calle y localidad), cuando la Copa tenga ficha.
3. Zona horaria del servidor de producción (afecta H1 en servidor; el código usa −6 fijo).

## Contradicciones registradas

- **Canonical de la portada:** la auditoría hablaba de barra final; el HTML en vivo muestra `https://c3.com.sv` sin barra. Se corrigió el código a esa forma.
- **Imagen de Open Graph:** la auditoría decía 176×118; el archivo real mide 1200×630.
- **Logo de Organization:** la auditoría lo citaba como relativo; el código lo construye absoluto. Manda el código.

## Verificación

Logs de la última corrida en `.superpowers/sdd/2026-11-17-seo-correcciones-tecnicas/` (carpeta ignorada por git).
