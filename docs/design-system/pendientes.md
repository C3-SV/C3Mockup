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

## Preguntas abiertas para el responsable ⚠

1. ¿Se puede conseguir el manual de marca y capturas de referencia del sistema aplicado?
2. ¿Confirma la propuesta para la burbuja de la órbita en móvil?
3. ¿Se publicarán paquetes o precios en el sitio? (Hoy: no.)

## Pendientes de producto y contenido (fuera del DS)

| # | Asunto | Postura | Cierra en |
| --- | --- | --- | --- |
| P1 | Página por evento con slug (`/eventos/{slug}`), redirecciones, metadatos y Open Graph por evento | Pendiente, posterior a las fotos. Requiere ADR (ADR-0003) y contenido por evento. Ver spec `docs/superpowers/specs/2026-11-12-destacado-rotativo-eventos-design.md` §9 | Fase 3 |
| P2 | Sistema de fotos y biblioteca de assets en el admin: subida, recorte 16:9, texto alternativo, derechos, almacenamiento | Planeado en el mismo spec §8. Requiere ADR-0012, que reemplaza la fila de ADR-0005 sobre subida de archivos | Fase 2 |
| P3 | Aprobación de textos nuevos: controles del carrusel, «Tipo de experiencia», texto del checkbox «Destacado» | Pendiente de responsable ⚠ | Fase 1 |
| P4 | Eventos vigentes para el destacado rotativo | Confirmado por el responsable (12-nov-2026): las fechas guardadas son reales y el Hackathon de Turismo Creativo I puede destacarse. Sin destacados vigentes, rotan la Copa y la Hackathon como históricos (decisión del 12-nov-2026). Cuando haya un destacado vigente, rota solo ese | Responsable (carga de datos) |
| P5 | Política de privacidad y términos básicos | Aplazado; está en el plan de rework | Iteración posterior |
| P6 | Órbita del símbolo del hero: los anillos giran sin botón de pausa (WCAG 2.2.2). Ya existía antes del destacado rotativo | Pendiente de decisión: pausa visible o límite de vueltas. Documentar en `docs/decisions` | Antes del cierre a `main` o después, según el responsable |
| P8 | El orden de la rejilla (`compareEventsBySchedule`) considera próximo solo si la fecha de inicio es futura, mientras `isUpcomingEvent` cuenta también los eventos en curso. Un evento en curso no destacado puede quedar después de los futuros, en la página 2 de la rejilla | Pendiente de decisión: unificar las dos definiciones de «vigente». Afecta el orden de /eventos también | Posterior |
| P9 | El JSON-LD ItemList de la home se llama «Eventos destacados C3» pero lista todo el catálogo (`apps/web/app/page.tsx`) | Pendiente: renombrar el ItemList o listar solo los destacados. Cambia el SEO, así que lo aprueba el responsable | Posterior |
| P7 | Dependabot: quitar `.github/dependabot.yml` y cerrar los PR `dependabot/*` abiertos (#3 a #12, excepto #9) | Decidido quitarlo (12-nov-2026); en pausa a petición del responsable. No incluido en el PR a `main` | Responsable |
