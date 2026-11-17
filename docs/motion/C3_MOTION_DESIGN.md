# C3 · dirección inicial de motion design

**Fecha:** 2026-11-14. **Estado:** exploración para aprobación; no autoriza cambios de interfaz. **Ámbito:** home del sitio público `apps/web`. Las duraciones son hipótesis para prototipos, no tokens ni decisiones aprobadas.

## Intención y límites

Motion debe ayudar a entender la relación entre Compite, Crea y Conecta, dar continuidad a los eventos reales y confirmar interacciones. El carácter buscado es tecnológico, preciso y moderno, con capacidad de ser **expresivo y editorial**. La intensidad visual queda abierta: «sobrio» no es un requisito ni un motivo suficiente para descartar una idea. Linear/Vercel inspira claridad y respuesta nítida; Stripe, narrativa visual y composición con presencia. La identidad, los archivos oficiales, las proporciones del logo, el contenido y los tokens del DS prevalecen. Evitar 3D protagonista, partículas decorativas por todas partes, rebotes exagerados y efectos pesados; una animación con mayor presencia sí puede ser adecuada si mejora la historia del home.

Cada efecto propuesto debe tener un propósito comprobable (explicación, orientación, estado o feedback), un estado final legible sin JS y una variante de movimiento reducido. El color de línea solo clasifica: Compite azul, Crea turquesa, Conecta morado; acción y foco usan `--c3-accion`/`--c3-foco`. No inventar eventos, imágenes, números ni actividad en tiempo real. Conservar los textos, rutas y SEO actuales.

## Dirección elegida para explorar · H1 + E2 (2026-11-15)

El responsable eligió **H1, entrada coreografiada del hero**, y **E2, continuidad visual de eventos**. Pidió que el hero tenga fuerza al entrar y que el recorrido completo se sienta dinámico y orgánico. También eligió **un trazo visible que progresa con el scroll y llega a nuevas secciones**. Esta elección acota las alternativas prioritarias; todavía falta aprobar la forma exacta del trazo y sus prototipos. «Orgánico» se interpreta aquí como continuidad entre gestos, curvas y ritmos que nacen de la geometría C3, con pausas para leer. No significa mover cada bloque ni usar el mismo reveal en todas las secciones.

### Storyboard propuesto del recorrido

| Momento | Qué se vería | Movimiento y relación con la siguiente sección |
| --- | --- | --- |
| **Entrada del hero** | El símbolo oficial está reconocible desde el primer cuadro y conserva su órbita actual. El H1 entra por líneas con un movimiento vertical corto y decidido; los puntos azul, turquesa y morado reciben énfasis en secuencia. Subtítulo y acciones llegan con solape, no después de una espera larga. | Un solo gesto coreografiado de aproximadamente 1–1.5 s, sujeto a prototipo. Los elementos no aparecen todos al mismo tiempo ni con retrasos idénticos. El H1 y los enlaces son legibles desde SSR, aunque su tratamiento visual tenga entrada. |
| **Del hero a eventos** | Un trazo visible nace cerca de la órbita, sale del hero y guía la mirada hacia el encabezado de eventos. Una línea base tenue muestra que hay camino por recorrer; el tramo activo se dibuja mientras la persona avanza. | El progreso acompaña el scroll y llega al siguiente bloque sin fijar la pantalla ni mover el contenido de lectura. Al retroceder, el tramo activo responde de forma continua en vez de reiniciar una animación de entrada. |
| **Eventos E2** | El destacado existente abre el capítulo. El trazo pasa junto a él y conecta hitos de eventos reales: puntos azul, turquesa o morado marcan Compite, Crea y Conecta. Las tarjetas siguen siendo contenido editorial, no objetos flotantes. | El segmento activo llega a cada hito al entrar en vista; el hito responde con un énfasis corto. Hover, foco y toque pueden resaltar su relación con el trazo. La rotación automática del destacado y su fade no deben reiniciar la narrativa ni competir con ella. |
| **Métricas y ecosistema** | Tras los eventos, el trazo sigue visible al margen de las métricas y baja el ritmo para que las cifras se lean. En ecosistema, se ramifica hacia Compite, Crea y Conecta, mostrando que son partes de un sistema. | El avance de la línea da continuidad entre secciones; los datos permanecen quietos y disponibles. Evaluar barras/reveal sin cambiar valores ni obligar a esperar un count-up. |
| **Audiencias y CTA** | Las ramas del recorrido señalan las tres audiencias y vuelven a reunirse al acercarse al panel final. Allí el trazo puede conectar con los anillos que ya existen. | El último tramo se completa con la llegada al CTA. Las microinteracciones y una entrada final coordinada son opciones a probar; el cierre debe sentirse distinto de la entrada del hero. |

