# Páginas institucionales de eventos, memorias y resultados

- Fecha: 2026-11-13.
- Estado: propuesta para revisión; decisiones del responsable registradas abajo. No autoriza implementación.
- Plan: [eventos-memorias](../plans/2026-11-13-eventos-memorias.md).
- Dirección: sitio institucional informativo; la plataforma de inscripción es posterior.

## 1. Intención y decisiones confirmadas

Cada edición tiene una ficha permanente en /eventos/{slug}. Antes informa; después conserva memoria y resultados. El responsable confirmó: conservar sitios especiales de Copa y Hackathon; editar desde admin con secciones estructuradas; una ficha por edición. Los resultados por experiencia viven aquí. No crear ahora una página global de impacto.

## 2. Enfoques considerados

1. Ficha institucional y sitios especiales enlazados: elegido por el responsable; conserva campañas y añade memoria permanente.
2. Sustituir también los sitios especiales: descartado para esta iniciativa.
3. Archivos editoriales en Git: descartado por el responsable; eligió admin.

Propuesta del implementador: ampliar los registros existentes de Firestore; contenido estructurado sin HTML libre ni editor enriquecido. Publicación explícita de ficha y memoria, sin publicar automáticamente por fecha. No depende del sistema de subida de fotos P2: primera versión sin medios o con URLs autorizadas.

## 3. Estado actual y alcance

EventItem en packages/config/src/events.ts contiene resumen, fechas, líneas, estado, CTA y href; no tiene ficha ni memoria. El admin usa buildAdminEventRecord y escrituras con merge:false: cada campo nuevo debe recorrer formulario, normalización, API, persistencia y parser público. El catálogo y el destacado usan toCatalogCard. getPublicEvents usa datos por defecto cuando Firestore falla; esa recuperación no debe fabricar una ficha.

Dentro: modelo, edición funcional del admin, publicación, ruta, enlaces, SEO, revalidación, migración revisable y documentación. Fuera: rediseño del admin, inscripción, cuentas, biblioteca de medios, newsletter, blog, galería global de proyectos y reordenamiento general del catálogo P8.

## 4. Identidad, direcciones y compatibilidad

- id de Firestore permanece estable. No renombrar documentos existentes ni reutilizar una edición para el año siguiente.
- Campo page.slug: minúsculas ASCII, números y guiones, 3–120 caracteres, patrón ^[a-z0-9]+(?:-[a-z0-9]+)*$. Elegido al crear la ficha; no cambia después del primer guardado. Sugerir nombre y edición solo si están confirmados.
- Reserva única en colección eventPageSlugs/{slug}, con { eventId: string; retired: boolean }, mediante transacción junto al documento events/{id}. Dos guardados concurrentes no pueden reservar el mismo slug.
- Despublicar conserva la reserva activa. Borrar un evento con ficha marca retired:true y elimina el evento en la misma transacción; un slug retirado no se reutiliza, ni siquiera recreando el mismo eventId. Lectura pública ignora reservas retiradas.
- Sin alias nuevos inicialmente porque los slugs son inmutables. Las rutas existentes /copa, /copa/:path*, /hackathon y /hackathon/:path* conservan sus redirecciones actuales; no redirigir sus subdominios.
- El id antiguo no es automáticamente un alias: solo redirigir una dirección si se documenta como dirección pública previa y se prueba su correspondencia. Sin regla general que pueda ocultar un 404.
- Cambiar título o fechas no cambia la URL. Ediciones futuras reciben otro id y slug.

## 5. Contrato de contenido propuesto

Definir EventItem.page?: PublicEventPage para consumidores públicos. AdminEventRecord será Omit<EventItem, "page"> & { page?: EventPage; createdAt: string; updatedAt: string }. EventPage/Memory son administrativos; PublicEventPage tiene publication:"published" y memory?:PublicEventMemory; PublicEventMemory tiene publication:"published" y galería sin rightsConfirmed. Tipos en packages/config/src/event-page.ts; exports desde index.ts. parseEventDocument y getPublicEvents devuelven EventItem público; formulario y API autenticada usan AdminEventRecord.

