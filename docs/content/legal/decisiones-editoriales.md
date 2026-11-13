# Decisiones editoriales · documentos legales y convivencia

- Corte: 2026-11-13.
- Estado: decisiones de preparación; no son aprobación jurídica ni autorización de publicación.
- Inventario relacionado: [inventario-tratamientos.md](inventario-tratamientos.md).

## Criterios aplicados

| Tema | Evidencia y fuente | Estado | Responsable de confirmar | Decisión de esta preparación |
| --- | --- | --- | --- | --- |
| Naturaleza de C3 | Confirmación registrada en la spec legal del 13-nov-2026 | Confirmado en la spec | Responsable de C3 | No atribuir personalidad jurídica ni razón social. La persona responsable del tratamiento aún debe identificarse. |
| Formulario | ContactForm.tsx, lib/contact-form.ts, api/contact/route.ts y lib/brevo.ts | Implementación observada; finalidad formal, acceso y conservación pendientes | Responsable de C3 y administrador de las cuentas | El borrador puede explicar que se reciben y remiten consultas. No afirmar un plazo de eliminación ni un fundamento jurídico. |
| Analítica | app/layout.tsx instala Vercel Analytics. [Documentación de Vercel](https://vercel.com/docs/analytics/privacy-policy), consultada 2026-11-13 | Proveedor describe sus datos y medidas; configuración de C3 no confirmada | Administrador de Vercel / Responsable de C3 | Explicar el uso de analítica con atribución al proveedor. Mantener pendiente si se necesita documento de cookies o controles. No prometer que no se trata ningún dato personal. |
| Brevo | lib/brevo.ts y [DPA de Brevo](https://www.brevo.com/legal/termsofuse/), consultado 2026-11-13 | Envío por API observado; cuenta, región, acuerdo y retención pendientes | Administrador de Brevo / Responsable de C3 | Describir la transmisión del mensaje. No atribuir al proveedor un plazo configurado en la cuenta C3. |
| Firebase | apps/web/lib/events.ts y apps/admin/lib/firebase-client.ts; [documentación Firebase](https://firebase.google.com/support/privacy), consultada 2026-11-13 | Separación de aplicaciones observada; configuración de proyectos pendiente | Administrador de Firebase / Responsable de C3 | No describir autenticación de admin como registro de visitantes públicos. |
| Imágenes y enlaces externos | apps/web/next.config.ts, componentes de eventos y navegación | Hosts visibles; derechos/configuración pendientes | Responsable de C3 | Indicar salidas a terceros solo después de revisar todos los enlaces efectivos y aprobar el texto correspondiente. |
| Canal de solicitudes de privacidad | El correo general aparece en el sitio; su uso para este fin no está confirmado | Pendiente | Responsable de C3 | No presentarlo aún como canal ARCO-POL. |
| Canal y proceso de convivencia | No se confirmó un canal, equipo o capacidad de respuesta | Pendiente | Responsable de C3 | No prometer anonimato, cobertura permanente, plazo ni resultado. |
| Personas menores de edad | C3 se dirige a talento joven, pero no se verificó edad de participantes ni proceso de atención | Pendiente | Responsable de C3 | No inventar edad mínima, consentimiento parental o medidas de verificación. |
| Términos | El sitio principal es institucional; la inscripción/plataforma futura está fuera de alcance de esta iniciativa | Confirmado en la spec | Responsable de C3 | Limitar el borrador al sitio informativo. Reglas de cada evento deben mostrarse en su convocatoria y no convertirse en términos globales. |

## Registro de borradores

| Documento | Versión | Revisión | Aprobador | Estado |
| --- | --- | --- | --- | --- |
| Privacidad | 0.1 | 2026-11-13 | Pendiente de identificar | Borrador explicativo interno; no publicar |
| Términos | 0.1 | 2026-11-13 | Pendiente de identificar | Borrador explicativo interno; no publicar |
| Código de convivencia | 0.1 | 2026-11-13 | Pendiente de identificar | Propuesta interna; no publicar |

## Gate para integrar textos

No pasar borradores a apps/web/lib/legal-content.ts, páginas públicas, pie, aviso de contacto, JSON-LD o sitemap hasta que se hayan completado estas comprobaciones:

- Responsable identificado y canal de solicitudes y reportes confirmado.
- Acceso, finalidades y plazos reales revisados contra las cuentas de Brevo, Vercel, Firebase y Cloudinary.
- Afirmaciones revisadas contra el inventario y las fuentes oficiales vigentes.
- Texto aprobado por el responsable; revisión jurídica incorporada cuando corresponda.
- Sin campos pendientes, garantías, plazos o datos inventados.

La rama actual prepara documentación e infraestructura. No declara que la operación cumpla una ley ni que los textos estén aprobados.
## Textos base preparados

- [Privacidad, versión 0.1](privacidad.md): formulario, envío por Brevo, analítica Vercel y datos operativos aún pendientes.
- [Términos, versión 0.1](terminos.md): uso del sitio institucional y reglas separadas por evento.
- [Convivencia, versión 0.1](codigo-de-conducta.md): expectativas básicas; canal, alcance y procedimiento sin confirmar.
- Los tres documentos son explicativos e internos. No están aprobados y no se han integrado en código ni en rutas públicas.