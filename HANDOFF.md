# HANDOFF — Seminario de fundamentación en cuidados paliativos

> **Qué es este documento.** El punto de entrada del proyecto. Si alguien —usted dentro de tres
> meses, un colega, o un agente de IA— abre esta carpeta sin contexto, esto es lo que tiene que
> leer primero.
>
> **Asignatura:** Seminario de fundamentación en cuidados paliativos · Código **32264001** ·
> Plan **3660** · **3 créditos**
> **Programa:** Maestría en Cuidados Paliativos · Facultad de Enfermería · Universidad Antonio Nariño
> **Docente:** Jorge Wilhem Bogoya López · jbogoya63@uan.edu.co
> **Semestre:** 2026-II · arranca el **21 de agosto de 2026**
> **Repositorio:** https://github.com/JBOGLOP/seminario_fundamentacion_cp
> **Actualizado:** 15 de agosto de 2026

---

## 1. De dónde viene esta asignatura

La dirección de la maestría fusionó dos asignaturas de 2026-I y les añadió bioética:

| Asignatura de origen | Código | Qué aporta |
|---|---|---|
| Contexto Histórico y Legal de los CP | 37542001 | **La Unidad 1 entera.** 8 sesiones ya construidas |
| Investigación en Cuidados Paliativos | 37543011 | **Cantera** de piezas para U2 y U3 |
| *(Bioética)* | — | No existía. Se construye |

Las dos anteriores están reorganizadas, publicadas y verificadas. **Este proyecto no parte de
cero: parte de dos cursos terminados.**

- https://jboglop.github.io/Contexto_Historico_Legal_CP/
- https://jboglop.github.io/Investigacion_CP/

---

## 2. Lo que hay que entender antes de tocar nada

### 2.1 El programa no es una fusión a partes iguales

Sus tres unidades son:

1. **Contexto histórico-filosófico y lineamientos sociopolíticos** → *es Contexto Histórico, entera*
2. **Modelos de atención desde la investigación** → contenido nuevo
3. **Aspectos bioéticos y experiencias de manejo integral** → contenido nuevo

**«Desde la investigación» es un ángulo, no un contenido.** En las tres unidades no aparece un
solo tema de metodología: ni diseños de estudio, ni niveles de evidencia, ni búsqueda
sistemática. La asignatura de Investigación no se fusionó al 50 %: se disolvió en un adverbio.

Y sin embargo el programa **evalúa competencia investigativa**. Ese hueco se tapa con las piezas
metodológicas de la asignatura anterior, insertadas como herramienta transversal. Ver
[`docs/CRUCE-FUSION.md`](docs/CRUCE-FUSION.md).

### 2.2 El hilo del seminario

Las dos asignaturas fusionadas traían cada una su pregunta de fondo, y resultan ser **la misma
desde dos lados**:

> *Contexto Histórico:* ¿por qué un instrumento vinculante no cierra la brecha territorial?
> *Investigación:* ¿por qué la evidencia global existe y la colombiana está por construirse?

**Hay norma y no hay datos.**

Ese es el hilo, y sale gratis de la fusión. Da al seminario una columna vertebral que el
contenido programático no le da, y convierte cada unidad en un tramo del mismo argumento:
U1 establece que la norma existe, U2 enseña a leer la evidencia que falta, U3 se ocupa de lo
que hay que decidir cuando ni la norma ni la evidencia alcanzan.

### 2.3 Siete sesiones, no doce

| Fuente | Encuentros | Por qué |
|---|---|---|
| `docs/PLAN_MIGRACION_U1.md` (julio) | 12 | Estimado antes de tener el calendario |
| Calendario oficial, contando fechas | 8 | Descontando inducción y encuentro de tesis |
| Calendario oficial, **franja de los viernes** | **7** | El encuentro del 8 de agosto cae en sábado |

Detalle completo en [`docs/PROGRAMADOR-2026-II.md`](docs/PROGRAMADOR-2026-II.md).

---

## 3. Estado actual

### Hecho

