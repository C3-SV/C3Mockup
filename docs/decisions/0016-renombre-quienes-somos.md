# 0016 · Renombre de «Qué es C3» a «Quiénes somos»

- **Fecha:** 2026-11-14 · **Responsable:** aprobado por el responsable de C3 (QA visual) · **Estado:** Aceptada

## Decisión

La página pública que se llamaba «Qué es C3» pasa a llamarse **«Quiénes somos»** en la navegación (cabecera y pie), en el encabezado de sección, en el título SEO y en las migas y etiquetas de datos estructurados. La pregunta del FAQ «¿Qué es C3?» no cambia.

## Lo que no cambia

- La **ruta** sigue siendo `/que-es-c3`, con su metadata y su canonical. Así no se rompen enlaces ni posicionamiento.
- El contenido de la página no cambia; solo cambian las etiquetas visibles.

## Consecuencias

- En `e2e/content-baseline.json` se actualizan exactamente 17 entradas: 16 enlaces «Qué es C3» pasan a «Quiénes somos» y el titular de `/que-es-c3`. No se regenera el baseline completo.
- `public/llms.txt` usa el nombre nuevo.
