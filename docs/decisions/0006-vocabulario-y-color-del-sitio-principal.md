# 0006 · Vocabulario y color de acción del sitio principal
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
El DS recibido nació del demo de **C3 Challenges**, una plataforma de retos empresariales que aún no ha salido. Su terminología («challenge», «Proponer un challenge», cuentas, paquetes) y la regla «la acción es la variante de su producto» responden a esa plataforma. c3.com.sv es el sitio principal de toda C3.

## Decisión
1. **Color de acción:** se mantiene el violeta `#6548c7` (`--c3-accion`) para botón primario, enlace y foco en todo el sitio. Es una decisión del sitio principal, no una consecuencia de la regla por producto. El azul sigue siendo de Compite.
2. **Vocabulario:** la unidad de contenido son **eventos** y **experiencias**, organizados por **áreas** (Compite, Crea, Conecta). «Challenge» no se usa como término de interfaz; cuando existan, los challenges serán un tipo de experiencia. No se anuncia C3 Challenges.
3. **CTAs:** «Explorar challenges» → «Ver eventos» / «Explorar experiencias»; «Proponer un challenge» → «Contactar»; «Ver challenge» → «Ver evento» / «Ver experiencia».
4. **Sin cuentas:** no hay «Iniciar sesión», «Crear cuenta», «Tu cuenta» ni menú de cuenta. Cabecera y pie los omiten.
5. **Sin DEMO.** El sitio es real: los eventos son reales y nunca llevan etiqueta DEMO (el badge del DS no se usa). Nada se anuncia como disponible si no existe.
7. **El contenido existente se conserva** (decisión del responsable, 2026-11-11): el rework es visual. Se mantienen titulares, textos, eyebrow, eventos, SEO y rutas; solo se ajusta el voseo a «tú». Los textos de referencia del DS son estructura, no copy.
8. **Logo:** el logo C3 **completo** que el sitio ya usa. No se adopta `c3-sim-azul.png` ni el logo simple del paquete en cabecera y pie. El símbolo `c3-symbol.png` solo se usa en la órbita del hero. **Superado el 2026-11-11:** la cabecera usa `c3-sim-azul.png` (logo completo oscuro); el logo claro se veía casi blanco sobre el fondo blanco. Ver el registro de la Fase 2.
9. **Limpieza:** se borra todo lo que el DS deja sin uso (componentes, estilos, assets, archivos temporales) para dejar el código más limpio.
6. **Precios y paquetes comerciales:** no se publican.
- **Nombre técnico del tipo de experiencia «reto» (2026-11-11).** El tipo que el DS llama `challenge` se llama `reto` en el código y en `experienceKinds` (`packages/config`). El término no aparece en la interfaz.

## Consecuencias
- Se adaptan los textos de referencia del DS (§8, §10) antes de portarlos; el spec lista cada reemplazo.
- La regla 4 del DS (§2) se lee aquí como «acción violeta común»; las variantes de acción por línea siguen sin definirse y no hacen falta (pendiente 3 del DS no aplica).
- Si C3 Challenges se lanza, este ADR se revisa.