- Auditoría de las dos asignaturas de origen (sus `INVENTARIO.md`, en sus carpetas)
- Diseño pedagógico de las tres unidades (`docs/PLAN_MIGRACION_U1.md`, `DISENO_UNIDAD_2.md`, `DISENO_UNIDAD_3.md`)
- Cruce de la fusión: qué pieza va de dónde a dónde
- Programador contra el calendario oficial
- Andamiaje técnico completo, heredado y probado
- **Esqueleto del sitio** (15 ago): portada, las siete carpetas de sesión y el generador. Ver §3.1

### 3.1 · El esqueleto, construido el 15 de agosto

El sitio ya tiene forma completa aunque no tenga contenido. Se hizo en este orden a propósito
—carpetas definitivas primero, portada después— porque en Fisiopatología rehacer los enlaces tras
renombrar carpetas costó una tarde.

| Pieza | Qué es |
|---|---|
| `index.html` | Portada del seminario. **Sin ella Pages servía el `README.md`**, que es otra cosa |
| `sesiones/_sesiones.json` | **Lista canónica** de las siete sesiones. Único sitio donde viven |
| `sesiones/sNN-slug/` × 7 | Ficha pública (`index.html`) + nota de trabajo (`README.md`) |
| `_shared/plantilla-sesion.html` | El molde del que nacen todas las fichas |
| `scripts/nueva-sesion.js` | Crea las carpetas que falten. **Nunca sobrescribe** |
| `scripts/verificar.js` §5 | Comprobación nueva: portada ↔ manifiesto |
| `CLAUDE.md` | Las reglas en versión ejecutable. `tokens.css` ya lo citaba y no existía |

**Dos decisiones dentro de esto:**

*Las carpetas se llaman por contenido, no por fecha* (`s03-marco-legal-barreras`, no `s03-18-sep`).
Si la dirección confirma que el 8 de agosto es sesión (§7.1), cambian fechas y numeración pero no
rutas, y ningún enlace compartido se rompe.

*Las siete fichas se publican vacías, diciendo «en preparación».* El recorrido del seminario se ve
completo desde el primer día, y no hay ningún enlace muerto: el estado se dice, no se finge.

*La lista de sesiones estaba en tres sitios en los cursos anteriores* —programador, portada y
disco— y los tres se separaron sin que nada avisara. Ahora está en uno y la comprobación 5 falla
si la portada no lo respeta.

### Falta

| Qué | Detalle |
|---|---|
| **Condensar U1** | Sesión 1 ✅ hecha (clases 1+2 → 3 h). Faltan las sesiones 2 y 3 |
| **Construir U2** | 2 sesiones, con 7 piezas de la cantera |
| **Construir U3** | 2 sesiones. La bioética es lo único de cero |
| **Bibliografía** | Resuelto a medias: **sí hay** bibliografía oficial, pero es la de Epidemiología. Ver `docs/PROGRAMADOR-2026-II.md` §6.1 |
| **Rúbricas** | La columna «Método de evaluación» del contenido programático está vacía en los tres cortes |
| **Confirmar con la dirección** | Ver §7 |

---

## 4. Cómo se trabaja aquí

### 4.1 Reglas innegociables

Vienen de dos cursos y funcionaron. No son preferencias estéticas.

**1 · Portabilidad sin conexión.** Cada HTML abre con doble clic, sin servidor y sin internet.
Sin Google Fonts, sin librerías desde CDN, sin `<iframe>`. Parte de los estudiantes ejerce en
municipios donde la conectividad no se da por supuesta; esta regla existe por ellos, no por
elegancia técnica.

> Los `<a href="https://…">` sí se conservan: son enlaces, no recursos que se carguen.
> Incrustar una librería **no viola la portabilidad: la cumple.**

**2 · Sin datos de estudiantes.** El repositorio es público e indexable. No entra ningún nombre,
código ni calificación. Los casos territoriales van generalizados: describen un patrón, no a una
persona.

