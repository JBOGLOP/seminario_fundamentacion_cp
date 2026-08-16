# CLAUDE.md — reglas de trabajo del repositorio

> Contexto operativo para agentes y para quien llegue nuevo. **El relato completo está en
> [`HANDOFF.md`](HANDOFF.md)**: de dónde viene la asignatura, qué decisiones se tomaron y qué
> costó caro en los dos cursos anteriores. Este archivo es la versión corta y ejecutable.

**Seminario de fundamentación en cuidados paliativos** · código 32264001 · plan 3660 · 3 créditos
Maestría en Cuidados Paliativos · Facultad de Enfermería · Universidad Antonio Nariño · 2026-II
Repositorio **público** con GitHub Pages: https://jboglop.github.io/seminario_fundamentacion_cp/

---

## Las cinco reglas innegociables

**1 · Portabilidad sin conexión.** Cada HTML abre con doble clic, sin servidor y sin internet.
Sin Google Fonts, sin librerías desde CDN, sin `<iframe>`. Los tokens de diseño se **copian en
línea** dentro del `<style>` de cada página; `_shared/tokens.css` es fuente canónica, no enlace.

> Los `<a href="https://…">` sí se conservan: son enlaces, no recursos que se carguen.
> Incrustar una librería en el archivo **no viola la portabilidad: la cumple.**

Parte de los estudiantes ejerce en municipios donde la conectividad no se da por supuesta.
La regla existe por ellos.

**2 · Sin datos de estudiantes.** El repositorio es público e indexable. No entra ningún nombre,
código ni calificación. Los casos territoriales van generalizados: describen un patrón, no a una
persona. Al repositorio se copia **archivo por archivo, nunca carpetas enteras**; el `.gitignore`
es la red de seguridad, no el procedimiento.

**3 · No se designa a nadie por su pronóstico.** «persona con enfermedad avanzada», no «paciente
terminal». **Excepción:** las citas literales de normas y jurisprudencia, donde cambiar la palabra
alteraría la cita. La regla se aplica a la voz del curso, no a lo que dice una norma.

**4 · Material de terceros: se cita, no se reproduce.** Libros, manuales y atlas se referencian en
APA 7 con DOI. Las normas y sentencias son documentos públicos y sí se incluyen.

**5 · Los secretos nunca en el HTML.** Contraseñas, claves de respuesta y URL de Apps Script van en
`config.js`, que está en `.gitignore`. La plantilla es `config.example.js`.

---

## Antes de cada commit

```bash
node scripts/verificar.js
```

Cinco comprobaciones: enlaces rotos · recursos externos · datos personales · lenguaje del curso ·
coherencia entre la portada y el manifiesto de sesiones. Sale con código 1 si algo bloquea.

Distingue **infracción de cita** y **dato duro de mención**, y por eso sus avisos ámbar son
para leer, no para obedecer a ciegas. Un detector que grita siempre enseña a ignorarlo: si aparece
un falso positivo, se afina el detector — no se rompe el contenido para callarlo.

**Lo que no comprueba: que la página se vea bien.** Eso no tiene sustituto. Hay que abrirla en el
navegador **con el wifi apagado**, comprobar que la consola no da errores, navegar con el teclado
y verificar que se lee a 375 px de ancho.

---

## El modelo pedagógico: seminario, no clase magistral

**Esto decide cómo se construye cada sesión.** El contenido no se expone en el aula: se lee
antes. Cada sesión tiene tres piezas y un orden fijo:

1. **`index.html`** — la guía. Explica qué leer, qué se entrega y cómo transcurrirá el encuentro.
   El contenido del tema está ahí, rotulado **«material de consulta · se lee antes»**.
2. **`preparacion.html`** — el entregable previo, individual. Cinco preguntas que no se responden
   con lo que dice la lectura: piden mirar el propio terreno con lo que la lectura dio.
3. **`_shared/tablero.html`** — el tablero docente. Se abre en clase, proyecta lo entregado
   **sin nombres** y la sesión se conduce contrastándolo.

