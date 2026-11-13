# Ideas futuras del sitio institucional C3

- Fecha: 2026-11-13.
- Estado: registro de exploración; no es un plan aprobado de implementación.
- Dirección confirmada: sitio institucional sólido e informativo. La futura plataforma gestionará inscripción y funciones personales.
- Fuente: conversación de exploración del 13-nov-2026, PRODUCT.md y documentación viva. No autoriza nuevas promesas ni publicación de datos sin validar.

## 1. Trabajo seleccionado para planificar ahora

Tres iniciativas separadas: [eventos y memorias](../superpowers/specs/2026-11-13-eventos-memorias-design.md), [legal y convivencia](../superpowers/specs/2026-11-13-legal-convivencia-design.md) y [Empieza en C3](../superpowers/specs/2026-11-13-empieza-en-c3-design.md). Sus planes viven en `docs/superpowers/plans/` con el mismo prefijo de fecha y tema, sin `-design`.

La convocatoria, memoria y resultados de una edición pertenecen a `/eventos/{slug}`. No se propone un sitio separado de memorias. Los sitios especiales de Copa y Hackathon se conservan.

## 2. Contenido por desarrollar después

### C1. Formas de colaborar — siguiente prioridad institucional

Página propuesta `/colabora`, con modalidades reales para instituciones educativas, empresas, organizaciones y personas. Cada modalidad explica qué puede aportar, qué implica colaborar y cómo iniciar la conversación. Secciones dentro de una página al principio; no crear paquetes o precios. Reutilizar los tipos de consulta existentes en contacto. Para retomarla: confirmar modalidades, capacidad de atención, contacto y copy. Indicador útil: consultas de colaboración pertinentes.

### C2. Blog y publicaciones — interés confirmado; diseño pendiente

Propuesta `/blog` y `/blog/{slug}`, con guías, aprendizajes, historias y novedades como categorías iniciales, sujetas al material disponible. Publicar conocimiento propio de C3: preparación para competencias, aprendizajes de experiencias y trabajo técnico explicado. Autor, fechas reales, fuentes y relación con eventos. La memoria factual vive en el evento; un artículo desarrolla un tema y enlaza la memoria. Para retomarlo: acordar audiencia, temas, responsables, revisión y una frecuencia sostenible; decidir edición desde admin o repositorio. No prometer posicionamiento por volumen de publicaciones.

### C3. Historias de trayectoria — interés confirmado; investigar primero

Entrevistar participantes para documentar cómo empezaron, qué hicieron, qué aprendieron y su evolución posterior. Incluir trayectorias diversas, no solo premiadas. Propuesta: comenzar como categoría del blog, sin perfiles públicos ni cuentas. Requiere entrevistas, comprobación de afirmaciones y autorización de texto, imagen y citas. Una sección independiente se reconsidera cuando exista suficiente material. Indicador: lectura de historias y visitas a Empieza en C3.

### C4. Historia institucional — interés confirmado

Desarrollar la historia dentro de `/que-es-c3`, vinculada a una línea de tiempo accesible. Seleccionar hitos comprobados y materiales existentes; distinguir fundación, incorporaciones y eventos. No crear otra página mientras quepa como sección. Para retomarla: validar fechas y relato con el equipo.

### C5. Impacto acumulado con evidencia

Los resultados por edición viven en su memoria. La home puede resumir resultados institucionales enlazando sus fuentes. Definir períodos y unidades: asistentes, participaciones y personas únicas no son equivalentes; no sumar automáticamente registros heterogéneos. Una futura `/impacto` depende de datos comparables y un proceso de revisión, no solo de tener contadores. Requiere autorización de cifras y fechas de actualización.

### C6. Boletín y distribución en LinkedIn

Una sola operación editorial: artículo completo en la web, adaptación para LinkedIn y resumen periódico por correo. El boletín no requiere contenido totalmente distinto. Primero consolidar publicaciones y una frecuencia viable; después definir suscripción, baja, preferencias y tratamiento de datos. No reutilizar direcciones del formulario de contacto como suscriptores. Publicar en redes o enviar correos requiere autorización específica, no la existencia de esta idea.

### C7. Aliados con contexto — aplazado expresamente

Mostrar qué aportó cada organización y a qué experiencia, usando nombres y logos autorizados. Empezar dentro de las páginas de evento; una página general se evalúa después. El responsable indicó que todavía no se han pedido los permisos: no solicitar ni publicar por iniciativa del implementador.

### C8. Recursos para prepararse

Guías y materiales reales para competencias, hackathons y talleres. Primero pueden publicarse como guías del blog y recursos de un evento; abrir una biblioteca solo cuando haya volumen. Revisar licencias de materiales externos y evitar duplicar artículos.

### C9. Vitrina de proyectos — propuesta para reconsiderar

Resultados seleccionados de experiencias: problema, equipo, capturas, demo o repositorio. Inicialmente caben como resultados y enlaces dentro de cada memoria. Una galería propia exige proyectos suficientes, permisos, responsables de actualización y un criterio editorial. No se ha seleccionado como iniciativa actual ni implica construir portafolios personales.

### C10. Sala de prensa — propuesta para reconsiderar