**3 · No se designa a nadie por su pronóstico.** «persona con enfermedad avanzada», no «paciente
terminal». **Excepción:** las citas literales de normas y jurisprudencia, donde cambiar la
palabra alteraría la cita.

**4 · Material de terceros: se cita, no se reproduce.** Libros, manuales y atlas se referencian
en APA 7 con DOI. Las normas y sentencias son públicas y sí se incluyen.

**5 · Los secretos nunca en el HTML.** Contraseñas, claves de respuesta y URL de Apps Script van
en `config.js`, que está en `.gitignore`. Ver `config.example.js`.

### 4.2 Antes de cada commit

```bash
node scripts/verificar.js
```

Cinco comprobaciones: enlaces rotos · recursos externos · rastros de datos personales · lenguaje
del curso · coherencia entre la portada y `sesiones/_sesiones.json`. Distingue una infracción de
una cita normativa, y un dato duro de una mención.

Para añadir una sesión: se anota en `sesiones/_sesiones.json`, se ejecuta
`node scripts/nueva-sesion.js` y se añade al cronograma de `index.html`. La comprobación 5 falla
hasta que lo último se haga.

**Lo que no comprueba: que la página se vea bien.** Eso no tiene sustituto — hay que abrirla en
el navegador **con el wifi apagado**, revisar que la consola no dé errores, navegar con el
teclado y comprobar que se lee a 375 px de ancho.

### 4.3 El sistema de diseño

`_shared/tokens.css` es **fuente canónica, no enlace**: por la regla de portabilidad se copia en
línea dentro del `<style>` de cada página. Si cambia un valor ahí, hay que propagarlo.

El color significa algo, no decora:

| Unidad | Acento |
|---|---|
| U1 · Contexto histórico | salvia |
| U2 · Modelos de atención | ámbar |
| U3 · Bioética y manejo integral | terracota |
| Transversal (avisos, evaluación) | arena |

La paleta es cálida y sobria a propósito: **la asignatura habla de personas que mueren.**

### 4.4 Ramas

Cada sesión toca `index.html` para marcarse como publicada. Si las ramas salen en paralelo de
`main`, todas chocan al fusionar. **Se apilan**: cada una sale de la anterior y se fusionan en
el mismo orden.

---

## 5. Lo que costó caro en los dos cursos anteriores

Esto es el valor real de este documento. Cada punto costó horas.

### 5.1 Audite antes de planificar

En Epidemiología el traspaso decía que las sesiones 1 a 5 no existían. La auditoría encontró
material dictado de cuatro de ellas. En Contexto Histórico, el «plan de 12 encuentros» resultó
ser de 7 al contrarlo contra el calendario.

**Cuando el plan escrito choque con el disco, gana el disco.**

### 5.2 Los datos personales están escondidos donde parecen no estar

No basta con mirar los nombres de archivo:

- Una guía de evaluación con aspecto publicable llevaba dentro los 12 nombres completos
- Cuatro fichas de grupo llevaban **nombre y código estudiantil** de cada integrante
- Un HTML docente interpelaba por nombre a estudiantes, **con su municipio y su empleador**
- Una transcripción de clase de 123 minutos con cada intervención atribuida

**Busque dentro del contenido, no solo en los títulos.**

### 5.3 El sufijo del archivo miente

Comprobado tres veces en un solo curso:

| Caso | Lo que sugería | Lo que decía la fecha |
|---|---|---|
| `actividad_grupal.html` vs `_v3` | `_v3` es posterior | El sin sufijo era 44 min **posterior** |
| `files_v2/` vs la raíz | `_v2` es la buena | 5 h más nueva y **2 KB menor** |
| `..._v5_merged.html` | fusión de versiones | **Duplicado exacto**, sin fusión |

**Fíese de la fecha y del hash, nunca del nombre.**

### 5.4 Un detector que grita siempre enseña a ignorarlo

El verificador dio falsos positivos cinco veces, y cada uno empujaba a romper algo bueno:

