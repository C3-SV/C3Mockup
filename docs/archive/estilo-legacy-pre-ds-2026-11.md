> **ARCHIVADO el 2026-11-11.** Guía visual anterior, reemplazada por el DS de nov-2026 (ver `docs/design-system/README.md` y ADR-0001). No usar como fuente.

# Guía de estilo visual C3 para sitio web

## 1. Objetivo visual

El sitio principal de C3 debe sentirse como una plataforma institucional de talento técnico joven: moderna, técnica, seria, visualmente fuerte y con energía de comunidad.

No debe verse como una startup genérica, una landing de SaaS, una página gamer, ni una página de evento aislado.

La estética debe combinar:

- identidad institucional,
- tecnología,
- comunidad joven,
- excelencia técnica,
- eventos,
- creación,
- conexión con industria,
- visión regional.

El sitio debe sentirse como el hub principal de C3, no como una página secundaria.

---

## 2. Concepto visual central

C3 se comunica como un ecosistema integrado:

- Compite
- Crea
- Conecta

Estas tres líneas no son marcas separadas. Son módulos de una misma identidad.

Visualmente, el sitio debe representar eso usando:

- el logo de C3 como eje central,
- formas circulares derivadas del logo,
- nodos,
- líneas de conexión,
- cards modulares,
- colores por línea,
- fondos navy profundos,
- gradientes suaves,
- tipografía fuerte y limpia.

La idea visual es:

> C3 como un sistema donde el talento técnico joven puede competir, construir y conectarse con oportunidades reales.

---

## 3. Personalidad visual

La marca debe sentirse:

- institucional,
- moderna,
- técnica,
- clara,
- joven,
- sobria,
- confiable,
- ambiciosa,
- regional,
- de alto nivel.

Debe evitar:

- estética hacker cliché,
- neón excesivo,
- degradados exagerados,
- look gamer pesado,
- ilustraciones genéricas,
- cards blancas sin identidad,
- exceso de botones,
- saturación visual,
- interfaces demasiado corporativas o frías.

---

## 4. Paleta oficial

Usar únicamente la paleta C3 o variaciones muy cercanas.

### Colores principales

