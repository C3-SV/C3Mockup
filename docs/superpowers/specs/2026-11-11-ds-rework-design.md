# Rework de c3.com.sv sobre el DS de nov-2026 · Diseño

- **Fecha:** 2026-11-11 · **Estado:** borrador para aprobación · **Base:** commit `89789b0`
- **Plan que lo implementa:** [`../plans/2026-11-11-ds-rework.md`](../plans/2026-11-11-ds-rework.md)
- **Insumos:** [`docs/design-system/`](../../design-system/README.md) (paquete original en `source/`), [`gap-analysis.md`](../../design-system/gap-analysis.md), [`porting-map.md`](../../design-system/porting-map.md), ADR 0001–0006.

## 1. Intención

Hacer una mejor versión de **c3.com.sv** usando el sistema de diseño recibido el 11-nov-2026, que **sobrescribe** al anterior. Al mismo tiempo, profesionalizar cómo se trabaja el repo: pruebas, CI/CD, skills de superpowers y documentación viva.

**Por qué ahora.** El DS nuevo ya fue pensado y validado (contraste, foco, componentes) en el demo de la plataforma Challenges. El sitio actual (navy oscuro con gradientes, partículas y acento turquesa) no lo sigue, no tiene pruebas y mezcla voseo y tuteo.

**Hecho de contexto clave.** El DS viene de un demo de **C3 Challenges**, que **aún no ha salido**. c3.com.sv es el sitio principal de toda C3. Se hereda lo **visual y estructural**; la **terminología y los CTAs no** (ADR-0006).

**Principio rector (responsable, 2026-11-11).** Este es el **sitio real y en producción** de C3. El cambio es **visual**: se **conserva el contenido existente** (textos, titulares, eyebrows, eventos, SEO, rutas) y solo se mejora lo mínimo (voseo a «tú»). Se sustituyen componentes y estilos por los del DS y se **borra** todo lo que deje de usarse. **Nunca** se usa etiqueta DEMO ni se inventa contenido.

## 2. Metas, no metas, anti-metas

**Metas**
1. Las páginas existentes (home, `/compite`, `/crea`, `/conecta`, `/eventos`, `/contacto`, `/faq`, `/que-es-c3`, 404) usan el DS: tokens `--c3-*` y clases `c3-*`.
2. Contenido y SEO intactos (rutas, metadata, JSON-LD, sitemap, `llms.txt`, formulario con Brevo, revalidación).
3. Cumple el checklist del DS §15.5: 390 y 1280 px sin scroll horizontal, foco visible, objetivo táctil ≥ 44 px, movimiento reducido, contraste verificado con herramienta, voz «tú», sin emojis, sin DEMO. Contenido existente conservado.
4. Pruebas automáticas (Vitest, Playwright + axe) y CI/CD (GitHub Actions + Vercel) como parte del trabajo.
5. Documentación viva y `AGENTS.md`/`PRODUCT.md` al día (hecho en esta ronda).

**No metas**
- `apps/admin` (el DS lo excluye) salvo CI, pruebas y, si hace falta, el contrato de datos de eventos (§7).
- Pantallas que el sitio no tiene: explorar, acceso/cuentas, perfil público, propuesta de empresa, zona privada. Se documentan como fase futura.
- Modo oscuro (el DS no lo resuelve).
- Rediseñar el logo, redactar textos nuevos de marca o definir precios.

**Anti-metas** (fracaso aunque funcione): que el sitio parezca la plataforma Challenges; que se use «challenge», «cuenta» o «iniciar sesión»; que queden dos sistemas visuales conviviendo; que se copien 5000 líneas de CSS de la app; que se publiquen datos o textos inventados sin DEMO.

## 3. Decisiones tomadas (del dueño)

| Tema | Decisión |
| --- | --- |
| Alcance de esta ronda | Docs, spec, plan y procesos; el código del sitio no se toca hasta ejecutar el plan |
| Implementación de estilos | Tokens CSS + clases `c3-*`; Tailwind solo para layout (ADR-0002) |
| Páginas | Solo adaptar las existentes (ADR-0003) |
| Calidad | Vitest + Playwright (+ axe) + GitHub Actions + Vercel (ADR-0004) |
| Color de acción | Violeta `#6548c7` en todo el sitio (ADR-0006) |
| Vocabulario | **Eventos y experiencias, por áreas** (Compite, Crea, Conecta). Los challenges, cuando existan, son un tipo de experiencia. No usar «challenge» ni anunciar C3 Challenges (ADR-0006) |