- «na**vega**ción», «det**allan**», «brechas **reales**» marcados como nombres de estudiante
- Autores de bibliografía (Núñez Rodríguez, Bonilla Sierra) confundidos con estudiantes
- Citas de la Ley 7756 y de la sentencia C-239 marcadas como infracción de lenguaje
- El `placeholder` de un formulario contado como correo real
- La propia regla del README —«no *paciente terminal*»— marcada como infracción

**Afine el detector hasta que solo suene cuando importa.** Y compruebe después que sigue
mordiendo con datos de verdad.

### 5.5 Distinga infracción de cita

El lenguaje del curso se aplica a **la voz del curso**, no a lo que dice una norma. «Pacientes
terminales» en la paráfrasis de la sentencia C-239/1997 **se conserva**: cambiarlo altera la cita.

### 5.6 Ninguna URL compartida puede morir

Si ya circuló un enlace, al mover el archivo se deja un *stub* de redirección en la ruta antigua.
El precio es que git registra *añadido* en vez de *renombrado*. Se asume.

**Un `.pdf` o un `.docx` no admite stub:** se serviría con el tipo MIME equivocado y no abriría.
Esos archivos se quedan donde están.

### 5.7 Rotule lo que no pueda verificar

Aparecieron contradicciones factuales entre materiales del mismo curso: dos cifras distintas del
promedio latinoamericano bajo la misma etiqueta, dos niveles del Atlas, dos tasas de servicios.

**No se resuelven inventando.** Se rotulan `[DATO POR VERIFICAR]`, visibles en la página, y las
decide el docente contra la fuente primaria. Una de ellas incluso mejoró la clase: la tensión se
volvió material didáctico.

### 5.8 Los gráficos: estáticos a SVG, interactivos con librería

Un gráfico sin filtros ni reordenación se convierte a **SVG en línea** — más ligero, accesible y
sin dependencias. Uno con botones que filtran necesita la **librería incrustada**. Confundirlos
cuesta 200 KB o un gráfico roto.

Y ojo: la fuente y los colores suelen estar **también dentro del JavaScript** del gráfico, no
solo en el CSS.

### 5.9 `.nojekyll` no es opcional

Sin él, Jekyll descarta en silencio toda carpeta que empiece por guion bajo. `_shared/`
desaparecería del sitio publicado **sin ningún error visible**.

---

## 6. Estructura de la carpeta

```
HANDOFF.md                 ← este documento · el relato completo
CLAUDE.md                  las reglas en versión corta y ejecutable
README.md                  cara pública del repositorio en GitHub
index.html                 portada del seminario · se mantiene a mano

docs/
  CRUCE-FUSION.md          qué material viene de cada asignatura
  PROGRAMADOR-2026-II.md   las siete sesiones y el calendario
  PLAN_MIGRACION_U1.md     cómo se condensan las 8 clases en 3
  DISENO_UNIDAD_2.md       sesiones de modelos de atención
  DISENO_UNIDAD_3.md       sesiones de bioética y manejo integral
  METODO-reorganizar-asignatura.md   el procedimiento general

sesiones/
  _sesiones.json           ← LISTA CANÓNICA de las sesiones
  sNN-slug/
    index.html             ficha pública de la sesión
    README.md              nota de trabajo del docente
    clase.html             (cuando exista)
    estudiante.html        (cuando exista)

_shared/
  tokens.css  base.css     sistema de diseño · se copian en línea, no se enlazan
  plantilla-sesion.html    el molde del que nace cada ficha
  bitacora.js  vendor/     JS y librerías incrustadas

recursos/originales/       contenido programático oficial
scripts/
  verificar.js             las cinco comprobaciones previas a publicar
  nueva-sesion.js          crea las carpetas de sesión que falten
config.example.js          plantilla de secretos → copiar a config.js
.nojekyll                  imprescindible
```

**Las páginas de detalle son `index.html`, no `README.md`.** Con `.nojekyll` activo —y es
obligatorio, §5.9— un `README.md` dentro de una carpeta no se renderiza: se sirve como texto plano
o se descarga. Los `README.md` de las carpetas de sesión son notas de trabajo, no páginas.

