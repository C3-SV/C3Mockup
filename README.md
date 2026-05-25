# C3 Shell Temporal

Landing institucional temporal de **C3 / Competitive Coding Club** para el dominio principal:

- `https://c3.com.sv`
- `https://www.c3.com.sv`

## Proposito

Este proyecto funciona como **shell temporal** del sitio principal de C3 y como punto de entrada para eventos activos:

- Copa Salvadorena de Programacion
- Hackathon de Turismo Creativo I

## Rutas publicas

- `/` -> Landing temporal principal de C3
- `/copa` -> Redirige al sitio externo de Copa
- `/hackathon` -> Redirige al sitio externo de Hackathon de Turismo Creativo I

## Redirecciones actuales

La configuracion usa **redirects temporales** (no permanentes) hacia:

- `https://copa.c3.com.sv`
- `https://hackathon.c3.com.sv`

Esto esta definido en:

- `vercel.json` (produccion en Vercel)
- `next.config.ts` (paridad para entorno local)

## Publicacion de Hackathon de Turismo Creativo I

El evento usa el sitio satelite oficial:

- `https://hackathon.c3.com.sv`

## Nota para evolucion futura

Si mas adelante se quiere mantener visible la URL bajo:

- `c3.com.sv/copa`
- `c3.com.sv/hackathon`

Se debe migrar de **redirects** a **rewrites** y configurar `basePath` en los proyectos destino.

## Desarrollo local

```bash
pnpm dev
```

Abrir `http://localhost:3000`.
