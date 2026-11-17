# Eventos, memorias y resultados · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar fichas permanentes por edición, editables desde el admin, con memoria y resultados aprobados.

**Architecture:** Extender el modelo compartido y los eventos existentes de Firestore. Mantener slug único e inmutable, separar proyección pública de borradores, renderizar detalle servidor y conservar micrositios y CTA originales como enlaces informativos.

**Tech Stack:** Next.js 16.2.5, React 19.2.4, TypeScript, Tailwind v4, tokens/clases C3, Vitest/Testing Library, Playwright y axe; pnpm 11.

**Spec:** [2026-11-13-eventos-memorias-design.md](../specs/2026-11-13-eventos-memorias-design.md).

**Estado:** código implementado hasta T6 en la rama `eventos-memorias` (13-nov-2026). **No aprobado para producción:** siguen pendientes la aprobación de la spec y del ADR-0014, el inventario real, el contenido editorial, el gate de Firestore de pruebas, la revisión de acceso del admin y las revisiones manuales. Las casillas abiertas llevan su motivo; no confundir una casilla de redacción con una tarea de producto terminada.

## Global Constraints

- Sitio institucional informativo; plataforma de inscripción fuera de alcance. Contenido real, voz tú; sin DEMO, datos, fotos, testimonios o promesas inventadas.
- DS vigente: tokens --c3-*, clases c3-*, acción violeta, Montserrat/Poppins; foco 3px y área táctil ≥44px; movimiento reducido.
- Conservar contenido y destinos actuales salvo cambios específicos aprobados en la spec. No reescribir baseline para ocultar regresiones.
- Leer guías locales de Next en apps/web/node_modules/next/dist/docs/ antes de escribir código; el enlace node_modules/next de raíz no existe en este checkout.
- No rediseñar admin ni packages/ui. No instalar dependencias nuevas sin revisar origen/licencia; las versiones de herramientas de pruebas existentes se pueden reutilizar en el workspace.
- Rama por fase desde dev conforme AGENTS.md §7 y ADR-0007; comprobar checkout y cambios del usuario antes de empezar. No commit a main.
- Cada tarea funcional: prueba significativa roja → implementación → verde → commit convencional con casilla marcada. No ejecutar escrituras de producción en pruebas.
- Cierre de implementación: pnpm lint, pnpm typecheck, pnpm build y pnpm test; pnpm build:web antes de pnpm test:e2e; 390/1280 px, axe, foco, zoom y movimiento reducido. Evidencias y checklist DS §15.5 en PR.

## Review Focus

1. Dos administradores reservan el mismo slug simultáneamente: uno guarda y el otro recibe conflicto sin escritura parcial (T2).
2. Un borrador o memoria no publicada nunca llega a HTML, props, metadata, sitemap o JSON-LD, ni reaparece desde fallback (T1/T4/T5).
3. Guardar un evento legado conserva kind, cover, source, featuredOrder y todas las secciones nuevas; quitar una sección es explícito (T1/T2/T3).
4. Evento en curso, terminado o sin fechas: acción de inscripción y memoria no se infieren erróneamente; fin de día local incluido (T1/T4).
5. Editar/despublicar/borrar ficha invalida detalle y sitemap; un fallo del webhook se informa sin borrar el evento ni fingir actualización inmediata (T5/T6).

---

## Orden y prerrequisitos

T0 → T1 → T2 → T3 → T4 → T5 → T6. T4 puede prepararse con fixtures después de T1, pero no publicarse antes de persistencia/revisión. Esta iniciativa no espera la biblioteca P2. No se rellena contenido real por deducción.

### T0: Contrato editorial, alcance y migración propuesta

**Files:** crear docs/content/eventos/inventario-ediciones.md y docs/content/eventos/guia-editorial.md; modificar PRODUCT.md, AGENTS.md y docs/design-system/pendientes.md al ejecutar; crear ADR de ampliación con siguiente número libre, sin usar 0012.

**Interfaces:** produce inventario con eventId, edición confirmada, slug, micrositio, contenido disponible, permisos, responsable y estado de revisión.

