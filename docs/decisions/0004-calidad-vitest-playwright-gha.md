# 0004 · Calidad: Vitest, Playwright + axe, GitHub Actions, Vercel
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
No hay pruebas ni CI. El DS exige verificación a 390 y 1280 px, contraste, foco y movimiento reducido (§6, §15.5) y recomienda auditoría con herramienta (pendiente 12).

## Decisión
- **Unitarias y de componentes:** Vitest + Testing Library (jsdom) en `apps/web` y paquetes.
- **E2E y accesibilidad:** Playwright con proyectos `mobile-390` y `desktop-1280`, `@axe-core/playwright`, emulación de `prefers-reduced-motion`.
- **Tokens:** prueba de contraste automática que calcula los ratios de `tokens.json` (cierra el pendiente 12 para el tema claro).
- **CI:** GitHub Actions en cada PR: install, lint, typecheck, test, build, e2e.
- **CD:** Vercel por proyecto (web y admin): preview por PR; producción al fusionar en `main`.
- **TDD** obligatorio para lógica y componentes con comportamiento (`superpowers:test-driven-development`).

## Consecuencias
Se añaden dependencias de desarrollo (Fase 0 del plan). El plan define los umbrales y qué es bloqueante.
