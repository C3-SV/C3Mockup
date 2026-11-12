# Destacado rotativo de eventos en el home · diseño

- **Fecha:** 2026-11-12
- **Estado:** propuesta para aprobación. No se construye nada hasta que el responsable apruebe este documento.
- **Relacionados:** [visión y misión](../../../apps/web/lib/site.ts), [PRODUCT.md](../../../PRODUCT.md), [ADR-0005](../../decisions/0005-decisiones-heredadas-del-ds.md), [ADR-0003](../../decisions/0003-alcance-solo-paginas-existentes.md), [pendientes](../../design-system/pendientes.md).

## 1. Intención

La visión de C3 no cambia: **ser el referente regional de una nueva generación técnica con pertenencia, oportunidades e impacto.** El home ya cumple la entrada (hero, líneas, cifras). Este cambio solo potencia la parte de eventos y experiencias: que el visitante vea un evento grande, con foto cuando exista, que rota entre los eventos vigentes destacados, como en un catálogo de plataformas de streaming. Quien entra debe sentir que es parte de la generación técnica del ecosistema.

## 2. Objetivos, no objetivos y anti-objetivos

**Objetivos**
- Un evento destacado a sección completa, arriba del resto del catálogo, que rota entre los eventos vigentes marcados como destacados.
- El catálogo que sigue debajo, con el mismo lenguaje de tarjetas que ya existe.
- Funciona sin fotos: el ícono de tipo que el sitio ya usa es el respaldo visual.
- El admin llega a tener un sistema de fotos (Fase 2), sin que eso bloquee publicar eventos.

**No objetivos (en esta fase)**
- No cambiar el hero, la visión, la misión, las cifras, las líneas ni el cierre.
- No crear páginas por evento ni slugs (Fase 3, pendiente).
- No subir fotos desde el admin (Fase 2, requiere decisión de almacenamiento y un ADR).
- No cambiar el orden de las secciones del home.

**Anti-objetivos**
- Que parezca una tienda genérica o un carrusel con mucho movimiento.
- Que muestre eventos pasados como destacados. Los pasados no rotan ni aparecen en el bloque.
- Que una foto sin permiso o sin texto alternativo llegue al sitio.

## 3. Decisiones del responsable (12-nov-2026)

1. Base: opción C (evento protagonista encima de la rejilla), con rotación.
2. El evento grande rota entre los eventos destacados vigentes. Ejemplo: hoy la Copa; a veces la Hackathon u otro evento.
3. Los eventos pasados no salen en ese bloque.
4. Mientras no haya fotos, se conservan los íconos de tipo que el sitio ya tiene. Son las fotos de respaldo.
5. Un evento sin foto no bloquea nada: las fotos se agregan después, en masa.
6. Después se hace un sistema de fotos y assets en el admin, de calidad, para jalar las fotos desde ahí.
7. Los slugs y las páginas por evento van a pendientes. Son posteriores.

**Aviso de datos:** con las fechas actuales de los datos por defecto (`packages/config/src/events.ts`), la Copa (1 de agosto de 2026) y la Hackathon (11–12 de julio de 2026) ya son pasadas. Con los datos actuales el bloque **no se mostraría**. Para que rote hay que confirmar fechas reales o cargar eventos vigentes (ver Fase 0).

## 4. Decisiones de diseño (mi llamada, para revisar)

| Tema | Decisión | Por qué |
| --- | --- | --- |
| Dónde vive | Dentro de «Evidencia viva del ecosistema C3», después de su encabezado y antes de la rejilla. | Mantiene el titular, el lead y el enlace al hub, sin mover secciones. |
| Qué entra al bloque | Eventos con `featured = true` y vigentes (`isUpcomingEvent`), ordenados por fecha, máximo 5. | Es lo que pidió el responsable: destacados, no pasados. |
| Cuántos | 0 → el bloque no se muestra. 1 → se muestra fijo, sin controles. 2 o más → rota. | Evita controles inútiles y un bloque vacío. |
| Rotación | Automática cada 8 s, con pausa. Con movimiento reducido, no rota. | Netflix/Disney rotan; la pausa y el movimiento reducido son obligatorios (ver §5.4). |
| Evento en el bloque | Sale de la rejilla para no repetirse en la misma pantalla. | Evita duplicados visibles. |
| Próximas iniciativas | Sigue existiendo y no repite los eventos que ya están en el bloque. Si queda vacía, no se muestra. | Conserva la sección actual sin duplicar. |
| Sin foto | Fondo con el tinte de la línea y el ícono de tipo, centrado. | Es el respaldo que pidió el responsable. |
| Enlace del botón | Usa el `cta` del evento; externo abre en pestaña nueva. | Igual que hoy en las tarjetas. |