### 6.1 · El roster y el prefijo `PRIVADO_`

**El grupo de 2026-II son 8 estudiantes.** La lista —nombres, códigos y correos— está en
`PRIVADO_roster_2026-II.md`, con su gemelo `.tsv` listo para pegar en la pestaña `Roster` de la
hoja. **Ninguno de los dos está en el repositorio**, y no pueden estarlo: son datos personales
(Ley 1581 de 2012) y este repositorio es público e indexable.

Tres redes lo sostienen, y conviene conocer las tres porque cada una tapa un hueco distinto:

| Red | Qué hace | Dónde |
|---|---|---|
| `.gitignore` | El prefijo `PRIVADO_` nunca entra a git | `.gitignore` §PRIVADO |
| `verificar.js` §3 | Un código `12262…` o un correo **fuera** de un archivo `PRIVADO_` bloquea la publicación | `scripts/verificar.js` |
| El procedimiento | Al repositorio se copia **archivo por archivo**, nunca carpetas enteras | esta regla |

El verificador **omite** los archivos `PRIVADO_` —si no, bloquearía siempre por datos que nadie
va a ver— pero los **lista en pantalla** al hacerlo. Un verificador que calla lo que no mira
enseña a confiar en él más de lo que merece. Comprobado el 16 de agosto: un código de estudiante
en un archivo sin el prefijo sigue bloqueando.

> ⚠️ **Los seudónimos de proyección no siguen el alfabeto, y es deliberado.** Si «A» fuera el
> primer apellido del curso, cualquiera del grupo desharía el anonimato del tablero ordenando la
> lista de clase. `asignarSeudonimos()` baraja antes de repartir por la misma razón.
>
> Y hay un límite honesto: con **ocho personas escribiendo cada una sobre su territorio**, la
> primera pregunta las identifica casi sola. Lo que el tablero garantiza es que *no se proyecta
> el nombre*, no que nadie sepa quién escribió. Conviene decirlo así en el encuadre y no
> prometer más.

### Sobre trabajar en Google Drive

Esta carpeta es a la vez el archivo del curso **y** el repositorio de trabajo. Es decisión del
docente y se respeta, pero conviene saber el riesgo: la sincronización de Drive puede corromper
`.git`, y algunos archivos quedan bloqueados mientras están abiertos en otro programa.

**Mitigación:** el remoto en GitHub es el respaldo real. **Commitee y empuje a menudo** — lo
único irrecuperable sería trabajo sin empujar. Si `.git` se corrompe, se vuelve a clonar.

### ⚠️ El clon huérfano de `C:\repos\`

Existe `C:\repos\Seminario_Fundamentacion_CP`, con tres commits propios
(`f12c0a1`, `01394f8`, `e0ac78a`). Es el andamiaje de antes de la decisión §8.3 —el proyecto
vive en Drive—, y quedó ahí.

Comprobado el 15 de agosto: **no tiene remoto**, su árbol de trabajo está limpio y **no contiene
ni un solo archivo versionado que no esté ya en esta carpeta**. No hay nada que rescatar.

El riesgo no es perder trabajo: es **abrir la carpeta equivocada** y construir una sesión en un
repositorio que no se empuja a ninguna parte. La carpeta buena es la de Drive, la que tiene el
remoto `JBOGLOP/seminario_fundamentacion_cp`. Se puede comprobar en un segundo:

```bash
git remote -v    # si no imprime nada, está en el clon huérfano
```

---

## 7. Lo que hay que confirmar con la dirección

| # | Pregunta | Por qué bloquea |
|---|---|---|
| 1 | ¿El **sábado 8 de agosto** es sesión del seminario? | Cambia de 7 a 8 sesiones y con ello toda la distribución. Con 8, la telesalud recupera sesión propia |
| 2 | Las **48 horas presenciales** declaradas frente a las 21 reales | 7 × 3 h = 21. El mismo desajuste existía en 2026-I (32 declaradas, 16 reales): la mitad exacta en ambos casos |
| 3 | ¿Hay **estudiantes nuevos** en 2026-II? | La inducción del 31 de julio lo sugiere. Cambia el encuadre de la sesión 1 |
| 4 | ¿La **Resolución 813** merece más espacio? | En 2026-I era una clase entera; aquí comparte sesión con toda la legislación |