**Forma propuesta del trazo:** una trayectoria curva y perceptible que bordea el contenido y se aproxima a los encabezados e hitos; el tramo ya recorrido permanece visible. En desktop puede serpentear suavemente entre zonas de la composición. En móvil se simplifica a una guía lateral, siempre fuera del texto y sin scroll horizontal. Puede construirse visualmente por segmentos que enlazan sin cortes perceptibles; así cada sección responde a su propio tamaño y a contenido variable. El trazo principal usa un color estructural del DS por definir, mientras los nodos usan azul/turquesa/morado solo para clasificar la línea correspondiente. No confundir la guía decorativa con un enlace o control.

**Lenguaje de movimiento a probar:** trayectorias curvas o arcos en capas gráficas; solapes entre elementos relacionados; aceleración y desaceleración naturales; variación de ritmo entre escenas. La energía se concentra en hero y eventos y deja respiración en las secciones de lectura. El scroll **gobierna el avance del trazo visible**, nunca la disponibilidad del contenido ni los controles. La versión móvil conserva el recorrido con menos desplazamiento y sin depender de hover; `prefers-reduced-motion` muestra la relación con línea y nodos estáticos, sin dibujo ligado al scroll.

**Dependencias narrativas:** E2 solo puede llamarse cronología cuando las fechas y el orden de los eventos reales la respalden. `selectRotation()` prioriza `featuredOrder` antes de fecha y `splitForHome()` conserva para el resto el orden recibido: el orden visual actual no demuestra por sí solo una cronología. Si faltan fechas o el orden editorial difiere, el recorrido debe expresar relación entre experiencias sin insinuar una secuencia temporal falsa. El símbolo central es un PNG único: los puntos no pueden separarse mediante animación de nodos existentes; cualquier halo o capa nueva debe respetar marca y la correspondencia actual de hotspots. GSAP/ScrollTrigger son opciones técnicas por evaluar después de aprobar el storyboard y medir costo; no están instalados como dependencias de ejecución.

## Base inspeccionada

`apps/web` usa App Router (`app/page.tsx`), Next.js 16.2.5 y React 19.2.4. `Home` entrega en orden `Hero`, `EventosSection`, `DatosSection`, `LinesSection`, `AudienceSection`, `ClosingPanel`. El servidor obtiene eventos reales mediante `getPublicEvents()`, separa destacados y resto con `splitForHome()`, y conserva metadatos y JSON-LD. No hay `gsap`, `@gsap/react`, Motion, Framer Motion, Lottie o Anime.js en los `package.json`, el lockfile de pnpm ni el código revisado; **no se añadió una dependencia de ejecución**.

### Inventario de movimiento existente, respaldado por código