```css
--c3-navy: #0F203E;
--c3-blue: #205298;
--c3-purple: #4F5BA9;
--c3-turquoise: #33BEAC;
````

### Colores secundarios

```css
--c3-dark: #202A3F;
--c3-secondary-blue: #2C519B;
--c3-secondary-purple: #6D529E;
--c3-secondary-turquoise: #46B8A8;
```

### Uso por línea

```txt
Compite → azul
Crea → turquesa
Conecta → morado
```

### Reglas

* El navy debe dominar las secciones institucionales.
* El turquesa debe usarse como acento energético, no como fondo principal permanente.
* El morado debe usarse para conexión, comunidad, industria y oportunidades.
* El azul debe asociarse a competencia, técnica, estructura y rigor.
* Los colores de línea deben aparecer en tags, bordes, iconos, glows sutiles y elementos de navegación visual.
* Evitar colores externos a la marca.

---

## 5. Tipografía

Usar la familia tipográfica definida por la marca:

* Montserrat como tipografía principal.
* Poppins como tipografía secundaria.

### Jerarquía sugerida

#### H1

* Grande.
* Fuerte.
* Institucional.
* Alto impacto.
* Puede usar tracking ligeramente negativo.
* Debe sentirse como portada de deck o manifiesto.

Ejemplo:

```txt
C3 desarrolla talento técnico joven a través de competencia, creación y conexión.
```

#### H2

* Claro.
* Modular.
* Puede acompañarse con una pequeña línea, badge o acento de color.

Ejemplo:

```txt
Un ecosistema integrado
```

#### Eyebrows / badges

Usar mayúsculas, tracking amplio y tamaño pequeño.

Ejemplo:

```txt
PLATAFORMA INSTITUCIONAL DE TALENTO TÉCNICO JOVEN
```

#### Texto de cuerpo

* Legible.
* Espaciado.
* No demasiado pequeño.
* Evitar párrafos largos.

---

## 6. Uso del logo

El logo no debe desaparecer del sitio.

Debe aparecer en puntos clave:

1. Header.
2. Hero.
3. Sección Compite / Crea / Conecta.
4. CTA final.
5. Footer.

### Reglas

* No deformar.
* No rotar sin criterio.
* No cambiar la paleta.
* No aplicar texturas al logo.
* No contornear.
* No usar efectos fuertes encima del logo.
* Usar versiones oficiales o assets existentes.
* En fondos oscuros, preferir logo blanco o versión a color autorizada.
* En secciones del ecosistema, usar el símbolo o módulos de línea si están disponibles.

---

## 7. Elementos gráficos derivados del logo

El sistema visual debe usar elementos inspirados en el logo C3:

* círculos grandes,
* nodos,
* puntos,
* líneas de conexión,
* semicírculos,
* formas tipo “C”,
* estructuras orbitales,
* diagramas radiales,
* composiciones de red.

Estos elementos deben sentirse técnicos y limpios, no decorativos sin función.

### Buen uso

* Gran forma circular sutil en el fondo del hero.
* Nodos conectando secciones.
* C3 central con Compite, Crea y Conecta alrededor.
* Líneas suaves en fondos oscuros.
* Puntos de color representando las tres líneas.

### Mal uso

* Patrones demasiado cargados.
* Texturas pesadas.
* Figuras que compiten con el contenido.
* Decoración sin relación con la marca.

---

## 8. Dirección de fondos

### Fondos oscuros

Son la base principal de la marca.

Usar:

```css
background: #0F203E;
```

o combinaciones con:

```css
#202A3F
#205298
#4F5BA9
#33BEAC
```

Se recomienda usar:

* gradientes suaves,
* glows controlados,
* formas circulares grandes,
* nodos en baja opacidad,
* líneas finas.

Inspiración: portada de la PPT de relanzamiento, donde aparece un fondo navy con un gran símbolo circular C3 en baja opacidad, un glow turquesa/azul y composición institucional fuerte.

### Fondos claros

Se pueden usar para secciones de respiración, datos o cards, pero no deben sentirse genéricos.

Cuando se usen fondos claros:

* agregar bordes sutiles,
* acentos de línea,
* sombras suaves,
* estructura modular,
* nodos o formas muy suaves de fondo.

Evitar bloques blancos planos sin identidad.

---

## 9. Cards

Las cards son un componente central del sitio.

Deben verse:

* modulares,
* limpias,
* técnicas,
* institucionales,
* con buena jerarquía.

### Cards oscuras

Usar para:

* eventos destacados,
* líneas C3,
* próximos eventos,
* CTA final,
* bloques institucionales.

Características:

```txt
- fondo navy o dark
- borde sutil
- glow muy controlado
- radio amplio
- acento superior o lateral del color de línea
- tags pequeñas
- CTA clara
```

### Cards claras

Usar para:

* datos,
* audiencias,
* secciones informativas,
* resúmenes.

Características:

```txt
- fondo blanco o gris muy claro
- borde sutil
- sombra baja
- acento de color
- número/icono destacado
- texto breve
```

### Evitar

* cards blancas demasiado planas,
* cards sin color,
* cards sin icono o sin jerarquía,
* demasiados botones por card,
* sombras exageradas.

---

## 10. Sección Hero

El hero debe ser una portada institucional fuerte.

Debe incluir:

* logo C3,
* badge superior,
* H1 grande,
* subtítulo claro,
* máximo dos botones principales,
* un elemento visual fuerte derivado del logo,
* gradiente o fondo navy con profundidad.

### Estructura recomendada

```txt
Badge:
PLATAFORMA INSTITUCIONAL DE TALENTO TÉCNICO JOVEN

H1:
C3 desarrolla talento técnico joven a través de competencia, creación y conexión.

Texto:
Competitive Coding Club conecta programación competitiva, hackathons, comunidad e industria para abrir oportunidades reales a la próxima generación técnica de El Salvador y la región.

CTAs:
Explorar eventos
Ser aliado

Link secundario:
Conocer C3
```

### Visual

El hero puede usar:

* logo grande o mediano,
* símbolo C3 gigante en baja opacidad,
* nodos conectados,
* forma circular lateral,
* gradiente turquesa/azul/morado,
* composición tipo portada de deck.

### Reglas

* No usar cuatro botones.
* No eliminar el logo.
* No dejarlo como texto flotando sobre fondo vacío.
* No hacerlo parecer landing genérica.

---

## 11. Sección “Lo próximo en C3”

Debe ir inmediatamente después del hero.

Objetivo:

Mostrar que C3 está activo ahora.

Debe destacar dos iniciativas:

1. Copa Salvadoreña de Programación.
2. Hackathon de Turismo Creativo I.

### Estilo

* Dos cards grandes.
* Visualmente fuertes.
* Fondo oscuro o híbrido.
* Color de línea.
* Tag de estado.
* CTA.
* Enlace a subdominio.
* Icono o símbolo de línea.

### Card Copa

```txt
Línea: Compite
Estado: Inscripciones abiertas
Título: Copa Salvadoreña de Programación
Texto: La iniciativa principal de C3 para impulsar programación competitiva, pensamiento algorítmico y excelencia técnica en estudiantes de El Salvador.
CTA: Ir a la Copa
Link: https://copa.c3.com.sv
```

### Card Hackathon

```txt
Línea: Crea
Estado: Próximamente
Título: Hackathon de Turismo Creativo I
Texto: Una iniciativa enfocada en creación, colaboración, prototipos y solución de retos reales desde tecnología, turismo y cultura.
CTA: Ver hackathon
Link: https://hackathon.c3.com.sv
```

---

## 12. Sección de impacto

Los datos son importantes, pero deben sentirse integrados a la marca.

Datos:

```txt
+60 miembros de comunidad
+150 personas alcanzadas
+130 participantes en Copa 2025
5+ eventos organizados o apoyados
2024 fundación
```

### Dirección visual

* No usar cajas blancas aburridas.
* Usar números grandes.
* Agregar micro-acento de color.
* Usar layout compacto.
* Puede ir en fondo claro o navy.
* Debe sentirse como “proof of work”, no como tabla.

### Ejemplo de estilo

```txt
Impacto inicial
Datos actualizados a mayo de 2026
```

Con cards pequeñas:

```txt
+60
Miembros de comunidad

