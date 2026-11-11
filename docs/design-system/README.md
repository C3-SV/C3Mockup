# Sistema de diseño C3 · corte del 5-nov-2026

**Estado:** vigente. **Reemplaza** a la guía anterior (`docs/archive/estilo-legacy-pre-ds-2026-11.md`) y a la paleta de `apps/web/lib/c3-theme.ts` una vez completado el plan.

## Qué es esto

> **Ojo:** el paquete viene del demo de la plataforma **C3 Challenges** (aún no lanzada). Sirve para lo visual y la estructura; la **terminología y los CTAs no se heredan** (eventos y experiencias, sin cuentas): ver [ADR-0006](../decisions/0006-vocabulario-y-color-del-sitio-principal.md) y la tabla de `PRODUCT.md`.

Un rework de c3.com.sv sobre el DS entregado el 11-nov-2026 en `paquete-c3-com-sv.zip`. El paquete se guardó **sin modificar** en [`source/`](source/). Esa carpeta es inmutable: si algo del paquete cambia, se anota en un ADR y en este documento, no editando `source/`.

## Mapa de `source/`

| Ruta | Qué es | Uso aquí |
| --- | --- | --- |
| `ACTUALIZACION-DS-C3.md` | Traspaso completo: principios, valores, componentes, home, pendientes, checklist | **Fuente para lo visual.** Léelo entero antes de diseñar |
| `tokens/tokens.css`, `tokens.json` | Variables `--c3-*` | Se importan a `apps/web` (Fase 1 del plan) |
| `estilos/globals.css` | ~5000 líneas de estilos del DS **y de la app de la plataforma** | Se extraen solo los bloques necesarios (`porting-map.md`) |
| `componentes/*.tsx` | Componentes de referencia de la plataforma | **No compilan aquí.** Estructura, clases y jerarquía; se reescriben |
| `brand/c3`, `brand/lines` | Logos y símbolo oficiales | Se copian a `apps/web/public/brand/` sin deformar |

## Qué cambia frente al sitio actual (resumen)

| Tema | Antes | Ahora |
| --- | --- | --- |
| Acción | Azul de Compite / turquesa | **Violeta `#6548c7`** (botón primario, enlace, foco) |
| Fondo | Navy profundo con gradientes y partículas | Blanco, superficie `#f6f8fb`, bordes `#dce3ed` |
| Cabecera | Navbar propio | Blanca, fija, 72/64 px, menú «Conoce C3» |
| Pie | Pie propio | Navy, cuatro columnas |
| Home | Secciones actuales | Hero con órbita, 3 líneas, 2 caminos, banda de 4 pasos, destacadas paginadas, cierre navy |
| Estilos | Tailwind + clases sueltas | Tokens `--c3-*` + clases `c3-*`; Tailwind solo para layout |
| Voz | Mixta | «tú» |
| Contenido | Real | **Se conserva.** No se usa el badge DEMO del DS; solo cambia lo visual |

El detalle por archivo está en el spec y el plan:
[`../superpowers/specs/2026-11-11-ds-rework-design.md`](../superpowers/specs/2026-11-11-ds-rework-design.md) · [`../superpowers/plans/2026-11-11-ds-rework.md`](../superpowers/plans/2026-11-11-ds-rework.md).

## Documentos de este directorio

- [`pendientes.md`](pendientes.md): los 16 asuntos abiertos del DS, con la postura que adopta este repo.
- [`porting-map.md`](porting-map.md): qué componente de referencia va a qué archivo, y qué CSS extraer.
- [`gap-analysis.md`](gap-analysis.md): brechas entre `apps/web` actual y el DS, por área.

## Reglas rápidas

Ver `AGENTS.md` §3. Para dudas de valores, `source/ACTUALIZACION-DS-C3.md` §3 a §6; para dudas de componente, §7; para la home, §8.

## Alcance de este repo

Aplica a las páginas existentes de `apps/web`: home, Compite, Crea, Conecta, eventos, contacto, FAQ, ¿Qué es C3? y 404. **Fuera de alcance:** `apps/admin`, y las pantallas del DS que el sitio no tiene (explorar, acceso, perfil público, propuesta de empresa, zona privada). Quedan documentadas como fases futuras en el plan.
