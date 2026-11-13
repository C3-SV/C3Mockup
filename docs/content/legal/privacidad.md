# Privacidad · borrador base

- Versión: 0.1.
- Fecha de revisión de este borrador: 2026-11-13.
- Aprobador: pendiente de identificar.
- Estado: explicación inicial para revisión interna; no publicar ni enlazar.
- Inventario relacionado: [inventario-tratamientos.md](inventario-tratamientos.md).

> Nota interna: este texto parte de lo que el repositorio muestra. Antes de publicarlo, C3 debe confirmar responsables, configuración de proveedores, conservación, canal de solicitudes y revisión jurídica que corresponda.

## Qué datos recibimos

Si escribes mediante el formulario de contacto, recibimos tu nombre, correo electrónico, tipo de consulta y mensaje. Puedes incluir una organización si aplica. El formulario también tiene un campo técnico antispam. No usamos ese formulario para inscripciones ni para suscribirte a una lista comercial.

## Para qué los usamos

La función observada del formulario es recibir tu consulta y permitir que C3 te responda. No afirmamos finalidades adicionales. Evita incluir información sensible que no sea necesaria para tu mensaje ni datos personales de otras personas.

## Cómo se entrega una consulta

La implementación actual remite el mensaje mediante el servicio de correo transaccional Brevo al buzón general de C3. El correo que escribes también se usa como dirección de respuesta. El sitio no guarda el envío en una base de datos propia observada en el repositorio.

Pendiente de confirmar antes de publicar: quién tiene acceso al buzón, cómo se administran las copias y respaldos, qué registros conserva Brevo en la cuenta de C3 y por cuánto tiempo. El DPA de Brevo indica que el cliente debe gestionar los plazos de retención de los datos que sube al servicio; no se ha verificado una regla concreta para C3.

## Analítica del sitio

El sitio incorpora Vercel Web Analytics para conocer qué páginas se visitan y orientar mejoras. Según la documentación del proveedor, sus mediciones pueden incluir fecha y hora, página y ruta, referidor, parámetros de URL filtrados, ubicación aproximada, sistema operativo, navegador y tipo de dispositivo. Vercel describe el uso de un hash derivado de la solicitud para distinguir visitas, mediciones agregadas y ausencia de cookies.

La configuración del proyecto de C3 no se ha verificado. El código revisado no define una regla beforeSend para redactar direcciones o parámetros de URL. No compartas datos personales en la dirección de una página. Antes de publicar, confirmar si hay otras cookies o herramientas y si se necesita un aviso o control adicional.

## Servicios y enlaces de terceros

El formulario se entrega a Brevo; Vercel sirve el sitio y la analítica; el catálogo público de eventos puede consultarse en Firebase desde el servidor; y algunas imágenes se sirven desde Cloudinary. La documentación de cada proveedor describe sus propias prácticas, pero no confirma la cuenta, ubicación, permisos o ajustes que usa C3.

El sitio también enlaza redes sociales y sitios de eventos. Si abres uno de esos enlaces, ese servicio recibe los datos técnicos propios de tu visita y aplica sus condiciones.

## Conservación y solicitudes

El plazo durante el que C3 conserva mensajes, registros y copias todavía no está confirmado. Tampoco se ha designado a una persona ni un canal específico para solicitudes sobre datos. El correo general publicado en el pie no se ha confirmado para atender este tipo de solicitudes.

Antes de publicar, C3 debe decidir quién recibe y responde solicitudes, cómo verificará la identidad cuando sea necesario y qué procedimiento se aplicará. No se incluye un plazo de respuesta ni una promesa de eliminación mientras no se hayan revisado las reglas y la operación.

## Menores y cambios

El sitio se dirige a talento joven, pero el repositorio no confirma edades, verificación de edad ni un procedimiento de atención a personas menores. Esta sección requiere una decisión responsable antes de publicarse.

La fecha de revisión que aparezca en una página pública deberá corresponder a una aprobación real. Este borrador no afirma cumplimiento legal ni sustituye la revisión factual y jurídica correspondiente.

## Referencias internas

- [Inventario de tratamientos](inventario-tratamientos.md).
- [Decreto 144, Ley para la Protección de Datos Personales (Asamblea Legislativa)](https://www.asamblea.gob.sv/sites/default/files/documents/decretos/7A4FBD85-7E1B-46BE-9408-6FC549E53E00.pdf).
- [Privacidad de Vercel Web Analytics](https://vercel.com/docs/analytics/privacy-policy).
- [Términos y DPA de Brevo](https://www.brevo.com/legal/termsofuse/).