+150
Personas alcanzadas

+130
Participantes en Copa 2025
```

---

## 13. Sección Compite / Crea / Conecta

Esta es una sección clave y debe sentirse como el corazón del sitio.

No debe ser solo tres cards de texto.

Debe representar un sistema.

### Dirección principal

Inspirarse en la referencia visual donde C3 está al centro y las tres líneas orbitan alrededor.

Estructura:

```txt
Título:
Un ecosistema integrado

Subtítulo:
C3 no solo organiza eventos. Construimos un sistema donde el talento técnico joven puede crecer de forma progresiva.
```

Centro:

```txt
C3
```

Alrededor:

```txt
Compite
Programación competitiva y excelencia técnica.

Crea
Hackathons, software y proyectos reales.

Conecta
Comunidad, industria y oportunidades.
```

### Reglas

* Cada línea debe tener logo/símbolo.
* Cada línea debe usar color propio.
* Debe haber una relación visual entre ellas.
* El logo central debe reforzar que no son marcas separadas.
* Usar nodos, líneas o composición radial.

### Cards complementarias

Si se agregan cards debajo, deben seguir este contenido:

#### Compite

```txt
Desarrollamos el máximo potencial técnico a través de desafíos y competencias de clase mundial.

- Programación competitiva
- ICPC
- Copa Salvadoreña
- Entrenamientos
```

#### Crea

```txt
Convertimos conocimiento técnico en construcción: prototipos, software y soluciones para retos reales.

- Hackathons
- Builders
- Desarrollo de software
- Proyectos reales
```

#### Conecta

```txt
Construimos el puente entre talento emergente, comunidad, instituciones y oportunidades reales.

- Comunidad
- Industria
- Mentoría
- Alianzas
```

---

## 14. Sección de eventos

Los eventos deben verse como evidencia del ecosistema C3.

### Reglas de tags

Las tags de línea deben ser individuales:

Correcto:

```txt
Compite
Conecta
Apoyo institucional
```

Incorrecto:

```txt
Compite / Conecta
```

### Colores

```txt
Compite → azul
Crea → turquesa
Conecta → morado
```

### Estados

Los estados pueden ir como tags secundarias:

```txt
Inscripciones abiertas
Próximamente
Histórico
Apoyo institucional
```

### Card de evento

Cada card debe incluir:

* tags de línea,
* tags de estado,
* título,
* descripción,
* CTA,
* acento visual por línea,
* hover sutil,
* mejor jerarquía.

Eventos principales:

```txt
Copa Salvadoreña de Programación
Hackathon de Turismo Creativo I
ICPC Centroamérica · sede El Salvador
Hack@Latam · Fiesta El Salvador
Duelo de Programación C3 · Software Week ESEN 2025
```

---

## 15. Sección “Para quién es C3”

Debe tener solo tres públicos.

No usar “Medios y prensa” en esta sección principal.

### Título

```txt
C3 conecta a quienes quieren construir el ecosistema técnico joven
```

### Subtítulo

```txt
Desde estudiantes que quieren crecer, hasta instituciones y organizaciones que buscan acercarse al talento técnico emergente.
```

### Públicos

#### Personas

```txt
Para estudiantes, builders y talento técnico joven.

Participa en competencias, hackathons, comunidad y espacios de aprendizaje para desarrollar habilidades, construir proyectos y conectar con oportunidades reales.

CTA: Participar en C3
```

#### Instituciones educativas

```txt
Para colegios, universidades y programas formativos.

Colabora con C3 para llevar competencias, hackathons, charlas, talleres y experiencias técnicas a tus estudiantes.

CTA: Crear una alianza educativa
```

#### Empresas y organizaciones

```txt
Para empresas, startups, sponsors y aliados del ecosistema.

Apoya experiencias de alto impacto, conecta con talento joven y fortalece el ecosistema tecnológico desde El Salvador hacia la región.