## 5. Comportamiento del bloque (Fase 1)

### 5.1 Qué eventos entran

- Conjunto R = eventos con `featured = true` y `isUpcomingEvent(event, now)`.
- Orden: `eventDate` ascendente; sin fecha al final.
- Máximo 5. Si hay más, se muestran los 5 primeros por fecha.
- Se calcula en cada render. La página ya tiene `revalidate = 60`.

### 5.2 Rotación y controles

- Diapositivas en una pista con `scroll-snap`. Sin JavaScript se ve la primera diapositiva y se puede deslizar.
- Rotación: cada 8 s, avanza a la siguiente y vuelve al inicio.
- Se pausa al pasar el puntero, al enfocar cualquier control dentro del bloque y con el botón **Pausar / Reanudar**.
- Controles (todos con área de 44 px): anterior, siguiente, puntos (uno por evento) y pausa.
- En móvil, deslizar con el dedo funciona de forma nativa.
- Textos de controles (propuestos, pendientes de aprobación): «Evento anterior», «Evento siguiente», «Pausar», «Reanudar», «Mostrar evento N de M: título».

### 5.3 Visual y respaldo sin foto

- Imagen 16:9 a todo el ancho en móvil (unos 201 px a 390 px). En escritorio, altura fija de 320 px con `object-fit: cover`.
- Con foto válida (Fase 2): la foto de portada, con su texto alternativo.
- Sin foto (hoy): fondo con el tinte de la línea del evento (la primera si tiene varias) y el ícono de tipo (`KindIcon`) a 96 px en escritorio y 72 px en móvil, con la misma opacidad que hoy (0.45). El ícono es decorativo: `aria-hidden`.
- Sin tipo: el ícono genérico actual (cuatro rayos).
- Panel de texto sólido navy debajo de la imagen, como en la maqueta C. Sin degradados ni capas translúcidas sobre la foto (ADR-0008).
- Contenido del panel: línea (con punto de color y texto), estado (pastilla fuera de la imagen), título, resumen en 3 líneas, fecha y botón.

### 5.4 Movimiento y accesibilidad

- Pausa obligatoria para contenido que se mueve más de 5 s (WCAG 2.2.2). Por eso existe el botón y la pausa al enfocar.
- `prefers-reduced-motion: reduce`: no rota, no hay transición de diapositiva y los controles siguen funcionando.
- Transición de diapositiva: 500 ms, desvanecido. Sin escalado ni rebote.
- Región: `role="region"`, `aria-roledescription="carrusel"`, `aria-label="Eventos destacados"`.
- Diapositiva: `role="group"`, `aria-roledescription="diapositiva"`, `aria-label="N de M: título"`.
- Durante la rotación, el texto del bloque no se anuncia en vivo (`aria-live="off"`). Al pausar, el anuncio es de lectura normal.
- Teclado: las flechas izquierda y derecha cambian de evento cuando el foco está dentro de la región.
- Foco visible de 3 px con `--c3-foco`, con desplazamiento de 2 px.
- Contraste: texto blanco sobre navy (no sobre la foto).

### 5.5 Rejilla y Próximas iniciativas

- La rejilla muestra todos los eventos que no están en el bloque, en el orden actual (`compareEventsBySchedule`), de 6 en 6. Sin cambios en su diseño.
- Próximas iniciativas excluye los eventos que están en el bloque. Ya no tiene respaldo con destacados terminados (ver §14).
- La rejilla muestra todo el catálogo; los pasados van al final, marcados «Histórico» (decisión del responsable, §14).

## 6. Admin (Fase 1)

Cambios mínimos, solo lo necesario para que el respaldo por tipo funcione y no se pierdan datos.