| Área | Comportamiento actual | Evidencia | Consecuencia para el diseño |
| --- | --- | --- | --- |
| Hero, geometría | Dos grupos de satélites giran continuamente: exterior 30 s, interior 22 s en sentido inverso; los anillos sirven de estructura visual. En `reduce` se detienen en ángulos definidos. | `components/ds/HomeOrbit.tsx`; `app/ds/c3-public.css` `.c3-orbit__spin`, `@keyframes c3-spin`, media query `prefers-reduced-motion`; `e2e/motion.spec.ts` | No animar de nuevo el mismo `transform` de los grupos giratorios ni sumar otra órbita continua sin medir carga visual. |
| Hero, símbolo | Imagen oficial `/brand/c3/c3-symbol.png` con tres hotspots transparentes. Cada hotspot activa una burbuja Compite/Crea/Conecta por hover, foco o clic; Escape la cierra, y hay retraso de 160 ms al salir. Un halo cambia por `box-shadow` en hover o `aria-pressed`. | `components/ds/HomeOrbit.tsx`; `app/ds/c3-public.css` `.c3-orbit__hotspot` y `.c3-bubble`; `lib/content.ts` `homeLines` | Las etiquetas informativas ya existen. El símbolo es un raster único: un reveal por punto no se obtiene animando tres nodos existentes. Validar coordenadas de hotspots y cualquier capa visual contra el archivo oficial. |
| Eventos destacados | Ya existe un evento editorial grande, rotativo. Cambia cada 8 s cuando hay varios ítems; pausa manual, por ratón, foco y fuera de pantalla. Con `reduce` no rota. Tiene navegación por flechas, puntos y teclado. La diapositiva visible entra con fade CSS de 500 ms. | `components/home/EventosSection.tsx`; `components/ds/FeaturedRotation.tsx`; `lib/ds/featured-rotation.ts`; `app/ds/spotlight.css` | La propuesta de “featured event” debe mejorar esta composición existente, no añadir otro carrusel ni interferir con su temporizador o controles. |
| Eventos, grilla | `FeaturedGrid` pagina de seis en seis, sin entrada animada. Las tarjetas `.c3-exp` hacen elevación de 2 px, borde y sombra en hover con transición de 150 ms; `reduce` elimina esa transición. El área gráfica usa portada real si existe y, si no, `KindIcon`. | `components/ds/FeaturedGrid.tsx`; `components/ds/CatalogCard.tsx`; `app/ds/c3-public.css` `.c3-exp` | Evitar duplicar la elevación. Los futuros reveals deben considerar paginación y el caso sin portada. |
| Métricas | Cuatro cifras y barras estáticas, con valores literales y fecha editorial existente. | `components/home/DatosSection.tsx`; `app/ds/home.css` | Un count-up no puede alterar el significado de prefijos `+` ni el sufijo `+`; mantener valor final visible en SSR. |
| Ecosistema y audiencias | Tarjetas y tres líneas estáticas; enlaces y botones tienen feedback visual CSS compartido. | `components/home/LinesSection.tsx`, `AudienceSection.tsx`; `app/ds/home.css`; `app/ds/c3-public.css` `.c3-btn` | Proponer solo motion que explique relaciones o confirme interacción, sin animar contenido de lectura continuamente. |
| CTA final | Panel con tres anillos y puntos de fondo estáticos; botones usan transiciones compartidas. | `components/home/ClosingPanel.tsx`; `app/ds/c3-public.css` `.c3-rings`, `.c3-btn` | Entrada opcional única; no convertir el fondo en otra órbita permanente. |

Fuera del home también hay hovers y transiciones compartidas en navegación, tarjetas de línea, equipo y canales. No son objetivo de rediseño en esta etapa. Hallazgo para la implementación futura: en `reduce`, `.c3-exp` pierde la transición pero su desplazamiento de hover sigue aplicándose de forma instantánea; el halo del hotspot conserva una transición de sombra. Revisar ambos con puntero, teclado y movimiento reducido antes de extenderlos. La auditoría se basa en código, el archivo del símbolo y pruebas existentes; falta observar el timing perceptual en navegador y dispositivos reales antes de aprobar una opción.

## Alternativas para hero

**Cómo se verían:**

- **H1 · entrada coreografiada:** al abrir la página, el titular se descubre por líneas con un recorte vertical corto; los tres puntos del símbolo ganan énfasis uno tras otro, seguidos por subtítulo y acciones. La órbita que ya gira permanece como fondo vivo. La escena termina estable y legible: no hay texto en movimiento permanente. El efecto sería una presentación con presencia, de tono editorial.
- **H2 · ecosistema que se conecta:** el símbolo oficial aparece completo y reconocible. Unos trazos o anillos adicionales, si marca los aprueba, sugieren el recorrido entre Compite, Crea y Conecta; cada punto recibe un momento de protagonismo. Después aparece el mensaje. Se sentiría más tecnológico y narrativo, con la geometría como protagonista, sin convertir el logo en 3D ni deformarlo.
- **H3 · exploración interactiva:** la carga inicial es directa. El interés aparece al acercarse o tocar un punto: el punto se destaca y su burbuja surge junto a él. La persona descubre las tres líneas a su ritmo. Es la opción más interactiva y la menos teatral en la entrada.