CTA: Ser aliado
```

### Estilo

* Cards más editoriales.
* No usar cuatro cajas blancas genéricas.
* Usar iconos o números.
* Usar acento de color.
* Usar layout de 3 columnas.
* Incluir mini lista de beneficios si ayuda.

---

## 16. CTA final

Debe sentirse como cierre institucional fuerte.

### Copy

```txt
Construyamos la próxima generación técnica de la región.

C3 une competencia, creación y conexión para abrir más oportunidades al talento joven.
```

### Botones

```txt
Participar en C3
Ser aliado
```

### Link secundario

```txt
Contactar
```

### Visual

* Fondo navy.
* Logo C3.
* Gran forma circular en baja opacidad.
* Gradiente turquesa/morado.
* Nodos o líneas.
* Headline grande.
* No parecer una card cualquiera.

---

## 17. Estilo de composición tomado de la PPT

La PPT de relanzamiento tiene una estética que sí debe influir en el sitio.

Elementos a replicar:

* portadas oscuras con navy profundo,
* logo C3 visible,
* formas circulares gigantes en baja opacidad,
* acentos turquesa,
* cards oscuras con borde sutil,
* fotografías dentro de marcos redondeados,
* layouts asimétricos,
* bloques tipo roadmap,
* diagramas con líneas y nodos,
* textos grandes y contundentes,
* aire visual amplio,
* sensación de presentación institucional ejecutiva.

No copiar literalmente las diapositivas, pero sí tomar su dirección visual.

---

## 18. Estilo de composición tomado de las referencias web

Las imágenes de referencia del sitio muestran buenas ideas que deben mantenerse:

### Ecosistema integrado

Usar el formato de C3 al centro con Compite, Crea y Conecta alrededor.

### Cards de líneas

Usar cards oscuras con:

* logo de línea,
* color superior,
* bullets,
* copy fuerte,
* estructura clara.

### Cards de eventos

Usar grid de cards con buena separación, pero mejorar tags y acentos.

### Roadmap / dirección

La sección tipo “Hacia dónde vamos” funciona como inspiración para futuros bloques de impacto o trayectoria.

### Cierre institucional

El cierre con logo, frase grande y las tres líneas en color funciona bien como referencia para el CTA final.

---

## 19. Botones

### Regla general

No saturar de botones.

### Hero

Máximo:

```txt
2 botones + 1 link secundario
```

### Cards

Máximo:

```txt
1 CTA por card
```

### CTA final

Máximo:

```txt
2 botones + 1 link secundario
```

### Estilos

Primary:

```txt
fondo turquesa o azul
texto claro u oscuro según contraste
radio pill
```

Secondary:

```txt
borde sutil
fondo transparente
texto blanco o navy
```

Text link:

```txt
sin caja
con underline o flecha
```

---

## 20. Tags

Las tags deben ser consistentes.

### Línea

```txt
Compite
Crea
Conecta
```

Nunca combinar tags de línea en una sola.

### Estado

```txt
Inscripciones abiertas
Próximamente
Histórico
Apoyo institucional
Activo
```

### Estilo

* pequeñas,
* uppercase o semibold,
* tracking leve,
* color por categoría,
* borde redondeado.

---

## 21. Responsive

El sitio debe verse bien en móvil.

### Reglas

* Hero no debe quedar demasiado alto sin contenido visual útil.
* Cards deben apilarse correctamente.
* Diagramas radiales deben convertirse en layout vertical en mobile.
* Botones deben mantener buena separación.
* No usar textos gigantes que rompan.
* No depender de hover para entender acciones.
* Mantener buen contraste.

---

## 22. Accesibilidad visual

* Mantener contraste suficiente.
* No usar texto turquesa muy pequeño sobre navy si pierde legibilidad.
* Agregar alt text a logos e imágenes.
* Usar headings en orden.
* Los botones deben tener labels claros.
* No usar color como único indicador.
* Las tags deben ser legibles.

---

## 23. Qué evitar

Evitar:

* eliminar logos de las líneas,
* usar cards genéricas,
* usar demasiados botones,
* usar secciones blancas planas,
* mezclar tags de línea,
* inventar colores fuera de la marca,
* convertir el home en página de evento,
* hacer que Copa o Hackathon dominen toda la identidad,
* copiar estilo gamer del Hackathon al sitio principal,
* usar prensa como público principal en Home,
* usar gráficos sin relación con el logo C3,
* rediseñar todo sin respetar lo existente.

---

## 24. Principio final

El sitio debe sentirse como:

> Una plataforma seria, joven y técnica que articula competencia, creación y conexión para desarrollar la próxima generación técnica de la región.

La Home debe comunicar tres cosas rápidamente:

1. Qué es C3.
2. Qué está haciendo ahora.
3. Cómo una persona, institución o empresa puede participar.

El diseño debe hacer que C3 se vea más sólido, no más complicado.
