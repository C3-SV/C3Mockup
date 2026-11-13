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
- **Próximas iniciativas se retiró el 13-nov-2026** (decisión 19). Sus eventos siguen en la rejilla, donde los próximos van primero.
- **Admin:** campo «Tipo de experiencia» (opcional) y «Orden en el destacado» (opcional, entero de 1 a 99, visible solo si el evento es destacado). El campo «Destacado» deja de prometer lo que no hacía.
- **Accesibilidad:** pausa manual persistente; pausa temporal que se levanta al salir; controles de 44 px con nombre y estado; anuncio de cambio solo por acción del usuario; anillo de foco visible sobre el panel navy.

## Consecuencias

- Sin destacados vigentes, el bloque muestra los históricos destacados con su estado «Histórico»: hoy, la Copa y la Hackathon. Cuando haya un destacado vigente, rota solo ese.
- El destacado usa una variante que el DS no define. Su altura (200 px móvil, 320 px escritorio) supera el medio de 132 px de la tarjeta; la rejilla no cambia.
- El estilo del destacado va en `apps/web/app/ds/spotlight.css` **sin capa**, porque los encabezados globales del DS no están en capas y ganarían a una regla con capa.
- Se corrige la pérdida de datos del admin: antes cada guardado borraba `kind`, `source` y `cover`. Ahora el registro lo arma `buildAdminEventRecord` en `packages/config`, con pruebas.
- Se corrige la lectura de la clave privada de la web (`normalizeFirebasePrivateKey`), que no convertía los saltos de línea escritos como texto.
- La subida de fotos desde el admin no está en esta decisión: requiere revisar ADR-0005 y tendrá su propio ADR (0012).

## Registro de decisiones (12-nov-2026)

Para consultarlas luego. «Responsable» = decidido por el responsable del proyecto. «Implementación» = llamada tomada al construir, para revisar. Los pendientes están en [pendientes.md](../design-system/pendientes.md) (P1 a P6).

| # | Decisión | Quién | Dónde verla |
| --- | --- | --- | --- |
| 1 | Base del home: evento protagonista con rotación encima de la rejilla (opción C), sin cambiar la narrativa ni la visión (referente regional) | Responsable | Spec §3 |
| 2 | Rotación automática cada 8 s; el admin también ordena los destacados | Responsable | Spec §3 |
| 3 | Los eventos pasados van al fondo de la rejilla, marcados «Histórico» | Responsable | Spec §14 |
| 4 | Sin destacados vigentes, rotan los destacados históricos, el más reciente primero. Hoy: Copa y Hackathon | Responsable | Spec §14, esta ADR |
| 5 | Mientras no haya fotos, los íconos de tipo son el respaldo visual; las fotos llegan después, sin bloquear publicar | Responsable | Spec §3 |
| 6 | Sistema de fotos y biblioteca en el admin después; páginas por evento con slug después | Responsable | Spec §8 y §9; P1 y P2 |
| 7 | La Hackathon de Turismo Creativo I puede aparecer destacada | Responsable | P4 |
| 8 | Las fechas guardadas en Firestore son reales | Responsable | P4 |
| 9 | Próximas iniciativas no usa destacados terminados como respaldo (después se retiró, decisión 19) | Implementación | Spec §14 |
| 10 | Un destacado sin fecha no entra a la rotación de vigentes | Implementación | `featured-rotation.ts` |
| 11 | Pausa: la manual persiste; la temporal (puntero de ratón o foco dentro del bloque) se levanta al salir; también se pausa fuera de pantalla | Implementación | Spec §5.4 |
| 12 | Sin deslizamiento táctil propio en móvil; se usan botones y puntos de 44 px | Implementación | Spec §14 |
| 13 | El tipo de experiencia se muestra como texto además del ícono | Implementación | `FeaturedRotation.tsx` |
| 14 | El admin tiene «Tipo de experiencia» y «Orden en el destacado»; el texto de «Destacado» dice lo que hace | Implementación | `admin-event-form.tsx` |
| 15 | El estilo del destacado va sin capa (`spotlight.css`) porque los encabezados globales del DS no están en capas | Implementación | `globals.css` |
| 16 | Corregir el guardado del admin, que borraba tipo, portada y origen | Implementación (corrección) | `buildAdminEventRecord` en `packages/config` |
| 17 | Convertir los saltos de línea escritos como texto en la clave privada de Firebase | Implementación (corrección) | `normalizeFirebasePrivateKey` |
| 18 | Se mantiene el número 0009 sin uso y esta decisión es 0011 | Implementación | `docs/decisions/README.md` |
| 19 | Se retira «Próximas iniciativas» y la evidencia viva pasa a ir justo después del hero (orden: Hero, evidencia viva, datos, líneas, audiencias, cierre). Se borra `IniciativasSection` y su prueba | Responsable (opción A, 13-nov-2026) | `app/page.tsx`, `e2e/home-orden.spec.ts` |
| 20 | Se quita el CSS `.c3-home-grid--2`, que solo usaba Próximas | Implementación | `app/ds/home.css` |

Qué no cambia: el hero, las cifras, las líneas, el cierre, la visión y la misión, y la tarjeta de la rejilla.