- [ ] Inventariar registros reales en lectura autorizada, sin exportar datos sensibles; confirmar ediciones y slugs con el responsable. No inferir el año de un título genérico. *(pendiente: lectura autorizada de registros reales y confirmación del responsable; el inventario es una plantilla sin datos)*
- [ ] Aprobar spec y contratos de publicación, límites y reserva permanente de slug. Registrar actualización de alcance respecto a ADR-0003 y cambios funcionales acotados del admin. *(ADR-0014 redactado como Propuesta en 9d5f57f; pendiente: aprobación del responsable)*
- [x] Redactar guía de carga: antes del evento, memoria posterior, evidencias y permisos. Detallar publicación en vivo de cambios a ficha ya publicada. *(guía redactada como borrador en 9d5f57f; pendiente: aprobación editorial y añadir la regla de ediciones de un solo día, que necesitan fecha final o Histórico para publicar la memoria)*
- [ ] Revisar que cada piloto tenga fuente y autorización; contenido pendiente queda en borrador. *(pendiente: sin contenido real ni permisos confirmados; todo queda en borrador)*
- [x] Commit documental: docs: especificar fichas y memorias por edición. *(9d5f57f; precisado en 9c1d689)*

### T1: Modelo, validación y proyección pública

**Files:** crear packages/config/src/event-page.ts; modificar events.ts, admin-event.ts e index.ts en ese paquete; modificar apps/web/lib/events-parse.ts; crear apps/web/tests/unit/event-page.test.ts; ampliar events-model.test.ts y las pruebas existentes de buildAdminEventRecord (localizarlas con rg).

**Interfaces:**
- EventPage y EventMemory: contrato y límites de spec §5.
- PublicEventPage: solo contenido publicado; no publication de borradores ni rightsConfirmed.
- EventItem.page?: PublicEventPage; AdminEventRecord = Omit<EventItem, "page"> & { page?: EventPage; createdAt: string; updatedAt: string }. Actualizar consumidores del admin al tipo administrativo cuando corresponda.
- validateEventPage(input: unknown, context: { event: Pick<EventItem, "status" | "eventDate" | "eventDateEnd">; now: string }): { ok: true; value: EventPage } | { ok: false; errors: Record<string,string> }.
- projectPublicEventPage(page: EventPage | undefined): PublicEventPage | undefined.
- getEventPagePhase(event: Pick<EventItem, "status" | "eventDate" | "eventDateEnd">, now: Date): "upcoming" | "ongoing" | "ended" | "unknown".
- getEventPageHref(event: Pick<EventItem, "page">): string | undefined.

- [x] Escribir pruebas: draft → undefined; ficha publicada/memoria draft → sin memory; galería pública no contiene rightsConfirmed; evento sin page conserva salida anterior. Assert concreto: expect(projectPublicEventPage(draft)).toBeUndefined(). *(24b88e9)*
- [x] Añadir casos límite: slug mayúsculas/colisión sintáctica, tamaño >500 KiB, HTML mostrado como texto, javascript:/data:/URLs // y credenciales rechazados; imagen sin alt/derechos rechazada; arrays vacíos válidos; límites exactos de spec. *(24b88e9, 1c8ac67)*
- [x] Añadir matriz temporal con now fijo en America/El_Salvador: día de inicio, día final, día siguiente, fecha inválida/ausente; memoria sin fecha ni Histórico no publicable. No cambiar compareEventsBySchedule global. *(24b88e9, 1c8ac67)*
- [x] Ejecutar pnpm --filter @c3/web exec vitest run tests/unit/event-page.test.ts tests/unit/events-model.test.ts; comprobar rojo por API ausente. *(rojo registrado en el informe de T1)*
- [x] Implementar normalización y validación; builder preserva/valida page administrativa; parser público proyecta contenido y omite bloques inválidos sin perder evento legado. Eliminar undefined recursivamente antes de Firestore. *(24b88e9)*
- [x] Repetir pruebas específicas y pnpm typecheck; guardar evidencia verde. Commit feat(config): modelar fichas y memorias de eventos. *(24b88e9, 1c8ac67; typecheck verde tras reparar node_modules)*

### T2: Persistencia transaccional e identidad estable

**Files:** crear apps/admin/lib/event-page-repository.ts; modificar apps/admin/lib/firebase-admin.ts y rutas apps/admin/app/api/events/route.ts y [id]/route.ts; crear apps/admin/vitest.config.ts, tests/setup.ts y tests/event-page-repository.test.ts; modificar apps/admin/package.json para script test y herramientas de prueba de las versiones ya presentes, y tsconfig si la config necesita exclusión.