## 4. Mis llamadas (revisables; marcadas como tales)

1. **Home sin banda de pasos.** Los cuatro pasos del DS (elegir challenge, inscribirte, entregar, evaluación) describen la plataforma, no a C3. No se inventa un proceso: la banda se omite hasta que el responsable dé pasos reales.
2. **Navegación:** «Inicio» · «Qué es C3» · «Ecosistema ▾» (Compite, Crea, Conecta) · «Eventos» · «FAQ»; el nombre del menú **se conserva** («Ecosistema», no «Conoce C3»: el contenido actual manda sobre el DS, decisión del responsable 2026-11-11); acción primaria única **«Contacto»**. Sin «Iniciar sesión» ni «Crear cuenta».
3. **Pie en cuatro columnas** con el contenido actual: marca (logo blanco, nombre, correo, redes), navegación principal, las tres líneas y los dos sitios hermanos. Sin títulos de columna ni «Fundado en octubre de 2024» ni «Hecho en El Salvador» (el DS los trae; el sitio no); quedan como pregunta al responsable.
4. **`next/font` se conserva** (no el `<link>` de Google del DS); sus variables se mapean a `--c3-font-titulo/-texto`.
5. **`lang`:** se conserva `es-SV` (refina `es`).
6. **Botón pequeño:** `.c3-btn--small` sube a 44 px de área táctil (el DS lo deja en 36).
7. **Burbuja de la órbita bajo 900 px:** se muestra en línea, bajo la órbita (el DS la oculta y deja los puntos mudos).
8. **`theme-color`/`background_color` del manifest:** pasan a blanco (cabecera blanca); los íconos no cambian.
9. **Datos de eventos:** campos nuevos **opcionales** (`kind`, `cover`, `source`); el admin sigue funcionando sin cambios. **No existe campo ni badge DEMO**: todos los eventos son reales.
10. **Eliminar al final** lo que el DS deja obsoleto: `Navbar`, `SiteHeader` viejo, `ScrollProgress`, `C3SectionTransition`, `ProjectCard`, `backgrounds/*`, `c3-theme.ts`, y el `Button` de pastilla; `packages/ui` se revisa pero el admin lo sigue usando, así que **no se toca** su visual.

**Resueltas tras la revisión independiente del spec** (también mías, revisables):

