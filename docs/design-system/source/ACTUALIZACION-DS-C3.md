# Actualización de DS C3 · noviembre 2026

> **Documento de traspaso.** Está pensado para el agente o equipo que actualiza el sistema visual de **c3.com.sv**. El paquete es autocontenido: los valores y reglas están aquí, y los archivos de referencia están en las carpetas de este mismo paquete. No necesitas acceso a ningún otro repositorio.

| Dato | Valor |
| --- | --- |
| Generado | 11-nov-2026 |
| Versión del sistema | Corte del 5-nov-2026 |
| Aplicado en | Sitio público de la plataforma C3 (home, líneas, explorar, detalles, propuesta, acceso, perfil público, 404) y app autenticada (joven y empresa) |
| Sin rediseñar | Consola de administración de la plataforma (no es parte de este paquete) |
| Contenido del paquete | Este documento, `tokens/`, `estilos/`, `brand/` y `componentes/` |

---

## 0. Cómo usar este documento

1. **Criterio:** §1 y §2. **Valores:** §3 a §5. **Componentes:** §7. **Home:** §8. **Otras pantallas:** §9. **Reglas y decisiones:** §10 y §11. **Pendientes:** §12. **Archivos:** §13. **Skills:** §14. **Pasos para adaptar el sitio:** §15.
2. **Archivos de referencia en este paquete:**
   - `tokens/`: variables `--c3-*` (CSS y JSON).
   - `estilos/globals.css`: implementación completa de los estilos del sistema.
   - `brand/`: logos y símbolo.
   - `componentes/`: componentes y páginas de referencia.
3. **Los componentes son referencia, no código listo para copiar.** Importan módulos de la plataforma (`@/lib/...`, `@/components/...`) que no vienen en el paquete. Sirven para entender estructura, clases y jerarquía. §13 indica qué sustituir.
4. **No incluido en el paquete:**
   - Manual de marca oficial y canvas de diseño vigentes.
   - Precios de los paquetes comerciales (ver §10).
   - Contenido de cada línea (textos de Compite, Crea y Conecta), que se escribe en el sitio.
   - Código de la app autenticada, la consola, las reglas de negocio, las rutas y los datos de la plataforma.
   - Capturas de pantalla actuales (pedirlas al responsable si hacen falta para comparar).
5. **Para lo visual manda este documento.** Para contenido, rutas y reglas de negocio manda el sitio actual.
6. **Antes de dar algo por adaptado:** verificar a 390 px y 1280 px, contraste, foco de teclado y movimiento reducido (§6 y §15.5).

---

## 1. Qué cambió (resumen)

- **Acción violeta.** El botón primario, el enlace y el foco usan el violeta de la línea Conecta (`#6548c7`). Antes era el azul de Compite, que se leía como una categoría de catálogo. Si el sitio usa azul para la acción, este es el cambio principal.
- **Neutros más claros.** Fondo blanco, superficie sutil `#f6f8fb` y bordes `#dce3ed`. Los colores de las líneas no cambian.
- **Cabecera blanca y fija** (sticky), con «Conoce C3» como menú desplegable (Compite · Crea · Conecta).
- **Pie navy** de cuatro columnas.
- **Home por secciones:** hero con órbita del símbolo, tres tarjetas de línea, dos caminos (joven y empresa), banda de cuatro pasos, experiencias destacadas paginadas de seis en seis y panel oscuro de cierre para empresas.
- **Tipografía:** Montserrat para títulos y etiquetas, Poppins para texto. Los botones van en frase normal, no en mayúsculas.
- **Voz «tú»** en toda la interfaz.
- **Etiqueta DEMO** en cada elemento inventado. No hay aviso global de demo.
- **Tarjetas de experiencia** con el tinte de su línea en el medio, estado con texto, portada opcional y pie con la acción.

---

## 2. Principios

1. **Tres líneas, tres colores principales.** Compite (azul), Crea (turquesa) y Conecta (morado). Cada una tiene base, variante de texto, variante para fondos oscuros, tinte y versión de impresión.
2. **Navy es la base.** Texto principal, cabeceras, pies y superficies oscuras.
3. **El color de línea clasifica; no decora.** Identifica el tipo de experiencia o de producto.
4. **Cada producto tiene su color de acción, y es una variante de su línea.** Regla confirmada por el responsable el 5-nov-2026.
5. **Los estados tienen color propio y llevan texto.** Éxito, advertencia, error e información nunca se pintan con un color de línea.
6. **Fondos claros y aire.** Blanco o neutros muy claros. Sin texturas, sin emojis y con gradientes solo donde se indica en §5.4.
7. **Dos familias tipográficas.** Montserrat para títulos y etiquetas; Poppins para texto.

---

## 3. Color

### 3.1 Las tres líneas

| Variante | Compite | Crea | Conecta | Uso |
| --- | --- | --- | --- | --- |
| **Base** | `#205298` | `#33beac` | `#4f5ba9` | Relleno, puntos, gráficos, identidad |
| **Texto** (sobre claro) | `#205298` · 7.72:1 | `#0f766e` · 5.47:1 | `#4f5ba9` · 6.17:1 | Texto sobre blanco. Para Crea, usar `--c3-crea-texto` |
| **Oscuro** (sobre navy) | `#6fa0dd` · 5.98:1 | `#4fd6c4` · 9.06:1 | `#9aa4e0` · 6.76:1 | Texto y acentos sobre navy |
| **Tinte** (fondo suave) | `#e9eff9` | `#e4f6f3` | `#eceefa` | Fondo de tarjeta de línea (`estilos/globals.css`) |
| **Impresión** | `#2c519b` | `#46b8a8` | `#6d529e` | Versiones secundarias para impresión |

Los ratios son de texto sobre el fondo indicado (WCAG 2.x, cálculo propio, no auditado con herramienta).

Página de línea: el fondo suave de la página usa `#f3f6fc` (Compite), `#f1faf8` (Crea) y `#f4f5fb` (Conecta).

**Reglas de uso:**

- **Crea base no es texto.** Sobre blanco da 2.31:1. Para texto, usar `--c3-crea-texto` (`#0f766e`).
- **Sobre relleno Crea, el texto es navy** (7.02:1). El blanco no alcanza.
- **Sobre navy, la base de Compite y Conecta no basta para gráficos** (2.10:1 y 2.62:1). Usar la variante oscura.
- **Como relleno con texto blanco**, Compite da 7.72:1 y Conecta 6.17:1.

### 3.2 Navy y neutros

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--c3-navy` | `#0f203e` | `#0f203e` | Base de marca; cabeceras, pies, texto principal |
| `--c3-sec-navy` | `#202a3f` | — | Hover del botón oscuro; impresión |
| `--c3-fondo` | `#ffffff` | `#0f203e` | Fondo de página |
| `--c3-superficie` | `#ffffff` | `#17294a` | Tarjetas, cabeceras, contenedores |
| `--c3-superficie-sutil` | `#f6f8fb` | `#1f335a` | Franjas de sección, filas alternas, hover |
| `--c3-texto` | `#0f203e` | `#eaf0f8` | Texto principal |
| `--c3-texto-suave` | `#536178` | `#a9b8d0` | Descripciones y metadatos (6.27:1 sobre blanco) |
| `--c3-text-mid` | `#36435a` | — | Texto de pastillas neutras |
| `--c3-texto-inverso` | `#ffffff` | `#eaf0f8` | Texto sobre relleno fuerte |
| `--c3-borde` | `#dce3ed` | `#2c3f63` | Divisores y bordes de tarjeta |
| `--c3-borde-fuerte` | `#7c8ba0` | `#4a5f85` | Bordes de campos (3.47:1 sobre blanco) |

