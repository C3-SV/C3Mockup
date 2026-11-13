# Decisiones (ADRs)

Una decisión por archivo: `NNNN-titulo.md`. Estado: `propuesta`, `aceptada`, `reemplazada`. Plantilla al final.

| # | Fecha | Decisión | Estado |
| --- | --- | --- | --- |
| [0001](0001-ds-nov-2026-reemplaza-al-anterior.md) | 2026-11-11 | El DS de nov-2026 reemplaza al anterior | aceptada |
| [0002](0002-estilos-tokens-y-clases-c3.md) | 2026-11-11 | Estilos con tokens `--c3-*` y clases `c3-*`; Tailwind solo layout | aceptada |
| [0003](0003-alcance-solo-paginas-existentes.md) | 2026-11-11 | Alcance: solo páginas existentes; admin fuera | aceptada |
| [0004](0004-calidad-vitest-playwright-gha.md) | 2026-11-11 | Calidad: Vitest, Playwright + axe, GitHub Actions, Vercel | aceptada |
| [0005](0005-decisiones-heredadas-del-ds.md) | 2026-11-05 a 11-11 | Decisiones heredadas del paquete (parcialmente reemplazadas por 0006) | aceptada |
| [0006](0006-vocabulario-y-color-del-sitio-principal.md) | 2026-11-11 | Vocabulario (eventos y experiencias, sin «challenge») y violeta de acción del sitio principal | aceptada |
| [0007](0007-rama-dev-y-un-pr-a-main.md) | 2026-11-11 | Rama `dev` de release y un solo PR a `main` | aceptada |
| [0008](0008-tokens-info-sombra-gradientes.md) | 2026-11-11 | Excepciones de tokens: info = Compite, sombra de tarjeta, 4 gradientes, modo oscuro no activo, puente de fuentes | aceptada |
| [0010](0010-panel-admin-estilo-dashboard.md) | 2026-11-12 | Panel admin con estilo de dashboard | aceptada |
| [0011](0011-destacado-rotativo-y-tipos-de-evento.md) | 2026-11-12 | Destacado rotativo en el home y tipo de experiencia como respaldo visual | aceptada |
| [0013](0013-entradilla-de-seccion-mas-ancha.md) | 2026-11-13 | Entradilla bajo el titular de sección: 62 caracteres (el DS dice 34) | aceptada |
| [0014](0014-fichas-y-memorias-por-edicion.md) | 2026-11-13 | Fichas y memorias por edición (`/eventos/{slug}`): ampliación de alcance de ADR-0003 y cambio funcional acotado del admin | propuesta (pendiente de aprobación; implementado en la rama `eventos-memorias`, ver el ADR) |

## Plantilla

```markdown
# NNNN · Título
- **Fecha:** AAAA-MM-DD · **Responsable:** … · **Estado:** …
## Contexto
## Decisión
## Consecuencias
```
