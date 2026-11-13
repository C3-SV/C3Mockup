# 0014 · Fichas y memorias por edición: ampliación de alcance

- **Fecha:** 2026-11-13 · **Responsable:** aprobada por el responsable de C3 · **Estado:** Aceptada (13-nov-2026)
- **Spec:** [`docs/superpowers/specs/2026-11-13-eventos-memorias-design.md`](../superpowers/specs/2026-11-13-eventos-memorias-design.md)
- **Plan:** [`docs/superpowers/plans/2026-11-13-eventos-memorias.md`](../superpowers/plans/2026-11-13-eventos-memorias.md)

> Decisión **aceptada** por el responsable el 13-nov-2026, con las aclaraciones de abajo. El contenido real de cada ficha sigue siendo responsabilidad editorial del responsable.

## Contexto

El responsable pidió que cada edición de un evento tenga una ficha permanente en `/eventos/{slug}`: antes informa y después conserva memoria y resultados. Conserva los sitios especiales de Copa y Hackathon y quiere editar el contenido desde el admin, con secciones estructuradas.

Dos decisiones vigentes limitan esto:

- [ADR-0003](0003-alcance-solo-paginas-existentes.md) acota el rework a las páginas existentes y deja `apps/admin` sin cambios visuales ni funcionales. `/eventos/{slug}` no existe todavía.
- `AGENTS.md` pide no tocar `apps/admin` visualmente y `PRODUCT.md` fija que el rework es visual y conserva el contenido.

## Decisión

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

## Aclaraciones del responsable (13-nov-2026)

- **Memoria y resultados** se agregan después de la ficha básica, sin eliminar la información básica.
- **Inscripción** se apaga cuando la edición está cerrada: solo se muestra con inscripciones abiertas y la edición vigente. El código ya lo hace así.
- **Copa y Hackathon:** la ficha `/eventos/{slug}` es el sitio permanente. Los sitios especiales (`copa.c3.com.sv`, `hackathon.c3.com.sv`) quedan como enlaces externos dentro de la ficha.
- **Excepción editorial del baseline (punto 7):** sigue sin registro aprobado. El registro `e2e/content-approved-changes.json` está vacío y no se usa para cambiar tarjetas en vivo.

## Estado de implementación

Estado de la decisión: **Aceptada** (13-nov-2026). El código está implementado en la rama `eventos-memorias`; la salida a producción sigue el orden de despliegue de la sección de pendientes.

- T0 (documentación): `9d5f57f`, `9c1d689`.
- T1 (modelo y validación): `24b88e9`, `1c8ac67`.
- T2 (persistencia transaccional): `8c85579`, `c6ec35c`, `bc64ed6`, `4d58a1e`.
- T3 (formulario del admin): `716558b`, `b9649d8`, `e07742f`.
- T4 (detalle público): `81b5868`, `992e0fd`.
- T5 (SEO y revalidación): `e248c40`, `78b5c0b`.
- T6 (e2e y migración): `89647ed`, `5252e60`.

Pendiente: aprobación de este ADR, inventario real, contenido editorial, gate en un proyecto Firestore de pruebas autorizado, revisión de acceso del admin, revisiones manuales y decisiones de publicación. Detalle en [`pendientes.md`](../design-system/pendientes.md).