EventPage:
- slug: string.
- publication: "draft" | "published".
- overview: string[] (párrafos).
- audience?: string; requirements?: string[].
- modality?: "presencial" | "virtual" | "hibrida"; location?: string.
- participation?: { label: string; url: string }; acción transaccional externa opcional.
- resources: Array<{ title: string; url: string }> (materiales).
- memory?: EventMemory.

EventMemory:
- publication: "draft" | "published".
- summary: string[]; learnings: string[].
- results: Array<{ label: string; value: string; context: string; evidenceUrl?: string }>.
- outputs: Array<{ title: string; description: string; url?: string }> (proyectos u otros resultados).
- gallery: Array<{ url: string; alt: string; caption?: string; rightsConfirmed: true }>.

Límites propuestos: overview y summary hasta 12 párrafos de 2.000 caracteres; audiencia y ubicación hasta 300; requisitos y aprendizajes hasta 20 textos de 500; recursos, resultados y outputs hasta 20; galería hasta 12 imágenes; títulos/etiquetas hasta 160, URL hasta 2.048, contexto/descripción hasta 1.000, valores hasta 80. Texto plano escapado por React; no HTML/Markdown ejecutable. Documento serializado máximo 500 KiB UTF-8, validado antes de escribir. Fallos de validación del admin son visibles, no se borran valores silenciosamente.

URL de recursos, evidencia, outputs y participación: https absoluto o ruta local que empiece con / y no //, sin credenciales. Medios: reutilizar la restricción de host C3 por https de normalizeEventCover, alt no vacío y confirmación de derechos. No añadir nuevos hosts por esta iniciativa.

Para publicar ficha: slug reservado, overview no vacío y datos obligatorios actuales válidos. Campos opcionales vacíos no generan secciones. Para publicar memoria: ficha publicada y summary no vacío; no exigir cifras o fotos. Los arrays ausentes se normalizan a []. En actualización, omitir page conserva la ficha existente para clientes antiguos; page:null se rechaza (para despublicar usar publication:draft). Enviar memory:null elimina expresamente la memoria; omitir page entera no la elimina. Un payload page presente debe ser completo y se valida como tal. create/update/upsert/seed respetan las mismas invariantes; el seed no sobrescribe campos de ficha ni createdAt al actualizar registros existentes.

publication es editorial, no el estado del evento. Se puede preparar memoria en borrador; publicarla exige la fecha de finalización confirmada y pasada o estado Histórico. No convertir automáticamente una memoria en pública. Guardar una ficha ya publicada modifica su contenido público: la UI lo informa; no hay versiones paralelas de un mismo texto en esta versión.

## 6. Proyección pública y comportamiento

parseEventDocument omite page si está en borrador o es inválida. Si page está publicada, elimina siempre memory en borrador y campos internos de derechos de la proyección enviada al navegador. No enviar borradores en props, JSON-LD, metadata ni respuestas de catálogo. Los fallos opcionales no descartan el evento base.

getPublicEventBySlug(slug): Promise<EventItem | null> resuelve por índice de slug y documento real de Firestore; usa la misma proyección pública. No usa defaultEvents para resolver detalles. Sin reserva activa, documento, ficha publicada o dato válido: 404. Fallo de infraestructura: error recuperable del servidor, sin simular 404 ni sustituirlo por otro evento.

Si existe ficha publicada, toCatalogCard apunta internamente a /eventos/{slug}, con acción "Ver evento" o "Ver memoria" si hay memoria publicada. Dentro de la ficha se conserva el enlace original al sitio especial. Sin ficha publicada se mantiene cta/href/external actual.

Para evento terminado no mostrar una acción que invite a inscribirse. La fecha y estado se evalúan con el helper de la ficha y día local America/El_Salvador; un rango vigente incluye su día final. Fechas ausentes o inválidas no permiten inferir finalización. Solo mostrar participation si el estado es Inscripciones abiertas y se ha confirmado que la edición no terminó; con fecha desconocida, ocultarla y conservar el enlace informativo al sitio especial.

## 7. Presentación y accesibilidad

PageShell ds; título, resumen, línea, estado y fechas; información práctica; participación si procede; memoria y resultados cuando estén publicados; recursos; sitio especial. Breadcrumb Inicio → Eventos → título real. Un h1, secciones con encabezados, enlaces descriptivos y anclas si el contenido es largo. Sin secciones vacías ni métricas de ejemplo.