Estas descripciones representan direcciones para comparar, no una secuencia aprobada. En H1, el titular debe estar disponible inmediatamente para lectura y accesibilidad aunque su tratamiento visual se anime; el resultado de `find-animation-opportunities` advierte sobre ese riesgo, pero no veta explorar un prototipo accesible.

| Opción | Composición y timing exploratorio | Valor / costo | Skills a consultar |
| --- | --- | --- | --- |
| **H1 · entrada coreografiada — elegida para explorar** | Tras el primer render, explorar un tratamiento visual por líneas (aprox. 450–650 ms) sin retrasar la disponibilidad del H1; subtítulo y acciones siguen en una timeline con separaciones de 60–100 ms. Los puntos reciben un énfasis secuencial sutil. La órbita actual continúa. | Mayor impacto narrativo; requiere prototipo de accesibilidad y capas fieles al logo. | `animation-vocabulary`, `choreograph`, `animate`, `gsap-timeline`, `gsap-react`, `gsap-performance` |
| **H2 · símbolo primero** | Los puntos, si la marca permite capas fieles, aparecen individualmente; conexiones o anillos ya presentes ganan énfasis temporal una sola vez. El texto entra después, con menor desplazamiento y sin ocultar la lectura. Mantener la rotación actual como único movimiento permanente. | Refuerza la historia de las tres líneas; más trabajo de marca, accesibilidad y composición móvil. | `find-animation-opportunities`, `choreograph`, `gsap-core`, `gsap-plugins`, `gsap-react` |
| **H3 · interacción primero** | Entrada del texto muy breve o sin máscara; el símbolo conserva su movimiento. Hover, foco y clic dan énfasis al punto y muestran la burbuja existente, tal vez con un label más compacto. Sin nuevas órbitas ni conexiones animadas. | Menor costo y riesgo; menos narrativa inicial. | `review-animations`, `animate`, `web-design-guidelines` |

En el PNG oficial inspeccionado, el punto azul está arriba a la derecha, el turquesa al centro y el morado abajo a la derecha; las posiciones actuales de `.c3-orbit__hotspot--compite`, `--crea` y `--conecta` coinciden visualmente. Confirmar con marca antes de crear capas independientes. Evitar cambiar escala del raster completo porque también desplazaría la lectura del logo. El reveal no debe ocultar el H1 a quien usa JS lento o desactivado. En móvil, sin hover, el clic y el foco siguen siendo vías completas; la burbuja actual se coloca bajo el símbolo.

## Alternativas para eventos

**Cómo se verían:**

- **E1 · portada editorial:** el evento destacado actual se sentiría como la apertura de una historia: una portada real, cuando exista, ocuparía el área gráfica; título, fecha, línea y acción tendrían una jerarquía más marcada. Al llegar a la sección podría haber una entrada coordinada única, mientras la rotación de eventos conservaría su pausa y controles. La grilla seguiría siendo la misma por ahora.
- **E2 · continuidad del ecosistema:** un trazo visible llega desde el hero, bordea el destacado y sigue hacia los demás eventos reales. Al avanzar por la sección se iluminan hitos de Compite, Crea y Conecta. Solo se llama línea de tiempo si los datos permiten una cronología fiel; nunca sugiere actividad «en vivo».
- **E3 · tarjetas con vida:** la composición actual permanecería. Dentro de cada tarjeta, la imagen real o el ícono, la flecha y la etiqueta responderían de forma coordinada al puntero, foco o toque. Al cambiar de página, el nuevo grupo aparecería como un conjunto. El resultado sería más ágil y táctil, con menor cambio editorial.

E1 y E2 pueden tener más presencia que las microinteracciones filtradas por una sola skill. Deben compararse visualmente con el bloque destacado que ya existe, no descartarse por la palabra «sobrio».

