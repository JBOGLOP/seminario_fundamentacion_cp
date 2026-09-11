# CLAUDE.md — Construcción de material didáctico a partir de leyes y resoluciones

> Instrucciones para Claude Code (y para cualquier persona) que construya fichas normativas
> didácticas en este repositorio.
> **Curso:** Maestría en Cuidados Paliativos · Universidad Antonio Nariño · Facultad de Enfermería
> **Docente:** Jorge Wilhem Bogoya López · jbogoya63@uan.edu.co
> **Creado:** 11 de septiembre de 2026 · Complementa el `CLAUDE.md` y el `HANDOFF.md` de la raíz del repositorio y el registro
> `docs/INVESTIGACION-TEMA3-marco-legal-barreras.md`. **Si una regla de aquí contradice la raíz,
> prevalece la raíz.**

---

## 0. Antes de escribir una sola línea

1. Leer `HANDOFF.md` (estado del curso) y `docs/INVESTIGACION-TEMA3-marco-legal-barreras.md`
   (verificaciones y correcciones vigentes).
2. Confirmar con el docente **tres decisiones** antes de construir: alcance (una página por norma o una
   integrada), elementos didácticos (modo docente, autoevaluación, actividad, anexo de verificación) y
   ubicación en el curso (sesión específica o material autónomo de consulta).
3. **Investigar primero, construir después.** No abrir plantillas ni escribir HTML hasta tener
   verificado el contenido sustantivo. El orden inverso ancla el trabajo en la maquetación y produce
   material bonito con datos falsos.

---

## 1. Verificación de fuentes: la regla que no se negocia

La verificación de fuentes no es control de calidad: **es contenido de la clase**. El curso ya
institucionalizó correcciones porque el material anterior reprodujo datos falsos de segunda mano.

### 1.1 Jerarquía de fuentes

| Nivel | Fuente | Uso |
|---|---|---|
| 1 | Diario Oficial; PDF oficial en `minsalud.gov.co/sites/rid/...` | Texto y fecha de expedición |
| 2 | Gestor Normativo (Función Pública), SUIN-Juriscol | Texto consolidado y notas de vigencia |
| 3 | Normogramas institucionales (SuperSalud, ICBF, Cancillería) | Notas de vigencia, derogatorias, modificaciones |
| 4 | Literatura académica indexada con DOI | Datos epidemiológicos y de cobertura |
| 5 | Divulgación profesional (blogs de software médico, consultoras) | **Solo** como pista para buscar la fuente primaria. Nunca se cita |

Prensa, presentaciones en SlideShare, Studocu, Scribd y resúmenes comerciales **no son fuente**.

### 1.2 Reglas duras

- Ningún número, fecha, artículo o porcentaje entra al material sin haber sido visto en fuente de
  nivel 1 a 4. Si no se pudo verificar, **no se escribe** o se marca explícitamente como pendiente.
- Prohibido inventar numerales de artículos, epígrafes o cifras «plausibles». Un artículo mal numerado
  destruye la credibilidad de toda la ficha.
- Si una fuente y otra discrepan (día del auto, año de publicación, cifra), **se cita la discrepancia**
  y se usa la formulación más conservadora («octubre de 2025», no «21 de octubre»).
- Toda afirmación que no pudo verificarse va en un bloque `.note` con el encabezado
  **«Pendiente de verificación literal»**, indicando qué se buscó y por qué no fue posible.
- Al final de cada ficha, sección **«Fuentes de esta ficha»** con enlaces a las fuentes de nivel 1-4.

### 1.3 Accesos que ya se probaron (ahorra tiempo)

- ✅ Accesibles: `minsalud.gov.co/sites/rid/...` (PDF), `funcionpublica.gov.co/eva/gestornormativo/`,
  `normograma.supersalud.gov.co`, `cancilleria.gov.co/sites/default/files/Normograma/`,
  `revcolanest.com.co`, `cijuf.org.co`, `jboglop.github.io`.
- ❌ Bloqueados por robots o error: `secretariasenado.gov.co`, `suin-juriscol.gov.co`,
  `alcaldiabogota.gov.co`, `scielo.org.co`, `icbf.gov.co` (compilación), `raw.githubusercontent.com`.
- Los anexos técnicos muy extensos (p. ej. los de la Resolución 3280, >800 pp.) no permiten búsqueda
  literal en línea: afirmar solo lo verificado sobre el cuerpo resolutivo y marcar el resto.

### 1.4 Correcciones ya institucionalizadas (no reproducir los errores)

