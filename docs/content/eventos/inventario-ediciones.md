# Inventario de ediciones (plantilla)

- **Estado:** plantilla sin datos confirmados. Fecha de creación: 2026-11-13.
- **Spec:** [`2026-11-13-eventos-memorias-design.md`](../../superpowers/specs/2026-11-13-eventos-memorias-design.md), §4 y §9.
- **Plan:** [`2026-11-13-eventos-memorias.md`](../../superpowers/plans/2026-11-13-eventos-memorias.md), tarea T0.

Este documento es el contrato de migración: lista qué registros pasarán a tener ficha por edición y qué falta confirmar. **No contiene datos reales todavía.** Se completa con lectura autorizada de los registros reales y con el responsable. Nadie debe rellenarlo por deducción.

## Reglas de llenado

1. **No inferir el año ni la edición** a partir de un título genérico. «Copa Salvadoreña de Programación» no indica por sí sola qué edición es. Si la edición no está confirmada, escribe `pendiente`.
2. **El slug es inmutable y se reserva de forma permanente** (spec §4). Un slug propuesto no es un slug aprobado hasta que el responsable lo confirme. Formato: minúsculas ASCII, números y guiones, de 3 a 120 caracteres.
3. **El id de Firestore no se renombra.** Una edición nueva recibe otro id y otro slug; nunca se reutiliza la ficha del año anterior.
4. **No exportar datos sensibles.** Registra solo id, título público y los campos de esta tabla.
5. Todo contenido sin fuente o sin autorización queda en **borrador** (guía editorial, §3 y §6).
6. **Sin DEMO ni datos inventados** (PRODUCT.md, reglas 1 y 2).

## Columnas

| Columna | Qué se anota |
| --- | --- |
| eventId | Id real del documento en `events/{id}`. |
| Edición confirmada | Edición o año confirmado por el responsable, con la fuente. `pendiente` si no lo está. |
| Slug propuesto | Slug candidato; no es definitivo hasta que se confirme. `pendiente` por defecto. |
| Micrositio | Dirección del sitio especial que se conserva como enlace informativo. `ninguno` solo si el responsable lo confirma. |
| Contenido disponible | Qué material existe (descripción, requisitos, resultados, galería, recursos) y dónde está. |
| Permisos | Estado de autorización para publicar texto, cifras y fotos (guía editorial, §3). |
| Responsable | Persona de C3 que valida el contenido de esa edición. |
| Estado de revisión | `pendiente`, `en revisión`, `aprobado por responsable` o `bloqueado`, con fecha. |

## Candidatos conocidos en el repositorio

Los ids y títulos salen de `defaultEvents` (`packages/config/src/events.ts`), que son los datos de respaldo del sitio. **No son el inventario real:** los registros de Firestore pueden incluir otros eventos o diferir de estos. Todas las demás columnas están sin confirmar.

| eventId | Título público actual | Edición confirmada | Slug propuesto | Micrositio | Contenido disponible | Permisos | Responsable | Estado de revisión |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `copa-salvadorena-programacion` | Copa Salvadoreña de Programación | pendiente | pendiente | pendiente de confirmar (el respaldo apunta a `https://copa.c3.com.sv`) | pendiente | pendiente | pendiente | pendiente |
| `hackathon-turismo-creativo-i` | Hackathon de Turismo Creativo I | pendiente | pendiente | pendiente de confirmar (el respaldo apunta a `https://hackathon.c3.com.sv`) | pendiente | pendiente | pendiente | pendiente |
| `icpc-centroamerica-el-salvador` | ICPC Centroamérica · sede El Salvador | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente |
| `hackatlatam-fiesta-el-salvador` | Hack@Latam · Fiesta El Salvador | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente |
| `duelo-programacion-c3-software-week-esen-2025` | Duelo de Programación C3 · Software Week ESEN 2025 | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente |

## Registros adicionales de Firestore

Agrega aquí una fila por cada evento real que exista en Firestore y no esté arriba. Hasta que alguien con lectura autorizada los inventaríe, esta sección queda vacía.

| eventId | Título público actual | Edición confirmada | Slug propuesto | Micrositio | Contenido disponible | Permisos | Responsable | Estado de revisión |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente |

## Pendiente de confirmar con el responsable

- [ ] Lista de registros reales a migrar (solo los seleccionados; el resto sigue como hasta ahora).
- [ ] Edición de cada evento seleccionado, con su fuente.
- [ ] Slug definitivo de cada ficha, comprobando que no haya colisiones.
- [ ] Micrositios que se conservan y dirección exacta.
- [ ] Material y permisos para el piloto en borrador y para la primera ficha completa real.
- [ ] Persona responsable de revisar cada ficha antes de publicar.

## Colisiones y migración

La herramienta de migración (tarea posterior del plan) arranca en dry-run, detecta colisiones de slug, no sobrescribe textos ni fechas y requiere aplicación explícita (spec §9). Este inventario es su entrada; sin filas confirmadas no se migra nada.