| Opción | Composición y timing exploratorio | Valor / costo | Skills a consultar |
| --- | --- | --- | --- |
| **E1 · portada editorial** | Mejorar el bloque destacado ya existente mediante jerarquía gráfica con portada real cuando exista. Explorar una entrada coordinada única de título/medio/panel, sin repetirla en cada cambio automático. Mantener su hover actual o reemplazarlo conscientemente. | Aprovecha datos y controles existentes; verificar que la nueva secuencia no compita con el fade del carrusel. | `choreograph`, `gsap-scrolltrigger`, `review-animations`, `react-best-practices` |
| **E2 · continuidad del ecosistema — elegida para explorar** | Un trazo visible progresa desde el hero con el scroll, conecta el destacado con eventos reales y llega a las secciones siguientes; usar marcadores cronológicos solo donde los datos y el orden de fechas lo permitan. Sin indicadores de “en vivo” ni nueva grilla por ahora. | Expresa actividad y continuidad; requiere validar fechas, orden y composición con contenido real. | `find-animation-opportunities`, `gsap-plugins`, `gsap-performance`, `web-design-guidelines` |
| **E3 · microinteracciones** | Conservar composición. Afinar feedback de flecha, enlace, etiqueta, borde o imagen dentro de la tarjeta con duraciones breves (aprox. 120–200 ms), siempre coordinado con el hover de elevación actual. La entrada del destacado continúa como está. | Bajo costo y menos JS; aporta menos lectura de ecosistema. | `animate`, `review-animations`, `animation-performance`, `web-design-guidelines` |

La rotación automática ya comunica actividad, pero no actividad en tiempo real. Toda animación de entrada debe respetar el estado `hidden` del carrusel, no dispararse en cada cambio automático y no bloquear controles o paginación.

## Oportunidades restantes y prioridad (exploración inicial)

Esta tabla conserva el mapa de ideas por sección. El filtro fechado del 15-11, más abajo, identifica oportunidades pequeñas y justificadas; **no decide por sí solo** la dirección creativa del hero ni de eventos. Todas las filas siguen pendientes de evaluación visual y aprobación.

| Prioridad | Sección | Idea exploratoria y condición | Impacto / dificultad | Skills |
| --- | --- | --- | --- | --- |
| P1 | Hero | Prototipar H1 con entrada de mayor presencia, símbolo oficial intacto y cierre estable; medir claridad, accesibilidad y LCP. | Alto / medio a alto | `choreograph`, `gsap-timeline`, `react-best-practices` |
| P1 | Eventos | Prototipar E2 como recorrido de hitos reales, validar cronología y convivencia con el destacado rotativo. | Alto / alto | `choreograph`, `gsap-scrolltrigger`, `web-design-guidelines` |
| P2 | Ecosistema | SVG de tres líneas y conexiones solo si explica una relación que las tarjetas no cuentan; trazo `SVG drawing` de una vez. | Medio / alto | `gsap-plugins`, `find-animation-opportunities`, `gsap-performance` |
| P2 | Métricas | Explorar count-up o reveal solo si un prototipo muestra que añade énfasis sin dificultar la lectura de cifras confirmadas. | Medio / medio | `find-animation-opportunities`, `animation-performance` |
| P3 | Audiencias | Feedback de enlaces y microinteracciones de cards; evaluar narrativa visual antes de mover bloques. | Medio / bajo a medio | `find-animation-opportunities`, `web-design-guidelines` |
| P3 | CTA final | Comparar una entrada única del panel y su geometría con la versión estática; conservar la más clara. | Bajo a medio / bajo | `choreograph`, `review-animations` |

**Filtro:** si un efecto no mejora explicación, orientación, estado o feedback al probarlo, descartarlo. Priorizar menos momentos con mayor intención.

## Oportunidades filtradas con `find-animation-opportunities` (2026-11-15)

Una pasada de la skill de Emil Kowalski sobre el home real. Su alcance es detectar momentos pequeños de UI; **no es un veto de la dirección visual ni de secuencias editoriales**. Estas son candidatas, no efectos aprobados. La curva de referencia de la skill es `cubic-bezier(0.23, 1, 0.32, 1)`; el repo aún no tiene un token de easing de motion. Si se adopta alguna propuesta, definir el token `--c3-*` y registrar la decisión según ADR-0002 antes de escribir CSS. La entrada debe ser optativa y el contenido debe seguir visible en SSR y sin JS.