**Interfaces:**
- saveEventWithPage(db: Firestore, record: AdminEventRecord): Promise<AdminEventRecord>.
- events/{id} y eventPageSlugs/{slug}: { eventId: string; retired: boolean }, actualizados en una transacción. Sin page se conserva el guardado legado.
- ApiError con status 409 para colisión/cambio de slug, 400 para datos inválidos; auth previa existente conserva 401/403.
- El primer slug guardado es inmutable. Despublicación conserva reserva activa; borrar retira reserva y elimina evento atómicamente. Reserva retirada bloquea también recreación con igual id. Registro existente manda frente a payload que intente cambiar id o createdAt.
- upsertAdminEvents y seed también usan invariantes del repositorio: no dejar rutas alternativas que omitan reservas. Actualización desde cliente antiguo sin page preserva ficha; page:null se rechaza, memory:null elimina memoria de forma explícita; createdAt existente se conserva. Añadir deleteEventWithPage(db: Firestore, id: string): Promise<void> y usarlo en deleteAdminEvent.

- [x] Pruebas con adaptador Firestore simulado: crear reserva+evento atómicos, editar mismo propietario, colisión 409, slug modificado 409, payload malicioso de id, borrar con retired:true, recreación de igual id bloqueada, carga masiva/seed y cliente antiguo conservan ficha, memoria vaciada de forma explícita y guardado legado sin pérdida. *(c6ec35c, bc64ed6, 4d58a1e)*
- [ ] Probar dos transacciones competidoras con conflicto/reintento simulado: solo una escritura efectiva. En entorno Firebase de prueba, confirmar la misma invariante antes de cierre; no usar proyecto productivo. *(hecho con adaptador simulado en 4d58a1e y una corrida en emulador local, en c6ec35c, no repetida en HEAD; bloqueado: sin proyecto Firestore de pruebas autorizado)*
- [x] Ejecutar pnpm --filter @c3/admin test → rojo; implementar repositorio y manejo de errores, integrarlo en create/update/upsert conservando autorización. *(8c85579, c6ec35c)*
- [x] Repetir pruebas y typecheck admin/web. Sin cuenta autorizada, las pruebas no sustituyen una revisión real de administración; registrar pendiente de revisión de acceso. *(pruebas y typecheck verdes; pendiente: revisión de acceso real del admin con cuenta autorizada, registrada en pendientes.md)*
- [x] Commit feat(admin): guardar fichas con slug único y estable. *(c6ec35c; correcciones bc64ed6 y 4d58a1e)*

### T3: Formulario estructurado del admin

**Files:** modificar apps/admin/lib/admin-types.ts, components/admin-events.tsx, admin-event-form.tsx, admin-event-editor-page.tsx y lib/admin-api.ts; crear components/admin-event-page-fields.tsx y tests/admin-event-page-fields.test.tsx. Añadir dependencias Testing Library/jsdom de las versiones ya usadas y configuración al harness T2 si hace falta.

**Interfaces:** EventDraft añade page?: EventPage; normalizeDraft(event?: AdminEventRecord | null): EventDraft conserva todas las secciones; EventPageFields({value,onChange,errors,event}): editor de bloque, callbacks sin persistencia propia. Mantener APIs onSubmit y validación actual; la UI no es autoridad de seguridad.

- [x] Prueba de interacción: cargar ficha publicada con memoria, cambiar solo título y enviar → conserva slug, gallery/results/resources y campos legados. Añadir/quitar filas produce payload exacto; errors.page.overview es visible y se asocia al control. *(716558b, b9649d8)*
- [x] Prueba: marcar memoria publicada con datos incompletos impide enviar y muestra causa; etiqueta advierte que cambios de ficha publicada se hacen públicos; slug existente no editable; validación 409 del servidor llega al usuario. *(716558b, b9649d8)*
- [x] Ejecutar pnpm --filter @c3/admin test → rojo. *(rojo registrado en el informe de T3)*
- [x] Implementar grupos Ficha, Participación, Recursos, Memoria/Resultados y Fotos mediante controles existentes de packages/ui; añadir/quitar elementos, publication explícita y confirmación de derechos. Sin editor HTML ni subida. *(716558b)*
- [x] Mantener normalización en una sola función; evitar dos modelos de draft divergentes y conservar cover/source en ida y vuelta. *(716558b)*
- [ ] Verde, typecheck y lint admin; revisión de teclado/móvil con datos de prueba. Commit feat(admin): editar fichas y memorias estructuradas. *(commits 716558b, b9649d8, e07742f; verde, typecheck y lint hechos; pendiente: revisión manual de teclado y móvil)*

