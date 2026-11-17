# 0017 · Fotos de la edición fuera de la memoria y host libre para imágenes

- **Fecha:** 2026-11-17 · **Responsable:** pedido del responsable de C3 · **Estado:** Aceptada (17-nov-2026)
- **Plan:** [`docs/superpowers/plans/2026-11-17-fotos-y-host-libre.md`](../superpowers/plans/2026-11-17-fotos-y-host-libre.md)
- **Amplía:** [ADR-0014](0014-fichas-y-memorias-por-edicion.md). **Reemplaza, para imágenes, la regla de host de [ADR-0005](0005-decisiones-heredadas-del-ds.md)** (portadas solo de hosts de C3).

## Contexto

1. Los enlaces de imagen de servicios externos no siempre contienen «c3» en la dirección, así que la regla de host bloquea fotos válidas.
2. La galería vivía dentro de la memoria (`memory.gallery`). Una foto o un arte puede existir antes de que la edición ocurra, y hoy no se podía cargar sin memoria.

## Decisión

1. **Imágenes de cualquier host por https.** Portadas y fotos aceptan cualquier enlace `https://` absoluto sin credenciales ni caracteres de control, de hasta 2.048 caracteres. Siguen rechazados: `http:`, credenciales, rutas relativas para imágenes, `javascript:`, `data:` y cualquier otro esquema.
2. **Fotos al nivel de la ficha.** La galería pasa de `memory.gallery` a `page.gallery`. Se publica con la ficha, sin necesitar memoria ni que la edición haya terminado. La memoria conserva solo el texto de cierre (resumen, aprendizajes, resultados y proyectos).
3. **Límite: 20 fotos por edición.** Sustituye el 12 de la guía editorial. Es el límite que el responsable fijó para la galería en la spec de ImageKit (17-nov-2026).
4. **Derechos por foto.** Cada foto exige texto alternativo y `rightsConfirmed`. Sin confirmación no se publica.
5. **Compatibilidad.** Un documento guardado con `memory.gallery` se lee como `page.gallery`. Ninguna foto ya guardada se pierde, y el siguiente guardado la escribe en el nivel nuevo.

## Alternativas descartadas

- **Mantener la lista de hosts de C3 y añadir excepciones.** Obliga a mantener una lista de dominios y deja fuera cualquier servicio nuevo.
- **Mantener la galería en la memoria y publicar la memoria antes.** Mezcla el cierre de la edición con material promocional que puede existir antes.

## Consecuencias

- Cambia el contrato de contenido: `PublicEventPage` expone `gallery` y `PublicEventMemory` ya no tiene `gallery`. El admin muestra «Fotos» al nivel de la ficha.
- Un enlace de imagen de un servicio externo puede dejar de cargar. El editor es responsable de que la imagen exista y tenga permiso de uso.
- La subida de archivos (ImageKit) sigue pendiente de su spec: [`2026-11-17-imagekit-media-design.md`](../superpowers/specs/2026-11-17-imagekit-media-design.md).