### Oportunidades que pasaron el filtro

| # | Ubicación | Hoy | Propósito | Frecuencia | Movimiento propuesto |
| --- | --- | --- | --- | --- | --- |
| 1 | `components/ds/HomeOrbit.tsx:89-106`; `app/ds/c3-public.css:811-827` | La burbuja informativa aparece y desaparece de inmediato con `hidden`/`display: none`. | **Consistencia espacial:** asociar la explicación con el punto activado. | Ocasional; hasta tres puntos por exploración. | En puntero o toque, entrada de `opacity: 0.8 → 1` y `scale(0.97) → scale(1)` durante **160 ms** con `cubic-bezier(0.23, 1, 0.32, 1)`; origen hacia el hotspot en desktop y borde superior en móvil. La salida no debe prolongar el cierre. Foco de teclado: aparición inmediata. Con `reduce`: solo opacidad, **120 ms**. Validar cómo transicionar el estado `hidden` sin exponer contenido oculto a foco o lectores. |
| 2 | `components/ds/HomeOrbit.tsx:68-85`; `app/ds/c3-public.css:789-809` | Los tres hotspots existen y responden al hover, pero su relación con los puntos de la imagen se descubre solo al interactuar. | **Explicación:** señalar una vez las tres áreas que abren Compite, Crea y Conecta. | Primera vista del home, no en cada scroll ni cada visita repetida. | Explorar un halo **independiente del PNG** sobre cada hotspot: `opacity: 0 → 1` y `scale(0.97) → scale(1)` en **180 ms** por punto, con **60 ms** de stagger y la misma curva. Después queda el estado normal; el halo existente de hover/foco mantiene prioridad. Con `reduce`: señales estáticas o fade de **120 ms**, sin escala. No animar ni recortar el logo oficial. |
| 3 | `components/ds/FeaturedGrid.tsx:23-43,46-76`; `app/ds/c3-public.css:1354-1384` | Al paginar, se sustituyen hasta seis tarjetas instantáneamente; el control ya indica la página actual. | **Evitar un cambio brusco:** confirmar visualmente que cambió el grupo de eventos. | Ocasional; solo al usar paginación. | Para activación con puntero/toque, transición de entrada del **nuevo grupo**, `opacity: 0.85 → 1` y `translateY(4px) → 0` durante **160 ms** con la misma curva, sin stagger por tarjeta ni retrasar los enlaces. Activación con teclado: cambio inmediato. Con `reduce`: cambio inmediato. Conservar `aria-current`, foco en controles y paginación de seis. |

Las tres pasan las cuatro preguntas de la skill: frecuencia baja u ocasional; propósito de explicación o de estado nombrado arriba; duración inferior a 300 ms; y función compatible con la lectura porque nunca retrasa texto ni controles. **No se recomienda aplicar las tres juntas por defecto**: probar primero la burbuja; el halo inicial solo si mejora la descubribilidad sin competir con la órbita. En eventos, observar el cambio de página real antes de aprobar el puente.

### Candidatas que esta skill no priorizó

- `components/home/DatosSection.tsx:19-28`: count-up de métricas. **Descartada por función:** son datos que se leen; mover cifras confirmadas dificulta lectura y comprensión de `+60`, `+150`, `+130`, `5+`.
- `components/home/Hero.tsx:10-15`: masked text reveal del H1. **No priorizada por función:** ocultar o retrasar el titular perjudicaría la lectura; H1 sigue abierta si el texto permanece disponible y el tratamiento visual supera una prueba de accesibilidad.
- `components/ds/FeaturedRotation.tsx:131-190`: otra secuencia en cada cambio del destacado. **No priorizada por función:** la diapositiva ya usa un fade de 500 ms en `spotlight.css:20-26` y rota automáticamente. Una entrada editorial única de la sección E1 sigue abierta.
- `components/home/ClosingPanel.tsx:11-21`: movimiento continuo de anillos del CTA. **Descartada por propósito:** la geometría es fondo decorativo y no explica una acción nueva.
- `components/home/LinesSection.tsx:16-31`: revelar las tres tarjetas al hacer scroll. **Descartada por función:** son contenido de lectura ya visible; un stagger en cada sección repetiría un efecto sin aclarar la relación entre las líneas. La posible visualización SVG de la tabla anterior requiere justificar su valor explicativo y costo antes de considerarse oportunidad real.

