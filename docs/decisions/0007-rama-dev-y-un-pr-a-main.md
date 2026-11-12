# 0007 · Rama `dev` de release y un solo PR a `main`
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
El rework de c3.com.sv tiene nueve fases. Abrir un PR por tarea (decenas de PRs) multiplica la revisión y deja a `main` con estados intermedios. El sitio es el real y en producción: `main` debe cambiar una sola vez, ya completo y verificado.

## Decisión
1. La rama `dev` es la rama de integración del release. Todo el trabajo se commitea ahí, con commits convencionales. No hay PR por tarea.
2. Un único PR `dev → main` al cerrar todas las fases del plan, con capturas a 390 y 1280 px, la lista de tareas y el checklist de `AGENTS.md` §5.
3. `main` no recibe commits directos ni parciales durante el release.
4. Cada push a `dev` ejecuta CI (`.github/workflows/ci.yml`) y genera preview de Vercel. No es producción.
5. Un hotfix de producción, si llegara a hacer falta, sale de `main`, se fusiona a `main` y luego a `dev`.

## Consecuencias
- Los commits de `dev` pueden romper un estado intermedio; por eso CI corre en cada push y el PR final es el punto de revisión humana.
- El historial de `main` queda con un commit de release en lugar de decenas de tareas. El detalle por tarea vive en el plan y en el historial de `dev`.
- Se reemplaza la regla «PR por tarea» de la guía de flujo (`AGENTS.md` §7) y de la plantilla del plan.
