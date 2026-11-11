# Documentación de C3

Índice único. Si un documento no está aquí, no es vigente.

| Carpeta | Contenido |
| --- | --- |
| [`design-system/`](design-system/README.md) | Sistema de diseño vigente (nov-2026): guía, pendientes, mapa de portado y **copia fiel del paquete recibido** en `source/` |
| [`superpowers/specs/`](superpowers/specs/) | Specs de diseño (qué y por qué) |
| [`superpowers/plans/`](superpowers/plans/) | Planes de implementación (tareas con casillas) |
| [`content/`](content/documento-maestro-sitio-c3.txt) | **Fuente de contenido** del sitio (Documento Maestro, 20-may-2026). El contenido existente se conserva |
| [`decisions/`](decisions/README.md) | ADRs: una decisión por archivo, con fecha |
| [`process/`](process/) | Flujo de trabajo: skills, pruebas, CI/CD, definición de hecho |
| [`archive/`](archive/) | Documentos reemplazados. No usar como fuente |

En la raíz: [`AGENTS.md`](../AGENTS.md) (entrada de agentes y colaboradores), [`PRODUCT.md`](../PRODUCT.md) (producto y contenido), [`CLAUDE.md`](../CLAUDE.md).

## Cómo mantenerla

- Cambia un token o una regla → ADR nuevo con fecha y actualiza `design-system/README.md`.
- Cierras una tarea del plan → marca la casilla en el mismo PR.
- Reemplazas un documento → muévelo a `archive/` con un aviso al inicio.
