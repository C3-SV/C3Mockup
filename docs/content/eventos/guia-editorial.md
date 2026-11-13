# Guía editorial de fichas y memorias por edición

- **Estado:** borrador para revisión del responsable. Fecha: 2026-11-13.
- **Spec:** [`2026-11-13-eventos-memorias-design.md`](../../superpowers/specs/2026-11-13-eventos-memorias-design.md).
- **Inventario:** [`inventario-ediciones.md`](inventario-ediciones.md).

Esta guía explica cómo cargar el contenido de una edición desde el admin. Los límites y reglas de publicación son propuestas de la spec y quedan sujetos a su aprobación.

## 0. Principios

- **Una ficha por edición.** Cada edición tiene su dirección `/eventos/{slug}`. Las ediciones futuras reciben otro id y otro slug.
- **Contenido real.** Escribe solo lo que puedas respaldar con una fuente. Nada de datos, cifras, fotos, testimonios ni promesas inventadas, y nunca etiqueta DEMO.
- **Voz «tú»**, tono institucional, claro y sobrio. Español sin voseo y sin emojis. Usa «eventos» y «experiencias»; no «challenge».
- **Texto plano.** No pegues HTML ni Markdown: no se ejecuta. Un párrafo por elemento de la lista.
- **Si falta fuente o permiso, queda en borrador.** Un borrador nunca llega al público.

## 1. Antes del evento

Prepara la ficha cuando la edición esté confirmada en el inventario.

1. **Slug.** Elígelo al crear la ficha: minúsculas, números y guiones, de 3 a 120 caracteres. Después **no cambia**. Confírmalo con el responsable antes del primer guardado y sugiere nombre y edición solo si están confirmados.
2. **Resumen de la ficha (`overview`).** Uno o más párrafos que expliquen qué es el evento y para quién. Obligatorio para publicar.
3. **Información práctica, solo si la tienes confirmada:** audiencia, requisitos, modalidad (presencial, virtual o híbrida) y ubicación. Si no se conoce, déjalo vacío: no se muestra la sección.
4. **Participación.** Un enlace de acción externa (etiqueta y URL) solo mientras las inscripciones estén abiertas y la edición no haya terminado. Si no se conoce la fecha, no se muestra.
5. **Recursos.** Materiales con título y enlace, solo los que C3 puede compartir.
6. **Micrositio.** El sitio especial (Copa, Hackathon u otro) se conserva como enlace informativo dentro de la ficha.
7. **Publicar.** Requisitos: slug reservado, resumen no vacío y los datos obligatorios del evento válidos. Mientras falte algo, déjala en `draft`.

## 2. Memoria posterior

La memoria documenta lo que pasó. Se puede preparar en borrador antes, pero **solo se publica cuando la edición terminó**.

- **Condición de publicación:** ficha publicada, resumen de la memoria no vacío y fecha de finalización confirmada y pasada, o estado Histórico.
- **Resumen (`summary`).** Qué ocurrió, en párrafos cortos y verificables.
- **Aprendizajes (`learnings`).** Lo que la comunidad o el equipo se lleva, uno por línea.
- **Resultados (`results`).** Cada uno con etiqueta, valor, contexto y, si existe, enlace a la evidencia. **No se exigen cifras:** una memoria sin cifras es válida. No publiques puntajes, posiciones o cantidades de participantes sin fuente.
- **Salidas (`outputs`).** Proyectos u otros resultados con título, descripción y enlace opcional.
- **Galería.** Opcional. Una memoria sin fotos también es válida.
- **No se publica sola.** Ni por fecha ni de forma automática: alguien debe publicarla de forma explícita.
- Para eliminar una memoria ya cargada hay que indicarlo de forma expresa; omitir la ficha completa no la elimina.

## 3. Evidencias y permisos

Antes de cargar cualquier cifra, nombre, imagen o enlace, confirma los puntos siguientes y anótalos en el inventario.

