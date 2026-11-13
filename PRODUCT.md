# PRODUCT.md · c3.com.sv

Fuente de verdad del **producto y del contenido**. Para lo visual, ver `docs/design-system/`. Esta es también la entrada que el plugin Impeccable esperaba (el traspaso del DS anotaba que faltaba).

## Qué es

**C3 · Competitive Coding Club · El Salvador.** Club fundado en octubre de 2024 que reúne talento técnico joven. El sitio público es el hub principal de C3: presenta la comunidad, las tres líneas, los eventos y el canal de contacto.

## Las tres líneas

| Línea | Idea | Color base |
| --- | --- | --- |
| **Compite** | Mide tus habilidades en competencias y challenges técnicos. | Azul `#205298` |
| **Crea** | Convierte ideas en proyectos. | Turquesa `#33beac` |
| **Conecta** | Muestra tus capacidades a empresas. | Morado `#4f5ba9` |

Las experiencias con empresas pertenecen a Conecta (Crea como línea secundaria si aplica). Las líneas no son marcas separadas: son módulos de una misma identidad.

## Origen del DS y vocabulario de este sitio

El DS viene del demo de una plataforma de retos empresariales («C3 Challenges») que **todavía no ha salido**. c3.com.sv es el sitio principal de toda C3, así que **no hereda** su terminología (ADR-0006):

| En el DS / demo | En c3.com.sv |
| --- | --- |
| «Explorar challenges ↗» | «Ver eventos ↗» o «Explorar experiencias ↗» |
| «Proponer un challenge» (empresas) | «Contactar» (formulario de `/contacto`) |
| «Ver challenge ↗» (tarjeta) | «Ver evento ↗» / «Ver experiencia ↗» |
| «Experiencias destacadas» | Igual: **eventos y experiencias**; los challenges, cuando existan, son un tipo de experiencia |
| «Tu cuenta», «Iniciar sesión», «Crear cuenta» | No existen: se omiten |

Unidades de contenido: **eventos** y **experiencias**, organizados por **áreas** (Compite, Crea, Conecta). No se menciona C3 Challenges como producto ni se anuncia su lanzamiento.

## Públicos

- **Jóvenes** con interés técnico: quieren demostrar lo que saben construir.
- **Empresas y aliados**: quieren ver talento con evidencia, no solo currículums.
- **Comunidad y prensa**: quieren entender qué es C3 y cómo participar.

## Propuesta vigente

Talento primero. A las empresas se les invita a conocer talento joven a través de la evidencia de lo que construye. **No se promete** «recibir soluciones», contratación garantizada, suscripción ni paquetes de pago (la propuesta comercial de la plataforma Challenges no se publica en este sitio).

## Voz y vocabulario

- Español con **«tú»** en toda la interfaz pública (decisión del 4-nov-2026 del DS). Nada de voseo.
- Términos: **eventos** y **experiencias**, por áreas. **No usar «challenge»** como término de interfaz (ADR-0006); la decisión «challenge es el término oficial» (26-oct-2026) es de la plataforma y no aplica aquí.
- Líneas: Compite · Crea · Conecta.
- Tono: institucional, claro, joven, sobrio, ambicioso. Sin estética gamer ni hacker, sin hipérbole.
- Sin emojis. Botones en frase normal («Explorar challenges ↗»), no en mayúsculas.
- Estados no implementados: «Próximamente». Nunca botones sin función.

## Reglas de contenido (no negociables)

0. **Sitio real y en producción.** El rework es **visual**: se conserva el contenido existente (titulares, textos, eventos, SEO, rutas) y solo se mejora lo mínimo, como pasar el voseo a «tú». La fuente de contenido de referencia es `docs/content/documento-maestro-sitio-c3.txt` (versión del 20-may-2026).
1. **Sin etiqueta DEMO, nunca.** Los eventos del sitio (`defaultEvents` y los del admin) son reales. Nada se inventa ni se marca como demostración. El badge DEMO del DS no se usa.
2. **No inventar:** testimonios, logos de clientes, puntajes «reales», fotos de jóvenes, marcas que no participan.
3. **Precios:** no publicar precios de paquetes sin confirmación del responsable. No inventar paquetes.
4. Las portadas de eventos usan imágenes de hosts de C3, con descripción alternativa obligatoria.
5. Datos de eventos reales vienen del admin (Firestore); nunca se fabrican en el cliente.
6. *(Capacidad implementado en la rama `eventos-memorias`; pendiente de aprobación del responsable; ADR-0014.)* Ficha permanente por edición en `/eventos/{slug}`, con memoria y resultados solo con fuente y permiso. Contenido sin respaldo queda en borrador. Ver `docs/content/eventos/guia-editorial.md`.

## Éxito

- El sitio se siente como el hub de un ecosistema integrado (Compite · Crea · Conecta), no como una landing genérica ni una página de evento.
- Un visitante entiende en una pantalla qué es C3, para quién es y cuál es su siguiente acción.
- Accesible (WCAG AA verificado con herramienta), usable a 390 px, rápido y con SEO intacto.

## Anti-metas

Que parezca SaaS genérico, página gamer, estética hacker, un sitio saturado de botones o de color decorativo; que prometa lo que C3 no ofrece; que invente evidencia.

## Estado del contenido

| Área | Estado |
| --- | --- |
| Textos, titulares y eyebrow (incluidos «El talento se ve en acción.» solo si ya existe en el sitio; si no, se conserva el actual) | **Se conservan**; solo ajuste de voseo a «tú» |
| Logo | Cabecera: `c3-sim-azul.png`, el logo completo oscuro del paquete (decisión del 2026-11-11, tras revisar el navbar). Pie: `logo-c3-blanco-monocromatico.png` sobre navy. `logo-c3-claro-con-color.png` se retiró en la Fase 8 (sin usos en el sitio) |
| Eventos | Reales (los de `defaultEvents` y los del admin). Sin DEMO |
| Paquetes comerciales y precios | **No publicados.** Pendiente de confirmación del responsable |
| Manual de marca oficial | No disponible en el repo. Pedir al responsable si se duda de logo o color |

## Responsable de decisiones

El responsable de C3 valida marca, precios y propuesta. Todo cambio de regla se registra en `docs/decisions/` con fecha.
