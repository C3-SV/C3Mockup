# 0017 · Los títulos no llevan punto final

- **Fecha:** 2026-11-17
- **Estado:** aceptada

## Contexto

El titular del hero («…creación y conexión.») y el titular del llamado final («…de la región.») terminaban en punto, mientras el resto de títulos del sitio no. El responsable pidió que los títulos no lleven punto nunca.

## Decisión

- Los **títulos** (`h1`, `h2`, `h3` y titulares de tarjeta o de sección) no llevan punto final.
- Las **entradillas, párrafos y subtítulos** conservan su puntuación.
- Se quita solo el punto final. El texto, las palabras y los destinos no cambian.

## Consecuencias

- Se cambiaron dos titulares: el del hero y el del llamado final. Sus textos se actualizaron en `e2e/content-baseline.json` y `e2e/home-orden.spec.ts`, y en `home-content.test.tsx`.
- La prueba `ningún encabezado de la sección termina en punto` (en `AudienceSection.test.tsx`) vigila la regla en la sección de audiencias.
- Al escribir un título nuevo, quitar el punto final antes de publicar.
