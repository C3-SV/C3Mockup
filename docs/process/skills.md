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
| `web-design-guidelines`, `vercel-react-best-practices` (`vercel-labs/agent-skills`) | Lista de revisión web y rendimiento de Next/React. Instalar solo tras revisar licencia, origen y hash |

## Orientación en el código

`graphify`: si existe `graphify-out/`, consúltalo antes de buscar a ciegas.

## Reglas

1. Invoca la skill **antes** de actuar, incluso para hacer preguntas.
2. No instales terceros sin revisar licencia y origen.
3. Las skills de Firebase del paquete (`firebase-*`) aplican solo a `apps/admin` y no son de diseño.
4. Si una skill contradice `AGENTS.md`, manda `AGENTS.md`.
