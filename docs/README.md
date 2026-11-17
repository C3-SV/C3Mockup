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

## Planificación de contenido institucional · 13-nov-2026

Estado: tres propuestas para revisión, sin implementación ni publicación. Las respuestas del responsable están registradas en cada spec; las decisiones técnicas propuestas requieren revisión antes de ejecutar.

| Iniciativa | Spec | Plan |
| --- | --- | --- |
| Fichas por edición, memorias y resultados | [Spec](superpowers/specs/2026-11-13-eventos-memorias-design.md) | [Plan](superpowers/plans/2026-11-13-eventos-memorias.md) |
| Legal y convivencia | [Spec](superpowers/specs/2026-11-13-legal-convivencia-design.md) | [Plan](superpowers/plans/2026-11-13-legal-convivencia.md) |
| Empieza en C3 | [Spec](superpowers/specs/2026-11-13-empieza-en-c3-design.md) | [Plan](superpowers/plans/2026-11-13-empieza-en-c3.md) |

[Ideas futuras de contenido y UI/UX](product/ideas-futuras-sitio-institucional.md): Colabora, publicaciones/SEO, historias, timeline, impacto acumulado, aliados, boletín y otras propuestas con dependencias y prioridad.
