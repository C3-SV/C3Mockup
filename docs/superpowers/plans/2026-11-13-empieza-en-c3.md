# Empieza en C3 · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una guía clara de entrada con comunidad de WhatsApp, eventos y contacto alternativo.

**Architecture:** Página servidor con contenido estático revisado y destino de comunidad centralizado. Reutilizar FAQ como fuente de dudas; sustituir su acceso en cabecera por la guía y mantener FAQ en pie y ruta actual.

**Tech Stack:** Next.js 16.2.5, React 19.2.4, TypeScript, Tailwind v4, tokens/clases C3, Vitest/Testing Library, Playwright y axe; pnpm 11.

**Spec:** [2026-11-13-empieza-en-c3-design.md](../specs/2026-11-13-empieza-en-c3-design.md).

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

1. No hay eventos próximos: la guía sigue ofreciendo comunidad y contacto sin inventar convocatorias (T1/T2).
2. Invitación de WhatsApp revocada o mal copiada: validar destino antes de publicar y disponer de alternativa de contacto (T0/T2).
3. JavaScript deshabilitado o visitante que no usa WhatsApp: enlaces reales a comunidad/eventos y contacto alternativo siguen funcionando (T2/T4).
4. Mover FAQ de header a apoyo no elimina ruta, contenido, metadata ni acceso desde footer; menús no desbordan (T3/T4).
5. Declaraciones generales sobre precio/edad/requisitos no comprobadas: excluirlas del copy; requisitos se consultan por evento (T0/T1).

---

## Orden y dependencias

T0 → T1 → T2 → T3 → T4. Puede ejecutarse sin fichas nuevas ni documentos legales publicados. No enlazar las páginas legales hasta que existan públicamente con contenido aprobado. Al compartir content.ts, sitemap.ts y structured-data.ts con otros planes, integrar sobre el estado actual y conservar rutas añadidas por las otras iniciativas.

### T0: Copy de entrada y revisión factual

**Files:** crear docs/content/empieza-en-c3.md; modificar PRODUCT.md y ADR de alcance al ejecutar.

**Interfaces:** documento editorial con secciones de spec §3, fuentes por afirmación, copy propuesto, versión, estado y aprobación. Destino confirmado por responsable: https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA.

- [ ] Releer PRODUCT.md, faqItems y páginas de las tres áreas; redactar guía breve sin duplicar la presentación institucional completa.
- [ ] Cubrir comunidad, exploración de áreas, participación por evento, ausencia de convocatorias y alternativa de contacto.
- [ ] Aprobar textos "Unirme a la comunidad", "Explorar eventos", "Contactar a C3" y aviso de servicio externo con el responsable. No prometer admisión, gratuidad general, edad, frecuencia o mentoría individual.
- [ ] Confirmar que el enlace sigue vigente sin entrar a la comunidad ni enviar mensajes; una confirmación del responsable basta. Registrar fecha de verificación y cómo sustituir enlace/contacto si caduca.
- [ ] Aprobar sustitución acotada de FAQ en header y permanencia en pie/guía. Registrar excepción al alcance original del rework.
- [ ] Commit docs: definir contenido de Empieza en C3.

### T1: Fuente de contenido y configuración de comunidad

**Files:** modificar apps/web/lib/site.ts; crear lib/getting-started-content.ts y tests/unit/getting-started-content.test.ts; revisar lib/content.ts para reutilizar preguntas sin copiar respuestas.

**Interfaces:**
- siteConfig.community: {label:"WhatsApp"; inviteUrl:string}.
- gettingStartedContent: {title:string;intro:string;steps:Array<{id:string;title:string;paragraphs:string[]}>;faqQuestions:readonly string[]}.
- getGettingStartedFaq(): ReadonlyArray<{question:string;answer:string}>, selecciona por pregunta exacta desde faqItems y falla en desarrollo/prueba si se referencia una inexistente; nunca duplica las respuestas.
- resolveCommunityAction(inviteUrl: string | undefined): {href:string;label:string;external:boolean}, URL válida de invitación chat.whatsapp.com por https o fallback /contacto.

- [ ] Prueba: destino exacto facilitado y sin parámetros agregados; URL inválida/vacía → /contacto; dudas seleccionadas corresponden a faqItems y respuestas coinciden con fuente.
- [ ] Prueba de copy contra afirmaciones nuevas no aprobadas mediante revisión editorial T0; no sustituir criterio por un listado superficial de palabras.
- [ ] Ejecutar pnpm --filter @c3/web exec vitest run tests/unit/getting-started-content.test.ts → rojo.
- [ ] Implementar datos, selección y resolución de enlace sin dependencia ni API adicional. No imponer un tipo literal que impida sustituir una invitación en el futuro.
- [ ] Verde, typecheck y commit feat(web): definir guía y acceso a comunidad.

### T2: Página de orientación