11. **Despliegue por rama de integración.** Todo el trabajo vive en la rama `dev` (rama de release, ADR-0007): no hay PR por tarea y el único PR es `dev → main` al cerrar la Fase 8. Cada push a `dev` pasa CI y tiene preview de Vercel. **`main` y producción no cambian hasta que todas las páginas estén migradas** (Fase 8). Así nunca se publica un sitio a medio migrar.
12. **Fechas de eventos:** `EventItem.eventDate` y `eventDateEnd` ya son ISO (`AAAA-MM-DD`) y `packages/config` tiene `parseEventDate` e `isUpcoming`; «próximos/concluidos» se derivan de ahí sin tocar el admin.
13. **Campos nuevos sin admin:** sin `kind`/`cover` la tarjeta usa el ícono genérico y el tinte de su área (aceptable). Los 5 `defaultEvents` reciben `kind` por commit (competencia, hackathon, etc., según su título actual); sin portadas hasta que existan.
14. **`--c3-crea-texto` (`#0f766e`) y las variantes oscuras ya vienen definidas** en el paquete; solo se añaden por ADR los tokens que el paquete no tiene (§12.1 #5–6).
15. **`packages/ui`:** el admin lo sigue usando. El sitio deja de importarlo (ya solo usa `cn`, que pasa a `apps/web/lib/utils.ts`, que ya existe). No se borra ni se cambia su visual; el `Button` nuevo vive en `apps/web`.
16. **CI y Vercel:** el workflow no despliega (lo hace la integración Git de Vercel). E2E corre contra `next build && next start` local en CI, sin secretos reales. Las integraciones de Vercel y la protección de `main` las configura el responsable (ver `docs/process/ci-cd.md`).
17. **Higiene detectada en la línea base:** `pnpm lint` ya falla (1 error, 13 advertencias en `components/ui/Button.tsx`) y hay ~13 850 archivos de `node_modules` versionados en `packages/config` y `packages/ui`. Se corrigen en la Fase 0 antes de activar CI.
18. **Sitios satélite** (`siteConfig.sites.copa`, `.hackathon`): se enlazan solo desde el pie, con indicador `↗`, `target="_blank"` y `rel="noopener noreferrer"`.

## 5. Arquitectura

```
apps/web/app/
  globals.css            @import tailwindcss → ds/tokens.css → ds/tokens-extra.css → ds/c3-public.css (capa components)
  ds/tokens.css          copia fiel del paquete (sin tema oscuro)
  ds/tokens-extra.css    bloque §15.4 + puente de fuentes + tokens añadidos por ADR
  ds/c3-public.css       bloques de globals.css del paquete, tokenizados (ver porting-map)
apps/web/components/
  brand/BrandMark.tsx · ui/StatePill.tsx · ui/Button.tsx (c3-btn)
  ds/CatalogCard.tsx · ds/FeaturedGrid.tsx (client) · ds/HomeOrbit.tsx (client)
  SiteHeader.tsx (client) · SiteFooter.tsx · PageShell.tsx
apps/web/lib/ds/         event-card.ts (EventItem → tarjeta) · event-state.ts (status → pastilla)
apps/web/tests · e2e/    Vitest y Playwright
```

- **Servidor primero:** páginas y listas se construyen en servidor; solo header, órbita y paginación son cliente. `lib/events.ts` nunca se importa desde cliente.
- **Capas CSS:** las clases del DS van en `layer(components)` para que las utilidades de Tailwind sigan ganando en layout; los resets globales del DS no se copian.
- **Migración sin caos:** el shell nuevo se activa en un solo paso (Fase 2) y las páginas migran una por una; los tokens heredados apuntan a los nuevos hasta el cierre.

## 6. Comportamiento por pantalla

**Shell.** Enlace «Saltar al contenido»; cabecera blanca fija (72 px / 64 px), «Ecosistema» como menú (Escape, clic fuera, `aria-expanded`, `aria-controls`), «Menú» bajo 900 px, `aria-current`; pie navy. Un `<main id="contenido">` por página.

**Home** (se **conserva el orden y los textos actuales** del sitio; cambia su apariencia al patrón DS que corresponde):

| # | Sección actual (se conserva) | Patrón del DS | Qué cambia |
| --- | --- | --- | --- |
| 1 | **Hero**: h1 «C3 desarrolla talento técnico joven a través de competencia, creación y conexión.», párrafo «Competitive Coding Club conecta programación competitiva…», botones «Explorar eventos», «Ser aliado», «Conocer C3» | Hero con órbita (§7.13–7.14) | Fondo blanco, órbita del símbolo a la derecha, botón primario violeta; **textos y destinos iguales** |
| 2 | **Próximas iniciativas** (`MissionVisionSection`) | Tarjetas `c3-card` / destacadas | Misma información y enlaces; se restilan |
| 3 | **Un ecosistema integrado** (`ActionLinesSection`) | Tres tarjetas de línea (§7.8) | Mismas descripciones; el diagrama `C3EcosystemDiagram` se retira (lo reemplaza la órbita del hero) |
| 4 | **Evidencia viva del ecosistema C3** (`ProjectsSection`) | Destacadas paginadas de 6 en 6 (§7.16) + tarjeta de experiencia | Eventos **reales**; título y enlaces iguales; vacío con el texto actual del sitio |
| 5 | **Audiencias** (`AudienceSection`: personas, instituciones, empresas) | Tarjetas de ruta (§7.11), la de empresas en navy | Mismo contenido, tres tarjetas |
| 6 | **Cierre** (`FinalCtaSection`) | Panel navy de cierre (§7.15) | Mismo texto y botones |

Lo que el DS describe y el sitio no tiene (banda de 4 pasos, «Dos caminos» con textos de la plataforma) **no se añade**. Los textos de referencia del DS no se usan.

**Líneas.** Acento por línea con `--c3-line-accent/-text/-tint` (Crea usa `--c3-crea-texto`); titular grande, órbita de 400 px, sección «La línea», recorrido o aliados, eventos de esa área con tarjeta DS. Contenido y SEO actuales se conservan.

**Eventos.** Encabezado claro; filtros por **área** y por **estado** en ejes separados (hoy están mezclados); «próximos/concluidos» se derivan de la **fecha**, no solo del estado; tarjetas DS; paginación de 6; vacío y error explícitos.

**Tarjeta de experiencia.** Medio de 132 px con tinte de su línea (o portada con alt), ícono por tipo, pastilla de estado con texto, título, resumen, fecha, pie «Ver evento ↗» / «Ver experiencia ↗». Si un evento tiene varias áreas, la tarjeta usa la primera y muestra las demás como etiquetas de texto. Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.

**Contacto, FAQ, Qué es C3.** Encabezado de página claro; campos de 46 px con borde fuerte y flecha propia en el selector; botón primario violeta; voz «tú» en todo (`lib/content.ts`, `lib/contact-form.ts`, páginas). **404** dentro del shell, con «Explorar eventos» y «Volver al inicio».

## 7. Datos

`packages/config/src/events.ts` añade opcionales: `kind` (competencia, hackathon, taller, charla, encuentro, challenge), `cover {url, alt}` (hosts de C3, alt obligatorio si hay portada) y `source?: string`. `lib/events.ts` los lee si existen. El admin no los edita en esta ronda (queda como mejora futura con su propio spec). Los eventos de `defaultEvents` son reales: sin DEMO, sin campo `demo`.

## 8. Calidad

Estrategia en [`docs/process/testing.md`](../../process/testing.md); CI/CD en [`docs/process/ci-cd.md`](../../process/ci-cd.md). Requisitos duros: TDD; `lint`, `typecheck`, `test`, `build`, `e2e` a 390 y 1280 px y axe sin violaciones serias o críticas en cada PR; prueba automática de contraste de tokens; pruebas de contenido (sin emojis, sin voseo, sin «challenge» ni «iniciar sesión», sin precios).

## 9. Restricciones

Node 20.9+ (CI en 22), pnpm 11, Next 16.2.5 (leer `node_modules/next/dist/docs/` antes de usar APIs), React 19.2.4, Tailwind v4. Sin dependencias nuevas fuera de las de pruebas. Sin secretos en el repo.

## 10. Riesgos

CSS sin capa que anule utilidades (mitigado con `layer(components)` y prueba de build); recortes de CSS por número de línea (verificar por comentarios de cabecera y prueba que parsee el CSS final); fuentes que caen a `system-ui` si no se mapean las variables; Crea turquesa como texto (2.38:1); dos anchos de contenedor durante la migración; OG image declarada con dimensiones incorrectas.

## 11. Respuestas del responsable (2026-11-11) y pendientes

| Pregunta | Respuesta |
| --- | --- |
| Logo en cabecera | **El logo C3 completo** que el sitio ya usa: `logo-c3-claro-con-color.png` sobre fondo claro y `logo-c3-blanco-monocromatico.png` sobre navy. No se adoptan `c3-sim-azul.png` ni el logo simple del paquete. `c3-symbol.png` solo para la órbita (el DS lo exige para sus puntos interactivos; mi llamada, revisable) |
| Titular y eyebrow | **Se conserva lo que ya está** (ver tabla de la home). «El talento se ve en acción» era texto del DS y no se usa |
| Eventos de `defaultEvents` | **Todos reales. Sin DEMO.** Es el sitio real |
| Manual de marca y capturas del DS aplicado | Pendiente, no bloquea |

## 12. Fases futuras (fuera de esta ronda)

Explorar con filtros y carga por lotes; acceso/cuentas; perfil público; propuesta de empresa; edición de portada, tipo y fuente en el admin; modo oscuro; banda de pasos con proceso real; lanzamiento de Challenges como tipo de experiencia.
