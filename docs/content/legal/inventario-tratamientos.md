# Inventario de tratamientos · revisión técnica inicial

- Corte: 2026-11-13.
- Estado: borrador interno; incompleto hasta confirmar operación, responsables y reglas de conservación.
- Uso: preparar los textos de privacidad y convivencia. No es un aviso publicado ni una declaración de cumplimiento.

## Alcance y método

Se revisó el código indicado por el plan sin leer archivos de entorno ni copiar secretos. “Confirmado por código” describe la implementación del repositorio; no confirma la configuración del proveedor en producción, sus contratos ni quién accede a las cuentas.

Los datos confirmados, las observaciones de proveedores y las incógnitas se distinguen en cada fila. Cuando una persona responsable debe responder, se indica “Responsable de C3 por identificar”.

## Registro

| Tratamiento | Fuente técnica y finalidad observada | Datos/categorías | Proveedor y acceso | Conservación | Solicitudes y responsable | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| Consulta enviada desde contacto | ContactForm, validación y ruta API. La función recibe consultas y las remite al buzón general para que C3 responda; confirmar que esta es la finalidad aprobada. | Nombre, correo, organización opcional, tipo de consulta, mensaje y campo oculto antispam. Si el campo antispam llega lleno, la validación rechaza el envío y no llama a Brevo. | La ruta envía asunto, contenido, correo y nombre de respuesta a la API SMTP de Brevo y al destinatario configurado en el código: competitivecodingclub.sv@gmail.com. Quién accede al buzón, la cuenta usada, región y contrato de Brevo: pendientes. | El repositorio no almacena una base de consultas. La copia del buzón, los registros de Brevo y cualquier respaldo dependen de configuración no revisada. El plazo efectivo está pendiente. | El sitio muestra el correo general en el pie; no está confirmado que reciba solicitudes de privacidad. No se identificó persona responsable de respuesta. | Parcial: campos, flujo y destinatario visibles en código; operación real pendiente. |
| Analítica web | Analytics se monta globalmente desde el layout público para medir visitas. | La documentación de Vercel describe fecha/hora, URL y ruta, referidor, parámetros filtrados, ubicación, sistema operativo, navegador, tipo de dispositivo y versión del script. Vercel describe un hash derivado de la solicitud para distinguir visitantes; dice que no usa cookies y presenta datos agregados/anónimos. No se concluye que la configuración de C3 elimina toda información personal. | Paquete @vercel/analytics. El layout no define beforeSend ni eventos personalizados. Proyecto, acceso al panel, región, retención y redacción en producción: pendientes. | No se observó el plazo configurado del proyecto. | Dueño del proyecto y persona que atendería solicitudes: pendientes. | Parcial: instalación y documentación del proveedor verificadas; configuración real pendiente. |
| Hosting y registros operativos | El flujo de CI/CD del repositorio usa Vercel. La ruta de contacto informa errores al registro de servidor con console.error; no registra el cuerpo de la consulta en ese mensaje. | Puede haber datos técnicos de solicitud y errores en registros de plataforma; la lista y retención reales no se han verificado. | Vercel según docs/process/ci-cd.md. Acceso al proyecto, configuración de logs, región, copias y plazo: pendientes. | Pendiente de confirmar en el proyecto. | Responsable de administración y respuesta: pendiente. | Parcial. |
| Catálogo público de eventos y administración | El sitio consulta eventos mediante firebase-admin en el servidor. La aplicación admin usa Firebase Authentication y Firestore para personal autorizado. No se encontró un flujo de cuenta pública en el sitio institucional. | Visitantes: el código consultado no les pide crear una cuenta ni enviar datos de registro. Admin: Firebase puede procesar correo, IP y agente de usuario para autenticación según su documentación; usuarios, roles y configuración del proyecto requieren confirmación. Los datos de evento pueden incluir imágenes identificables. | Firebase Authentication/Firestore en admin; el sitio lee catálogo con firebase-admin. La ubicación, permisos, roles, contrato y accesos reales no se verificaron. | Retención y backups del proyecto: pendientes. | Responsable de Firebase y canal para solicitudes: pendientes. | Parcial; administración separada del visitante público. |
| Imágenes y salidas a terceros | Next permite imágenes servidas desde una ruta de Cloudinary. El sitio enlaza redes y los sitios de la Copa y el Hackathon. | Una imagen puede identificar personas según su contenido. Abrir un enlace externo entrega al tercero los datos técnicos propios de esa navegación; no se observó una transferencia de campos del formulario al hacer clic. | Cloudinary para imágenes; LinkedIn, Instagram, TikTok y sitios del ecosistema para enlaces. Cuentas, permisos de imágenes y configuración efectiva: pendientes. | Retención de Cloudinary y terceros: no observada. | Responsable de cada cuenta/canal: pendiente. | Parcial; revisar derechos de imágenes y avisos de salida. |

