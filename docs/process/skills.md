# Skills y herramientas

Las skills de `superpowers` son el método de trabajo de este repo, no una sugerencia. Las demás se usan según el tipo de tarea.

## Método (superpowers)

| Skill | Cuándo | Salida esperada |
| --- | --- | --- |
| `brainstorming` | Idea nueva, cambio ambiguo, decisión de producto | Spec en `docs/superpowers/specs/YYYY-MM-DD-tema-design.md` |
| `writing-plans` | Spec aprobado, trabajo en varios pasos | Plan en `docs/superpowers/plans/YYYY-MM-DD-tema.md` con casillas |
| `subagent-driven-development` | Ejecutar un plan con tareas independientes | Un subagente por tarea + revisión entre tareas |
| `executing-plans` | Ejecutar un plan en sesiones separadas | Casillas marcadas por commit |
| `test-driven-development` | Lógica, utilidades, componentes con comportamiento | Prueba roja → verde → refactor |
| `systematic-debugging` | Bug, test o CI rojo | Causa raíz antes de arreglar |
| `verification-before-completion` | Antes de afirmar «listo» | Salida real de los comandos |
| `requesting-code-review` / `receiving-code-review` | Antes de PR / al recibir comentarios | Hallazgos resueltos o justificados |
| `using-git-worktrees` | Trabajo paralelo sin pisar ramas | Worktree por tarea |
| `finishing-a-development-branch` | Cerrar una rama | PR o merge limpio |

## Diseño y UI

| Skill / herramienta | Cuándo |
| --- | --- |
| `frontend-design:frontend-design` | Implementar UI con criterio de composición, sobre el DS |
| `design:design-system` | Auditar tokens, nombres y valores sueltos; documentar variantes |
| `design:accessibility-review` | Cada PR que cambie UI (contraste, foco, táctil) |
| `design:design-critique` | Revisión de pantallas contra el DS antes de fusionar |
| `design:ux-copy` | Textos de interfaz en voz «tú» |
| `design:design-handoff` | Documentar un componente nuevo (variantes, estados, a11y) |
| **Impeccable** (opcional) | `impeccable context` una vez por sesión y `impeccable detect <rutas>` sobre lo cambiado. Docs: `https://impeccable.style/docs/`. **No ejecutar `npx impeccable install` dentro del repo sin revisar lo que escribe.** `PRODUCT.md` ya existe |
| **Playwright** | E2E a 390 y 1280 px (ver `testing.md`) |
| `web-design-guidelines`, `react-best-practices` (`vercel-labs/agent-skills`) | Lista de revisión web y rendimiento de Next/React; fuente, licencia y commit revisados en `.agents/skills.lock.json` |

## Skills de motion instaladas en el proyecto (2026-11-14)

Las copias versionables están en `.agents/skills/`; el inventario, fuentes y commits están en `.agents/skills.lock.json`, y el uso concreto por sección en `docs/motion/C3_MOTION_DESIGN.md`. En el repositorio oficial actual de Vercel, el nombre de la skill de rendimiento es `react-best-practices`.

| Familia | Cuándo consultarla |
| --- | --- |
| `gsap-*` | Diseño técnico de timelines, ScrollTrigger, integración React, plugins y perfilado de animaciones GSAP. No implica instalar la librería. |
| `animate`, `animation-vocabulary`, `choreograph`, `find-animation-opportunities` | Explorar oportunidades justificadas, describir efectos y coordinar secuencias. |
| `review-animations`, `improve-animations`, `animation-performance` | Auditar motion existente o propuesto, priorizar mejoras y buscar problemas de rendimiento. |
| `react-best-practices`, `web-design-guidelines` | Revisar costo de JS, límites servidor/cliente, accesibilidad e interacción web. |

Las skills de terceros complementan el método `superpowers` y están subordinadas a `AGENTS.md`, `PRODUCT.md` y al DS. Para reinstalar o actualizar, seguí `docs/motion/C3_MOTION_DESIGN.md` §Skills, revisá los cambios de origen y mantené el lock al día.

## Orientación en el código

`graphify`: si existe `graphify-out/`, consúltalo antes de buscar a ciegas.

## Reglas

1. Invoca la skill **antes** de actuar, incluso para hacer preguntas.
2. No instales terceros sin revisar licencia y origen.
3. Las skills de Firebase del paquete (`firebase-*`) aplican solo a `apps/admin` y no son de diseño.
4. Si una skill contradice `AGENTS.md`, manda `AGENTS.md`.
