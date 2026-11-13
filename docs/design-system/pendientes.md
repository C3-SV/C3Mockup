# Pendientes del DS y postura de este repo

Los 16 asuntos abiertos de `source/ACTUALIZACION-DS-C3.md` §12.1, más las desviaciones de §12.2. «Postura» es lo que este repo hará **mientras el responsable no decida otra cosa**; son llamadas del implementador, no decisiones del responsable. Las marcadas ⚠ necesitan su respuesta.

| # | Asunto | Postura por defecto en este repo | Cierra en |
| --- | --- | --- | --- |
| 1 | Manual de marca | Usar logos del paquete; ante duda pedirlo ⚠ | Responsable |
| 2 | Canvas vigentes | No bloquea; pedir capturas de referencia para comparar ⚠ | Responsable |
| 3 | Color `info` = azul Compite (la «acción por producto» no aplica: ADR-0006) | Aceptar la excepción **por escrito** y limitar `info` a pastillas con texto | Fase 1 (ADR) |
| 4 | Modo oscuro | No activar. `color-scheme: light`. Los tokens oscuros se importan pero sin uso; se marca «no activar hasta corregir 4.13:1» | Fase 1 |
| 5 | Tokenizar lo que falta | Añadir tintes, radios, sombras y fondos de estado a `tokens.json` y regenerar CSS | Fase 1 |
| 6 | Variantes por línea | Añadir `compite/crea/conecta` (base, texto, oscuro, tinte, impresión) a `tokens.json` | Fase 1 |
| 7 | Botones | Poppins 600, frase normal (vigente según el paquete) | Resuelto |
| 8 | Radio de campos | **12 px** (como el sistema aplicado); `radius-sm` queda para chips | Fase 1 |
| 9 | Tracking de etiqueta | **0.12 em** (aplicado); actualizar token | Fase 1 |
| 10 | Escalas de espaciado y tipografía | Usar la escala de 4 px y los `clamp` de §4; valores sueltos se justifican en el PR | Continuo |
| 11 | Movimiento | Duraciones como convención (0.15 s); sin tokens por ahora | Resuelto |
| 12 | Auditoría de contraste | Prueba automática de ratios en CI + axe en e2e | Fase 0 y 1 |
| 13 | Sombra de tarjetas | Aceptar `shadow-soft` | Fase 1 (ADR) |
| 14 | Gradientes | Aceptar los 4 usos de §5.4 por escrito; ninguno más | Fase 1 (ADR) |
| 15 | Oro como acento | Fuera de alcance (el sitio no tiene contador de atención) | N/A |
| 16 | Oro: percentil o puesto | Fuera de alcance (no hay reconocimientos en el sitio) | N/A |

## Desviaciones que no se copian (§12.2)

- `.c3-btn--small` de 36 px: **se sube a 44 px** de área táctil.
- ~30 hexadecimales fuera de token: se tokenizan al extraer cada bloque.
- Texto de 10 y 11 px: solo en etiquetas (número de paso, eyebrow, títulos de pie); nunca en texto corrido.
- Burbuja de la órbita oculta bajo 900 px: **decisión pendiente ⚠**. Propuesta: mostrar la información en línea bajo la órbita en tableta y móvil, para que el control no quede mudo.
- Lectura en proyector: sin verificar; fuera de alcance.
- Entradilla bajo titular de sección (`.c3-section-head .c3-lead`): hasta **62 caracteres**, no 34 como dice el paquete. El hero conserva 34. Decidido el 13-nov-2026 por el responsable ([ADR-0013](../decisions/0013-entradilla-de-seccion-mas-ancha.md)).

## Preguntas abiertas para el responsable ⚠

1. ¿Se puede conseguir el manual de marca y capturas de referencia del sistema aplicado?
2. ¿Confirma la propuesta para la burbuja de la órbita en móvil?
3. ¿Se publicarán paquetes o precios en el sitio? (Hoy: no.)

## Pendientes de producto y contenido (fuera del DS)

