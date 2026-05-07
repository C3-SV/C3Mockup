# C3 Shell Temporal

Landing institucional temporal de **C3 / Competitive Coding Club** para el dominio principal:

- `https://c3.com.sv`
- `https://www.c3.com.sv`

## Propósito

Este proyecto funciona como **shell temporal** del sitio principal de C3 y como punto de entrada para dos eventos activos:

- Copa Salvadoreña de Programación
- Festival / Hackathon

## Rutas públicas

- `/` → Landing temporal principal de C3
- `/copa` → Redirige al sitio externo de Copa
- `/festival` → Redirige al sitio externo de Festival/Hackathon

## Redirecciones actuales

La configuración inicial usa **redirects temporales** (no permanentes) hacia:

- `https://copa.c3.com.sv`
- `https://festival.c3.com.sv`

Esto está definido en:

- `vercel.json` (producción en Vercel)
- `next.config.ts` (paridad para entorno local)

## Nota para evolución futura

Si más adelante se quiere mantener visible la URL bajo:

- `c3.com.sv/copa`
- `c3.com.sv/festival`

se debe migrar de **redirects** a **rewrites** y configurar `basePath` en los proyectos destino.

## Desarrollo local

```bash
npm run dev
```

Abrir `http://localhost:3000`.
