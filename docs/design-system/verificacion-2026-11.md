# Verificación del rework · nov-2026

Registro de la Tarea 8.3 (plan `docs/superpowers/plans/2026-11-11-ds-rework.md`, Fase 8), rama `fase-8-cierre`.
Cumple el checklist de accesibilidad y pruebas del DS (§15.5) en lo que se puede verificar desde el repositorio.

## Resultados (estado del código al cierre de la Fase 8)

| Comprobación | Comando | Resultado |
| --- | --- | --- |
| Lint | `pnpm --filter @c3/web lint` | 0 errores, 0 advertencias |
| Typecheck | `pnpm --filter @c3/web typecheck` | Sin errores (app y pruebas) |
| Pruebas unitarias y de componentes | `pnpm exec vitest run` (apps/web) | 28 archivos; 188 pruebas en verde y 1 «expected fail» heredada de contraste |
| Build público | `pnpm build:web` | Compila; 8 páginas estáticas, `/manifest.webmanifest`, `/sitemap.xml`, `/api/contact` y `/api/revalidate` |
| Build admin | `pnpm --filter @c3/admin build` | Compila (con `.env.local` local) |
| E2E completo | `pnpm test:e2e` (apps/web) | 206 pruebas: 183 en verde, 0 fallos, 23 omitidas (18 de accesibilidad por proyecto y 5 preexistentes con condición de viewport o de proyecto) |
| Accesibilidad por página | `e2e/a11y.spec.ts` | 9 páginas (8 públicas y la 404) a 390 y 1280 px: respuesta esperada, sin scroll horizontal, axe sin violaciones serias o críticas (WCAG 2.0 y 2.1 A/AA), primer Tab con contorno sólido de 3 px. A 320 px: sin scroll horizontal y axe limpio. Con movimiento reducido: sin animaciones infinitas en marcha |

La prueba de 320 px encontró un defecto real antes de corregirlo: en `/faq` la página medía 350 px, por el correo de la respuesta, que no tiene espacios. Se corrigió en `fix(web): ítem de FAQ sin desbordamiento a 320 px`.

## Capturas (comparativo antes/después)

- `e2e/visual.spec.ts` genera una captura de página completa por página y viewport. No bloquea ni afirma nada sobre el diseño. Se ejecuta con `CAPTURAS_DIR=<carpeta> pnpm exec playwright test e2e/visual.spec.ts`; por defecto escribe en `apps/web/test-results/capturas`, que git ignora.
- «Antes»: producción `https://c3.com.sv`, que aún sirve el sitio anterior al rework (el PR `dev → main` no se ha fusionado).
- «Después»: build local de `fase-8-cierre`.
- Las capturas no se versionan. Hay que adjuntarlas al PR de la Tarea 8.4 para la validación del responsable.

## Revisión de accesibilidad y de diseño (Step 5)

Revisión parcial y por muestreo, no completa:

- Revisadas visualmente: primera pantalla de la home a 390 y 1280 px, y primera pantalla de `/contacto` a 390 px.
- **Incumple la regla de objetivo táctil de 44 px del DS** (medido con Playwright sobre el build): en 390 px el botón «Menú» mide 89×40 px y el enlace del logo 71×30 px; en 1280 px los enlaces de la navegación miden 37 px de alto. Solo «Contacto» (113×46 px) cumple. No se corrigió en 8.3 porque cambia la geometría de la cabecera ya validada en la Fase 2: queda como decisión pendiente de aprobación.
- Los campos del formulario tienen etiqueta visible. Su altura (46 px en el plan) no se midió. El violeta de acción se usa en el botón primario.
- Mejora observada: en 390 px, la columna de texto del hero ocupa unos dos tercios del ancho y deja espacio vacío a la derecha. Es un tema de composición, no de accesibilidad.
- El contraste de los textos de cuerpo y de los botones no se verificó con capturas: lo cubren las pruebas de tokens (`tests/tokens/contrast.test.ts`), que pasan.
- No revisado: el resto de páginas a 1280 px, el zoom de texto al 200 %, y lectores de pantalla (VoiceOver, NVDA).
- El skill `design:design-critique` no se ejecutó en esta tarea.

## Pendientes que no se pudieron verificar desde aquí

- **Objetivo táctil de la cabecera (44 px del DS).** Medidas en la sección de revisión: «Menú» 40 px de alto en móvil, logo 30 px y enlaces de navegación 37 px en escritorio. Propuesta para aprobar: ampliar el área de toque con `min-height` o relleno, sin cambiar el tamaño visual. Requiere un cambio en la cabecera de la Fase 2 y su prueba de E2E.

- **Lighthouse y axe manual sobre el preview de Vercel.** No es accesible desde este entorno, así que no hay puntuaciones registradas. Pendiente de la Tarea 8.4 o del responsable.
- **Validación del comparativo antes/después** por el responsable.
- **Zoom de texto al 200 %** y lectura con lector de pantalla.
- **Revisión de diseño completa** (`design:design-critique` sobre todas las capturas).
- **Revisión de código sobre la rama** (`superpowers:requesting-code-review`, Step 6).
- **Capturas del admin antes y después.** El admin compila y usa solo `Button`, `Badge`, `Card` y `cn` de `packages/ui`, que no cambiaron; no se capturó visualmente.
- **Análisis de código muerto con knip.** Falló por falta de memoria en `oxc-parser` en Windows; el análisis se hizo con grep.