- «Resolución CD58.R22» **no existe**: el instrumento es CD52.R9 (2013).
- La OPS **no tiene** resolución autónoma de cuidados paliativos.
- **No existe** una RIAS autónoma de cuidados paliativos (Res. 3202 de 2016: integración transversal).
- Colombia: **627 servicios; 1,18 por 100.000** (Atlas 2025). Los 79 servicios son de Uruguay.
- Cobertura poblacional: **41 % nacional, 79 % Bogotá, 29 % Orinoquía, 18 % Amazonía**
  (Sánchez-Cárdenas et al., 2024, *BMC Public Health*, 24, 1659).
- Opioides: **Bogotá 24,83 mg vs. Amazonía 0,46 mg** equivalentes de morfina (OCCP 4.ª ed., 2021,
  datos JIFE 2019). La presentación de la sesión 3 usa el **Reporte Técnico 2024** (Bogotá 18,12
  frente a Amazonas 0,19). Son ediciones distintas: toda cifra declara de qué edición sale.
- «El 70 % muere sin cuidados paliativos» **no es verificable**: no usar.
- El marco OMS de 6 dominios es de **2021** y no se llama «Global Palliative Care Framework».
- El IDC-Pal es de la **Junta de Andalucía (2014)**, no de SECPAL.

---

## 2. El protocolo de lectura normativa (cuatro pasos)

Toda ficha se construye con la misma secuencia. Es también lo que se exige a los estudiantes.

1. **Identificar** — tipo de norma, fecha exacta, título completo literal, número de artículos, anexos,
   vigencia, derogatorias expresas y cadena de modificaciones posteriores hasta la fecha de hoy.
2. **Descomponer** — artículo por artículo, separando definiciones, derechos, obligaciones y cierre.
   La arquitectura del articulado anticipa el desenlace de la norma.
3. **Interrogar** — para cada obligación: *¿a quién obliga? ¿quién lo mide? ¿qué pasa si no se cumple?*
   Una obligación sin indicador y sin consecuencia es una declaración, no una obligación.
4. **Contrastar** — norma frente a dato territorial verificado. La distancia entre lo que la norma dice
   y lo que el territorio muestra **es** el contenido de la clase.

### 2.1 Rejilla de cinco dimensiones

Aplicar a cada instrumento y presentarla en tabla: **población objetivo · fuerza jurídica ·
financiación · indicador verificable · brecha territorial**. Es la rejilla del Tema 2 y da continuidad
entre bloques del curso.

### 2.2 Tesis rectora

Cada ficha necesita **una** frase rectora, marcada con `.thesis`, que sintetice el hallazgo analítico.
No es un resumen: es lo que el estudiante debe poder repetir una semana después.

---

## 3. Estructura estándar de una ficha normativa

Siete pestañas. Adaptar los nombres, conservar la progresión (de lo general a lo operativo, y de lo
operativo a la crítica).

| # | Pestaña | Contenido |
|---|---|---|
| 1 | Panorama | Qué crea / qué no crea la norma, ficha de identificación, estado de vigencia |
| 2 | Articulado | Artículo por artículo, con `.art` y su epígrafe |
| 3 | Núcleo sustantivo | Lo que distingue a esta norma (derechos, definiciones, procedimiento) |
| 4 | Obligaciones | Tabla obligado / obligación / indicador / consecuencia |
| 5 | Trayectoria | Línea de tiempo de reglamentación, modificaciones y jurisprudencia |
| 6 | Norma vs. realidad | Datos territoriales verificados; dato que no debe usarse |
| 7 | Uso en la práctica | Historia clínica, reclamación, preguntas guía, fuentes |

Reglas de redacción:

- Español académico, APA 7, registro de posgrado. Frases cortas. Sin adjetivación entusiasta.
- Distinguir siempre **texto literal** (entre comillas angulares « ») de **paráfrasis**. Encabezar las
  pestañas de articulado con la advertencia: *«Síntesis fiel del contenido normativo… verificar contra
  el texto oficial antes de citar en un documento formal.»*
- Nada de emojis. Los `chips` de estado (vigente, derogado, suspendido, pendiente) hacen ese trabajo.
- No moralizar. El material muestra la brecha con datos y deja la conclusión al estudiante.

---

## 4. Modo docente

- Todo contenido reservado va en `<div class="docente">…</div>`, oculto por defecto.
- Se activa con `?docente=true` (o `?docente=1`) en la URL o con <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>;
  el estado se guarda en `sessionStorage` dentro de `try/catch`.
- **Qué va en modo docente:** secuencia de la sesión con minutaje, respuestas esperadas, errores
  previsibles de los estudiantes, ganchos metacognitivos, elementos reservados del curso
  (convergencia normativa 2013-2014; gancho Bonilla Sierra), verificaciones pendientes para el docente.
- **Qué NO va en modo docente:** claves de examen, contraseñas, calificaciones, datos personales de
  estudiantes. Si el material tiene evaluación, la clave vive en repositorio privado o en el servidor,
  nunca en el JS de una página pública.

