# Legal y convivencia · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preparar y publicar documentos coherentes con la operación real, con identificación y aprobación verificadas.

**Architecture:** Inventariar tratamientos y responsables antes de redactar. Mantener texto aprobado versionado en repositorio, renderer de lectura compartido y enlaces legales en pie/contacto; publicación condicionada a la validación factual y jurídica correspondiente.

**Tech Stack:** Next.js 16.2.5, React 19.2.4, TypeScript, Tailwind v4, tokens/clases C3, Vitest/Testing Library, Playwright y axe; pnpm 11.

**Spec:** [2026-11-13-legal-convivencia-design.md](../specs/2026-11-13-legal-convivencia-design.md).

**Estado:** borrador para revisión, 13-nov-2026. No ejecutado; la spec y decisiones editoriales deben aprobarse antes de implementar. No confundir una casilla de redacción con una tarea de producto terminada.

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

1. Responsable no identificado o texto con placeholders: no publicar ni enlazar documentos provisionales como definitivos (T0/T1/T4).
2. Brevo, Analytics y servicios externos pueden tratar datos aunque no exista una cookie visible: contrastar código con configuración real (T0).
3. La consulta no debe convertirse en suscripción ni aceptar condiciones de eventos futuros al enviar contacto (T3).
4. Documentos largos, correo sin espacios y anclas bajo header: lectura y navegación a 390/1280 px y zoom 200% (T2/T4).
5. Cambios en publicRoutes afectan Record tipados de sitemap/JSON-LD: probar conjunto de rutas sin eliminar las existentes (T3).

---

## Dependencia principal

T0 → T1 es un gate editorial. La infraestructura T2 se puede preparar en rama con fixtures; T3 y publicación pública esperan textos aprobados. La identidad pendiente no se sustituye por "C3, entidad legal". Cookies y controles extra solo se incorporan si el inventario determina su necesidad y se aprueba el alcance.

### T0: Inventario operativo y responsables

**Files:** crear docs/content/legal/inventario-tratamientos.md y docs/content/legal/decisiones-editoriales.md.

**Interfaces:** una fila por tratamiento con fuente técnica, finalidad confirmada, categorías de datos, proveedores, acceso, conservación, canal de solicitudes, responsable de respuesta y estado confirmado/pendiente. Sin secretos en documentación.

- [ ] Revisar apps/web/components/ContactForm.tsx, lib/contact-form.ts, lib/brevo.ts, app/api/contact/route.ts, app/layout.tsx, next.config.ts y despliegue; no leer ni copiar valores de .env.
- [ ] Confirmar con responsable configuración real de Brevo, buzón, hosting, Analytics, imágenes, logs y WhatsApp; distinguir visitantes de administradores Firebase.
- [ ] Identificar persona/personas responsables del sitio y tratamiento, contacto y jurisdicción aplicable. Confirmar canal, alcance y responsables de reportes de convivencia.
- [ ] Consultar fuentes oficiales vigentes aplicables; anotar URL, autoridad, fecha, jurisdicción y conclusión respaldada. Revisar documentación oficial de proveedores sobre configuración efectiva. No completar bases jurídicas/plazos por intuición.
- [ ] Decidir con evidencia si hace falta política separada de cookies o controles. Si amplía trabajo, añadir tarea concreta y revisión de alcance antes de implementación.
- [ ] Verificar consistencia: todo dato confirmado tiene fuente; toda incógnita tiene dueño; no afirmar cumplimiento. Commit docs: inventariar operación y responsables legales.

### T1: Redacción y aprobación de tres documentos

**Files:** crear docs/content/legal/privacidad.md, terminos.md y codigo-de-conducta.md; actualizar decisiones-editoriales.md.

**Interfaces:** documentos con id (privacidad/terminos/codigo-de-conducta), versión, fecha de revisión, secciones identificadas, aprobador y fecha de aprobación. Versiones anteriores conservadas en Git.

- [ ] Redactar privacidad con los datos confirmados de T0; términos limitados al sitio informativo; convivencia con procedimiento real de reporte. No extender condiciones a inscripciones no existentes.
- [ ] Revisar afirmaciones una a una contra inventario; marcar borrador mientras existan datos pendientes. Responsable, retención, finalidad y canales no pueden quedar implícitos.
- [ ] Obtener aprobación de responsable identificado; incorporar revisión jurídica que corresponda y registrar decisiones. No contactar asesores ni enviar documentos fuera sin autorización.
- [ ] Lista de publicación: cero placeholders; aprobador identificado; fechas reales; canal de solicitudes y de reportes confirmados. Si falla, mantener tarea abierta y continuar solo infraestructura de rama.
- [ ] Commit docs: preparar textos legales revisados (el mensaje no debe decir aprobados si aún no lo están).

### T2: Renderer de documentos legible y accesible

