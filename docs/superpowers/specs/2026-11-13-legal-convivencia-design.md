# Documentos legales y de convivencia del sitio institucional

- Fecha: 2026-11-13.
- Estado: propuesta para revisión; planificación, sin textos legales aprobados.
- Plan: [legal-convivencia](../plans/2026-11-13-legal-convivencia.md).

## 1. Intención y confirmaciones

Dar al sitio informativo documentos coherentes con su operación y un aviso comprensible en contacto. El responsable quiere privacidad, términos y documentos básicos. Confirmó que C3 aún no es una entidad legal y que la identificación de la persona o personas responsables queda pendiente. No atribuir personalidad jurídica ni inventar razón social, domicilio, plazos, obligaciones o mecanismos de reporte.

## 2. Enfoques y elección propuesta

1. Documentos versionados en repositorio, revisados antes de publicar: recomendado; trazabilidad y cambios poco frecuentes.
2. Editor legal en admin: aplazado; añade complejidad sin resolver la validación.
3. Copiar términos genéricos de otro servicio: descartado; no describe esta operación.

El implementador puede resolver organización de componentes y pruebas sobre el DS. La aprobación factual/legal del texto corresponde al responsable identificado, con revisión jurídica cuando corresponda. La planificación no declara cumplimiento jurídico.

## 3. Hechos observados y cuestiones por confirmar

| Hecho comprobado en código | Fuente | Falta verificar |
| --- | --- | --- |
| Contacto recoge nombre, email, organización opcional, tipo y mensaje; honeypot | ContactForm.tsx, lib/contact-form.ts | Responsable, acceso al buzón, retención y atención de solicitudes |
| Se envía mediante Brevo al correo oficial | api/contact/route.ts y lib/brevo.ts | Configuración contractual y operativa real; registros, conservación y eliminación |
| Analytics está montado en layout público | app/layout.tsx | Configuración efectiva, datos, cookies/almacenamiento y proveedores en producción |
| Hosting y fuentes/imágenes externas forman parte de la operación | next.config.ts, layout.tsx y configuración de despliegue | Logs, transferencias, condiciones vigentes de proveedores |
| La comunidad usa WhatsApp por invitación facilitada por el responsable | Conversación del 13-nov-2026 | Normas y administración del grupo; aviso de salida a tercero |
| Hay fotos de personas y eventos | PRODUCT.md, content.ts | Permisos existentes y proceso para atender solicitudes |

No concluir que no hay cookies por no encontrar document.cookie, ni que cada proveedor exige el mismo consentimiento. Inventario administrativo separado del formulario público: Firebase Auth/Firestore no implican que el visitante público cree una cuenta.

## 4. Alcance documental

Rutas propuestas:
- /privacidad: responsable real, datos y finalidades confirmadas, medios de recogida, destinatarios/proveedores, conservación, canal de solicitudes, información aplicable a menores y cambios.
- /terminos: uso del sitio informativo, propiedad y uso de contenido, enlaces externos, contacto y alcance de sus avisos. Condiciones específicas de una competencia o inscripción pertenecen a su organización/servicio; no imponerlas globalmente aquí.
- /codigo-de-conducta: convivencia, ámbito real, canal de reporte, responsables y proceso viable. No prometer anonimato absoluto, cobertura permanente ni tiempos de respuesta sin capacidad confirmada.

Una política de cookies separada y controles de consentimiento son una decisión condicional del inventario; no instalar un banner genérico. Si son necesarios, registrar una ampliación concreta del plan antes de publicar el tratamiento afectado. Para el código de conducta, confirmar quién atiende reportes; no asumir que el buzón general es suficiente.

Fuera: newsletter, consentimiento comercial, términos de una plataforma futura, pagos, inscripción, asesoría legal automatizada, panel de gestión de consentimientos sin necesidad demostrada.

## 5. Dossier y aprobación previa a publicación

Crear docs/content/legal/inventario-tratamientos.md y decisiones-editoriales.md. Registrar para cada dato: fuente, propietario de la respuesta, estado confirmado/pendiente, fecha y decisión; no incluir secretos ni datos personales innecesarios. Identificación de responsable pendiente bloquea aprobación de textos finales, no la preparación técnica del plan.

El trabajo de ejecución empieza por inventario y revisión de fuentes oficiales vigentes aplicables a El Salvador y a los tratamientos efectivos. Guardar títulos, URLs, autoridad, jurisdicción y fecha de consulta; distinguir obligación verificada de propuesta. No asignar una base jurídica o plazo usando plantillas.

Registro por documento: versión, última revisión sustantiva, responsable de aprobación y alcance. El responsable identificado valida datos y textos; correcciones jurídicas se incorporan antes del merge de publicación. No enviar mensajes a terceros ni contratar servicios sin autorización específica.

## 6. Presentación e integración

Páginas de lectura en PageShell ds, h1, introducción, fecha y secciones; índice con anclas cuando sea útil, párrafos legibles y contacto visible. Guardar el texto aprobado como datos estructurados estáticos en apps/web/lib/legal-content.ts; renderer LegalDocument compartido. No HTML libre.

Enlaces en una zona legal del pie que conserve las cuatro columnas y enlaces actuales. Aviso breve junto al formulario enlaza privacidad y explica el tratamiento confirmado. No añadir aceptación obligatoria de términos o marketing a la consulta por defecto; cualquier consentimiento adicional depende del inventario y de una decisión explícita.

Datos de versión editoriales no dependen de new Date() en cada render. Metadata/canonical propios, sitemap y etiquetas de navegación acordes con rutas reales. Robots por defecto del sitio: no usar noindex como sustituto de aprobación. En despliegue público solo entran textos aprobados: el trabajo puede prepararse en rama/preview restringido; no publicar páginas con marcadores pendientes.

## 7. Accesibilidad y reglas del producto

Voz tú, sin promesas ni datos inventados; no llamar entidad constituida a C3. DS --c3-*, clases c3-*, acción violeta, foco de 3px y área táctil ≥44px. Lectura a 390/1280 px y con zoom 200%, anclas que no queden bajo la cabecera, sin movimiento imprescindible. No reescribir otros contenidos del sitio.

## 8. Criterios de aceptación

- Inventario tiene fuente y validación para cada afirmación de los textos publicados.
- Responsable y canal de solicitudes identificados; canal de reporte y capacidad confirmados para convivencia.
- No quedan placeholders, razón social ficticia ni plazos no aprobados.
- Enlaces de pie y aviso de contacto funcionan; envío de contacto conserva validación y tratamiento comprobado.
- Documentos congruentes con navegación, metadata y sitemap.
- Pruebas de componentes y E2E en 390/1280 px; no scroll horizontal, axe serio/crítico limpio, foco/zoom revisados. Cierre con AGENTS.md §5.

## 9. Dependencias y estado

Independiente de eventos y Empieza en C3 para preparar infraestructura; publicación legal condicionada a completar identificación y validación. El código de conducta no debe enlazarse como definitivo desde Empieza en C3 si sigue en borrador. P5 de pendientes pasa de aplazado a planificado, sin marcarlo terminado. Ampliación de rutas y contenido documentada por ADR de alcance de esta ronda; número se elige al ejecutar, sin ocupar 0012 reservado para medios.
