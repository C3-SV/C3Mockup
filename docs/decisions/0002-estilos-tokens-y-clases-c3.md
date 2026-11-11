# 0002 · Estilos con tokens `--c3-*` y clases `c3-*`
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
`apps/web` usa Tailwind v4. El DS está escrito en CSS plano con variables `--c3-*` y clases `c3-*`. Opciones: (a) adoptar tokens y clases del DS; (b) mapear tokens a Tailwind `@theme` y reescribir con utilidades.

## Decisión
Opción (a). Se importa `tokens.css` y bloques seleccionados de `globals.css` del paquete a archivos propios de `apps/web`. Tailwind queda para utilidades de layout y espaciado puntual. Los tokens también se exponen a Tailwind vía `@theme inline` **solo** para que las utilidades de layout puedan referenciarlos, sin crear una segunda fuente de verdad.

## Consecuencias
- Fidelidad al DS y menor deriva visual.
- Riesgo de colisiones con clases existentes (`.container-shell`, `.section-shell`): se resuelven en el plan (Fase 1) y las clases antiguas se eliminan al terminar.
- No se copian los ~5000 líneas del paquete; solo los bloques del mapa de portado.
- Los hexadecimales sueltos del paquete (~30 valores, §12.2) se tokenizan antes de reutilizarse.