1. **Campo «Tipo de experiencia»** (opcional): competencia, hackathon, taller, charla, encuentro, reto. Hoy el admin no tiene este campo (`apps/admin` no contiene `kind`), así que los eventos creados o editados desde el admin pierden el tipo y caen al ícono genérico.
2. **Dejar de borrar datos al guardar.** `sanitizeEventPayload` (`apps/admin/lib/firebase-admin.ts`) no conserva `kind`, `source` ni `cover`, y las escrituras usan `set(record, { merge: false })` en las líneas 224, 245 y 268. Cada guardado borra esos campos. Se corrige con prueba antes de cualquier otro cambio (Fase 0).
3. **Texto del checkbox «Destacado».** Hoy dice «Aparece primero en la portada y en el catálogo», y no es cierto. Propuesta para aprobar: «Puede aparecer en el destacado rotativo de la portada mientras el evento esté vigente.»
4. Sin campo de foto en Fase 1.

## 7. Fase 0: prerrequisitos (antes de cualquier cambio visible)

- **a)** Confirmar que producción lee Firestore. Revisar en los logs de Vercel si aparece «Falling back to bundled events data». Si aparece, la web muestra datos por defecto y el bloque nunca se verá con datos reales.
- **b)** Corregir la clave privada en `apps/web/lib/events.ts`, línea 23. Hoy el reemplazo es `privateKey.replace(/\n/g, "\n")`, que no cambia nada. Debe ser `/\\n/g` como en el admin. Con prueba antes del cambio.
- **c)** Corregir la pérdida de datos del admin (§6, punto 2), con prueba.
- **d)** El responsable confirma las fechas reales de la Copa, la Hackathon y los demás eventos. Sin eventos vigentes destacados, el bloque no aparece.
- **e)** El responsable decide si el Hackathon de Turismo Creativo I puede aparecer destacado. El documento maestro (§3.2 y §11.4) pide confirmación antes de publicarlo.

## 8. Fase 2: sistema de fotos y assets en el admin (planificado, no se construye ahora)

- **Subir desde el admin:** JPG, PNG o WebP. No SVG ni GIF. Recorte 16:9 en el navegador, exportación a WebP y tope de 400 KB tras optimizar. Texto alternativo obligatorio. Casilla de derechos de uso; si aparecen personas menores, autorización de tutores (DS §10, PRODUCT.md regla 2, maestro §11.4).
- **Almacenamiento:** Firebase Storage privado, servido desde una ruta de c3.com.sv (`/media`), o un subdominio `media.c3.com.sv`. La decisión va en **ADR-0012**, que reemplaza la fila «sin subida de archivos» de ADR-0005 (2026-11-04).
- **Biblioteca de medios (assets):** las fotos subidas quedan en una biblioteca. Un evento elige una. Reemplazar o quitar la foto no borra el evento. Una foto puede reutilizarse en varios eventos.
- **Carga en masa:** subir varias y asignarlas desde una lista. Mi propuesta; se confirma en Fase 2.
- **Orden del bloque:** un campo opcional «Orden en el destacado» para elegir qué evento va primero. Se decide en Fase 2.
- **Calidad de las fotos finales:** fuente de al menos 1920 × 1080 píxeles para 16:9.
- **Regla:** un evento sin foto siempre se puede publicar. Su respaldo es el ícono de tipo.

## 9. Fase 3: página por evento (pendiente)

Cada evento con su propia página, por ejemplo `/eventos/copa-salvadorena-programacion` (el id actual del evento), con slug estable, redirecciones, metadatos y Open Graph por evento. ADR-0003 limita el alcance a páginas existentes, así que requiere ADR y contenido por evento. Queda registrado en [pendientes](../../design-system/pendientes.md).

## 10. Verificación (antes de decir «listo»)

Según AGENTS.md §5, con salida real pegada en el PR:

- **TDD:** primero las pruebas, en rojo.
  - Selección de rotación: destacados vigentes, orden por fecha, máximo 5, vacío, uno solo.
  - Exclusión: la rejilla y Próximas iniciativas no repiten los eventos del bloque.
  - Respaldo de ícono: por tipo y genérico.
  - Clave privada (Fase 0, b) y conservación de datos del admin (Fase 0, c).
