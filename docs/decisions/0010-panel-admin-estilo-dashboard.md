# 0010 · Panel admin con estilo de dashboard

- **Fecha:** 2026-11-12
- **Estado:** aceptada

## Contexto

AGENTS.md dejaba `apps/admin` fuera de alcance visual («solo CI y pruebas»). El responsable pidió corregir el panel: estilos inconsistentes, decoración sin función (degradados, tarjetas de relleno), colores escritos a mano en cada componente y textos de relleno en la barra lateral y en el acceso.

## Decisión

- **Estructura de dashboard:** barra lateral fija (escritorio) y cajón (móvil), encabezado de página con título, descripción breve y acciones, indicadores en tarjetas planas, tablas para los eventos y paneles de distribución.
- **Paleta por nombres de uso:** `apps/admin/app/globals.css` define los colores en `@theme` (`brand`, `ink`, `muted`, `line`, `subtle`, `success`, `warning`, `danger`, `line-*`). Los componentes usan esos nombres; no hay hexadecimales sueltos.
- **Componentes compartidos en `packages/ui`:** `Button` (primario violeta, secundario, fantasma y peligro), `Card` plana, `Badge` con tonos, `Input`, `Select`, `Textarea`, `Field` (etiqueta, error asociado y pista) y `Table`. `cn` se conserva: lo usa también el sitio público.
- **Sin cambios de datos ni de lógica:** el guardado, la validación del formulario, el borrado, el filtrado y los estados de carga siguen igual; solo cambia la presentación.

## Consecuencias

- Cambia el visual del admin. El sitio público no cambia: solo usa `cn` de `packages/ui`.
- `AGENTS.md` §1 y §3 dicen que el admin está fuera de alcance visual; esta decisión es la excepción pedida por el responsable.
- Verificación: typecheck, lint y build de `apps/admin` y `apps/web`. Las pantallas que requieren inicio de sesión no se revisaron en el navegador, porque no se pudo entrar con una cuenta autorizada: queda pendiente una revisión visual con sesión iniciada.
