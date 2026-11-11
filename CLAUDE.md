@AGENTS.md
@PRODUCT.md

# Notas específicas de Claude Code

- Antes de cualquier tarea no trivial, invoca la skill de `superpowers` que corresponda (tabla en `AGENTS.md` §4).
- El trabajo vive en `docs/superpowers/plans/`: toma la siguiente tarea sin marcar, no improvises alcance.
- `docs/design-system/source/` es **inmutable** (copia fiel del paquete recibido). Los cambios al sistema van en `docs/design-system/*.md` y `docs/decisions/`.
- Al terminar, aplica `superpowers:verification-before-completion`: pega la salida real de lint, typecheck, build y pruebas.
