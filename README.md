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