### Hallazgos confirmados en código

- El formulario no incluye newsletter ni aceptación obligatoria de términos.
- El envío no se guarda en una base de datos propia observada; se envía por API a Brevo y al buzón indicado.
- El error del envío se escribe en el log de servidor; el payload no se incluye en esa llamada de log.
- Analytics está montado en todas las páginas públicas; el código no configura redacción personalizada.
- La autenticación Firebase vive en admin. No se debe describir a las visitas del sitio como personas con cuenta C3.
- El layout importa Montserrat y Poppins mediante next/font/google; la configuración de carga de fuentes no se validó en este inventario.
- No se leyó ningún archivo .env ni se copiaron claves.

## Fuentes revisadas

Consulta: 2026-11-13. Fuentes para verificar contenido; no sustituyen la confirmación de la configuración de C3.

| Autoridad/proveedor | Fuente y jurisdicción | Nota de revisión |
| --- | --- | --- |
| Asamblea Legislativa de la República de El Salvador | [Decreto 144, Ley para la Protección de Datos Personales (PDF oficial)](https://www.asamblea.gob.sv/sites/default/files/documents/decretos/7A4FBD85-7E1B-46BE-9408-6FC549E53E00.pdf), El Salvador | Se revisó el artículo 64 sobre entrada en vigor y los artículos transitorios 60 y 61. El estado de emisión de normativa complementaria y posibles reformas posteriores queda pendiente de verificación jurídica; no se concluye cumplimiento. |
| Vercel | [Privacidad de Web Analytics](https://vercel.com/docs/analytics/privacy-policy), documentación del proveedor | Describe medición anónima/agregada, uso de hash de solicitud y no uso de cookies; revisar los datos y la configuración de redacción. No confirma el proyecto C3. |
| Brevo | [Términos y DPA](https://www.brevo.com/legal/termsofuse/), documentación contractual del proveedor | El DPA asigna al cliente la gestión de los plazos de retención y describe opciones para los registros transaccionales; la configuración C3 no se revisó. |
| Google Firebase | [Privacidad y seguridad de Firebase](https://firebase.google.com/support/privacy), documentación del proveedor | La ubicación y el procesamiento dependen del servicio y de su configuración. No confirma el proyecto C3. |

## Pendientes que mantienen abierto T0

1. Identificar a la persona responsable del sitio, del tratamiento y de responder solicitudes; confirmar jurisdicción y canal.
2. Confirmar quién accede al buzón, cómo se conservan y eliminan los mensajes y qué retención tiene el historial de Brevo.
3. Confirmar la configuración de Analytics, tratamiento de URLs/parámetros, acceso al panel y retención.
4. Confirmar hosting, registros, copias, región y retención de Vercel.
5. Confirmar proyectos, permisos, ubicación y retención de Firebase y Cloudinary, además de derechos/proceso para imágenes.
6. Verificar normativa salvadoreña complementaria vigente y determinar con el responsable si se necesita política de cookies o controles adicionales.
7. Identificar canal y responsable operativo para reportes de convivencia.