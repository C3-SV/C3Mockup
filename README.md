# C3 Shell Temporal

Landing institucional temporal de **C3 / Competitive Coding Club** para el dominio principal:

- `https://c3.com.sv`
- `https://www.c3.com.sv`

## Proposito

Este proyecto funciona como **shell temporal** del sitio principal de C3 y como punto de entrada para eventos activos:

- Copa Salvadorena de Programacion

El contenido de Festival/Hackathon se mantiene en codigo pero esta oculto temporalmente.

## Rutas publicas

- `/` -> Landing temporal principal de C3
- `/copa` -> Redirige al sitio externo de Copa

## Redirecciones actuales

La configuracion usa **redirects temporales** (no permanentes) hacia:

- `https://copa.c3.com.sv`

Esto esta definido en:

- `vercel.json` (produccion en Vercel)
- `next.config.ts` (paridad para entorno local)

## Publicacion de Festival/Hackathon

El contenido no se elimino. Quedo desactivado por bandera:

- UI: `NEXT_PUBLIC_SHOW_FESTIVAL` (solo visible si es `true`)
- Redirect local/build: `SHOW_FESTIVAL` en `next.config.ts`

## Nota para evolucion futura

Si mas adelante se quiere mantener visible la URL bajo:

- `c3.com.sv/copa`
- `c3.com.sv/festival`

Se debe migrar de **redirects** a **rewrites** y configurar `basePath` en los proyectos destino.

## Desarrollo local

```bash
npm run dev
```

Abrir `http://localhost:3000`.