Barrido adicional: no hay gesto de arrastre, acordeón, estado de éxito ni estado vacío emotivo en estas seis secciones que justifique recetas de gesto, apertura o celebración. Botones, enlaces, hover de tarjetas y el carrusel ya tienen feedback o movimiento; una auditoría de esos efectos corresponde a `review-animations`/`improve-animations`, no a esta skill.

**Veredicto acotado de la skill:** entre los cambios pequeños, la burbuja del símbolo tiene el mayor valor porque suaviza un cambio de estado existente. Esto no limita la cantidad ni la presencia del motion editorial que pueda aprobarse para H1/H2/H3 y E1/E2/E3. Para convertir una fila en plan de implementación, usar `improve-animations plan <oportunidad>` después de aprobarla y contrastarla visualmente a 390 y 1280 px.

## Vocabulario de implementación (no decisión de librería)

- **Fade:** cambio de opacidad; hoy el destacado usa uno de 500 ms.
- **Stagger:** desfase breve de elementos relacionados; evitar retrasar lectura o controles.
- **Scale-in:** entrada de escala cercana a 1, nunca deformación del logotipo oficial.
- **Text reveal / masked text reveal:** descubrimiento de líneas mediante contenedor recortado; conservar texto semántico y legible en SSR.
- **Timeline:** secuencia coordinada que gobierna orden, solapes y limpieza.
- **SVG drawing:** revelado de un trazo SVG; solo para geometría nueva aprobada, no para recrear el logo.
- **ScrollTrigger:** activación ligada a visibilidad/scroll; valorar primero CSS o `IntersectionObserver` y cargar GSAP solo cuando el prototipo lo justifique.
- **Count-up:** interpolación visual de un dato confirmado, con valor final accesible desde el inicio.
- **Microinteracción:** feedback breve de un control o zona interactiva, equivalente para teclado y toque.

## Condiciones de accesibilidad y rendimiento

- **Desktop y móvil:** evaluar a 1280 y 390 px, sin scroll horizontal ni ocultar enlaces. `hover` solo cuando hay `hover: hover` y `pointer: fine`; ofrecer foco y clic/tap equivalentes. No depender del puntero para comprender las tres líneas.
- **Teclado y lectores:** preservar orden de foco, Escape, `aria-pressed`, `aria-controls`, anuncios y controles del destacado. Un reveal nunca debe retrasar un foco ni convertir texto en múltiples nodos anunciados de forma confusa.
- **Movimiento reducido:** detener órbitas como hoy; eliminar desplazamiento, escala y scroll ligado al progreso; mantener cambios de estado legibles. Evitar que nuevas timelines React y CSS ignoren la preferencia.
- **Carga:** respetar el límite servidor/cliente del App Router. Hero y SEO deben ser legibles antes de hidratar. GSAP y `@gsap/react` se instalarían únicamente tras aprobar un efecto que realmente los necesite; considerar importación acotada y limpieza con `gsap.context()`/`useGSAP` cuando corresponda. Evitar lecturas/escrituras de layout alternadas, animación de `top/left/width/height`, exceso de capas `will-change`, múltiples `ScrollTrigger` y trabajo fuera de pantalla. Medir LCP, CLS, INP, tamaño de JS y fluidez en equipo móvil real.
- **Verificación futura:** pruebas a 390/1280 px, `axe` sin violaciones serias/críticas, foco manual, reduced motion, ausencia de scroll horizontal, contraste y rendimiento. Antes de código Next.js 16, leer la guía local `node_modules/next/dist/docs/`.

## Decisiones pendientes de aprobación