### 3.3 Color de acción

La acción es la variante del producto. En C3 Challenges (Conecta) es el violeta.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--c3-accion` | `#6548c7` | `#7a5fd6` | Botón primario, enlace, foco, paso actual |
| `--c3-accion-intensa` | `#5236b0` | `#8f78e0` | Hover y estado activo |
| `--c3-enlace` | `#6548c7` | `#b9a8f0` | Enlaces |
| `--c3-foco` | `#6548c7` | `#b9a8f0` | Anillo de foco |
| `--c3-action-tint` | `#efeafc` | — | Halo suave de pasos e iconos |
| `--c3-action-line` | `#e4ddfb` | — | Borde suave de acción; conector de pasos |
| `--c3-action-soft` | `#a996ec` | — | Acento secundario; conector de pasos |

**Contraste:** blanco sobre `accion` = 6.35:1; sobre `accion-intensa` = 8.36:1. En oscuro, `#eaf0f8` sobre `#7a5fd6` = **4.13:1** (no cumple para texto normal), y sobre el hover oscuro = **3.09:1**. Corregir antes de activar el modo oscuro (§12).

**Pendiente:** si hay productos de Compite o de Crea, definir su variante de acción con el mismo método. Hoy no existe.

### 3.4 Estados

| Estado | Claro | Fondo suave | Oscuro | Texto sobre fondo suave |
| --- | --- | --- | --- | --- |
| Éxito | `#157a52` | `#e0f2ea` | `#4fd99e` | 4.59:1 |
| Advertencia | `#9a5b00` | `#fbefdd` | `#e8b15c` | 4.78:1 |
| Error | `#b83227` | `#fae6e3` | `#f28b7e` | 4.96:1 |
| Información | `#205298` | `#e3ecf8` | `#6fa0dd` | 6.47:1 |

Tinte de bloque de atención: `--c3-advertencia-tinte: #fbf6ec`.

**Conflicto abierto:** `--c3-info` reutiliza el azul de Compite. Eso contradice la regla de que un estado nunca usa color de línea (§12).

Pastillas de estado (`.c3-pill--neutro | info | exito | advertencia | error`): el texto siempre es visible; el punto del mismo color es solo un refuerzo.

### 3.5 Reconocimiento

| Token | Claro | Oscuro |
| --- | --- | --- |
| `--c3-oro` | `#c99700` | `#e8c24d` |
| `--c3-plata` | `#8b97a6` | `#b9c4d2` |
| `--c3-bronce` | `#a56a39` | `#c98a57` |

Navy sobre oro: 6.10:1. Solo para medallas y reconocimientos. Pendiente: no está decidido si el sello representa percentil o puesto.

---

## 4. Tipografía

**Familias:** Montserrat (`--c3-font-titulo`) para títulos, etiquetas y cabeceras de tarjeta. Poppins (`--c3-font-texto`) para texto y botones. Ambas tienen respaldo en `system-ui`.

