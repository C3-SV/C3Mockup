# Estrategia de pruebas

Decisión: [ADR-0004](../decisions/0004-calidad-vitest-playwright-gha.md). Las herramientas se instalan en la **Fase 0** del plan; este documento define qué se prueba y cuándo.

## Pirámide

| Capa | Herramienta | Qué cubre | Dónde |
| --- | --- | --- | --- |
| Tokens | Vitest | Ratios de contraste calculados desde `tokens.json` (AA 4.5:1 texto, 3:1 UI); ningún hex suelto en `apps/web` fuera de archivos de tokens | `apps/web/tests/tokens/` |
| Unidad | Vitest | Utilidades (`lib/*`), validación del formulario de contacto, mapeo de eventos a tarjetas, paginación de destacadas (6 por página) | `apps/web/tests/unit/` |
| Componente | Vitest + Testing Library | `Button`, `StatePill`, `CatalogCard`, `SiteHeader` (menú, Escape, clic fuera, `aria-expanded`), `FeaturedGrid`, `HomeOrbit` (botones con nombre, `aria-pressed`) | junto al componente o `tests/components/` |
| E2E | Playwright | Recorridos de cada página a **390 y 1280 px**: sin scroll horizontal, navegación por teclado, foco visible, menú móvil, formulario de contacto, 404 | `apps/web/e2e/` |
| Accesibilidad | `@axe-core/playwright` | Cero violaciones `serious` o `critical` por página y viewport | `apps/web/e2e/a11y.spec.ts` |
| Movimiento | Playwright (`reducedMotion: 'reduce'`) | Órbita sin animación | `apps/web/e2e/motion.spec.ts` |
| Contenido | Vitest | Sin emojis, sin voseo, sin precios, sin la palabra DEMO, sin «challenge» | `apps/web/tests/content/` |
| Visual (opcional, fase final) | Playwright screenshots | Línea base por página y viewport, para el comparativo antes/después del DS §15.5 | `apps/web/e2e/__screenshots__/` |

## Reglas

- **TDD** (`superpowers:test-driven-development`): la prueba nueva debe fallar primero, y el PR lo evidencia.
- Las pruebas de contenido son baratas y atrapan regresiones de voz y de reglas de `PRODUCT.md`.
- E2E corre contra `next build && next start`, no contra `dev`.
- Sin mocks del DS: se prueba con los tokens reales.
- No se desactivan pruebas para pasar CI; se corrige la causa (`systematic-debugging`).

## Bloqueante en CI

lint, typecheck, test, build, e2e (ambos viewports) y axe. La comparación visual no bloquea; se revisa en el PR.