---

## 5. Plantilla técnica

- **HTML5 autocontenido**, un archivo por ficha. Sin build, sin dependencias JS externas.
- Tipografías: **fuentes del sistema**. Nunca Google Fonts ni ningún recurso que se cargue de
  internet: la regla 1 del repositorio exige que cada página abra sin conexión. Las variables
  `--serif` y `--sans` conservan Source Serif 4 y DM Sans solo como preferencia, si están instaladas.
- Paleta por variables CSS en `:root`, con acento por norma (`--ley` azul para leyes, `--res` verde
  para resoluciones, `--doc` violeta para el modo docente, `--warn` y `--alert` para notas y
  correcciones). Tema claro/oscuro mediante `data-theme` en `<html>`.
  **Pendiente:** armonizar con la paleta por unidad del seminario (en la raíz, la Unidad 1 es
  `bosque`). Mientras no se haga, esta es una excepción declarada, no un descuido.
- **Sin JavaScript se ven todos los paneles**: un `<noscript>` muestra `.panel[hidden]` y oculta
  `.tabs`. Una ficha que se queda en blanco sin script no cumple la regla 1.
- Componentes disponibles: `.chip`, `.stat`, `.card`, `.art`, `.note`, `.crit`, `.thesis`,
  `blockquote`, `.tl` (línea de tiempo), `.tablewrap > table`, `details`, `.docente`, `.srcs`.
- **Responsive obligatorio**: se revisa a 400 px de ancho. Las tablas siempre dentro de `.tablewrap`
  con `overflow-x:auto`; el cuerpo de la página nunca desplaza en horizontal.
- **Imprimible**: en `@media print` se ocultan barra y pestañas y se muestran todos los paneles.
- Navegación por pestañas con `aria-selected`, panel por `id="p-<slug>"`, sincronizada con el hash de
  la URL para poder enlazar una pestaña concreta.
- El generador `build/common.py` que describía la versión original **no existe en este
  repositorio**: las fichas se editan directamente en su HTML.

---

## 6. Convenciones del repositorio

```
sesiones/s03-marco-legal-barreras/
  clase.html · clase_s02_s03.html      # presentaciones que enlazan las fichas
  leyes_construir/                     # la biblioteca de normas
    index.html                         # índice del módulo
    <norma-slug>.html                  # p. ej. ley-1733-2014.html
    CLAUDE.md                          # este archivo
  ref/                                 # PDF oficiales · ignorado por git, no se publica
```

- Nombres de archivo en minúscula, sin tildes, separados por guion: `ley-1733-2014.html`,
  `resolucion-3280-2018.html`.
- Ramas: `clase/NN-tema`, `norma/<slug>`, `fix/descripcion`. Commits en español y en presente:
  «Agrega ficha de la Resolución 3280 de 2018».
- Publicación en GitHub Pages: `main` / root. Enlaces internos siempre **relativos**.
- Los PDF oficiales pesados no se versionan en el repositorio: se enlaza la URL oficial.

---

## 7. Lista de verificación antes de publicar

- [ ] Fecha, título completo y número de artículos verificados en fuente de nivel 1 o 2.
- [ ] Derogatorias expresas y cadena de modificaciones revisadas **hasta la fecha de hoy**.
- [ ] Cada cifra tiene fuente citada con año; ninguna procede de divulgación secundaria.
- [ ] Ninguna de las correcciones del punto 1.4 fue reintroducida.
- [ ] Lo no verificable está marcado como tal, no omitido en silencio.
- [ ] Texto literal entre comillas angulares; el resto declarado como paráfrasis.
- [ ] Una sola frase rectora (`.thesis`) por ficha.
- [ ] Rejilla de cinco dimensiones presente.
- [ ] Preguntas guía redactadas sobre la práctica del estudiante, no sobre el texto de la norma.
- [ ] Modo docente oculto por defecto; sin claves ni datos personales.
- [ ] Sección «Fuentes de esta ficha» con enlaces funcionales.
- [ ] Revisado a 400 px; tablas con desplazamiento propio; impresión correcta.
- [ ] Tema claro y oscuro legibles; enlaces internos relativos y vivos.
- [ ] Pie con institución, curso, docente y fecha de actualización.

---

## 8. Política de IA en el material

El curso trata la declaración transparente de uso de IA como criterio evaluativo positivo. El material
producido con asistencia de Claude lo declara en el pie: *«Elaborado con asistencia de Claude
(Anthropic) sobre fuentes primarias verificadas el <fecha>»*. La misma exigencia aplica a las entregas
de los estudiantes: sección metodológica de declaración obligatoria.

---

*Mantener actualizado. Si una regla de este archivo se rompe en una ficha, se corrige la ficha o se
corrige la regla —pero nunca se deja la contradicción sin resolver.*