**Files:** crear apps/web/app/empieza-en-c3/page.tsx, components/getting-started/GettingStarted.tsx y GettingStarted.test.tsx; crear app/ds/getting-started.css si utilidades/componentes existentes no bastan; modificar app/globals.css si añade hoja.

**Interfaces:** GettingStarted({content,communityAction,faqs}) recibe tipos T1; página servidor usa PageShell ds y Button, sin client wizard. Lee contenido estático y resuelve comunidad; no depende de getPublicEvents para poder abrir la guía.

- [ ] Prueba render: h1, acción WhatsApp, explicación de tercero, eventos, tres áreas, FAQ y alternativa de contacto presentes; enlace externo lleva target=_blank y rel noopener noreferrer.
- [ ] Prueba fallback con communityAction de contacto: no deja botón vacío/roto ni dos acciones idénticas innecesarias. Requisitos se explican por evento, no como regla global.
- [ ] Ejecutar Vitest de componente → rojo.
- [ ] Implementar guía lineal con contenido aprobado, enlaces semánticos y jerarquía; CTA principal comunidad, secundario eventos. Si legal sigue pendiente, no renderizar un enlace a ruta inexistente.
- [ ] CSS mínimo del DS; sin nuevos iconos rellenos, animación o métricas decorativas.
- [ ] Verde, typecheck y commit feat(web): publicar guía Empieza en C3.

### T3: Navegación, home y SEO

**Files:** modificar apps/web/lib/content.ts, structured-data.ts, app/sitemap.ts, components/home/AudienceSection.tsx; revisar components/SiteHeader.tsx y SiteFooter.tsx; ampliar SiteHeader.test.tsx/SiteFooter.test.tsx; crear tests/unit/getting-started-seo.test.ts.

**Interfaces:** añadir /empieza-en-c3 a publicRoutes y mainNavigation; en headerNavigation sustituir FAQ por Empieza en C3; mainNavigation conserva FAQ para footer. Revisar consumidores de navItems alias. JSON-LD de la guía: WebPage/BreadcrumbList, labels legibles, canonical propio.

- [ ] Pruebas: header incluye guía y no FAQ; footer incluye ambas; /faq sigue con metadata/canonical/FAQPage y contenido previo; sitemap conserva todas las rutas actuales.
- [ ] Prueba de AudienceSection: enlace contextual nuevo sin borrar heading, texto ni CTA existentes. Navegación principal de tamaño acotado; no incorporar Blog/Colabora futuros.
- [ ] Ejecutar Vitest dirigido → rojo.
- [ ] Integrar ruta, metadata y enlaces; revisar Record tipados de rutas. Aprovechar menús actuales; no fusionar Ecosistema/Qué es C3 como parte de esta tarea.
- [ ] Resolver áreas táctiles y desbordamiento que el cambio del header afecte; registrar variación acotada DS si cambia regla.
- [ ] Verde y commit feat(web): integrar guía en navegación y seo.

### T4: Verificación de recorrido y conservación

**Files:** crear apps/web/e2e/empieza-en-c3.spec.ts; ampliar e2e/header.spec.ts, footer.spec.ts, a11y.spec.ts y content-pages.spec.ts según cobertura; actualizar PRODUCT.md, inventario editorial y docs/design-system/pendientes.md.

- [ ] E2E antes de implementación: desde header abrir guía, comprobar destino WhatsApp sin seguir invitación ni unirse, explorar eventos, acceder a contacto y FAQ. Obtener rojo → implementar T2/T3 → verde.
- [ ] Contexto de navegador con javaScriptEnabled:false: /empieza-en-c3 muestra enlaces reales a comunidad/eventos/contacto. No exigir menú móvil cliente sin JS como parte de este caso.
- [ ] Verificar 390/1280 px, axe, sin scroll horizontal, teclado, foco, texto al 200% y movimiento reducido. Abrir/cerrar menús con Escape y retorno de foco como antes.
- [ ] Ejecutar content-preserved sin regenerar baseline. FAQ sigue visible en footer; si falla, corregir el movimiento, no mapear texto de producto como si fuera voseo.
- [ ] Verificar que no se cargue widget de WhatsApp ni se añada captura de datos/SDK al entrar a la guía.
- [ ] Revisar copy final, fecha de confirmación de invitación y procedimiento de mantenimiento con responsable.
- [ ] Commit test(web): verificar entrada a C3 y acceso a comunidad.

## Cierre y entrega de la iniciativa

- [ ] Ejecutar los comandos de Global Constraints y adjuntar salidas reales; no registrar como hecho lo que solo se describe en el plan.
- [ ] Capturas 390/1280 px; revisar foco, zoom 200%, objetivos táctiles y movimiento reducido; resolver hallazgos del alcance.
- [ ] Registrar checklist DS §15.5, revisión de código y validación editorial del responsable.
- [ ] Actualizar PRODUCT.md, docs/design-system/pendientes.md y documentación de alcance con estado real. No cerrar tareas ajenas.
- [ ] Integrar según ADR-0007 solo tras revisión y autorización vigente; no desplegar por ejecutar la planificación.