### T4: Detalle público y enlaces de tarjetas

**Files:** crear apps/web/lib/event-detail.ts, app/eventos/[slug]/page.tsx, components/events/EventDetail.tsx, app/ds/event-detail.css, tests/unit/event-detail.test.ts y components/events/EventDetail.test.tsx; modificar lib/ds/event-card.ts y app/globals.css.

**Interfaces:** getPublicEventBySlug(slug: string): Promise<EventItem | null>, consulta índice+documento real y proyecta; errores de infraestructura se propagan. Componente EventDetail({event,now}: {event: EventItem; now: Date}). Página async con params: Promise<{slug:string}> y revalidate=60.

- [x] Pruebas de repositorio: slug sin reserva, evento borrado o draft → null; Firestore caído → rechazo, no null ni defaultEvents. Fixture de defaultEvents no habilita ficha. *(81b5868)*
- [x] Pruebas render: memoria sin cifras/fotos no deja encabezados vacíos; pasado oculta inscripción; en curso válido la permite; fecha desconocida no la permite; enlace al micrositio se conserva; payload de HTML se presenta como texto. *(81b5868, 992e0fd)*
- [x] Prueba de tarjeta: publicado → /eventos/slug con external=false; draft o sin page → href/cta original; memoria publicada → acción Ver memoria. *(81b5868)*
- [x] Ejecutar pnpm --filter @c3/web exec vitest run tests/unit/event-detail.test.ts components/events/EventDetail.test.tsx tests/unit/event-card.test.ts → rojo. *(rojo en t4-red.txt)*
- [x] Leer guías locales dynamic-routes, not-found, generate-metadata y images. Implementar detalle SSR, 404 antes de render para no publicado, manejo de error real, breadcrumbs visibles y secciones semánticas. No usar generateStaticParams como catálogo cerrado. *(81b5868, 992e0fd)*
- [x] CSS mínimo en DS y registro de variantes si corresponde. No cargar imágenes de hosts no admitidos; verificar configuración de next/image antes de elegirlo para hosts C3. *(apps/web/app/ds/event-detail.css, 81b5868)*
- [x] Pruebas verdes y commit feat(web): mostrar fichas y memorias de eventos. *(81b5868, 992e0fd)*

### T5: SEO y revalidación coherentes

**Files:** modificar apps/web/lib/metadata.ts, structured-data.ts, app/sitemap.ts, app/page.tsx y app/eventos/page.tsx; revisar listas en compite/crea/conecta; modificar packages/config/src/seo.ts, apps/admin/lib/revalidate-site.ts y apps/web/app/api/revalidate/route.ts; revisar todas las llamadas del admin con rg; crear tests/unit/event-detail-seo.test.ts, event-revalidation.test.ts y sitemap.test.ts.

**Interfaces:** getPublishedEventPages(): Promise<EventItem[]> consulta documentos reales sin fallback y proyecta publicados; build metadata recibe event real y usa OG institucional salvo portada autorizada adecuada. Allowlist añade exactamente /eventos/[slug] y /sitemap.xml; en webhook usar revalidatePath("/eventos/[slug]", "page"), no omitir segundo argumento.

