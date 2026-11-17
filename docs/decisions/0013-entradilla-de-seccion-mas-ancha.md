# 0013 · Entradilla bajo el titular de sección: 62 caracteres

- **Fecha:** 2026-11-13
- **Estado:** aceptada

## Contexto

El paquete del DS (`docs/design-system/source/ACTUALIZACION-DS-C3.md`, escala efectiva) fija la entradilla (`.c3-lead`) en un máximo de 34 caracteres por línea. Con ese ancho, el texto bajo un titular de sección largo quedaba angosto: en la evidencia viva del home, el párrafo medía unos 342 px frente a un titular de más de 600 px de ancho. El responsable lo reportó como un problema visual.

## Decisión

- **Entradilla bajo titular de sección** (`.c3-section-head .c3-lead`): máximo **62 caracteres** por línea. Aplica a todas las secciones que usan `c3-section-head`.
- **Hero** (`.c3-hero .c3-lead`): se mantiene en 34 caracteres. Su columna ya es estrecha y el texto se ve bien.
- Se retira el modificador `c3-section-head--ancho`, que hacía lo mismo solo en la sección «Un ecosistema integrado».
- El paquete original no se modifica (`source/` es inmutable). Esta decisión es una desviación registrada en `docs/design-system/pendientes.md`, §12.2.

## Consecuencias

- Las entradillas de sección son más anchas en escritorio: home (evidencia viva y ecosistema), audiencias, contacto, «Qué es C3» y las páginas de línea. En el teléfono no cambian: ocupan el ancho disponible.
- Verificación: prueba E2E `e2e/entradilla.spec.ts` (escritorio ≥ 480 px en la evidencia viva; teléfono a todo el ancho).
- Número 0012 reservado para la decisión de fotos y medios del admin (ver spec de destacado, §8).