| # | Asunto | Postura | Cierra en |
| --- | --- | --- | --- |
| P1 | Página por edición con slug (`/eventos/{slug}`), memoria, resultados, metadatos y Open Graph | Planificación preparada para revisión (13-nov-2026). Admin estructurado y micrositios conservados; la nueva propuesta permite iniciar sin biblioteca de fotos. Requiere spec aprobada, ADR de alcance y contenido real. Ver enlaces al final | Plan nuevo, sin ejecutar |
| P2 | Sistema de fotos y biblioteca de assets en el admin: subida, recorte 16:9, texto alternativo, derechos, almacenamiento | Planeado en el mismo spec §8. Requiere ADR-0012, que reemplaza la fila de ADR-0005 sobre subida de archivos | Fase 2 |
| P3 | Aprobación de textos nuevos: controles del carrusel, «Tipo de experiencia», texto del checkbox «Destacado» | Pendiente de responsable ⚠ | Fase 1 |
| P4 | Eventos vigentes para el destacado rotativo | Confirmado por el responsable (12-nov-2026): las fechas guardadas son reales y el Hackathon de Turismo Creativo I puede destacarse. Sin destacados vigentes, rotan la Copa y la Hackathon como históricos (decisión del 12-nov-2026). Cuando haya un destacado vigente, rota solo ese | Responsable (carga de datos) |
| P5 | Privacidad, términos y convivencia | Planificación preparada para revisión (13-nov-2026). Identificación de responsables pendiente; inventario y aprobación de textos requeridos antes de publicar. Ver enlaces al final | Plan nuevo, sin ejecutar |
| P6 | Órbita del símbolo del hero: los anillos giran sin botón de pausa (WCAG 2.2.2). Ya existía antes del destacado rotativo | Pendiente de decisión: pausa visible o límite de vueltas. Documentar en `docs/decisions` | Antes del cierre a `main` o después, según el responsable |
| P8 | El orden de la rejilla (`compareEventsBySchedule`) considera próximo solo si la fecha de inicio es futura, mientras `isUpcomingEvent` cuenta también los eventos en curso. Un evento en curso no destacado puede quedar después de los futuros, en la página 2 de la rejilla | Pendiente de decisión: unificar las dos definiciones de «vigente». Afecta el orden de /eventos también | Posterior |
| P9 | El JSON-LD ItemList de la home se llama «Eventos destacados C3» pero lista todo el catálogo (`apps/web/app/page.tsx`) | Pendiente: renombrar el ItemList o listar solo los destacados. Cambia el SEO, así que lo aprueba el responsable | Posterior |
| P7 | Dependabot: quitar `.github/dependabot.yml` y cerrar los PR `dependabot/*` abiertos (#3 a #12, excepto #9) | Decidido quitarlo (12-nov-2026); en pausa a petición del responsable. No incluido en el PR a `main` | Responsable |

## Planificación de contenido institucional (13-nov-2026)

Estos registros actualizan la postura de P1 y P5 sin declarar implementación terminada:

- **P1, eventos:** [spec](../superpowers/specs/2026-11-13-eventos-memorias-design.md) y [plan](../superpowers/plans/2026-11-13-eventos-memorias.md) preparados para revisión. Ficha por edición, admin estructurado, memoria/resultados dentro de la ficha y micrositios conservados. La nueva propuesta permite empezar sin biblioteca de fotos; P2 sigue independiente. Requiere aprobar spec, ADR de ampliación y contenido real antes de publicar.
- **P5, legal:** [spec](../superpowers/specs/2026-11-13-legal-convivencia-design.md) y [plan](../superpowers/plans/2026-11-13-legal-convivencia.md) preparados para revisión. C3 aún no es entidad legal; identificación de responsables pendiente. Preparación técnica posible; publicación condicionada a inventario y textos aprobados.
- **P10, Empieza en C3:** [spec](../superpowers/specs/2026-11-13-empieza-en-c3-design.md) y [plan](../superpowers/plans/2026-11-13-empieza-en-c3.md) preparados para revisión. Entrada principal por comunidad WhatsApp facilitada por responsable; FAQ conserva ruta y función de apoyo. Confirmar enlace y copy antes de publicar.
- Las demás propuestas quedan en [ideas futuras](../product/ideas-futuras-sitio-institucional.md); no son tareas aprobadas ni cambios pendientes de este rework.
