# C3 Monorepo

Monorepo Turborepo para C3 con dos apps independientes:

- `apps/web`: sitio público de `c3.com.sv`
- `apps/admin`: panel interno para CRUD de eventos
- `packages/ui`: componentes reutilizables
- `packages/config`: tipos y datos compartidos

## Requisitos

- Node.js 20.9+
- `pnpm`

## Desarrollo

```bash
pnpm install
pnpm dev
```

### Ejecutar solo una app

```bash
pnpm dev:web
pnpm dev:admin
```

## Build

```bash
pnpm build
```

O por app:

```bash
pnpm build:web
pnpm build:admin
```

## Deploy

- `apps/web` se despliega como proyecto Vercel independiente.
- `apps/admin` se despliega como proyecto Vercel independiente.
- Cada app tiene su propio `next.config.ts`, variables de entorno y build.

## Variables de entorno

- `apps/web/.env.local`: secretos del sitio público.
- `apps/admin/.env.local`: Firebase Auth, Firestore y allowlist de admins.

## Notas

- El sitio público conserva rutas, metadata, SEO, assets y redirects.
- El panel admin usa Google Auth con Firebase y maneja eventos en Firestore.

## Documentación y flujo de trabajo

- Entrada para agentes y colaboradores: [`AGENTS.md`](AGENTS.md). Producto y contenido: [`PRODUCT.md`](PRODUCT.md).
- Índice de documentación: [`docs/README.md`](docs/README.md). Sistema de diseño vigente: [`docs/design-system/`](docs/design-system/README.md).
- Spec y plan del rework de c3.com.sv: [`docs/superpowers/`](docs/superpowers/).
- Pruebas, CI/CD y skills: [`docs/process/`](docs/process/).

## Calidad

```bash
pnpm lint && pnpm typecheck && pnpm build
pnpm test        # Vitest (se crea en la Fase 0 del plan)
pnpm test:e2e    # Playwright a 390 y 1280 px + axe (Fase 0)
```

CI en GitHub Actions (`.github/workflows/ci.yml`); despliegue por Vercel (preview por PR, producción desde `main`).
