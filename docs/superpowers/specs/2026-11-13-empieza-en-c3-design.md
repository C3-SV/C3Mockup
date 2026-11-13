# Empieza en C3: guía de entrada al sitio institucional

- Fecha: 2026-11-13.
- Estado: propuesta para revisión; sin implementación.
- Plan: [empieza-en-c3](../plans/2026-11-13-empieza-en-c3.md).

## 1. Intención y decisiones confirmadas

Una persona que descubre C3 entiende qué puede encontrar, cómo dar un primer paso y dónde seguir las próximas experiencias. El responsable eligió la comunidad de WhatsApp como acción principal, además de consultar eventos, y facilitó:
https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA

El enlace fue proporcionado por el responsable; no se ha abierto ni verificado ni se ha unido a la comunidad. Verificar vigencia sin entrar al grupo o pedir al responsable su confirmación antes de publicar.

## 2. Enfoques y dirección propuesta

1. Guía editorial /empieza-en-c3 con pasos y enlaces: recomendado para el sitio institucional.
2. Cuestionario personalizado: aplazado; no hace falta para orientar.
3. Sustituir /faq y redirigirlo: descartado inicialmente para conservar información y enlaces.

Contenido estático revisado en el repositorio, reutilizando siteConfig y las definiciones de áreas; no añadir un CMS general. FAQ queda como apoyo. No construir cuentas, inscripción ni onboarding de la plataforma futura.

## 3. Estructura editorial propuesta

1. Presentación breve: qué es C3 y a quién está dirigida la guía, a partir de PRODUCT.md.
2. Qué puedes encontrar: Compite, Crea y Conecta, con ejemplos de experiencias existentes y enlaces a las páginas actuales; no prometer un calendario fijo o mentoría individual.
3. Tu primer paso: comunidad de WhatsApp. Explicar con lenguaje neutral que se abre WhatsApp, servicio externo; no afirmar condiciones de admisión ni reglas no confirmadas.
4. Cómo participar en una experiencia: explorar eventos, leer sus requisitos y seguir su enlace de participación cuando exista.
5. Si todavía no hay una próxima experiencia: conservar acceso a comunidad, experiencias anteriores y contacto. No anunciar fechas futuras.
6. Dudas para empezar: selección de respuestas de FAQ y enlace a /faq. No duplicar respuestas textuales en dos fuentes.
7. Contacto alternativo por correo/formulario para quien no usa WhatsApp.

Preparar docs/content/empieza-en-c3.md como propuesta de copy con fuentes y registro de aprobación. El copy factual actual se reutiliza con cambios mínimos a tú; cualquier afirmación nueva se marca como propuesta hasta ser validada.

## 4. FAQ y navegación

- /faq conserva ruta, contenido, metadata, JSON-LD y accesibilidad.
- Sustituir únicamente el enlace FAQ de cabecera por Empieza en C3; FAQ permanece enlazada en el pie y desde la guía. Registrar el cambio intencional y sus pruebas.
- Mantener el resto de la cabecera (Qué es C3, Ecosistema, Eventos y Contacto); no introducir el sitemap completo futuro.
- Añadir guía a mainNavigation/publicRoutes y ajustar headerNavigation por separado para no borrar FAQ del pie. Revisar navItems alias y consumidores actuales.
- Home: incorporar un enlace contextual Empieza en C3 en AudienceSection para personas, conservando textos, encabezados y enlaces existentes. No reordenar secciones ni reemplazar CTAs del hero en esta tarea.
- Referencias a documentos legales solo cuando sus rutas y textos estén publicados.

## 5. Contrato de presentación y enlace

Centralizar el destino en siteConfig.community = { label: "WhatsApp", inviteUrl: "https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA" }. Texto propuesto para acción: "Unirme a la comunidad". Acción secundaria: "Explorar eventos". Alternativa: "Contactar a C3". Textos sujetos a revisión editorial, no atribuidos a una aprobación expresa anterior.

Enlace externo https, pestaña nueva con rel noopener noreferrer y aviso textual del destino. Sin widget embebido de WhatsApp, píxeles, QR como única opción, nueva captura de datos ni formulario duplicado. Si el enlace deja de estar vigente, cambiar configuración y mostrar temporalmente contacto como acción principal, sin botón roto ni promesa de acceso garantizado.

Componentes servidor sobre PageShell ds y Button existentes. Secuencia legible y corta, no un wizard con progreso. No requiere JavaScript para acceder a la comunidad o navegar. Iconos solo SVG de trazo y sin emojis.

## 6. DS y accesibilidad

--c3-* y c3-*; Montserrat/Poppins, acción violeta, foco visible 3px, área táctil ≥44px. A 390 y 1280 px, sin scroll horizontal, jerarquía clara, grupos de acciones que envuelven y texto legible. Respeta movimiento reducido; no necesita animación propia. Comprobar zoom 200%, teclado y nombres accesibles del enlace externo. La deuda de cabecera que afecte a este cambio se resuelve de forma acotada al integrar la navegación; no asumir que la auditoría anterior la cerró.

## 7. SEO y pruebas de conservación

Nueva metadata/canonical /empieza-en-c3, WebPage y BreadcrumbList; no generar FAQPage adicional solo por enlazar dudas. Incluir en sitemap y en labels del generador de navegación. Mantener metadata y dirección /faq.

content-baseline exige enlaces y textos antiguos en las páginas actuales. Mover FAQ de cabecera al pie conserva ese destino/texto; no regenerar el baseline para pasar. Añadir pruebas específicas de presencia de FAQ en pie y ausencia intencional en nav principal, así como acceso a la guía. Si el baseline detecta un cambio adicional, resolver la causa o registrar la excepción editorial aprobada por separado, nunca usar voseo-map para alteraciones de producto.

## 8. Alcance y aceptación

Una persona puede comprender la propuesta, abrir la comunidad, explorar eventos y contactar sin cuenta. La guía no depende de que existan próximos eventos, documentos legales no publicados o la plataforma futura. Ruta y acciones correctas sin JS; FAQ accesible; enlaces de header/footer y JSON-LD congruentes; no nuevas promesas de costo, edades, frecuencia o requisitos generales no confirmados.

Fuera: Colabora, blog, historias, timeline, newsletter, encuesta interactiva, recursos nuevos no existentes y reorganización general de menús. Las otras ideas están en docs/product/ideas-futuras-sitio-institucional.md.

Cierre: revisión del copy por responsable, enlace confirmado, pruebas significativas y AGENTS.md §5. Actualizar PRODUCT.md y ADR de ampliación para registrar nuevo punto de entrada y comunidad. No enviar mensajes ni unirse a WhatsApp durante implementación sin instrucción específica.