- **Componente:** pausa al puntero y al foco; sin rotación con movimiento reducido; teclado; etiquetas.
- **E2E a 390 y 1280 px:** sin scroll horizontal de la página; axe sin violaciones serias o críticas; controles de 44 px; movimiento reducido.
- **Capturas** a 390 y 1280 px para revisión del responsable.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm test:e2e`.

## 11. Preguntas para el responsable (ordenadas por importancia)

1. ¿La rejilla debajo sigue mostrando eventos pasados marcados «Histórico», o solo los vigentes?
2. ¿Rotación automática cada 8 s con pausa (mi propuesta), o solo manual con flechas y puntos?
3. ¿Cuáles son las fechas reales de la Copa, la Hackathon y los demás eventos? Sin eventos vigentes destacados, el bloque no aparece.
4. ¿El Hackathon de Turismo Creativo I puede aparecer destacado?
5. ¿Se aprueban los textos nuevos? Controles («Pausar», «Reanudar», «Evento anterior», «Evento siguiente»), el campo «Tipo de experiencia» y el texto del checkbox «Destacado».
6. Fase 2, puede esperar: ¿Firebase Storage con ruta en c3.com.sv, o subdominio `media.c3.com.sv`?

## 12. Registro de decisiones

- **ADR-0011** (se redacta al aprobar): variante de destacado rotativo a sección completa con respaldo por tipo de experiencia. El DS no la define; el medio de 132 px de la tarjeta sigue igual en la rejilla.
- **ADR-0012** (Fase 2): fotos y medios del admin. Reemplaza la fila de ADR-0005 sobre subida de archivos.
- El número 0009 no existe en `docs/decisions/`. Se usa 0011 para no reutilizar un hueco.

## 13. Fuera de alcance

- Slugs y páginas por evento (Fase 3).
- Fotos reales (llegan después, en Fase 2).
- Cambios en hero, visión, misión, cifras, líneas o cierre.
- Cambios en `/eventos` y en las páginas de línea (siguen igual).
- Cambios visuales en el admin fuera de los campos indicados.

## 14. Estado de la implementación (12-nov-2026)

Respuestas del responsable: (1) la rejilla muestra también los pasados, al fondo; (2) rotación automática, y el admin también permite ordenar los destacados; (3) las fechas guardadas en Firestore son las reales; (4) la Hackathon de Turismo Creativo I puede aparecer destacada.

Cambios frente a la propuesta original:

- **Próximas iniciativas ya no usa destacados terminados como respaldo.** Sin próximos, conserva el encabezado y dice «Por ahora no hay iniciativas próximas.», o dice que las iniciativas con fecha están en el destacado de abajo. Textos nuevos pendientes de aprobación (P3 en pendientes.md).
- **El destacado requiere fecha.** Un destacado sin fecha no entra al bloque; así no se queda para siempre.
- **Pausa:** la manual persiste; la temporal (puntero de ratón o foco dentro del bloque) se levanta al salir; también se pausa fuera de pantalla.
- **Sin deslizamiento táctil propio.** Móvil usa los botones de 44 px y los puntos; los puntos pasan a otra línea si no caben.
- **Tipo de experiencia como texto** («Competencia», «Hackathon»…) además del ícono, para que no dependa solo del dibujo.
- **Admin:** campos «Tipo de experiencia» y «Orden en el destacado». El texto del checkbox «Destacado» cambió a: «Puede aparecer en el destacado rotativo de la portada mientras el evento esté vigente.»
- **Datos:** con las fechas guardadas en producción, la Copa (hasta el 5 de sept. de 2026) y la Hackathon (julio de 2026) ya son pasadas. No hay destacado vigente hasta que se carguen eventos vigentes.

Verificación: pruebas unitarias y de componentes (220), pruebas E2E (186 pasadas, 24 omitidas, como antes), lint, typecheck y build. Vista previa visual del bloque en 1280 y 390 px con fechas de ejemplo, con una ruta temporal que se borró después.

Fase 2 (fotos desde el admin, biblioteca de medios) sigue en §8 y requiere ADR-0012.