**Files:** crear apps/web/lib/legal-content.ts, components/legal/LegalDocument.tsx, components/legal/LegalDocument.test.tsx, app/ds/legal.css; modificar app/globals.css. Tipos locales, sin paquete nuevo.

**Interfaces:**
- LegalDocumentId = "privacidad" | "terminos" | "codigo-de-conducta".
- LegalDocumentData = { id: LegalDocumentId; title: string; version: string; reviewedAt: string; sections: Array<{id:string;title:string;paragraphs:string[];items?:string[]}> }.
- legalDocuments: Record<LegalDocumentId, LegalDocumentData>, solo textos aprobados al integrar.
- LegalDocument({document}: {document:LegalDocumentData}): sección semántica de lectura dentro de PageShell del consumidor.

- [ ] Prueba con fixture interno: un h1, versión/fecha visible, índice enlaza ids únicos, email largo no se trunca y texto con etiquetas no se ejecuta. Assert: enlace "#responsable" tiene sección id="responsable".
- [ ] Ejecutar pnpm --filter @c3/web exec vitest run components/legal/LegalDocument.test.tsx → rojo.
- [ ] Implementar renderer, índice cuando hay varias secciones, mailto del contacto aprobado y CSS mínimo con scroll-margin-top. Sin HTML libre ni banners.
- [ ] Integrar texto T1 en datos estáticos solo tras aprobación; fixtures de prueba quedan dentro de tests y nunca en rutas públicas.
- [ ] Verde, typecheck y commit feat(web): presentar documentos legales accesibles.

### T3: Rutas, pie y aviso de contacto

**Files:** crear apps/web/app/privacidad/page.tsx, terminos/page.tsx y codigo-de-conducta/page.tsx; modificar components/SiteFooter.tsx, components/ContactForm.tsx, lib/content.ts, lib/structured-data.ts y app/sitemap.ts; ampliar SiteFooter.test.tsx y crear tests/unit/legal-routes.test.ts y components/ContactForm.test.tsx si no existe.

**Interfaces:** tres páginas estáticas sobre PageShell ds y LegalDocument; metadata mediante createPageMetadata. Enlaces legales separados de mainNavigation para no saturar header. Revisar tipos Record que dependen de publicRoutes; última revisión legal procede de datos editoriales.

- [ ] Pruebas: cada ruta tiene canonical/título y label JSON-LD; sitemap contiene URLs sin duplicados; footer conserva enlaces/redes anteriores y añade legales.
- [ ] Prueba ContactForm: aviso enlaza /privacidad; enviar conserva campos/validación y no añade newsletter/aceptación obligatoria por defecto. Stub fetch solo en test; no enviar correos reales.
- [ ] Ejecutar Vitest dirigido → rojo.
- [ ] Crear rutas y enlaces con texto T1 aprobado. Incorporar aviso breve aprobado próximo a Enviar mensaje, sin alterar el payload o honeypot.
- [ ] Si T0 exige consentimiento u otros controles, implementar tarea ampliada aprobada antes de habilitar tratamiento afectado; no resolverlo con un checkbox sin justificación.
- [ ] Verde, typecheck y commit feat(web): integrar privacidad términos y convivencia.

### T4: Publicación y evidencia

**Files:** crear apps/web/e2e/legal.spec.ts; ampliar e2e/a11y.spec.ts; actualizar PRODUCT.md, docs/design-system/pendientes.md P5 y ADR de alcance (nuevo número libre; 0012 reservado).

- [ ] E2E: abrir cada ruta desde pie y privacidad desde contacto, comprobar h1, versión/fecha, anclas y contacto; 390/1280 px y axe sin serious/critical.
- [ ] Ejecutar prueba roja antes de integrar rutas en build de trabajo, implementar cualquier falta y obtener verde. No usar registros productivos ni ejecutar envíos reales.
- [ ] Revisión manual: teclado, zoom 200%, anclas visibles bajo cabecera y correos largos; lectura del texto completo con responsable.
- [ ] Repetir inventario contra código final; si hay nuevos proveedores/medios respecto a T0, revisar documento antes de publicar.
- [ ] Verificar que el preview público/producción no exponga borradores; publicar solo tras gate T1. Sin aprobación, registrar pendiente real y no dar tarea por terminada.
- [ ] Commit test(web): verificar documentos y enlaces legales.

## Cierre y entrega de la iniciativa

- [ ] Ejecutar los comandos de Global Constraints y adjuntar salidas reales; no registrar como hecho lo que solo se describe en el plan.
- [ ] Capturas 390/1280 px; revisar foco, zoom 200%, objetivos táctiles y movimiento reducido; resolver hallazgos del alcance.
- [ ] Registrar checklist DS §15.5, revisión de código y validación editorial del responsable.
- [ ] Actualizar PRODUCT.md, docs/design-system/pendientes.md y documentación de alcance con estado real. No cerrar tareas ajenas.
- [ ] Integrar según ADR-0007 solo tras revisión y autorización vigente; no desplegar por ejecutar la planificación.