**Las preguntas del entregable no se resumen ni se recuerdan: se sostienen.** El patrón que se
repite en las siete sesiones es *del juicio al dato*: se pide una posición y, acto seguido, qué
dato la convertiría en evidencia y si ese dato existe. La ausencia de datos es un hallazgo, no
un fracaso — es el hilo del seminario visto en el terreno de cada estudiante.

Cada entregable lleva además: **una fuente en inglés** (competencia institucional de lectura en
segunda lengua) y una **declaración de uso de IA** (declararlo suma; una cita inventada resta).

> **Los entregables cuentan para el corte.** Son el seguimiento, y el producto de cada corte los
> integra. No son tareas sueltas.

## El motor

Un solo proyecto de Apps Script para las siete sesiones, con una hoja y una pestaña de respuestas
por sesión. Instalación completa en
[`scripts/apps-script/INSTALACION.md`](scripts/apps-script/INSTALACION.md).

| Pieza | Dónde | Secreto |
|---|---|---|
| Backend | `scripts/apps-script/Codigo.gs` | **Ninguno.** Los tokens viven en la hoja y en las Propiedades del script |
| Token de escritura | dentro de cada `preparacion.html` | **Público por diseño.** Solo enruta; no lee nada |
| Token de lectura | `config.js` (en `.gitignore`) | 🔴 **Secreto.** Con él se descargan todas las entregas |
| Roster | pestaña `Roster` de la hoja | 🔴 **Nunca sale del servidor** |

**Identidad sin exponer la lista.** El estudiante escribe su correo institucional y el servidor lo
valida contra el roster. El navegador **nunca** recibe la lista del curso — que es lo que pasaría
con un selector, y el entregable abre días antes de la sesión.

**Seudónimos.** Cada estudiante tiene una letra estable. El tablero proyecta la letra; el docente
ve la correspondencia en su panel. En un seminario donde se pide tomar posición, el anonimato al
proyectar sube la franqueza de lo que se escribe.

### Portabilidad y backend no se contradicen

El entregable **se lee, se responde y se guarda sin conexión** (borrador en `localStorage`). Solo
el envío necesita red, y si no la hay, «Copiar todo» deja el trabajo listo para mandarlo por
correo. La regla 1 existe por los estudiantes que ejercen donde la conectividad no se da por
supuesta: la conectividad no puede ser el motivo por el que alguien no entregue.

Un backend **no es un recurso externo**: la página no lo carga para dibujarse. Aun así,
`verificar.js` lista los backends declarados, porque un verificador que dice «cero recursos
externos» mientras hay páginas hablando con un servidor esconde justo lo que hay que vigilar.

## Estructura

```
index.html                 portada del seminario · la mantiene una persona, a mano
README.md                  cara pública del repositorio en GitHub
HANDOFF.md                 relato completo del proyecto · punto de entrada
CLAUDE.md                  este archivo

sesiones/
  _sesiones.json           ← LISTA CANÓNICA de las sesiones
  sNN-slug/
    index.html             guía de la sesión + material de consulta
    preparacion.html       entregable previo del estudiante
    README.md              nota de trabajo del docente

_shared/
  tokens.css               paleta y tipografía · fuente canónica, se copia en línea
  base.css                 componentes · fuente canónica, se copia en línea
  plantilla-sesion.html    molde del que nace cada ficha de sesión
  tablero.html             TABLERO DOCENTE · sirve a las siete sesiones
  bitacora.js  vendor/     JS y librerías incrustadas

docs/                      programador, cruce de la fusión, diseño de unidades, método
recursos/originales/       contenido programático oficial
scripts/
  verificar.js             las cinco comprobaciones previas a publicar
  nueva-sesion.js          crea las carpetas de sesión que falten
  generar-programador.py   genera el programador institucional .docx
  apps-script/             Codigo.gs · appsscript.json · INSTALACION.md
config.example.js          plantilla de secretos → copiar a config.js
.nojekyll                  imprescindible · ver abajo
```

### Crear una sesión

Se añade al array `sesiones` de `sesiones/_sesiones.json` y se ejecuta:

```bash
node scripts/nueva-sesion.js --listar   # qué haría
node scripts/nueva-sesion.js            # crearlo
```

**Nunca sobrescribe.** Se puede ejecutar con el curso empezado: crea solo lo que falta y deja
intacto lo que ya se editó a mano. Después hay que **añadir la sesión al cronograma de
`index.html`**; la comprobación 5 falla hasta que se haga.

### Por qué las carpetas se llaman por contenido y no por fecha

Está pendiente de confirmación si el sábado 8 de agosto es sesión del seminario (HANDOFF §7). Si
lo es, cambian las fechas y la numeración de todo el semestre. Con slugs de contenido
—`s03-marco-legal-barreras`, no `s03-18-sep`— eso mueve texto, no rutas, y ningún enlace ya
compartido se rompe.

---

## Sistema de diseño

El color significa la unidad, no decora. La paleta es cálida y sobria a propósito: **la asignatura
habla de personas que mueren.**

| Ámbito | Acento |
|---|---|
| Unidad 1 · Contexto histórico-filosófico y lineamientos | `salvia` |
| Unidad 2 · Modelos de atención desde la investigación | `ambar` |
| Unidad 3 · Aspectos bioéticos y manejo integral | `terracota` |
| Transversal · portada, avisos, evaluación | `arena` |

**No inventes colores nuevos ni cambies los hex.** El CSS usa siempre `var(--acento*)`, nunca el
color concreto, para que cambiar de unidad sea una sola edición.

Tipografía: fuentes del sistema (`--sans`, `--serif`, `--mono`). Nunca Google Fonts — regla 1.

---

## Cosas que muerden

**`.nojekyll` no es opcional.** Sin él, Jekyll descarta en silencio toda carpeta que empiece por
guion bajo, y `_shared/` desaparecería del sitio publicado **sin ningún error visible**. El
workflow de Pages falla a propósito si el archivo no está.

**Las páginas de detalle son `index.html`, no `README.md`.** Consecuencia directa de lo anterior:
con `.nojekyll` activo, un `README.md` dentro de una carpeta no se renderiza — se sirve como texto
plano o se descarga. Los `README.md` de las carpetas de sesión son notas de trabajo, no páginas.

**Ninguna URL compartida puede morir.** Si un enlace ya circuló, al mover el archivo se deja un
*stub* de redirección en la ruta antigua. El precio es que git registra *añadido* en vez de
*renombrado*; se asume. Un `.pdf` o un `.docx` **no admite stub**: se serviría con el tipo MIME
equivocado. Esos archivos se quedan donde están.

**El sufijo del archivo miente.** `_v2`, `_v5_merged`, `files_v2/` — en el curso anterior los tres
casos resultaron falsos: el archivo sin sufijo era el posterior, la carpeta `_v2` era más vieja y
el `_merged` era un duplicado exacto. **Fíese de la fecha y del hash, nunca del nombre.**

**Cuando el plan escrito choque con el disco, gana el disco.** Audite antes de planificar.

**Rotule lo que no pueda verificar.** Si dos materiales dan cifras distintas bajo la misma
etiqueta, no se resuelve inventando: se marca `[DATO POR VERIFICAR]`, visible en la página, y lo
decide el docente contra la fuente primaria.

**Gráficos:** uno estático se convierte a **SVG en línea**; uno con filtros o reordenación necesita
la **librería incrustada** (`_shared/vendor/`). La fuente y los colores suelen estar también dentro
del JavaScript del gráfico, no solo en el CSS.

---

## Ramas

Cada sesión que se publica toca `index.html` para marcarse. Si las ramas salen en paralelo de
`main`, todas chocan al fusionar. **Se apilan:** cada una sale de la anterior y se fusionan en el
mismo orden.

## Este repositorio vive en Google Drive

Es decisión del docente y se respeta. El riesgo es que la sincronización de Drive corrompa `.git`
o bloquee archivos abiertos en otro programa. **Mitigación: commitear y empujar a menudo** — el
remoto en GitHub es el respaldo real, y lo único irrecuperable sería trabajo sin empujar.
