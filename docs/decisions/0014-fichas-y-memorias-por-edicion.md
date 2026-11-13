# 0014 · Fichas y memorias por edición: ampliación de alcance

- **Fecha:** 2026-11-13 · **Responsable:** pendiente de aprobación del responsable de C3 · **Estado:** Propuesta — pendiente de aprobación del responsable
- **Spec:** [`docs/superpowers/specs/2026-11-13-eventos-memorias-design.md`](../superpowers/specs/2026-11-13-eventos-memorias-design.md)
- **Plan:** [`docs/superpowers/plans/2026-11-13-eventos-memorias.md`](../superpowers/plans/2026-11-13-eventos-memorias.md)

> Esta decisión **no está aprobada**. Mientras no lo esté, ninguna ficha se publica y el contenido real queda en borrador. Los límites y el contrato son propuestas del implementador, no respuestas atribuidas al responsable (spec §11).

## Contexto

El responsable pidió que cada edición de un evento tenga una ficha permanente en `/eventos/{slug}`: antes informa y después conserva memoria y resultados. Conserva los sitios especiales de Copa y Hackathon y quiere editar el contenido desde el admin, con secciones estructuradas.

Dos decisiones vigentes limitan esto:

- [ADR-0003](0003-alcance-solo-paginas-existentes.md) acota el rework a las páginas existentes y deja `apps/admin` sin cambios visuales ni funcionales. `/eventos/{slug}` no existe todavía.
- `AGENTS.md` pide no tocar `apps/admin` visualmente y `PRODUCT.md` fija que el rework es visual y conserva el contenido.

## Decisión (propuesta)

1. **Amplía el alcance de ADR-0003** con una ruta nueva de detalle, `/eventos/{slug}`, una por edición. Las demás páginas siguen como están. No hay página global de impacto, inscripción, cuentas, blog, newsletter ni biblioteca de medios.
2. **Cambio funcional acotado del admin.** Se permite añadir al formulario de eventos la edición de la ficha y la memoria (campos estructurados), con su normalización, API, persistencia y validación. **No se rediseña el admin** ni `packages/ui`; el estilo visual del admin no cambia más allá de los campos nuevos.
3. **Modelo.** Se extienden los registros existentes de Firestore (`events/{id}`) con `page` y, dentro de ella, `memory`. Texto plano, sin HTML ni Markdown ejecutable. El tipo público (`PublicEventPage`) no incluye borradores ni datos internos de derechos.
4. **Slug único e inmutable.** Reserva permanente en `eventPageSlugs/{slug}` mediante transacción. Despublicar conserva la reserva; borrar un evento con ficha retira el slug para siempre. Cambiar título o fechas no cambia la URL.
5. **Publicación explícita.** La ficha y la memoria se publican por separado, nunca por fecha ni de forma automática. Publicar la memoria exige ficha publicada, resumen y edición terminada (fecha pasada o estado Histórico).
6. **Micrositios y CTA originales se conservan** como enlaces informativos dentro de la ficha. Las redirecciones actuales de `/copa` y `/hackathon` no cambian.
7. **Excepción editorial acotada del baseline de contenido.** Solo para tarjetas migradas y mediante un registro exacto (`e2e/content-approved-changes.json`) que cita este ADR. Se conserva el baseline original y no se autoriza ningún cambio de titulares. Si no se aprueba, se mantienen enlaces secundarios explícitos a los destinos originales.
8. **SEO y actualización.** Metadata y canonical propios, JSON-LD congruente con el contenido visible y sitemap con fichas publicadas. Revalidación autenticada del patrón `/eventos/[slug]`.
9. **Migración** revisable, con dry-run por defecto, detección de colisiones y solo de eventos seleccionados con el responsable. Nada se rellena por deducción.

## Alternativas descartadas

- Reemplazar también los sitios especiales de Copa y Hackathon: fuera de alcance.
- Archivos editoriales en Git: el responsable eligió el admin.
- Dependencia del sistema de fotos (P2, ADR-0012 reservado): la primera versión funciona sin medios o con URLs autorizadas.

## Consecuencias

- ADR-0003 queda ampliado para `/eventos/{slug}`, no reemplazado: el resto de su alcance sigue vigente. Si se aprueba esta decisión, ADR-0003 debe enlazar a este registro.
- `apps/admin` recibe cambios funcionales acotados, con pruebas; sigue fuera de alcance visual.
- Cambia el contrato de contenido: un guardado de una ficha publicada modifica el sitio público en vivo (sin versiones paralelas). La guía editorial lo documenta.
- Hay dependencias de aprobación antes de publicar: spec, este ADR, el inventario de ediciones y el contenido real con permisos. Ver [`docs/content/eventos/inventario-ediciones.md`](../content/eventos/inventario-ediciones.md) y [`docs/content/eventos/guia-editorial.md`](../content/eventos/guia-editorial.md).
- El número 0012 sigue reservado para la decisión de fotos y medios.
- Pendiente del responsable: aprobar o ajustar límites, la excepción del baseline y la lista de ediciones a migrar.