1. H1, E2 y la guía visible que progresa con el scroll están elegidas para explorar; aprobar la geometría, peso visual, adaptación móvil y comportamiento de entradas al visitar o volver a la página.
2. Validar con marca la correspondencia espacial de los tres puntos y si pueden existir capas fieles del logo oficial. Si no, preferir halo/hotspot sin separar el raster.
3. Decidir si GSAP aporta suficiente frente a CSS/`IntersectionObserver`; si se aprueba, agregar `gsap` y `@gsap/react` en una tarea de implementación con presupuesto de JS.
4. Acordar presupuesto de duración, desplazamiento y carga para 390/1280 px, y si la rotación automática de eventos conserva 8 s.
5. Confirmar si hay cronología veraz y portadas aprobadas suficientes para E2; no crear material ficticio.
6. Revisar visualmente los prototipos con marca, contenido y accesibilidad antes de modificar componentes o tokens. Registrar decisiones de token/regla en `docs/decisions/`.

## Skills de proyecto y restauración

Las 15 skills están copiadas como archivos reales en `.agents/skills/<nombre>/SKILL.md` con sus recursos adyacentes; no se usaron symlinks ni se añadió paquete npm. El manifest `.agents/skills.lock.json` fija fuente, commit, ruta y nombre. Es un lock de procedencia local, no un lock generado por `npx skills`; `pnpm-lock.yaml` permanece intacto. Git puede versionar `.agents/skills/` y el manifest (no coinciden con `.gitignore`). La carpeta de Vercel se llama `react-best-practices`, mientras que el `name` declarado dentro del `SKILL.md` es `vercel-react-best-practices`: ambos apuntan a la misma skill, sin duplicar archivos.

| Fuente oficial | Commit fijado | Skills instaladas |
| --- | --- | --- |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (MIT) | `aed9cfd3277740755f6bfc1155c7aa645403b760` | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-performance` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) (MIT) | `0f2e23b32bb1265e84cff8d3e75785fec953fb1b` | `animate`, `animation-vocabulary`, `choreograph`, `find-animation-opportunities`, `review-animations`, `improve-animations`, `animation-performance` |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | `react-best-practices`, `web-design-guidelines` |

**Restaurar:** un checkout de Git trae todos los `SKILL.md` y recursos locales, sin descarga ni instalación global. Si faltan archivos o se decide actualizar: leer el manifest; verificar origen, licencia y nuevo commit; descargar las rutas `skills/<nombre>` del commit indicado con el instalador de skills de Codex (`install-skill-from-github.py --repo <owner/repo> --ref <commit> --path skills/<nombre> ... --dest .agents/skills`); revisar diff y recursos; actualizar manifest. El instalador no reemplaza directorios existentes: para una actualización usar un destino temporal dentro del repo, comparar y mover solo después de revisar. En una sesión nueva de Codex, las skills del proyecto quedan disponibles; si un agente no las muestra en su catálogo, debe abrir directamente el `SKILL.md` correspondiente por la ruta de este documento. La disponibilidad automática en una sesión ya iniciada depende de recargar el catálogo del agente.

**Dependencia externa de una skill:** `web-design-guidelines` indica consultar la versión reciente de `vercel-labs/web-interface-guidelines/command.md` en cada revisión; ese documento remoto no forma parte de la carpeta instalada. Si no hay red, la skill no puede hacer una revisión completa con sus reglas actuales. Registrarlo en el informe de una futura auditoría en vez de presentar una revisión parcial como completa.

**Hallazgo de verificación (2026-11-14):** la prueba E2E `content-preserved` del home a 390 px falló cuando la página recibió eventos publicados de Firestore: la Copa mostraba `Ver evento` y su ficha interna, mientras el baseline espera `Ir a la Copa` y el enlace externo de `defaultEvents`. La misma prueba pasó a 1280 px cuando el servidor cayó a datos incluidos por falta de conexión a Firestore. Es una variación de fuente de datos y baseline, ajena a esta preparación de motion; resolverla en una tarea de pruebas/contenido antes de usar la suite completa como puerta de aprobación visual. El proceso Playwright quedó abierto tras ejecutar sus 312 casos y se interrumpió, por lo que `pnpm test:e2e` no se puede declarar aprobado en esta sesión.