- [x] Pruebas: metadata canonical corresponde al slug, título real y OG de respaldo; sitemap solo páginas reales publicadas, updatedAt sin fecha inventada; draft no aparece en ningún canal. *(e248c40, 78b5c0b)*
- [x] Pruebas webhook: secreto incorrecto →401; ruta ajena → descartada; patrón permitido llama con tipo page; guardado/despublicación/borrado envían patrón y sitemap. No habilitar cualquier cadena /eventos/*. *(e248c40, 78b5c0b)*
- [x] Probar fallo del webhook: guardado sigue confirmado con advertencia de refresco pendiente, no se deshace ni aparenta éxito del refresco; documentar respaldo 60s. *(e248c40; el respaldo de 60 s ya no aplica: la ficha usa generateStaticParams vacío con revalidación bajo demanda)*
- [x] Ejecutar pruebas dirigidas en web/admin → rojo. *(rojo registrado en el informe de T5)*
- [x] Implementar enlaces consistentes de ItemList, canonical, breadcrumbs con título y sitemap. Solo WebPage/BreadcrumbList inicialmente; Event requiere verificación oficial de campos conocidos. *(e248c40, 78b5c0b)*
- [x] Ajustar tipos de rutas compartidos y sus validadores en ambos lados. Leer guía local de revalidatePath y sitemap. *(e248c40)*
- [x] Pruebas verdes, typecheck y commit feat(web): integrar seo y actualización de fichas. *(e248c40, 78b5c0b)*

### T6: Migración revisable y aceptación completa

**Files:** crear apps/admin/scripts/migrate-event-pages.ts y tests/migrate-event-pages.test.ts; crear apps/web/e2e/event-detail.spec.ts y e2e/content-approved-changes.json; modificar e2e/content-preserved.spec.ts, a11y.spec.ts, eventos.spec.ts, home.spec.ts según cambios; inventario T0 y documentación viva.

**Interfaces:** planEventPageMigration(events: AdminEventRecord[], approved: Array<{eventId:string; page:EventPage}>): {changes: Array<{eventId:string;before:AdminEventRecord;after:AdminEventRecord}>; conflicts:string[]}; exportar módulo puro a lib/event-page-migration.ts. Script dry-run por defecto; --apply con revisión explícita del diff; salida/respaldo no versionado y protegido.

- [x] Pruebas de migración: edición ambigua no se decide automáticamente; colisión impide aplicar lote; segunda ejecución no duplica; datos previos idénticos fuera de page; respaldo suficiente para revertir. Ejecutar en rojo, implementar y comprobar verde. *(5252e60; migración solo probada con un Firestore simulado en memoria)*
- [x] E2E con datos controlados de entorno de prueba: publicado 200, desconocido/draft 404, memoria y enlaces, ausencia de fuga, 390/1280 px y axe; no cambiar globalmente getPublicEvents para servir fixtures de producción. *(89647ed; 32 pruebas verdes contra emulador local; sin proyecto Firestore de pruebas autorizado se omiten por puerta)*
- [x] Definir fixture reproducible mediante mocks del repositorio en pruebas de integración y/o proyecto Firestore de prueba configurado; sin proyecto de prueba, dejar gate de integración bloqueado, no usar credenciales reales por comodidad. *(89647ed; fixture con emulador local, puerta E2E_FIRESTORE_TEST_PROJECT; bloqueado: proyecto Firestore de pruebas autorizado)*
- [ ] Revisar baseline de contenido: aprobar registro exacto de cambios de CTA por ruta/texto/href/eventId/slug y ADR; conservar baseline intacto. Prueba de conservación verifica sustitución interna solo en esas entradas y prueba el CTA original en la ficha; entradas desconocidas o cambios de titulares siguen fallando. Sin aprobación del registro, conservar CTA secundarios explícitos en las páginas afectadas. No regenerar baseline ni usar voseo-map para cambios de producto. *(registro e2e/content-approved-changes.json creado vacío en 89647ed; pendiente: aprobación del responsable del registro exacto y ADR-0014; baseline intacto)*
- [ ] Ensayar dry-run y restauración en entorno de prueba; aplicar a producción solo como operación separada autorizada después de revisión. *(no ejecutado contra datos reales: solo humo del dry-run con un export local y --apply/--revert sobre Firestore simulado; pendiente: entorno de pruebas autorizado y operación separada)*
- [x] Commit test(web): verificar fichas por edición y su migración. *(89647ed y 5252e60)*

## Cierre y entrega de la iniciativa

- [ ] Ejecutar los comandos de Global Constraints y adjuntar salidas reales; no registrar como hecho lo que solo se describe en el plan. *(pendiente: verificación final en HEAD; los informes de T5 y T6 traen salidas parciales)*
- [ ] Capturas 390/1280 px; revisar foco, zoom 200%, objetivos táctiles y movimiento reducido; resolver hallazgos del alcance. *(pendiente: revisión manual a 390/1280 px, teclado, zoom 200% y movimiento reducido no realizada)*
- [ ] Registrar checklist DS §15.5, revisión de código y validación editorial del responsable. *(pendiente: checklist en el PR, revisión de código final y validación editorial del responsable)*
- [x] Actualizar PRODUCT.md, docs/design-system/pendientes.md y documentación de alcance con estado real. No cerrar tareas ajenas. *(estado real registrado en este cierre; no cierra tareas ajenas)*
- [ ] Integrar según ADR-0007 solo tras revisión y autorización vigente; no desplegar por ejecutar la planificación. *(pendiente: revisión y autorización; ADR-0014 sin aprobar)*
