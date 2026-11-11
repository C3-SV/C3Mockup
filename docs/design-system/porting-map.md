# Mapa de portado: paquete DS → `apps/web`

Fuente: lectura de `source/componentes/*` contra `apps/web` (commit `89789b0`). Los componentes del paquete **no compilan aquí**; este mapa dice qué sustituir. Vocabulario según [ADR-0006](../decisions/0006-vocabulario-y-color-del-sitio-principal.md).

## 1. Componentes

| Referencia | Destino | Tipo | Qué sustituir / decidir |
| --- | --- | --- | --- |
| `BrandMark.tsx` | `components/brand/BrandMark.tsx` | server | Tipo `LineKey` local (`@c3/config` ya lo exporta); `alt` como prop; copiar `brand/` a `public/brand/c3` y `public/brand/lines` **sin pisar** los `*-blanco.png` existentes |
| `StatePill.tsx` | `components/ui/StatePill.tsx` | server | Tipo `PillTone` local; mapeo `EventItem.status → {label, tone}` en `lib/ds/event-state.ts` |
| `CatalogCard.tsx` | `components/ds/CatalogCard.tsx` | server | Sin `CoverImage` (hoy no hay portadas): conservar el ícono por tipo como medio; tipo `CatalogCardData` local; adaptador `lib/ds/event-card.ts` (`EventItem → tarjeta`); enlaces externos (`copa.c3.com.sv`) con `target`/`rel`; `demo` solo para datos inventados; sin esqueleto |
| `FeaturedGrid.tsx` | `components/ds/FeaturedGrid.tsx` | **client** | Solo cambiar el import de la tarjeta. Recibe datos serializables desde una página servidor; **no importar `lib/events.ts` desde cliente** |
| `SiteHeader.tsx` | `components/SiteHeader.tsx` (reemplaza; `Navbar.tsx` se elimina) | **client** | Quitar `UserMenu`, sesión, `loginHref` y variante mínima. Navegación: Qué es C3 · Eventos · Conoce C3 ▾ (Compite/Crea/Conecta) · FAQ; acción primaria única «Contacto». Breakpoint 900 px, Escape/clic fuera, `aria-current` |
| `Footer.tsx` | `components/SiteFooter.tsx` (reemplaza cuerpo) | server | Cuatro columnas: marca; Conoce C3; Comunidad (Qué es C3, Eventos, FAQ, Contacto); Síguenos (redes de `siteConfig`). Sin «Tu cuenta», sin rutas inexistentes |
| `SiteShell.tsx` | `components/PageShell.tsx` | server | `<div class="c3-sitio">` + header + `{children}` + footer; eliminar `backgroundClassName`; cada página aporta `<main id="contenido">` |
| `HomeOrbit.tsx` | `components/ds/HomeOrbit.tsx` | **client** | Copiar; requiere `c3-symbol.png`; hrefs `/compite`, `/crea`, `/conecta` ya existen. Decidir burbuja bajo 900 px (ver `pendientes.md`). Prueba de retardo de 160 ms y `aria-pressed` |
| `LineLandingPage.tsx` | `components/LinePageTemplate.tsx` (adaptar) | server | Solo la lógica de acento (`--c3-line-accent/-text/-tint`, Crea usa `--c3-crea-texto`). Contenido, SEO y JSON-LD actuales se conservan; eventos de `lib/events.ts` filtrados por línea; sin `force-dynamic` |
| `home-page.tsx` | `app/page.tsx` | server | Seis secciones del §8 con el copy de ADR-0006; destacadas con `getEvents()` → adaptador → `FeaturedGrid` |
| `root-layout.tsx` | `app/layout.tsx` | server | **No copiar.** Solo añadir el enlace de salto. Se conserva `next/font` (mejor que el `<link>` de Google) |
| `tokens.css` | `app/ds/tokens.css` | css | Copia fiel; más `tokens-extra.css` con el bloque §15.4; sin bloques `[data-theme=oscuro]` |

## 2. Reglas de integración CSS (Tailwind v4 + clases `c3-*`)

