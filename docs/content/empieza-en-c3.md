# Empieza en C3: contenido editorial

- **Versión:** 0.1
- **Fecha:** 2026-11-14
- **Estado:** propuesta ejecutada por instrucción del responsable (14-nov-2026), texto sujeto a revisión. No es una aprobación editorial.
- **Spec:** [2026-11-13-empieza-en-c3-design.md](../superpowers/specs/2026-11-13-empieza-en-c3-design.md) (estructura de §3)
- **Plan:** [2026-11-13-empieza-en-c3.md](../superpowers/plans/2026-11-13-empieza-en-c3.md)

Reglas: voz «tú», sin emojis, sin «challenge». Solo se reutilizan hechos ya presentes en el sitio; toda afirmación nueva va marcada **(propuesta)**. No se afirman reglas de admisión, gratuidad general, edad, frecuencia, mentoría individual ni requisitos generales: los requisitos se consultan en cada evento.

Fuentes: `PRODUCT.md`; `apps/web/lib/content.ts` (`faqItems`, `homeLines`, `linePageContent`); `apps/web/lib/site.ts` (`siteConfig`).

## Destino de la comunidad y registro de verificación

- Enlace: https://chat.whatsapp.com/FZ7iUuuFHJX22e7zb3ejSA
- Origen: facilitado por el responsable el 14-nov-2026. Vigencia no verificada por el implementador (no se abrió el enlace, no se entró a la comunidad ni se enviaron mensajes).
- Antes de publicar: el responsable confirma que sigue vigente. Fecha de confirmación: _pendiente_.
- Cómo sustituirlo si caduca: cambiar `siteConfig.community.inviteUrl` (único punto de configuración, ver spec §5). Mientras se renueva, mostrar «Contactar a C3» como acción principal y ocultar el botón de comunidad; no dejar un botón roto ni prometer acceso.
- Cómo cambiar el contacto: el correo vive en `siteConfig.contact.email`; el formulario, en `/contacto`.

## Textos de acción (propuesta)

| Uso | Texto |
| --- | --- |
| Acción principal | Unirme a la comunidad |
| Acción secundaria | Explorar eventos |
| Alternativa | Contactar a C3 |
| Aviso de servicio externo | Se abrirá WhatsApp, un servicio externo a C3, en una pestaña nueva. |

Los tres textos de acción y el aviso son propuesta, pendientes de revisión del responsable.

## Secciones (orden de spec §3)

### 1. Presentación breve

Título: **Empieza en C3**

> C3 · Competitive Coding Club reúne talento técnico joven en El Salvador y la región. Esta guía te muestra qué puedes encontrar y cómo dar tu primer paso.

Fuentes: PRODUCT.md («Qué es»); `siteConfig.shortDescription` y `siteConfig.description`; FAQ «¿Quiénes pueden participar en C3?» (principalmente estudiantes, builders y talento técnico joven). La segunda frase es **(propuesta)** de enlace.

### 2. Qué puedes encontrar

> **Compite:** programación competitiva, ICPC, entrenamientos y la Copa Salvadoreña de Programación.
> **Crea:** hackathons, prototipos, builders, software y proyectos reales.
> **Conecta:** comunidad, industria, mentoría y alianzas.

Enlaces: `/compite`, `/crea`, `/conecta`. Ejemplos de experiencias existentes: Copa Salvadoreña de Programación (Compite) y Hackathon de Turismo Creativo I (Crea).

Fuentes: `homeLines[].bullets`, `siteConfig.lines`, FAQ «¿Qué son Compite, Crea y Conecta?» y «¿Cuál es la relación entre C3, la Copa y el Hackathon?». Sin calendario fijo ni mentoría individual: no se afirman. «Mentoría» aparece solo como parte de la descripción de Conecta, tal como ya está en el sitio.

### 3. Tu primer paso: la comunidad

> La comunidad de C3 está en WhatsApp. Es un buen lugar para conocer la siguiente actividad disponible.
> [Unirme a la comunidad]
> Se abrirá WhatsApp, un servicio externo a C3, en una pestaña nueva.

Fuente: FAQ «¿Cómo me uno o participo en C3?» (escribiendo por los canales oficiales para conocer la siguiente actividad disponible); enlace facilitado por el responsable. La descripción de la comunidad como «lugar para conocer la siguiente actividad» es **(propuesta)** derivada de esa FAQ. No se afirman condiciones de admisión, reglas del grupo ni cantidad de miembros.

### 4. Cómo participar en una experiencia

> 1. Explora los eventos.
> 2. Lee los requisitos de cada uno.
> 3. Sigue su enlace de participación cuando exista.
> [Explorar eventos] → `/eventos`

Fuente: FAQ «¿Cómo me uno o participo en C3?» (participar en eventos, seguir convocatorias); PRODUCT.md (eventos y experiencias). Los pasos son **(propuesta)** de redacción; no se declaran requisitos generales: cada evento publica los suyos.

### 5. Si todavía no hay una próxima experiencia

> A veces no hay una experiencia abierta. Mientras tanto, puedes unirte a la comunidad, revisar las experiencias anteriores o escribirnos.

Enlaces: comunidad, `/eventos`, `/contacto`. Fuente: PRODUCT.md («Estados no implementados: Próximamente»; sin fechas inventadas). La frase es **(propuesta)**; no anuncia fechas futuras ni frecuencia.

### 6. Dudas para empezar

Selección de respuestas existentes de `faqItems` (se renderizan desde esa fuente, sin copiar el texto aquí):

- ¿Qué es C3?
- ¿C3 es solo programación competitiva?
- ¿Quiénes pueden participar en C3?
- ¿Cómo me uno o participo en C3?

Enlace: «Ver todas las preguntas frecuentes» → `/faq`. La selección es **(propuesta)**. No se enlazan páginas legales (P5 aún sin publicar).

### 7. Contacto alternativo

> ¿No usas WhatsApp? Escríbenos por correo a competitivecodingclub.sv@gmail.com o desde el formulario de contacto.
> [Contactar a C3] → `/contacto`

Fuente: FAQ «¿Cómo contacto a C3?»; `siteConfig.contact.email`. Sin formulario duplicado ni nueva captura de datos.

## Excepción de alcance (registrar en ADR al implementar)

Sustituir únicamente el enlace FAQ de la cabecera por «Empieza en C3»; FAQ permanece en el pie y en la guía, con ruta y contenido intactos. Es una excepción acotada al alcance original del rework, **pendiente de aprobación del responsable** (spec §4).

## Registro de aprobación

| Elemento | Estado |
| --- | --- |
| Copy de las 7 secciones | Propuesta ejecutada por instrucción del responsable; sujeta a revisión |
| Textos de acción y aviso externo | Propuesta; sujeta a revisión |
| Vigencia del enlace de WhatsApp | Facilitado por el responsable; sin verificar por el implementador |
| Excepción FAQ en cabecera | Pendiente de aprobación |
