<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# C3 · guía para agentes y colaboradores

Monorepo de **c3.com.sv** (Competitive Coding Club · El Salvador). Este archivo es la entrada obligatoria para cualquier agente de IA o persona que cambie código. Lo que no esté aquí vive en los documentos enlazados; no lo reinventes.

## 1. Mapa del repositorio

| Ruta | Qué es | Estado frente al DS nuevo |
| --- | --- | --- |
| `apps/web` | Sitio público (Next.js 16, React 19, Tailwind v4) | **En rework** al DS de nov-2026 |
| `apps/admin` | Panel interno de eventos (Firebase) | **Fuera de alcance visual.** Solo CI y pruebas |
| `packages/ui` | Componentes compartidos | Se reevalúa en el plan (ver `docs/superpowers/plans/`) |
| `packages/config` | Tipos y datos compartidos | Sin cambios de diseño |
| `docs/` | Toda la documentación viva | Ver §2 |

## 2. Dónde está cada cosa (léelo antes de actuar)

1. **Producto y reglas de contenido:** [`PRODUCT.md`](PRODUCT.md). Voz, vocabulario, qué no inventar.
2. **Sistema de diseño vigente (manda para lo visual):** [`docs/design-system/README.md`](docs/design-system/README.md) y el traspaso original [`docs/design-system/source/ACTUALIZACION-DS-C3.md`](docs/design-system/source/ACTUALIZACION-DS-C3.md).
3. **Spec y plan del rework:** [`docs/superpowers/specs/`](docs/superpowers/specs/) y [`docs/superpowers/plans/`](docs/superpowers/plans/). El plan es la lista de trabajo; márcalo mientras avanzas.
4. **Decisiones y pendientes:** [`docs/decisions/`](docs/decisions/) (ADRs) y [`docs/design-system/pendientes.md`](docs/design-system/pendientes.md).
5. **Flujo de trabajo, calidad, CI/CD:** [`docs/process/`](docs/process/).
6. **Obsoleto:** `docs/archive/`. No lo uses como fuente. `estilo.md` quedó reemplazado por el DS nuevo.

**Precedencia cuando dos fuentes se contradicen:** el DS manda para lo visual; el sitio actual y `PRODUCT.md` mandan para contenido, rutas y reglas de negocio; el código en `main` manda para comportamiento hasta que una tarea del plan lo cambie.

## 3. Reglas de diseño no negociables (resumen del DS)

- Acción violeta `--c3-accion` (`#6548c7`) para botón primario, enlace y foco. El azul es de Compite, no de la acción.
- Color de línea **clasifica, no decora**: Compite azul, Crea turquesa, Conecta morado. Estados (éxito, advertencia, error, info) nunca usan color de línea.
- Crea base **no es texto**: usa `--c3-crea-texto`. Sobre relleno Crea, texto navy.
- Fuentes: Montserrat (títulos, etiquetas) y Poppins (texto, botones en frase normal).
- Objetivo táctil ≥ 44 px, foco visible `3px` con `--c3-foco`, `prefers-reduced-motion` respetado, sin emojis, íconos solo de trazo SVG.
- **Este es el sitio real y en producción de C3. El rework es visual: el contenido existente se conserva** (textos, titulares, eventos, SEO, rutas) y solo se mejora lo mínimo (voz «tú»). **Nunca etiqueta DEMO** ni datos, eventos, logos o textos inventados.
- Voz **«tú»** (ajuste mínimo de voseo; sin reescribir el sentido).
- **El DS viene del demo de C3 Challenges (no lanzado); este es el sitio principal.** Vocabulario: **eventos y experiencias, por áreas**. No uses «challenge», «Proponer un challenge», «Iniciar sesión» ni «Crear cuenta» (ADR-0006; tabla en `PRODUCT.md`). Los textos del DS son referencia de estructura, no copy.
- Logos: usar los archivos oficiales tal cual; no recrearlos ni deformarlos.
- Estilos: tokens `--c3-*` y clases `c3-*`. Tailwind solo para utilidades de layout. **No hay valores hexadecimales sueltos en componentes**: si falta un token, se añade (ver ADR-0002).
- Todo cambio de token o regla se registra con fecha en `docs/decisions/`.