| Elemento | Qué confirmar |
| --- | --- |
| Cifras y resultados | Fuente verificable y contexto (qué se midió, cuándo, quién lo midió). Si no hay fuente, no se publica. |
| Nombres de personas o equipos | Autorización de la persona o del equipo. Si es menor de edad, autorización de su responsable legal. Sin autorización, no se nombra. |
| Fotos | Permiso de uso de quien aparece y de quien la tomó; texto alternativo que describa la imagen; confirmación de derechos (`rightsConfirmed`). La imagen debe estar en un host de C3 por https. Sin permiso, la foto no se carga. |
| Enlaces de evidencia, recursos y salidas | https absoluto o ruta local que empiece con `/`, sin credenciales. Comprueba que abra y que C3 pueda enlazar esa fuente. |
| Marcas, logos y aliados | Solo los que participaron y autorizaron su uso. No se inventan aliados. |
| Testimonios | Solo con cita textual autorizada y atribuida. Si no los tienes, no se escriben. |

Cada ficha piloto debe tener **fuente y autorización** documentadas. Lo que no las tenga queda en borrador.

## 4. Límites de carga (propuestos)

| Campo | Límite |
| --- | --- |
| Resumen de ficha y resumen de memoria | hasta 12 párrafos de 2.000 caracteres |
| Audiencia y ubicación | hasta 300 caracteres |
| Requisitos y aprendizajes | hasta 20 textos de 500 caracteres |
| Recursos, resultados y salidas | hasta 20 de cada uno |
| Galería | hasta 12 imágenes |
| Títulos y etiquetas | hasta 160 caracteres |
| URL | hasta 2.048 caracteres |
| Contexto y descripción | hasta 1.000 caracteres |
| Valores de resultados | hasta 80 caracteres |
| Documento completo | 500 KiB en UTF-8 |

Si un campo supera el límite, el admin muestra el error y **no borra** tu texto: corrígelo y vuelve a guardar.

## 5. Publicación en vivo de cambios a una ficha ya publicada

Una ficha publicada es la versión pública. **Guardar cambios la modifica en vivo**: no hay borrador paralelo del mismo texto en esta versión. Por eso:

1. **Lee el aviso antes de guardar.** El admin informa que el guardado cambia contenido público.
2. **Pide una segunda revisión** cuando el cambio sea de fondo (cifras, nombres, fechas, enlaces).
3. **Qué cambia en vivo:** el título, el resumen, las secciones, los recursos y la memoria publicada. La dirección (slug) no cambia nunca, aunque cambien el título o las fechas.
4. **Cómo se actualiza el sitio.** Al crear, guardar, despublicar o borrar se solicita la actualización de la ficha y del mapa del sitio. Si no ves el cambio de inmediato, el sitio se refresca solo en poco más de un minuto.
5. **Cambios grandes.** Prepáralos fuera del admin (por ejemplo, en un documento de trabajo) y cárgalos cuando estén aprobados; esta versión no guarda versiones intermedias del mismo texto.
6. **Corregir un error publicado.** Corrígelo en el admin y guarda. Si el dato es sensible, pasa primero la ficha o la memoria a borrador.
7. **Despublicar.** Cambia `publication` a `draft` en la ficha o en la memoria. La dirección sigue reservada y no se reutiliza. La ficha deja de ser pública y su URL devuelve 404 hasta que la publiques de nuevo.
8. **Borrar un evento con ficha.** Es irreversible: el slug queda retirado para siempre; ni siquiera recreando el mismo id se reutiliza.

## 6. Lista de verificación antes de publicar

- [ ] Edición y slug confirmados en el inventario.
- [ ] Cada dato tiene fuente; cada nombre y foto, autorización.
- [ ] Texto en voz «tú», sin voseo, emojis, HTML ni promesas.
- [ ] Sin cifras, puntajes ni fotos inventados; sin etiqueta DEMO.
- [ ] Enlaces comprobados (https o ruta local) y micrositio conservado.
- [ ] Participación visible solo si las inscripciones siguen abiertas.
- [ ] Memoria publicada solo si la edición terminó.
- [ ] Revisión del responsable registrada en el inventario.