---

## 8. Decisiones ya tomadas

| # | Decisión | Cuándo |
|---|---|---|
| 9 | **El seminario no tiene clase magistral.** El contenido se lee antes; cada sesión abre con un entregable individual previo y el encuentro se conduce contrastando lo entregado | 16 ago 2026 |
| 10 | **Un solo proyecto de Apps Script** para las siete sesiones, con pestaña y token por sesión. La regla «instrumento nuevo = despliegue nuevo» protege claves de examen, y aquí no hay clave: son preguntas abiertas | 16 ago 2026 |
| 11 | **El tablero proyecta sin nombres.** Cada estudiante es una letra estable. El docente ve la identidad en su panel; el salón no | 16 ago 2026 |
| 12 | **Los entregables previos cuentan para el corte** como seguimiento, y el producto de cada corte los integra | 16 ago 2026 |
| 13 | **El roster nunca llega al navegador.** El estudiante escribe su correo y el servidor lo valida. Un selector expondría la lista los días que el entregable está abierto | 16 ago 2026 |
| 1 | El material de Investigación CP se usa como **cantera** para U2 y U3, no como estructura | 5 ago 2026 |
| 2 | **Repositorio nuevo.** Los dos anteriores se congelan como archivo de 2026-I | 5 ago 2026 |
| 3 | El proyecto vive en **Google Drive**, no en `C:\repos\` | 15 ago 2026 |
| 4 | Se reutiliza el **sistema de diseño** de las asignaturas anteriores | heredado |
| 5 | Si hay que recortar sesiones, la variable de ajuste es **U1**, nunca U2 ni U3 | jul 2026 |

---

## 9. Por dónde seguir

0. 🔴 **Instalar el motor** — `scripts/apps-script/INSTALACION.md`, unos quince minutos. **Sin
   esto el entregable de la sesión 1 no recibe nada.** El roster ya está listo para pegar (§6.1);
   falta crear la hoja, pegar el token en `preparacion.html` y abrir la ventana de entrega.
   Después, publicar el enlace del entregable al grupo: cierra el **21 de agosto a las 7:00**.
1. **Revisar la sesión 1 en el navegador, con el wifi apagado**, y a 375 px. Se dicta el
   **21 de agosto**. Es lo único que el verificador no puede comprobar. Compruebe también el
   **modo proyección** del tablero antes de compartir pantalla en clase.
2. **Sesiones 2 y 3 de U1.** El molde ya existe: la sesión 1 muestra cómo se condensa y dónde va
   la capa investigativa. La 2 absorbe las clases 3, 4 y 5 de 2026-I; la 3, las clases 6, 7 y 8.
3. **Confirmar las cuatro preguntas del §7.** La primera cambia la estructura entera. Con el
   esqueleto ya construido, el coste de un cambio ahí es editar fechas y el manifiesto, no rutas;
   el programador se regenera con `python scripts/generar-programador.py`.
4. **Bibliografía de las unidades 1 y 3.** La oficial no sirve: es la de Epidemiología
   (`docs/PROGRAMADOR-2026-II.md` §6.1). Hay que proponerla, y de paso llevar a la Dirección las
   seis correcciones del contenido programático.
5. **Rúbricas de los tres cortes.** La columna «Método de evaluación» está vacía en el documento
   oficial. La sesión 1 ya lanza el primer insumo del producto del primer corte; falta el criterio.
6. **U2 y U3.** Con los diseños de julio como guion y la cantera de Investigación como material.

---

*Fuente única de verdad del proyecto. Manténgalo actualizado: el próximo que lo lea puede ser
usted, sin recordar nada de esto.*