Tokens --c3-* y clases c3-*; acción violeta, Montserrat/Poppins, foco 3px, objetivo táctil ≥44px. Una nueva hoja event-detail.css solo con reglas necesarias; registrar variantes nuevas del DS. Imágenes con alt y dimensiones; no carrusel automático ni video automático. Funciona a 390 y 1280 px sin scroll horizontal y con movimiento reducido.

## 8. SEO y actualización

- Metadata y canonical propios; reutilizar createPageMetadata con opciones de imagen opcionales, sin alterar los demás consumidores. Usar OG institucional por defecto; portada autorizada solo cuando pueda presentarse correctamente.
- Params de Next 16 son Promise y se esperan en página y generateMetadata. Consultar documentación local indicada en el plan.
- JSON-LD WebPage y BreadcrumbList congruentes con contenido visible. Event solo si se conocen los campos exigidos por la documentación oficial vigente; nunca inventar horarios, lugar ni offers para lograr rich results.
- Sitemap agrega solo fichas publicadas desde documentos reales, con updatedAt real y URL canónica. No agrega borradores, reservas huérfanas ni defaultEvents como fichas.
- Revalidar patrón /eventos/[slug] con tipo page desde webhook autenticado al crear, guardar, despublicar o borrar. Extender allowlist compartida de forma acotada; conservar las cinco rutas actuales y actualizar /sitemap.xml. Mantener revalidate=60 como respaldo, también para cambios de visibilidad.
- Las listas JSON-LD deben enlazar la misma ficha que las tarjetas, evitando divergencias. P9 (nombre de ItemList de la home) sigue como pendiente aparte.

## 9. Migración y publicación

Inventariar ediciones reales, fechas y contenidos con el responsable. Preparar propuesta de ids/slugs por edición sin deducir que una Copa sin año pertenece a determinada edición. Herramienta de migración con dry-run por defecto, aplicación explícita, detección de colisiones y copia recuperable segura. No sobrescribir textos ni fechas automáticamente.

Solo migrar eventos seleccionados; los demás siguen funcionando como antes. Probar un borrador y luego una ficha completa real. No escribir en Firestore ni publicar al ejecutar este trabajo de planificación.

## 10. Documentación y aceptación

Actualizar alcance mediante ADR nuevo (0012 sigue reservado para medios); reflejar la ampliación funcional del admin y nuevas páginas en PRODUCT.md y AGENTS.md según corresponda. Actualizar P1 sin marcar implementación realizada. La restricción anterior del rework no impide esta ampliación expresamente solicitada, pero no autoriza rediseños adicionales.

Aceptación: una edición conserva URL y micrositio; borradores privados; colisiones bloqueadas; memoria sin cifras funciona; ausencia de fotos funciona; guardado conserva datos existentes; fichas publicadas accesibles, indexables y actualizables; 404 y errores diferenciados; regresiones de catálogos evitadas. Pruebas y checklist completo de AGENTS.md §5 al implementar.

## 11. Decisiones por revisar

Los límites, contrato estructurado, slug inmutable, reservas tras borrado y publicación sin versiones paralelas son propuestas del implementador, no respuestas atribuidas al responsable. Aprobar la spec antes de ejecutar. Copy editorial y migración concreta requieren material real.

### Conservación de contenido al cambiar tarjetas

El baseline actual exige textos y destinos de los CTA antiguos por página. La aprobación de esta spec autoriza proponer una excepción editorial acotada para tarjetas migradas, conservando el baseline original. Al ejecutar, crear e2e/content-approved-changes.json con ruta, texto/href original, eventId/slug nuevo, destino esperado del micrositio en la ficha y referencia al ADR aprobado. La prueba de conservación solo admite entradas exactas de ese registro, verifica el nuevo enlace interno y prueba el CTA original dentro de la ficha; todas las otras expectativas siguen intactas. No suprimir globalmente enlaces externos ni regenerar baseline ni usar voseo-map. Si esta excepción no se aprueba, mantener enlaces secundarios explícitos originales en las páginas afectadas. Ningún cambio a titulares queda autorizado por esta excepción.
