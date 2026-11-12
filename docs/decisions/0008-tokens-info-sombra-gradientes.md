# 0008 · Excepciones aceptadas de los tokens del DS
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
El paquete del DS (`docs/design-system/source/ACTUALIZACION-DS-C3.md` §12.1) deja abiertos cuatro puntos que afectan a los tokens y que el sitio necesita resolver al implementar la Fase 1:

- **#3 `--c3-info` = azul de Compite** (`#205298`). Contradice la regla de que un estado nunca usa color de línea.
- **#13 sombra de tarjetas.** El DS dice «sin sombras» en una versión anterior y usa `shadow-soft` en el sistema aplicado.
- **#14 gradientes.** El DS admite cuatro usos explícitos (§5.4) y una versión anterior decía «sin gradientes».
- **#4 modo oscuro.** Los tokens oscuros existen, pero el botón oscuro no cumple (4.13:1) y ningún componente activa `data-theme`.

## Decisión
1. **`--c3-info` = azul de Compite, excepción aceptada por escrito.** `info` se usa solo en pastillas de estado con texto visible, nunca como color de línea ni como acento decorativo.
2. **`shadow-soft` (`0 6px 22px rgba(15,32,62,.07)`) aceptada** en tarjetas de línea, tarjetas de experiencia y rutas. No se añaden otras sombras de tarjeta.
3. **Cuatro gradientes aceptados y ninguno más** (§5.4): conector entre pasos, órbita del hero, esqueleto de carga y conector vertical de pasos. Los gradientes de `c3-theme.ts` (barra de progreso, botón destacado) se retiran en la Fase 8.
4. **Modo oscuro no activo.** La copia de `tokens.css` en `apps/web/app/ds/` omite el bloque `[data-theme="oscuro"]`. El sitio fuerza `color-scheme: light`. Reactivarlo requiere antes corregir el botón oscuro (§3.3) y reabrir este ADR.
5. **Tokens añadidos por la guía §15.4** se declaran en `apps/web/app/ds/tokens-extra.css`. Los que el paquete no trae y el sitio necesita se añaden en el mismo archivo y se registran aquí.
6. **Puente de fuentes:** las variables `--c3-font-titulo` y `--c3-font-texto` apuntan a `--font-heading` y `--font-body` de `next/font`. Poppins conserva el peso 700, porque el sitio lo usa en 86 lugares con `font-bold`.

## Tokens añadidos en la Tarea 1.2
Los colores que el paquete escribe como hexadecimales en `estilos/globals.css` se tokenizan. Los que no tienen token en `tokens.json` se declaran en `apps/web/app/ds/tokens-extra.css`:
- Bordes de estado de pastilla: `--c3-info-borde`, `--c3-exito-borde`, `--c3-advertencia-borde`, `--c3-error-borde`.
- Sobre navy: `--c3-texto-sobre-navy`, `--c3-enlace-sobre-navy`, `--c3-acento-sobre-navy`.
- Neutros: `--c3-borde-hover`, `--c3-borde-suave`, `--c3-superficie-suave` (unifica #f7f9fd y #f8fafd: diferencia de 1 unidad), `--c3-superficie-gris`.
- Línea: `--c3-line-accent`, `--c3-line-text`, `--c3-line-tint` con valor por defecto de Compite; la plantilla de línea los sobrescribe.
- Fondo suave de cada página de línea (Tarea 5.1, DS §3.1): `--c3-pagina-compite` (#f3f6fc), `--c3-pagina-crea` (#f1faf8), `--c3-pagina-conecta` (#f4f5fb).

## Consecuencias
- La prueba `tests/tokens/contrast.test.ts` sigue validando los valores del paquete. Si cambia `tokens.css`, la prueba avisa.
- Cualquier nuevo gradiente, sombra de tarjeta o uso de `info` como color de línea exige un ADR nuevo.
- Los pendientes #3, #4, #13 y #14 de `docs/design-system/pendientes.md` quedan cerrados por este ADR.

## Ajuste de la Fase 5 (2026-11-11): cabecera de línea y foco
- `--c3-line-on-fill` (texto sobre el color pleno de la línea; navy en Crea, blanco en Compite y Conecta) con valor por defecto en `tokens-extra.css`. Lo fija `lib/ds/line-theme.ts`.
- Dentro de `.c3-line-hero` (`app/ds/line-pages.css`) se redefine `--c3-foco` como `var(--c3-line-on-fill)`. El foco global es violeta (`--c3-foco`) y sobre el color pleno de cada línea queda entre 1,03:1 y 2,75:1, por debajo del mínimo de 3:1 de WCAG 1.4.11. Redefinir la variable en el hero evita una regla con capa que no ganaría a la regla global sin capa. No se cambia `--c3-foco` en el resto de la página.
