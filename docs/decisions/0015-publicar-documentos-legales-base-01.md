# 0015 · Publicar la base explicativa legal 0.1

- **Fecha:** 2026-11-14 · **Responsable:** autorización expresa en esta tarea · **Estado:** aceptada
- **Plan:** [`2026-11-13-legal-convivencia.md`](../superpowers/plans/2026-11-13-legal-convivencia.md)
- **Spec:** [`2026-11-13-legal-convivencia-design.md`](../superpowers/specs/2026-11-13-legal-convivencia-design.md)

## Contexto

El plan P5 mantenía privacidad, términos y convivencia como borradores internos hasta confirmar responsables, ajustes de proveedores, conservación, canales y revisión jurídica. El responsable pidió que se publiquen versiones 0.1 explicativas con la información básica sobre el uso del sitio, la analítica, el contacto y la convivencia, incluso mientras esas confirmaciones siguen abiertas.

## Decisión

1. Publicar páginas estáticas `/privacidad`, `/terminos` y `/codigo-de-conducta` con versión 0.1 y fecha de revisión visible.
2. Indicar en cada página, de forma comprensible, qué datos y procedimientos están por confirmar. No inventar persona responsable, razón social, plazo, capacidad o garantía, y no afirmar aprobación jurídica ni cumplimiento.
3. Enlazar las tres páginas en la franja inferior del pie, añadir un aviso de privacidad junto al formulario y registrar las rutas en metadata, JSON-LD y sitemap. Mantenerlas fuera de la navegación principal.
4. Mantener P5 abierto. Las versiones finales requieren confirmar la operación y obtener la revisión/aprobación que corresponda.
5. Esta es una ampliación acotada a ADR-0003: las tres páginas legales se suman al sitio público; no cambia el alcance visual de otras páginas ni `apps/admin`.

## Consecuencias

- La base 0.1 aparecerá en previews y en el sitio cuando el cambio llegue a producción, acompañada de una nota clara sobre los pendientes.
- Los documentos, fechas y referencias se mantienen versionados en el repositorio para su actualización.
- La decisión autoriza la publicación explicativa; no constituye dictamen jurídico ni cierra T0/T1.