1. **Capas.** Un CSS sin capa le gana a las utilidades de Tailwind v4. Importar así: `@import "tailwindcss";` → `@import "./ds/tokens.css";` → `@import "./ds/tokens-extra.css";` → `@import "./ds/c3-public.css" layer(components);`. Verificar con `pnpm build:web` que Turbopack acepta `@import … layer()`. Si no, envolver el archivo en `@layer components { … }`.
2. **Sin resets globales del DS.** No copiar `*`, `html`, `body`, `a`, `h1–h3`, `p` (líneas ~41–82 del paquete): duplican el preflight y repintarían páginas aún no migradas. Escopar bajo `.c3-sitio`.
3. **Fuentes.** Los tokens nombran Montserrat/Poppins literales; `next/font` renombra la familia. Añadir `--c3-font-titulo: var(--font-heading), system-ui, sans-serif;` y `--c3-font-texto: var(--font-body), system-ui, sans-serif;`. Quitar Poppins 700 si nadie lo usa.
4. **Tokens heredados.** Durante la migración, apuntar los antiguos a los nuevos (`--c3-surface → --c3-superficie-sutil`, `--c3-soft-border → --c3-borde`, `--c3-muted → --c3-texto-suave`) y borrarlos al final. Exponer a Tailwind (`@theme inline`) solo `--color-c3-accion`, `--color-c3-crea-texto` y los de línea, sin duplicar valores.
5. **Modo oscuro:** no importar. `color-scheme: light`.
6. **Contenedores.** Conviven `container-shell` (1360 px) y `.c3-frame` (1180 px) solo durante la migración; el final usa `.c3-frame`.

## 3. CSS a extraer de `source/estilos/globals.css`

Rangos de línea **aproximados** (§13 del traspaso); verificar cada corte con `grep` del comentario de cabecera antes de copiar. Destino: `apps/web/app/ds/c3-public.css` (o varios archivos por bloque).

| Bloque | Líneas ≈ | Notas |
| --- | --- | --- |
| Primitivas: foco, `.c3-btn*`, `.c3-pill*`, `.c3-card`, `.c3-campo*`, `.c3-alerta*`, `.c3-page`, etiqueta/título | 41–339 | Sin resets globales; `.c3-btn--small` sube a 44 px |
| Enlace de salto `.c3-saltar` | 602–620 | |
| Marco, `.c3-sitio`, punto de línea, cabecera pública | 2815–2870 y la parte pública de 2870–2995 | **Excluir** `.c3-app__barra` y menú de cuenta (2995–3066) |
| Pie | 3067–3130 | |
| Compartidos | 3131–3174 | |
| Órbita y burbuja | 3175–3339 | Incluye `prefers-reduced-motion` |
| Home | 3340–3539 | |
| Pasos y banda | 3540–3654 | Solo si se usa la banda (ver spec) |
| Tarjeta de experiencia | 3655–3912 | Incluye esqueleto (omitible) |
| Panel de cierre | 3913–3988 | |
| Encabezado de página | 3989–4105 | Para eventos, contacto, FAQ, Qué es C3 |
| Páginas de línea | 4106–4148 | |
| 404 | 4860–4903 | |
| Responsive | 4904–5031 | Recortar reglas de detalle, perfil, rúbrica, portada si no se usan |
| **Excluir** | 340–2814 y 4149–4859 | App, consola, espacio de empresa, detalle, propuesta, perfil, acceso |

Todo hexadecimal fuera de token en estos bloques (≈30 valores: `#c3cde0`, `#b8c4d9`, `#c5cee0`, `#e2e7f0`, `#f7f9fd`, `#eef2f7`, `#b9a8f0`…) se **tokeniza al extraer** (prueba automática en Fase 0/1).

## 4. Riesgos conocidos

- Cortes por número de línea frágiles: llaves huérfanas o reglas faltantes. Mitigar con una prueba que parsee el CSS final.
- Componentes cliente (header, órbita, destacadas) aumentan el bundle; las listas y los datos se construyen en servidor.
- Hotspots de la órbita atados a `c3-symbol.png`: no cambiar el símbolo sin recalcular.
- Crea turquesa falla como texto (2.38:1 sobre blanco): hoy `que-es-c3` lo usa como texto; usar `--c3-crea-texto`.
- OG image declarada 3508×2481, real 1200×630: corregir metadatos (la regeneración requiere diseño).
- No sustituir logos oficiales existentes sin confirmación del responsable.