**Carga** (de `componentes/root-layout.tsx`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap" />
```

**Escala de tokens** (`tokens/tokens.css`):

| Estilo | Familia | Tamaño | Peso | Interlineado | Uso |
| --- | --- | --- | --- | --- | --- |
| display | Montserrat | 56 px | 800 | 1.0 | Portadas |
| h1 | Montserrat | 40 px | 700 | 1.1 | Título de página |
| h2 | Montserrat | 30 px | 700 | 1.2 | Subtítulo de sección |
| h3 | Montserrat | 22 px | 600 | 1.3 | Título de tarjeta |
| etiqueta | Montserrat | 13 px | 700 | 1.2 | MAYÚSCULAS |
| cuerpo-lg | Poppins | 18 px | 400 | 1.6 | Entradilla |
| cuerpo | Poppins | 16 px | 400 | 1.6 | Texto base |
| cuerpo-sm | Poppins | 14 px | 400 | 1.5 | Texto de apoyo |
| leyenda | Poppins | 12 px | 500 | 1.4 | Metadatos y pies |

**Escala efectiva en el sistema aplicado** (lo que de verdad se ve; los valores fuera de token se justifican en §12):

| Elemento | Valor |
| --- | --- |
| Titular del hero (`.c3-hero h1`) | `clamp(40px, 6.2vw, 64px)`, peso 800, interlineado 1.02; la palabra final en `accion` |
| Titular de sección (`.c3-section-head h2`) | `clamp(28px, 3.6vw, 40px)`, peso 800, interlineado 1.1 |
| Titular de página de línea | `clamp(52px, 7.4vw, 84px)`, peso 800, interlineado 0.98 |
| Titular de tarjeta de ruta | `clamp(24px, 2.6vw, 30px)`, peso 800 |
| Titular de banda y bloque | `clamp(22px, 2.4vw, 28px)`, peso 800 |
| Titular de cierre oscuro | `clamp(26px, 3.4vw, 38px)`, peso 800, blanco |
| Entradilla (`.c3-lead`) | `clamp(16px, 1.6vw, 19px)`, máximo 34 caracteres por línea |
| Texto de sección | 16 px, `--c3-texto-suave`, interlineado 1.6 |
| Etiqueta de sección (`.c3-eyebrow`) | Montserrat 700, **11 px**, tracking 0.12 em, MAYÚSCULAS, color `accion` |
| Botón (`.c3-btn`) | Poppins 600, **14 px**, frase normal, interlineado 1.2 |
| Texto de tarjeta | 13–15 px, `--c3-texto-suave` |
| Número de paso | Montserrat 700, **10 px**, tracking 0.12 em |

**Notas:**

- **Tracking de etiqueta:** el token dice 0.08 em; el sistema aplicado usa 0.12 em. Pendiente unificar.
- **Botones:** una versión anterior pedía Montserrat en MAYÚSCULAS. El sistema aplicado usa Poppins 600 en frase normal, y es el vigente.

---

## 5. Espaciado, layout, radios, sombras y movimiento

### 5.1 Layout

- **Marco de contenido:** `.c3-frame` con `max-width: 1180px`, centrado, con `padding-inline: clamp(16px, 4vw, 40px)`.
- **Contenido ancho:** `.c3-ancho` con `max-width: 1440px` (`--c3-ancho-pagina`).
- **Margen de página:** `.c3-page` con `padding: clamp(16px, 4vw, 48px)`.
- **Breakpoints:**
  - **640 px:** tableta. Las tarjetas y las acciones se reacomodan.
  - **900 px:** la cabecera pasa a «Menú» plegable.
  - **1024 px:** escritorio de la zona de app (si el sitio la tiene).
- **Alturas de cabecera:** 72 px en escritorio y 64 px en móvil.
- **Espaciado:** `tokens/tokens.css` define una escala de 4 px (`--c3-space-1` a `--c3-space-10`), pero el sistema aplicado usa píxeles sueltos (14, 18, 20, 28 px). Pendiente (§12).

### 5.2 Radios

| Token | Valor | Uso |
| --- | --- | --- |
| `--c3-radius-sm` | 6 px | Chips (según `tokens.json`) |
| `--c3-radius-md` | 12 px | Botones, campos, bloques de ayuda |
| `--c3-radius-card` | 18 px | Tarjetas de línea y de experiencia |
| `--c3-radius-block` | 22 px | Tarjetas de ruta, bandas y bloques grandes |
| panel de cierre | 28 px | Panel oscuro de la home (valor fijo) |
| burbuja de la órbita | 16 px | Tarjeta flotante del símbolo (valor fijo) |
| `--c3-radius-pill` | 999 px | Pastillas, puntos y avatares |
| botón pequeño | 10 px | `.c3-btn--small` |

Pendiente: los campos usan 12 px, pero `tokens.json` asigna 6 px a `radius-sm` (§12).

### 5.3 Sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `--c3-sombra-sm` | `0 1px 2px rgba(15,32,62,.08)` | Elevación mínima |
| `--c3-sombra-md` | `0 6px 16px rgba(15,32,62,.12)` | Menús flotantes |
| `--c3-sombra-lg` | `0 16px 40px rgba(15,32,62,.16)` | Modales |
| `--c3-shadow-soft` | `0 6px 22px rgba(15,32,62,.07)` | Tarjetas al pasar el cursor; tarjetas de ruta |
| `--c3-shadow-action` | `0 8px 20px rgba(101,72,199,.25)` | Halo del botón primario |

Las sombras de marca van tintadas en navy. La de acción va tintada en violeta. Pendiente: una versión anterior decía «sin sombras en tarjetas» y el sistema aplicado usa `shadow-soft` (§12).

### 5.4 Gradientes (excepciones explícitas)

Solo estos usos. Ninguno es decorativo libre:

- **Conector entre pasos:** degradado lineal de `action-soft` a `action-line`.
- **Órbita del hero:** degradado radial suave dentro del anillo exterior.
- **Esqueleto de carga:** degradado de brillo gris.
- **Conector vertical de pasos** (versión en columna): mismo degradado, en vertical.

### 5.5 Movimiento

- **Transiciones:** 0.15 s en botones, tarjetas y bordes. Las tarjetas de línea y de experiencia se elevan 2 px al pasar el cursor.
- **Órbita del símbolo:** anillo exterior en 30 s, anillo interior en 22 s en sentido inverso. Es decorativa.
- **Esqueleto de carga:** brillo continuo.
- **Regla:** toda animación respeta `prefers-reduced-motion`. Con movimiento reducido, la órbita se queda en reposo y el brillo del esqueleto no se anima. La animación nunca retrasa la lectura.

---

## 6. Accesibilidad y foco

- **Anillo de foco:** `:focus-visible` con `outline: 3px solid var(--c3-foco)` y desfase de 2 px. Nunca se elimina.
- **Enlace de salto:** «Saltar al contenido» (`.c3-saltar`), visible solo con foco de teclado.
- **Tamaño táctil mínimo:** 44 px. Botones (46 px) y campos (46 px) lo cumplen. **Excepción:** `.c3-btn--small` en el sitio público mide 36 px (§12).
- **Estados con texto.** El color solo nunca basta. Las pastillas de estado llevan palabra.
- **Idioma:** `<html lang="es">`.
- **Navegación:** `aria-current="page"` en el enlace activo; `aria-expanded` y `aria-controls` en los menús; `aria-live="polite"` en la burbuja de la órbita.
- **Órbita:** cada punto es un botón con nombre (`aria-label`), `aria-pressed` cuando está abierto y se abre también con foco.
- **Contraste:** el tema claro cumple AA según los cálculos del sistema. El tema oscuro no (§3.3). **No hay auditoría con herramienta** todavía (§12).

---

## 7. Componentes

Cada componente indica su archivo en `componentes/` y sus clases. Las clases están en `estilos/globals.css`.

### 7.1 Cabecera pública (`SiteHeader.tsx`)

- **Clases:** `.c3-site-header`, `.c3-site-header__row`, `.c3-site-nav`, `.c3-dropdown`, `.c3-site-link`.
- **Estructura (escritorio):** logo a la izquierda (enlace al inicio) · **Explorar** · **Conoce C3 ▾** · **Para empresas** · a la derecha **Iniciar sesión** (enlace) y **Crear cuenta** (botón primario). Con sesión, aparece el menú de la cuenta.
- **Menú «Conoce C3»:** desplegable con Compite, Crea y Conecta, cada uno con su punto de línea y una descripción corta. Se cierra con Escape y con clic fuera.
- **Móvil (menos de 900 px):** una fila de 64 px con logo, «Iniciar sesión» y «Menú». El panel agrupa Compite, Crea y Conecta bajo «Conoce C3».
- **Estilo:** fondo `rgba(255,255,255,.94)` con desenfoque de 8 px, borde inferior `--c3-borde`, fija al hacer scroll, altura 72 px.
- **Logo:** `brand/c3/c3-sim-azul.png`, altura 30 px en escritorio.
- **Variante mínima:** en la pantalla de acceso, solo logo y «Seguir explorando sin cuenta».
- **Dependencias a sustituir:** `UserMenu` y `useSession` son de la plataforma. Reemplazar por el menú de cuenta del sitio, o quitarlo si el sitio no tiene cuentas.

### 7.2 Menú de la cuenta

No incluido en el paquete. Lo que describe el sistema:

- Avatar circular en `accion` con iniciales en blanco.
- Contenido típico: Mi cuenta, Salir, y los accesos que el sitio tenga.
- En teléfono y tableta, el menú es solo el avatar.

### 7.3 Pie (`Footer.tsx`)

- **Clases:** `.c3-footer`, `.c3-footer__grid`, `.c3-footer__base`.
- **Fondo navy**, padding 56 px arriba y 28 px abajo.
- **Cuatro columnas:** marca (logo blanco de 34 px y el texto «Competitive Coding Club · El Salvador. Fundado en octubre de 2024.») · **Participa** (Explorar challenges, Compite, Crea, Conecta) · **Empresas** (Proponer un challenge, Cómo funciona Conecta) · **Tu cuenta** (enlaces de acceso).
- **Base:** «© 2026 C3 · Competitive Coding Club» y «Hecho en El Salvador».
- **Títulos de columna:** 11 px, MAYÚSCULAS, blancos. **Enlaces:** `#b8c4d9`, blanco y subrayados al pasar el cursor.
- **Dependencia a sustituir:** `FooterAccountLinks` es de la plataforma. Reemplazar por los enlaces de cuenta del sitio, o quitar.

### 7.4 Logos (`BrandMark.tsx`)

- **Marca C3:**
  - `brand/c3/c3-sim-azul.png`: versión azul para fondos claros (cabecera).
  - `brand/c3/logo-simple-blanco.png`: versión blanca para fondos navy (pie).
  - `brand/c3/c3-symbol.png`: símbolo para la órbita del hero.
- **Líneas:** `brand/lines/compite.png`, `crea.png`, `conecta.png` y sus versiones en blanco: `compite-blanco.png`, `crea-blanco.png`, `conecta-blanco.png`.
- **Regla:** usar los archivos tal cual. **No recrearlos a mano ni deformarlos.** Si el sitio ya tiene logos oficiales, conservarlos. El manual de marca no está en el paquete (§12).

### 7.5 Botones (`.c3-btn`)

Base: `min-height: 46px`, `padding: 0 22px`, radio 12 px, Poppins 600 14 px en frase normal, transición de 0.15 s. Cuando el botón lleva a otra pantalla o acción, va con una flecha `↗` (`.c3-arrow`, 13 px).

| Variante | Clase | Fondo | Texto | Hover |
| --- | --- | --- | --- | --- |
| Primario | `.c3-btn--primario` | `accion` + halo `shadow-action` | blanco | `accion-intensa` |
| Contorno | `.c3-btn--contorno` | `superficie` + borde `borde` | `texto` | borde `borde-fuerte` |
| Blanco | `.c3-btn--blanco` | `#ffffff` (sobre navy) | `navy` | `superficie-sutil` |
| Oscuro | `.c3-btn--dark` | `navy` | blanco | `sec-navy` |
| Pequeño | `.c3-btn--small` | — | — | `min-height: 36px`, 13 px, radio 10 px |

**Reglas:** un solo primario por bloque, que es la acción principal de la pantalla. Las acciones secundarias van en contorno.

### 7.6 Campos y selectores (`.c3-campo`)

- Altura mínima 46 px, padding `0 14px`, borde `--c3-borde-fuerte` (3:1 sobre blanco), radio 12 px, fondo `superficie`, texto Poppins 16 px.
- **Selector:** sin flecha nativa. Flecha propia SVG en `#536178`, con 44 px de margen interno a la derecha.
- Foco: anillo de 3 px `--c3-foco`.

### 7.7 Pastillas de estado (`.c3-pill`)

- Pastilla con punto de 6 px del color del texto, Poppins 600 12 px, radio pill, padding `3px 10px 3px 8px`.
- Variantes: `--neutro`, `--info`, `--exito`, `--advertencia`, `--error`.
- El componente `StatePill.tsx` recibe un estado con `label` y `tone`. El tono es uno de los cinco valores de arriba.

### 7.8 Tarjeta de línea (home)

- **Clases:** `.c3-lines` (rejilla de 3 columnas, separación 16 px), `.c3-line-card`.
- **Estructura:** punto de línea de 10 px a la izquierda; título h2 de 18 px; descripción de 13 px; enlace «Conocer <línea> ↗» abajo a la derecha, que pasa a `accion` al pasar el cursor.
- **Estilo:** fondo `superficie`, borde `borde`, radio 18 px, padding `20px 22px`. Al pasar el cursor: se eleva 2 px, sombra `shadow-soft` y borde `#c5cee0`.

### 7.9 Tarjeta de experiencia (`CatalogCard.tsx`, clase `.c3-exp`)

Se usa en la home, en las páginas de línea y en explorar. Es la pieza más reutilizada.

- **Estructura, de arriba abajo:**
  1. **Medio** de 132 px de alto con el tinte de su línea (`--c3-compite-tint`, `--c3-crea-tint` o `--c3-conecta-tint`). Muestra la portada si existe o, si no, el ícono del tipo de experiencia en el color de la línea y al 45 % de opacidad.
  2. **Badge DEMO** (`.c3-exp__badge`). Con portada, se mueve a la esquina superior izquierda para no tapar rostros.
  3. **Línea:** punto de línea y etiqueta («Compite · Taller», por ejemplo). Después, la pastilla de estado.
  4. **Título** (h3), **resumen** (`.c3-exp__summary`), **nota DEMO** (`.c3-exp__note`).
  5. **Fecha o detalle** con ícono de calendario (`.c3-exp__detail`).
  6. **Fuente** («Fuente: …»), solo en páginas de línea.
  7. **Pie:** dato corto a la izquierda y «Ver challenge ↗» o «Ver experiencia ↗» a la derecha.
- **Etiqueta de línea:** toma el color de su línea; en Crea, el texto usa `--c3-crea-texto` (§3.1).
- **Estilo:** fondo `superficie`, borde `borde`, radio 18 px, desbordamiento oculto. Al pasar el cursor: se eleva 2 px y toma sombra `shadow-soft`.
- **Esqueleto:** `CatalogCardSkeleton` (en la plataforma) replica la forma mientras cargan lotes. Si el sitio no carga por lotes, no hace falta.
- **Iconos por tipo:** competencia, hackathon, challenge empresarial, taller, charla y encuentro. Trazo de 2 px, en el color de la línea.
- **Dependencias a sustituir:** `CoverImage` (plataforma) y `StatePill`. La portada puede ser una imagen normal con `object-fit: cover`, en el mismo medio de 132 px.

### 7.10 Pasos (`.c3-steps`, `.c3-step`)

- **Uso:** solo para secuencias reales (inscribirse, entregar, evaluar).
- **Horizontal:** cuatro columnas centradas. Icono circular de 44 px en `accion` con halo de 5 px `action-tint`; número «Paso N» de 10 px; título de 16 px; texto de 13 px.
- **Conector:** línea de 2 px entre pasos, degradado `action-soft` → `action-line`.
- **Vertical** (`.c3-steps--vertical`): iconos de 36 px a la izquierda, texto alineado a la izquierda. Se usa en columnas laterales.
- **Lista ordenada** (`<ol>`): recomendable para pasos secuenciales. Usar `aria-current` en el paso actual.

### 7.11 Dos caminos (`.c3-paths`)

- **Sección:** fondo `superficie-sutil`, bordes superior e inferior `borde`, padding `clamp(48px, 6vw, 72px)`.
- **Tarjetas** (`.c3-path-card`): rejilla de 2 columnas con separación de 24 px. Radio 22 px, borde `borde`, sombra `shadow-soft`, padding `clamp(22px, 2.6vw, 32px)`.
- **Variante oscura** (`.c3-path-card--dark`): fondo navy, borde navy, sombra `0 14px 34px rgba(15,32,62,.22)`. Título blanco, texto `#c3cde0`, etiqueta en `--c3-conecta-claro`.
- **Cabecera de tarjeta:** punto de línea y etiqueta en MAYÚSCULAS. Acción al pie, alineada a la derecha.

### 7.12 Banda de pasos (`.c3-band`)

- Contenedor blanco con borde y radio 22 px, padding `clamp(22px, 3vw, 32px)`. Su cabecera (eyebrow + título) va centrada; debajo, los pasos de §7.10.

### 7.13 Órbita del símbolo (`HomeOrbit.tsx`)

- **Clases:** `.c3-orbit*`, `.c3-bubble`.
- **Composición:** símbolo central (48 % del ancho del contenedor), dos anillos y dos giros con satélites de 13 px con borde blanco de 2 px. El satélite de Compite es azul, el de Crea turquesa.
- **Puntos interactivos:** tres botones invisibles sobre los puntos del símbolo (Compite arriba a la derecha, Crea al centro, Conecta abajo a la derecha). Al pasar el cursor, al enfocar o al hacer clic, aparece una **burbuja** con el nombre de la línea, una frase y «Conocer <línea> ↗». Se cierra con un retardo de 160 ms para permitir pasar el cursor a la burbuja.
- **Posiciones:** están fijadas en porcentajes sobre `brand/c3/c3-symbol.png`. Si cambia el activo, hay que medirlas de nuevo.
- **Tamaño:** máximo 460 px. En la página de línea, 400 px y color por línea (§9.1). Por debajo de 900 px, la órbita se centra con 360 px de ancho máximo y **la burbuja se oculta**: en tableta y teléfono los puntos no muestran información (§12).
- **Clip:** `.c3-hero` y `.c3-line-intro` recortan el desbordamiento de los anillos, para que el móvil no tenga scroll lateral.

### 7.14 Hero (`.c3-hero`)

- **Estructura:** dos columnas (1.05 fr y 1 fr) con separación de 40 px. Izquierda: texto. Derecha: órbita.
- **Orden del texto:** eyebrow → titular → entradilla → dos botones.
- **Padding vertical:** `clamp(40px, 7vw, 88px)` arriba y `clamp(32px, 4vw, 48px)` abajo.
- **Por debajo de 900 px:** una columna. La órbita pasa debajo del texto (§7.13).

### 7.15 Panel de cierre (`.c3-cta`)

- **Estructura:** panel navy con radio 28 px, padding `clamp(28px, 5vw, 56px)`, rejilla de dos columnas (texto y acción). Eyebrow en violeta claro (`#b9a8f0`), título blanco, texto `#c3cde0`.
- **Decoración:** círculos concéntricos con borde blanco al 9 % y tres puntos, uno por línea, recortados a la derecha. Decorativos (`aria-hidden`). Por debajo de 640 px el panel pasa a una columna y los círculos se desplazan hacia la derecha.
- **Acción:** botón blanco («Proponer un challenge»).

### 7.16 Paginación de destacados (`FeaturedGrid.tsx`)

- **Clases:** `.c3-featured`, `.c3-featured__grid`, `.c3-pagination`.
- **Regla:** seis tarjetas por página, en rejilla de 3 columnas (separación 20 px). Por debajo de 900 px, una columna. El catálogo ya debe estar cargado; la paginación solo lo divide.
- **Controles:** «‹» y «›» (deshabilitados en los extremos) y números de página. La página actual lleva `aria-current="page"`.
- **Encabezado:** eyebrow «Experiencias destacadas», título «Lo que está pasando en C3» y el enlace «Ver todas ↗» a la derecha.

### 7.17 Tarjeta genérica (`.c3-card`)

- Fondo `superficie`, borde `borde`, radio 18 px. En zonas de app suma `shadow-soft`.

---

## 8. Home (referencia prioritaria)

La home es la referencia principal de este sistema. Su orden es el de `componentes/home-page.tsx`. Los textos son de referencia: el sitio puede cambiarlos, pero conviene conservar la estructura y la jerarquía.

| # | Sección | Clases | Contenido de referencia | Notas de adaptación |
| --- | --- | --- | --- | --- |
| 1 | **Hero** (`section.c3-hero`) | `.c3-hero`, `.c3-hero__grid`, `.c3-hero__text` | Eyebrow «Competitive Coding Club · El Salvador». Titular «El talento se ve *en acción.*». Entradilla sobre participar en challenges y conectar el trabajo con oportunidades. Botones: «Explorar challenges ↗» (primario) y «Para empresas» (contorno). | Órbita a la derecha (§7.13). El énfasis del titular va en violeta. |
| 2 | **Tres líneas** (`.c3-lines`) | `.c3-line-card` | Compite: «Mide tus habilidades en competencias y challenges técnicos.» Crea: «Convierte ideas en proyectos.» Conecta: «Muestra tus capacidades a empresas.» | Tres columnas. Cada una enlaza a su página de línea. |
| 3 | **Dos caminos** (`.c3-paths`) | `.c3-paths__grid`, `.c3-path-card`, `.c3-path-card--dark` | Joven: «Demuestra lo que sabes construir» → Explorar. Empresa: «Descubre talento con evidencia, no solo con currículums» → Proponer un challenge. | Tarjeta de empresa oscura para equilibrar la composición. |
| 4 | **Banda de pasos** (`.c3-band`) | `.c3-steps`, `.c3-step` | «De la idea a la evidencia, en cuatro pasos»: eliges un challenge · te inscribes · entregas tu solución · recibes tu evaluación. | Iconos de trazo; pasos con número y título. |
| 5 | **Destacadas** (`.c3-featured`) | `.c3-featured__grid`, `.c3-exp` | «Lo que está pasando en C3». Seis por página (§7.16). Si no hay experiencias publicadas: «Todavía no hay experiencias publicadas. Vuelve pronto.» | Solo datos reales del catálogo. Nunca inventados. |
| 6 | **Cierre para empresas** (`.c3-cta`) | `.c3-cta__panel`, `.c3-rings` | «¿Quieres ver cómo resuelve problemas el talento joven?» con el botón «Proponer un challenge». | Panel navy. Junto con la tarjeta oscura de empresa (§7.11), son los dos bloques navy de acento de la página. |

**Comportamiento:**

- **Más de 900 px:** hero a dos columnas; tres líneas en una fila; dos caminos en dos columnas; pasos en cuatro columnas; destacadas en tres columnas.
- **Entre 641 y 900 px:** hero y caminos a una columna con la órbita debajo, centrada; pasos en lista vertical; destacadas en una columna; las tres líneas siguen en fila; la burbuja de la órbita no aparece.
- **Hasta 640 px:** las tres líneas se apilan; el panel de cierre pasa a una columna; los botones del hero se apilan.
- **Ritmo vertical:** las secciones se separan con `clamp(56px, 7vw, 88px)`. Las bandas con fondo sutil marcan el cambio de bloque.

**Lo que da carácter a la home:** la órbita del símbolo como ilustración única, el color de línea como clasificación (no decoración), el fondo blanco con una banda gris claro, dos bloques navy de acento (la tarjeta de empresa y el cierre) y las tarjetas de experiencia con el tinte de su línea.

---

## 9. Otras pantallas

### 9.1 Páginas de línea (Compite, Crea, Conecta)

- **Archivo:** `componentes/LineLandingPage.tsx`. El contenido de cada línea no está incluido: se escribe en el sitio.
- **Acento por línea:** la plantilla fija tres variables CSS: `--c3-line-accent` (base de la línea), `--c3-line-text` (variante legible: Crea usa `--c3-crea-texto`) y `--c3-line-tint` (fondo suave de la página). Todo el bloque de la línea hereda de ellas.
- **Estructura:** cabecera con titular grande (clamp 52–84 px) precedido de un punto de la línea con halo de tinte; órbita de 400 px con el color de la línea; sección «La línea»; sección de recorrido o de organizaciones; catálogo de experiencias de la línea; pie común.
- **Nota de contenido:** cada línea muestra su nota DEMO y la fuente de los datos cuando la hay.

### 9.2 Otras pantallas del sitio (patrones)

No hay código de referencia para estas pantallas en el paquete. Son patrones que el sistema ya aplica:

| Pantalla | Patrón visual |
| --- | --- |
| **Explorar** | Encabezado de página; filtros en campos de 46 px; rejilla de tarjetas de experiencia; carga por lotes con esqueletos; estados abierto, próximo y concluido en pastilla. |
| **Detalle de experiencia o challenge** | Cabecera de detalle. Si hay portada, una banda de 340 px de alto en escritorio y 16:9 en móvil. Bloques en tarjetas. Columnas que pasan a una por debajo de 900 px. Estados con pastilla. |
| **Propuesta para empresas** | Formulario en campos de 46 px; pasos verticales en la columna lateral. Sin cuenta obligatoria. El campo trampa y el límite por hora son de servidor. |
| **Acceso** (iniciar sesión, crear cuenta) | Una columna estrecha. Cabecera mínima con logo y «Seguir explorando sin cuenta». Las dos pantallas son distintas y se enlazan entre sí. |
| **Perfil público** | Vista construida solo con datos ya públicos. Aviso visible al dueño del perfil. |
| **404** | Dentro de la cabecera y el pie del sitio. Código «Error 404», titular «No encontramos esta página», texto sobre contenido retirado o dirección mal escrita. Acción principal «Explorar experiencias» y secundaria «Volver al inicio». |

### 9.3 Zona privada (solo si el sitio tiene cuentas)

El sistema aplicado a la app de la plataforma no está en el paquete. Sus patrones, por si el sitio los necesita:

- **Cabecera:** desde 1024 px, cabecera superior blanca, igual a la pública. Por debajo, barra superior mínima y barra inferior de cuatro pestañas. La pestaña activa lleva un borde superior de 3 px en `accion`.
- **Mi cuenta:** saludo y contadores en claro. Dos columnas en escritorio (principal 2/3 y lateral 1/3); una columna en móvil.
- **Tareas con pasos** (entrega, inscripción): pasos como lista ordenada con `aria-current`. Retroalimentación y bitácora dentro de la columna principal.
- **Evaluación o formularios densos:** encabezado con cifras; rúbrica o índice en columna lateral desde 1024 px; puntajes en dos columnas; total parcial visible; confirmación antes de cerrar una acción irreversible.
- **Estados obligatorios:** carga (esqueleto o texto «Cargando…»), vacío, error y sin permiso.
- **Ancho:** la app usa todo el ancho útil. No hay marco de teléfono centrado.

### 9.4 Consola de administración

No es parte de este paquete y no se necesita para el sitio público.

---

## 10. Voz, contenido y etiquetas

- **Voz «tú»** en toda la interfaz pública (decisión del 4-nov-2026).
- **Término oficial:** «challenge» (decisión del 26-oct-2026). Verificar el término en el resto del sitio antes de cambiarlo.
- **Vocabulario de líneas:** Compite · Crea · Conecta. Un challenge empresarial pertenece a Conecta (con Crea como línea secundaria si aplica).
- **DEMO:** todo dato inventado lleva la etiqueta **DEMO** (badge en la tarjeta y nota en el detalle). No hay aviso global de demo.
- **Propuesta vigente:** talento primero. La empresa paga por challenge para observar capacidades de talento joven con evidencia (entregable, proceso y defensa). **No** se promete «recibir soluciones», contratación garantizada ni suscripción.
- **Precios de paquetes:** no están en este documento. Si el sitio necesita mostrarlos, deben tomarse de la tabla comercial de la plataforma (`src/lib/domain/commercial.ts` del repositorio de la plataforma) y **confirmarse con el responsable antes de publicarlos**. Son referencias, sin cobro ni contrato. No inventar precios ni paquetes.
- **No inventar:** testimonios, logos de clientes, puntajes «reales», fotografías de jóvenes ni marcas de organizaciones que no participan.
- **Estados no implementados:** se marcan como «Próximamente». No hay botones sin función.
- **Emojis:** no se usan. Íconos solo de trazo (SVG).
- **Portadas:** en la plataforma, las portadas se cargan por enlace desde hosts de C3, validados en servidor, con descripción alternativa obligatoria. El sitio decide su propio manejo de imágenes. Proporciones de referencia: medio de 132 px en la tarjeta; banda de 340 px en escritorio y 16:9 en móvil en el detalle.

---

## 11. Decisiones registradas

| Fecha | Decisión |
| --- | --- |
| 26-oct-2026 | «Challenge» es el término oficial en la interfaz. |
| 4-nov-2026 | **Rediseño visual:** acción violeta; cabecera blanca con «Conoce C3»; textos con «tú»; sin aviso global de demo; DEMO en cada elemento inventado. Los colores de línea no cambian. |
| 4-nov-2026 | **Portadas por enlace:** solo hosts de C3; descripción obligatoria; sin subida de archivos. |
| 5-nov-2026 | **Regla de acción:** cada producto usa una variante de su línea. C3 Challenges (Conecta) es morado. Vale para todos los productos. |

Estas decisiones vienen de la documentación interna de la plataforma, que no está en el paquete. Si hace falta el texto completo, pedirlo al responsable.

**Principio:** un cambio de token o de regla de uso debe quedar registrado aquí, con fecha y responsable.

---

## 12. Deuda visual y pendientes

Estos asuntos están abiertos. **No copiar sin revisar** las partes que dependen de ellos.

### 12.1 Pendientes del sistema

| # | Asunto | Situación | Para cerrar |
| --- | --- | --- | --- |
| 1 | **Manual de marca** | No está en el paquete. Es la fuente de los colores y del logo oficiales. | Si el sitio necesita validar logos o colores, pedirlo al responsable de marca. |
| 2 | **Canvas de diseño vigentes** | No están en el paquete. El paquete no incluye vistas de referencia de la versión actual. | Pedirlos al responsable si hacen falta. |
| 3 | **Color `info`** | `--c3-info` reutiliza el azul de Compite. Contradice la regla de que un estado no usa color de línea. | Definir un `info` propio o aceptar la excepción por escrito. |
| 4 | **Modo oscuro** | Los tokens existen, pero ningún componente activa `data-theme="oscuro"`. La página fuerza `color-scheme: light`. El botón primario oscuro no cumple (4.13:1). | Corregir el botón y activar el modo, o retirar los tokens oscuros. |
| 5 | **Tokenizar lo que falta** | Tintes, radios de tarjeta y bloque, sombras y fondos de estado existen en `estilos/globals.css`, pero no en `tokens.json`. | Añadirlos a `tokens.json` y regenerar `tokens.css`. |
| 6 | **Variantes por línea en tokens** | `compite`, `crea`, `conecta` con base, texto, oscuro, tinte, impresión y acción. | Añadirlas a `tokens.json`. |
| 7 | **Botones** | Una versión anterior pedía Montserrat en MAYÚSCULAS. El sistema aplicado usa Poppins en frase normal. | Confirmar la vigente (aquí, Poppins). |
| 8 | **Radio de campos** | Sistema aplicado: 12 px. Token `radius-sm`: 6 px. | Decidir cuál vale. |
| 9 | **Tracking de etiqueta** | Token 0.08 em; sistema aplicado 0.12 em. | Unificar. |
| 10 | **Escalas de espaciado y tipografía** | El sistema aplicado usa píxeles fuera de escala (14, 17, 18, 20, 26, 28 px). | Adoptar las escalas o retirarlas. |
| 11 | **Movimiento** | Sin tokens de movimiento. Duraciones fijas en CSS. | Añadir tokens o dejarlo como convención. |
| 12 | **Auditoría de contraste** | No se ha hecho con herramienta. Los ratios son cálculos propios. | Auditar con herramienta y registrar el resultado. |
| 13 | **Sombra de tarjetas** | Una versión anterior decía «sin sombras». El sistema aplicado usa `shadow-soft` en tarjetas. | Decidir y documentar. |
| 14 | **Gradientes** | Una versión anterior decía «sin gradientes». Hay cuatro usos explícitos (§5.4). | Aceptar por escrito o retirarlos. |
| 15 | **Oro como acento** | El sistema aplicado usa el oro como acento de un contador de atención, contra la regla de reconocimiento. | Revisar el contador. |
| 16 | **Oro: percentil o puesto** | Sin decidir qué representa el sello. | Decidir con el responsable. |

### 12.2 Desviaciones de la implementación

No son deuda de criterio, sino valores que el sitio no debería copiar tal cual:

- **`.c3-btn--small` mide 36 px** en el sitio público, bajo el mínimo de 44 px.
- **Colores fuera de token** en `estilos/globals.css`: unos 30 valores hexadecimales distintos, sobre todo `#ffffff`, `#c3cde0`, `#b8c4d9`, `#c5cee0`, `#e2e7f0`, `#f7f9fd`, `#eef2f7`, `#b9a8f0` y `#36435a`. Tokenizarlos antes de reutilizarlos.
- **Texto de 10 y 11 px:** el número de paso (10 px), la etiqueta (11 px) y los títulos del pie (11 px) están bajo la escala de leyenda (12 px). Válidos como etiquetas, pero no para texto corrido.
- **Burbuja de la órbita oculta por debajo de 900 px** (`.c3-bubble { display: none }`). En tableta y teléfono, los puntos no muestran la información de cada línea. Decidir si se muestra en línea o si se retira el control.
- **Lectura en proyector:** no está verificada.

### 12.3 Fuera de este paquete

- **Revisión visual** del sitio con las pantallas de la app: no se hizo con herramienta.
- **App autenticada y consola** de la plataforma: no son necesarias para el sitio público.

---

## 13. Qué hay en el paquete

| Archivo | Qué es | Cómo usarlo |
| --- | --- | --- |
| `tokens/tokens.css` | Variables `--c3-*` del tema claro y oscuro. | Importar en el CSS global del sitio. |
| `tokens/tokens.json` | Fuente de los tokens (claro y oscuro). | Referencia para regenerar el CSS. Faltan los tokens de §12. |
| `estilos/globals.css` | Implementación completa de estilos, ~5.000 líneas, en bloques comentados. | Copiar las secciones necesarias. Bloques clave: cabecera pública (~2815), órbita (~3175), home (~3340), pasos y tarjetas (~3540–3720), pie (~3067), cierre oscuro (~3913). Incluye bloques de la app que el sitio puede no necesitar. |
| `componentes/root-layout.tsx` | Carga de fuentes, `lang="es"` y enlace de salto. | Copiar el enlace de fuentes (§4). |
| `componentes/home-page.tsx` | Estructura y textos de la home. | Referencia de orden y jerarquía (§8). |
| `componentes/HomeOrbit.tsx` | Órbita interactiva del hero. | Copiar. Recalcular los puntos si cambia el símbolo. |
| `componentes/FeaturedGrid.tsx` | Paginación de destacados. | Copiar. Necesita `CatalogCard.tsx`. |
| `componentes/SiteHeader.tsx` | Cabecera pública con menú. | Copiar y adaptar la navegación. Sustituir `UserMenu` y `useSession` por el menú de cuenta del sitio, o quitarlos. |
| `componentes/Footer.tsx` | Pie de cuatro columnas. | Copiar y adaptar el contenido. Sustituir `FooterAccountLinks`. |
| `componentes/SiteShell.tsx` | Marco común: cabecera, contenido y pie. | Copiar la estructura. Usa `SiteHeader` y `Footer`. |
| `componentes/CatalogCard.tsx` | Tarjeta de experiencia. | Copiar. Sustituir `CoverImage` por una imagen normal. |
| `componentes/StatePill.tsx` | Pastilla de estado. | Copiar. Recibe `label` y `tone`. |
| `componentes/BrandMark.tsx` | Logos: marca C3 y de cada línea. | Copiar y apuntar a `brand/`. |
| `componentes/LineLandingPage.tsx` | Plantilla de página de línea. | Copiar la lógica de acento por línea. El contenido de cada línea no está incluido. |
| `brand/c3/` | Logo azul, logo blanco y símbolo. | Usar tal cual. Si el sitio ya tiene logos oficiales, conservarlos. |
| `brand/lines/` | Logos de Compite, Crea y Conecta, en color y en blanco. | Usar tal cual. |

**Nota sobre los componentes:** son copias de referencia de la plataforma. Sus `import` apuntan a módulos que no están en el paquete (`@/lib/...`, `@/components/...`). No compilan tal cual; sirven para estructura, clases y jerarquía.

---

## 14. Skills y plugins usados

Estas son las herramientas usadas para diseñar y verificar el sistema. El paquete no incluye ninguna; solo se citan para que el equipo que actualice el sitio pueda usar las mismas.

### 14.1 Usadas en el rediseño

| Herramienta | Tipo | Para qué se usó | Cómo obtenerla | Evidencia |
| --- | --- | --- | --- | --- |
| **Impeccable** | Plugin de usuario | Contexto de diseño (`impeccable context`, una vez por sesión) y detección de problemas de interfaz (`impeccable detect <rutas>`). Modos previstos: Persuade (landing, explorar, empresa) y Operate (formularios, dashboards, evaluación, entregas); critique, audit, clarify y polish. | Documentación oficial: `https://impeccable.style/docs/`. En Windows, `impeccable.cmd` en la carpeta `scripts/` del plugin. **No ejecutar `npx impeccable install` dentro de un repositorio sin revisar lo que escribe.** | Registro del proyecto: contexto y detección ejecutados; falta `PRODUCT.md`. |
| **Superpowers** (obra/superpowers) | Plugin de skills de método | Planes en formato de planificación y registro de ejecución por subagentes (`subagent-driven-development`). Se prescriben además `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion` y `requesting-code-review`. | Catálogo de plugins (publicador obra) o `https://github.com/obra/superpowers`. | Registro de planes y ejecución. El uso del resto de skills es lo prescrito; confirmar. |
| **design** (Anthropic, `knowledge-work-plugins`) | Plugin del catálogo. Skills: `design:design-system`, `design:accessibility-review`, `design:design-critique`, `design:design-handoff`, `design:ux-copy`, `design:user-research` y `design:research-synthesis`. | Apoyo al diseño del sistema visual, revisión de accesibilidad, critiques y redacción de la interfaz. Las skills concretas usadas no están registradas. | Catálogo de plugins de Claude; id `plugin_01XXJmxLXPEhPMmnxmrgntNw`. | **Confirmado por el responsable (11-nov-2026).** |
| **frontend-design** (Anthropic) | Plugin del catálogo. Skill: `frontend-design:frontend-design`. | Implementación de la interfaz con criterio de diseño (dirección visual y composición). | Catálogo de plugins de Claude; id `plugin_011XJXyLY2skJXTKdTJcsNBn`. | **Confirmado por el responsable (11-nov-2026).** |
| **Playwright** (E2E) | Herramienta de prueba (no es skill) | Recorridos de escritorio y móvil para comprobar la interfaz en los dos anchos. | Instalación estándar de Playwright. | Usado en las pruebas de la plataforma. |
| **Vista previa del navegador** | Herramienta del entorno | Verificación visual en 390 px y 1280 px. | Depende del entorno; no es parte del sistema visual. | Uso en el entorno de trabajo. |
| **graphify** | Skill global | Orientación en grafos de un código base antes de leerlo. No interviene en el diseño. | Instalación global de la skill. | Uso en el entorno de trabajo. |

### 14.2 Instaladas en el repositorio de la plataforma (no son de diseño)

Estas skills están en el repositorio de la plataforma. Solo son relevantes para el sitio si usa React, Next.js o Firebase.

| Skill | Fuente | Uso |
| --- | --- | --- |
| **web-design-guidelines** | `vercel-labs/agent-skills`, `skills/web-design-guidelines/SKILL.md` | Revisión de UI contra guías de interfaz web (accesibilidad y buenas prácticas). Sirve de lista para la revisión de §15. |
| **vercel-react-best-practices** | `vercel-labs/agent-skills`, `skills/react-best-practices/SKILL.md` | Rendimiento de React y Next.js. |
| **firebase-auth-basics**, **firebase-firestore**, **firebase-security-rules-auditor** | `firebase/agent-skills` | Autenticación, Firestore y auditoría de reglas. **No son de diseño.** |

### 14.3 Cómo instalarlas en el otro entorno

1. **Catálogo de plugins de Claude:** instalar Superpowers, `design` y `frontend-design`.
2. **Impeccable:** instalar desde su documentación (`https://impeccable.style/docs/`). Ejecutar `context` una vez por sesión y `detect` sobre las rutas cambiadas.
3. **Skills de la tabla 14.2:** instalar desde sus repositorios de origen con las rutas indicadas. Comprobar que el hash coincide con el de origen antes de usarlas.
4. **Regla general:** no instalar terceros sin revisar licencia y origen.

---

## 15. Checklist para adaptar c3.com.sv

### 15.1 Antes de tocar nada

- [ ] Inventariar el sitio actual pantalla por pantalla: cabecera, home, pie, tarjetas, botones, colores, tipografía y logos.
- [ ] Anotar la diferencia con este documento en cada pantalla: color de acción, cabecera, pie, home, voz, DEMO y tarjetas.
- [ ] Si el sitio ya tiene logos oficiales o un manual de marca, usarlos. Si hay dudas sobre colores o logos, pedir el manual al responsable antes de cambiarlos.
- [ ] Decidir qué se conserva del sitio actual (contenido, rutas, formularios) y qué se rediseña.
- [ ] Si se necesitan capturas del sistema aplicado para comparar, pedirlas al responsable.

### 15.2 Tokens y base

- [ ] Importar `tokens/tokens.css` como fuente de `--c3-*`. Añadir el bloque de tokens extra de §15.4.
- [ ] Cargar Montserrat (600, 700, 800) y Poppins (400, 500, 600) con el enlace de §4.
- [ ] Establecer `body` con fondo `--c3-fondo`, color `--c3-texto`, Poppins 16 px y `line-height` 1.6.
- [ ] Definir `:focus-visible` con 3 px de `--c3-foco` y desfase de 2 px.
- [ ] Mantener `color-scheme: light` hasta resolver §12.1 (modo oscuro).

### 15.3 Componentes

- [ ] Cabecera blanca fija de 72 px con «Conoce C3». En móvil, 64 px y «Menú» debajo de 900 px.
- [ ] Pie navy de cuatro columnas con logo blanco.
- [ ] Botones primario, contorno, blanco y oscuro, con 46 px de alto mínimo.
- [ ] Campos de 46 px con borde fuerte y selector con flecha propia.
- [ ] Tarjetas de experiencia con el tinte de su línea, pastilla de estado, badge DEMO y pie con acción.
- [ ] Órbita del símbolo en el hero, con burbuja accesible.
- [ ] Panel oscuro de cierre para empresas.
- [ ] Pasos con icono, número y conector.

### 15.4 Bloque de tokens extra

Copiar al `:root` del sitio. Es el bloque de `estilos/globals.css` (líneas 9 a 30, sin comentarios). El tema oscuro de esas variables está en las líneas 32 a 39 del mismo archivo y solo hace falta si se activa el modo oscuro:

```css
:root {
  --c3-ancho-pagina: 1440px;
  --c3-info-fondo: #e3ecf8;
  --c3-exito-fondo: #e0f2ea;
  --c3-advertencia-fondo: #fbefdd;
  --c3-error-fondo: #fae6e3;
  --c3-advertencia-tinte: #fbf6ec;
  --c3-texto-cabecera: #a9b8d0;
  --c3-navy-claro: #2c3f63;
  --c3-text-mid: #36435a;
  --c3-action-tint: #efeafc;
  --c3-action-line: #e4ddfb;
  --c3-action-soft: #a996ec;
  --c3-compite-tint: #e9eff9;
  --c3-crea-tint: #e4f6f3;
  --c3-conecta-tint: #eceefa;
  --c3-radius-card: 18px;
  --c3-radius-block: 22px;
  --c3-shadow-soft: 0 6px 22px rgba(15, 32, 62, 0.07);
  --c3-shadow-action: 0 8px 20px rgba(101, 72, 199, 0.25);
}
```

### 15.5 Verificación antes de dar por adaptado

- [ ] A **390 px** y **1280 px**, sin scroll horizontal en ninguna pantalla.
- [ ] Cabecera, menú y pie navegables con teclado; foco siempre visible.
- [ ] Ningún botón ni enlace por debajo de 44 px de área táctil (salvo que se justifique).
- [ ] Contraste verificado con herramienta en texto normal y botones.
- [ ] Movimiento reducido: la órbita y el brillo se detienen.
- [ ] Etiqueta DEMO visible en cada dato inventado.
- [ ] Sin emojis, sin testimonios, sin logos de clientes inventados.
- [ ] Voz «tú» en todos los textos nuevos.
- [ ] Estados vacío, cargando y error presentes en las listas.
- [ ] Capturas comparativas antes y después, para validar con el responsable.
- [ ] Ningún precio de paquete publicado sin confirmación del responsable (§10).

---

*Fin del documento. Para dudas de implementación, consultar `estilos/globals.css` y los componentes de `componentes/`. Para dudas de decisiones, consultar al responsable.*