## 4. Flujo de trabajo (superpowers)

Usa las skills; no las sustituyas por intuición. Detalle y tabla completa en [`docs/process/skills.md`](docs/process/skills.md).

| Situación | Skill |
| --- | --- |
| Idea nueva o cambio ambiguo | `superpowers:brainstorming` → spec en `docs/superpowers/specs/` |
| Spec aprobado, varias tareas | `superpowers:writing-plans` → `docs/superpowers/plans/` |
| Ejecutar un plan | `superpowers:subagent-driven-development` o `superpowers:executing-plans` |
| Cualquier lógica o componente con comportamiento | `superpowers:test-driven-development` |
| Bug o fallo de CI | `superpowers:systematic-debugging` |
| Antes de decir «listo» | `superpowers:verification-before-completion` |
| Antes de abrir PR | `superpowers:requesting-code-review` |
| Trabajo aislado en paralelo | `superpowers:using-git-worktrees` |
| UI nueva o cambio visual | `frontend-design:frontend-design` + `design:design-system` |
| Revisión de accesibilidad | `design:accessibility-review` |
| Textos de interfaz | `design:ux-copy` (voz «tú») |
| Antes de tocar código desconocido | `graphify` si existe `graphify-out/` |

## 5. Definición de «hecho» (obligatoria)

Una tarea no está hecha hasta que, con salida real pegada o enlazada en el PR:

1. `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan.
2. `pnpm test` pasa y las pruebas nuevas **fallaron antes** del cambio (TDD).
3. Para UI: `pnpm test:e2e` pasa a **390 px y 1280 px**, sin scroll horizontal, y `axe` sin violaciones serias o críticas.
4. Revisión manual de foco por teclado y de movimiento reducido en lo que cambió.
5. Checklist de `docs/design-system/source/ACTUALIZACION-DS-C3.md` §15.5 marcado en el PR.
6. Documentación al día: spec/plan marcados, ADR si hubo decisión, `PRODUCT.md` si cambió una regla de contenido.

## 6. Comandos

```bash
pnpm install              # dependencias (pnpm 11, Node 20.9+; CI usa Node 22)
pnpm dev:web              # sitio público
pnpm dev:admin            # panel interno
pnpm lint && pnpm typecheck && pnpm build
pnpm test                 # unitarias y de componentes (Vitest)
pnpm test:e2e             # Playwright, 390 y 1280 px + axe
```

`test` y `test:e2e` ya existen. `test:e2e` corre contra `next start`: ejecuta `pnpm build:web` antes.

## 7. Git, PR y despliegue

- Rama por tarea: `feat/…`, `fix/…`, `docs/…`, `chore/…`. Commits convencionales (`feat(web): …`). Nunca commitear a `main` sin PR.
- Cada PR enlaza la tarea del plan que cierra y adjunta capturas a 390 y 1280 px si toca UI.
- CI (GitHub Actions) corre en cada PR; CD es Vercel (preview por PR, producción al fusionar en `main`). Ver [`docs/process/ci-cd.md`](docs/process/ci-cd.md).
- Nunca versionar `.env*`, claves de Firebase ni `node_modules`. No ejecutar `npx impeccable install` ni instalar terceros sin revisar licencia y origen.

## 8. Qué no hacer

- No copiar `docs/design-system/source/componentes/*.tsx` tal cual: son referencia y no compilan aquí (ver `docs/design-system/porting-map.md`).
- No copiar las ~5000 líneas de `globals.css` del paquete: solo los bloques listados en el plan.
- No inventar testimonios, logos de clientes, precios, puntajes ni fotos. No publicar precios sin confirmación del responsable.
- No tocar `apps/admin` visualmente.
- No dejar `TODO` sin una entrada en el plan o en `pendientes.md`.
- No reescribir contenido que ya existe en el sitio «porque el DS dice otra cosa». El DS manda para lo visual; el contenido real manda para el contenido (fuente de referencia: `docs/content/documento-maestro-sitio-c3.txt`).
- No dejar código muerto: lo que el DS reemplaza se borra en el mismo PR que lo reemplaza o, a más tardar, en la Tarea 8.1 del plan.
