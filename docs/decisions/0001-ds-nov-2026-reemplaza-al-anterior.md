# 0001 · El DS de nov-2026 reemplaza al anterior
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
El sitio se construyó con la guía `estilo.md` (navy profundo, gradientes, partículas, acento turquesa/azul) y la paleta de `apps/web/lib/c3-theme.ts`. Se recibió `paquete-c3-com-sv.zip` con un DS rediseñado (fondo blanco, acción violeta, cabecera blanca, home por secciones).

## Decisión
El DS del paquete **sobrescribe** al anterior para el sitio público. `estilo.md` se archiva en `docs/archive/`. El paquete se conserva intacto en `docs/design-system/source/`. Los colores de las líneas no cambian.

## Consecuencias
- Hay que retirar fondos con gradientes, partículas y patrones de `components/backgrounds/*` salvo los usos explícitos del DS (§5.4).
- `c3-theme.ts` se sustituye por tokens CSS; el módulo se elimina al final del plan.
- Cualquier guía visual no incluida en el DS pierde vigencia.
