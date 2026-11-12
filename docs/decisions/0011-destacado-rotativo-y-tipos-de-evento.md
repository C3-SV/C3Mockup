# 0011 · Destacado rotativo en el home y tipo de experiencia como respaldo visual

- **Fecha:** 2026-11-12
- **Estado:** aceptada
- **Spec:** [`docs/superpowers/specs/2026-11-12-destacado-rotativo-eventos-design.md`](../superpowers/specs/2026-11-12-destacado-rotativo-eventos-design.md)

## Contexto

El responsable quiere que los eventos y experiencias se vean como un catálogo, con un evento grande que rota entre los destacados vigentes, como en las plataformas de streaming. El DS (§7.9 y §7.16) define la tarjeta de 132 px y la rejilla paginada de 6; no define un destacado rotativo. Mientras no haya fotos, el respaldo visual son los íconos de tipo que el sitio ya usa (`KindIcon`).

## Decisión

- **Destacado rotativo a sección completa**, dentro de «Evidencia viva del ecosistema C3» y encima de la rejilla. Muestra los eventos marcados como destacados y vigentes, máximo 5, ordenados por orden de destacado (si lo tienen) y después por fecha. Si no hay destacados vigentes, rotan los destacados que ya terminaron, los más recientes primero (decisión del 12-nov-2026).
- **Rotación automática cada 8 s**, con pausa manual, pausa mientras el puntero (ratón) o el foco están dentro del bloque y pausa fuera de pantalla. Con `prefers-reduced-motion` no rota. Sin JavaScript se ve el primer evento.
- **Respaldo sin foto:** el tinte de la línea y el ícono de tipo (`KindIcon`), a 72 px en móvil y 96 px en escritorio. Un evento sin tipo usa el ícono genérico. Las fotos se agregan después, sin cambiar el código.
- **Los eventos pasados solo rotan si están marcados como destacados y no hay destacados vigentes.** Nunca aparecen en Próximas iniciativas. La rejilla sigue mostrando todo el catálogo, con los pasados al final marcados como «Histórico».
- **Ningún evento aparece dos veces en el home:** el destacado no se repite en la rejilla ni en Próximas iniciativas.
- **Próximas iniciativas conserva su encabezado.** Si no hay tarjetas, el texto dice dónde están las iniciativas con fecha o que por ahora no hay ninguna.
- **Admin:** campo «Tipo de experiencia» (opcional) y «Orden en el destacado» (opcional, entero de 1 a 99, visible solo si el evento es destacado). El campo «Destacado» deja de prometer lo que no hacía.
- **Accesibilidad:** pausa manual persistente; pausa temporal que se levanta al salir; controles de 44 px con nombre y estado; anuncio de cambio solo por acción del usuario; anillo de foco visible sobre el panel navy.

## Consecuencias

- Sin destacados vigentes, el bloque muestra los históricos destacados con su estado «Histórico»: hoy, la Copa y la Hackathon. Cuando haya un destacado vigente, rota solo ese.
- El destacado usa una variante que el DS no define. Su altura (200 px móvil, 320 px escritorio) supera el medio de 132 px de la tarjeta; la rejilla no cambia.
- El estilo del destacado va en `apps/web/app/ds/spotlight.css` **sin capa**, porque los encabezados globales del DS no están en capas y ganarían a una regla con capa.
- Se corrige la pérdida de datos del admin: antes cada guardado borraba `kind`, `source` y `cover`. Ahora el registro lo arma `buildAdminEventRecord` en `packages/config`, con pruebas.
- Se corrige la lectura de la clave privada de la web (`normalizeFirebasePrivateKey`), que no convertía los saltos de línea escritos como texto.
- La subida de fotos desde el admin no está en esta decisión: requiere revisar ADR-0005 y tendrá su propio ADR (0012).