Descripción institucional aprobada, contacto, logos originales autorizados, fotografías utilizables y menciones verificadas. Puede comenzar como una sección pequeña de Qué es C3 o Colabora. Requiere resolver permisos y datos institucionales antes de elaborar un kit descargable.

## 3. Formas, UI y UX futuras

| ID | Idea | Desarrollo y condición para retomarla |
| --- | --- | --- |
| U1 | Línea de tiempo en Qué es C3 | Interés confirmado. Hitos con fecha y enlaces; lista vertical en móvil y contenido legible sin animación. Depende de C4. |
| U2 | Lectura editorial | Plantilla legible de artículos e historias: autor, fechas, jerarquía, imágenes con contexto, índice si aporta y contenido relacionado. Depende de C2/C3. |
| U3 | Conexión entre contenidos | Relaciones explícitas evento–artículo–historia–área. Empezar con enlaces relacionados; no requiere un mapa gráfico ni recomendaciones automáticas. |
| U4 | Memorias más visuales | Profundizar la presentación con galerías y video bajo demanda cuando haya medios autorizados. El plan actual entrega una memoria estructurada; una exposición multimedia elaborada es posterior. |
| U5 | Filtros compartibles | Mantener área y estado; almacenar selección en URL y añadir año o modalidad cuando el catálogo lo necesite. Búsqueda por texto al crecer el volumen. |
| U6 | Agenda y calendario | Lista cronológica y descarga/enlace de calendario para fechas confirmadas. Requiere horarios y zona horaria fiables. Vista mensual solo con programación suficiente. |
| U7 | Contacto por intención | Llegar desde Colabora con el motivo seleccionado y contexto útil; conservar el formulario existente. Validar parámetros permitidos. |
| U8 | Estados vacíos útiles | Sin próximas convocatorias, ofrecer guía de entrada, memorias o publicaciones pertinentes. No inventar fechas ni actividades. |
| U9 | Compartir y seguir novedades | Enlaces para compartir eventos y artículos, y suscripción cuando exista C6. Evitar SDK pesados o rastreo innecesario. |
| U10 | Presentación editorial variada | Alternar relato, fotografía, cifras y piezas destacadas según el contenido. Mantener tokens, tipografía y reglas del DS; evitar uniformar todo en tarjetas. |
| U11 | Recorridos interactivos | Explorador de intereses o exposiciones de proyectos solo si una guía y enlaces sencillos resultan insuficientes. Validar utilidad antes de construir. |
| U12 | Mapa o exploración del ecosistema | Posible visualización de relaciones o alcance geográfico, condicionada a datos fiables y suficiente contenido. Es exploratoria y de baja prioridad. |

## 4. Deuda vigente y dependencias, no ideas nuevas

- Sistema de fotos y biblioteca del admin: P2 de [pendientes](../design-system/pendientes.md), spec de destacado §8 y ADR-0012 pendiente. Es independiente; la ficha puede empezar sin fotos o con URLs autorizadas existentes.
- Accesibilidad: tamaños táctiles de cabecera y pausa de órbita están documentados. El alcance de cada iniciativa cubre sus componentes; revisar la deuda global en su tarea propia.
- SEO: P8/P9 de pendientes y datos estructurados del catálogo necesitan revisión de alcance. No introducir cambios silenciosos de reglas al añadir páginas.
- Dependabot sigue en pausa por petición del responsable.

## 5. Arquitectura de información futura propuesta

```text
Inicio
Qué es C3 [historia, línea de tiempo, equipo]
Empieza en C3
Compite / Crea / Conecta
Eventos → /eventos/{slug} [convocatoria, memoria, resultados]
Colabora [modalidades confirmadas]
Blog → /blog/{slug} [guías, aprendizajes, historias, novedades]
Contacto
Apoyo y pie: FAQ, privacidad, términos, convivencia
```

Este árbol orienta conversaciones posteriores; no autoriza añadir al menú enlaces a páginas inexistentes. Historias y categorías pueden comenzar dentro del blog; no necesitan cada una una ruta nueva.

## 6. Relación con la plataforma futura

Propuesta: el sitio institucional conserva las direcciones públicas de eventos, memorias y publicaciones. La plataforma procesa inscripción y funciones personales. El evento enlaza al trámite correspondiente; los datos informativos deben tener una fuente acordada para evitar duplicaciones. Dominio, integración y contratos de datos de la plataforma quedan por diseñar. No anunciarla ni publicar cuentas o accesos desde este documento.

## 7. Referencias revisadas en la exploración

- [Hack Club](https://hackclub.com/): proyectos con autores, demo y código.
- [Technovation: galería](https://www.technovation.org/app-gallery): exploración de resultados por categorías.
- [Technovation: impacto](https://www.technovation.org/impact): resultados acompañados de informes.
- [MLH: eventos](https://www.mlh.com/seasons/2027/events): descubrimiento e información práctica.
- [Laboratoria](https://laboratoria.la/): orientación, historias y evidencia institucional.
- [Google: contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=es): contenido propio pensado para la audiencia.

Referencias consultadas el 13-nov-2026; sirven como antecedentes, no como diseños para copiar ni como afirmaciones sobre capacidades de C3.
