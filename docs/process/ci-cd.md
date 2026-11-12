# CI/CD

## CI (GitHub Actions)

Archivo: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). Corre en cada PR y en cada push a `main`.

| Job | Comandos | Estado |
| --- | --- | --- |
| `quality` | `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `build` | Activo. **Hoy `lint` falla** (1 error en `components/ui/Button.tsx`); la Tarea 0.1 del plan lo corrige, y hasta entonces el job saldrá en rojo |
| `test` | `pnpm test` | Activo desde la Fase 0 |
| `e2e` | `playwright install --with-deps chromium` → `pnpm test:e2e` | Activo desde la Fase 0 |

- Node 22, pnpm según `packageManager`, caché de pnpm y de Turborepo.
- Cancelación de ejecuciones previas por rama (`concurrency`).
- Permisos mínimos (`contents: read`).
- Sin secretos en CI: las variables que necesita `next build` se sustituyen por valores de prueba (ver el workflow).
- En fallo, el reporte de Playwright y los traces se suben como artefacto.

## CD (Vercel)

- Dos proyectos Vercel independientes: `apps/web` y `apps/admin` (ver `README.md`).
- **Preview** por PR; **producción** al fusionar en `main`.
- **`dev`** (rama de release, ADR-0007): cada push pasa CI y tiene preview de Vercel. No es producción.
- Protección de `main`: PR obligatorio, CI verde, sin push directo (configurar en GitHub → Settings → Branches).
- El despliegue lo gestiona la integración Git de Vercel; CI no despliega. Así CI y CD no duplican el build.
- Variables de entorno: solo en Vercel y en `.env.local` locales. Nunca versionadas.
- Tras fusionar, verificar la URL de producción a 390 y 1280 px (checklist del DS §15.5).

## Dependabot

`.github/dependabot.yml` abre PRs semanales para npm/pnpm y Actions. Next, React y Tailwind se revisan a mano: Next 16 tiene cambios incompatibles (ver `AGENTS.md`).

## Responsabilidades pendientes del propietario del repo

1. Activar la protección de rama en GitHub.
2. Confirmar que las integraciones de Vercel apuntan a `apps/web` y `apps/admin` como directorios raíz.
