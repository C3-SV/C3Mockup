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
