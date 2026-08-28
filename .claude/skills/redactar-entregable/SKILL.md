---
name: redactar-entregable
description: Redactar o revisar el entregable previo (preparacion.html) de una sesión del seminario — las preguntas, su anclaje a fuentes localizadas, la calibración de la carga y los enganches con el tablero y el Apps Script. Úsala cuando haya que construir el entregable de una sesión nueva, rehacer las preguntas de una existente, o comprobar que un entregable ya escrito cumple el formato. No sustituye el juicio pedagógico del docente.
---

# Redactar el entregable previo de una sesión

`preparacion.html` es la primera de las tres piezas de cada sesión y la que sostiene el modelo:
el seminario no expone contenido en el aula, lo contrasta. Sin entregable no hay qué contrastar.

## 0 · Lo que esta skill no decide

**El argumento de la sesión es del docente.** Esta skill garantiza que el entregable tenga la
forma correcta, que nada afirmado en él sea inverificable y que quede enganchado donde debe. No
garantiza que diga lo correcto. Cuando el contenido esté en duda, §8.

## 1 · Leer antes de escribir — nunca de memoria

Cinco lecturas, en este orden. Ninguna es opcional y ninguna se sustituye por lo que se recuerde:

| Qué | Dónde | Qué se saca |
|---|---|---|
| Datos de la sesión | `sesiones/_sesiones.json` | **Fuente canónica**: número, título, fecha, modalidad, unidad, corte, temas |
| Las reglas | `CLAUDE.md` | Portabilidad, datos, lenguaje, secretos, paleta |
| El argumento | `sesiones/sNN-slug/README.md` y `clase.html` | Qué sostiene la sesión y con qué cierra |
| El molde | `preparacion.html` de la sesión anterior | La estructura probada, literal |
| Los datos de la anterior | `PRIVADO_guion-SNN.md` y la pestaña de respuestas | Carga real y anclaje por pregunta (§5) |

> **No copie dentro de esta skill —ni deduzca de memoria— los hex, los nombres de variable de
> color ni la lista de sesiones.** La paleta cambió el 16 de agosto de 2026 y la fija
> `_shared/tokens.css`; la lista de sesiones vivió en tres sitios en los cursos anteriores y los
> tres se desincronizaron. Se leen del archivo cada vez.

Los tokens de diseño se copian **en línea** dentro del `<style>`: la página abre sin conexión.
La forma más segura de acertar es partir del `preparacion.html` anterior y cambiar el acento de
unidad si cambia.

## 2 · La regla de anclaje

Es el corazón de la skill, porque es lo que el seminario evalúa: **verificar lo que se cita.** Un
entregable que afirme lo que no puede rastrear enseña justo lo contrario de lo que pide.

Toda afirmación factual que entre en el contexto de una pregunta —una norma, un año, una cifra,
lo que un organismo dice— tiene que estar en una de **tres** situaciones. No hay una cuarta:

1. **Rastreada.** Consta en un documento localizado, con su URL comprobada en esta sesión de
   trabajo. Se enlaza en «Qué estudiar antes de responder».
2. **Rotulada `[DATO POR VERIFICAR]`**, visible en la página. No escondida en un comentario.
3. **Convertida en la pregunta misma.** Si el curso no lo tiene localizado, se dice y se pregunta.
   La P3 de la sesión 2 hace exactamente esto con el BID, la OCDE y la CEPAL, y declara en el
   propio enunciado que puede no existir. **Las dos salidas sirven**: si el grupo encuentra algo,
   el curso gana una fuente; si no, queda documentado que el programa cita organismos sin
   respaldo localizable.

### La comprobación que no se salta

**Antes de describir qué hace una norma, verifique qué adopta realmente.** No basta con que el
número sea correcto.

El caso que lo enseñó: el borrador de la sesión 2 presentaba la **Resolución 3280 de 2018** como
«el peldaño operativo» del cuidado paliativo. Adopta los lineamientos de la RIAS de promoción y
mantenimiento de la salud y de la materno-perinatal — **ninguna de las dos es la ruta paliativa**.
Se corrigió antes de publicar y la sesión mejoró: la 3280 quedó como *ejemplo del mecanismo* y el
peldaño paliativo se volvió el hueco abierto. Citar «la 3280» como respaldo de cualquier ruta es
un hábito frecuente, y es el tipo de cita que este seminario enseña a verificar.

Si dos materiales dan cifras distintas bajo la misma etiqueta, **no se resuelve inventando**:
rótulo visible y lo decide el docente contra la fuente primaria.

## 3 · Anatomía de una pregunta

Seis piezas, siempre en este orden. El esqueleto literal está en
[`esqueleto-pregunta.html`](esqueleto-pregunta.html).

| Pieza | Clase | Qué hace |
|---|---|---|
| Rótulo | `.pregunta__n` | `Pregunta N · ` y el ángulo, en minúscula. Es lo que la distingue de las demás |
| Título | `<h3>` | La pregunta en una línea, legible sin el contexto |
| Contexto | `.pregunta__ctx` | El dato anclado (§2) sobre el que se pregunta. **Aquí es donde se miente sin querer** |
| Consigna | `.pregunta__q` | Lo que hay que hacer. Verbo imperativo, y siempre **dónde buscar** |
| Expectativa | `.espera` | Tres viñetas: qué hace buena a esta respuesta. La tercera suele ser el permiso explícito de no encontrar nada |
| Campo | `<textarea data-min>` + `.contador` | `data-min` entre 180 y 200 palabras, **orientativo, nunca bloqueante** |

Tres cosas que hacen la diferencia y no se ven en la estructura:

- **Cada pregunta nombra dónde buscar.** No es cortesía: en la sesión 1 el anclaje por pregunta fue
  **P1 4/7 · P2 4/7 · P3 0/7 · P4 7/7**. La P4 fue la única que nombraba un documento concreto —el
  *Global Atlas*— y la única con todas las respuestas ancladas. Ojo con el diagnóstico fácil: el
  factor **no** es pedir mirar el terreno propio (P1 y P2 también lo pedían y sacaron 4/7), sino
  decir **a qué documento ir**.
- **La ausencia documentada vale igual que el hallazgo**, y hay que decirlo dentro de la pregunta,
  no solo en la introducción. «Busqué y no había» no es una búsqueda; «busqué estos términos en
  este repositorio, N resultados, todos sobre esto otro» sí lo es.
- **El `placeholder` del textarea enumera lo que se espera**: qué buscó, dónde, qué encontró y qué
  no. Es la última oportunidad de recordar la consigna, y se lee cuando el campo está vacío.

## 4 · Qué tiene que cubrir el conjunto

No cada pregunta: el conjunto. Cuatro obligaciones y una prohibición.

1. **El patrón del seminario, *del juicio al dato*.** Al menos una pregunta pide una posición y,
   acto seguido, qué dato la convertiría en evidencia y si ese dato existe. Suele ser la última, y
   se llama «de la afirmación a la pregunta».
2. **Una fuente en inglés**, por la competencia institucional de lectura en segunda lengua. Se
   marca en el rótulo de la pregunta y en la lista de lecturas.
3. **Declaración de uso de IA.** Textarea `#ia`. *Declararlo suma; una fuente inventada resta.*
4. **Campo de minutos.** `#minutos`, número, «no afecta la nota». Es el instrumento de calibración
   de §5: sin él, la sesión siguiente se diseña a ciegas.

**La prohibición: ninguna pregunta se responde copiando el material.** Todas piden mirar el
terreno propio del estudiante con lo que el material dio. Si una pregunta se puede responder sin
salir de `clase.html`, está mal formulada.

## 5 · Calibrar con los datos de la anterior

El número de preguntas **no se elige, se deduce**. La sesión 1 anunció 180 minutos y la carga real
fue de 240 de mediana; la sesión 2 bajó a cuatro preguntas y anunció «3 horas y media», que es
honesto.

Procedimiento antes de fijar el número:

1. Leer la mediana del campo `minutos` de la sesión anterior.
2. Si supera lo anunciado, **quitar una pregunta** — no recortar las que quedan.
3. Contar cuántas respuestas quedaron ancladas en una fuente, pregunta por pregunta. La que salga
   baja no se elimina: se le añade la ruta de búsqueda que le faltaba.
4. Anunciar en el `hero` el tiempo que salga del dato, no el que se desearía.

**Y devolverle el resultado al grupo**, en el `hero` y en la nota de «Cómo funciona». No es adorno
motivacional: es el primer dato del seminario sobre el sistema en el que trabajan, y lo
produjeron ellos.

## 6 · La página, de arriba abajo

Orden fijo. Se hereda del anterior y no se reordena sin motivo:

`nav-sesion` → `hero` (con los chips de cierre, número de preguntas, tiempo estimado y corte, y el
`#estado` del plazo) → **Cómo funciona** (los cuatro pasos, incluido que se proyecta sin nombres)
→ **Qué estudiar antes de responder** (la presentación primero; las demás fuentes etiquetadas con
la pregunta a la que sirven) → **Quién entrega** (`#correo`, `#nombre`) → **Las N preguntas** →
**Antes de enviar** (`#ia`, `#minutos`, los tres botones, la salida por correo si no hay red) →
`footer` con el aviso de tratamiento de datos.

Dos invariantes que no se tocan:

- **Nada de la lista del curso llega al navegador.** El estudiante escribe su correo y el servidor
  lo valida contra el roster. Un selector expondría la lista los días que el entregable está
  abierto.
- **La página se lee, se responde y se guarda sin conexión.** Borrador en `localStorage`, y
  «Copiar todo» deja el trabajo listo para enviarlo por correo. La conectividad no puede ser el
  motivo por el que alguien no entregue.

## 7 · Los enganches de después

Escribir la página no termina el trabajo. Siete puntos, y el verificador solo ve el sexto:

1. **`CONFIG`** al final del HTML: `ENDPOINT`, `TOKEN` de la fila de esa sesión en la pestaña
   `Config`, `SESION` (`SNN`) y `CIERRE_LEGIBLE`. Los dos primeros son **públicos por diseño**:
   solo enrutan. El token secreto —el de lectura del tablero— no está aquí ni puede estarlo.
2. **`CLAVE`** de `localStorage` y **`IDS_TEXTO`**: la clave lleva el número de sesión y los ids
   son tantos como preguntas. Copiar el archivo anterior sin cambiar esto hace que dos sesiones
   compartan borrador.
3. **`TITULOS` en `_shared/tablero.html`**: el servidor devuelve `p1`, `p2`… y no sabe cómo se
   llaman. Sin esta entrada, el tablero proyecta «P1» en clase.
4. **El `<option>` de la sesión** en el selector del tablero.
5. **La ventana en la pestaña `Config`**: `Apertura`, `Cierre`, `Activa = Sí`. Es acción del
   docente en la hoja, no del repositorio — pero si no se hace, el entregable no recibe nada.
6. **`node scripts/verificar.js`** en verde.
7. **El estado en el `README.md` de la sesión**, con lo que queda pendiente marcado.

Y lo que ningún script comprueba: **abrirla con el wifi apagado**, mirar la consola, navegar con
el teclado y leerla a 375 px.

## 8 · Cuándo parar y preguntar

Pare y consulte al docente —no lo resuelva— si:

- Dos fuentes se contradicen bajo la misma etiqueta. Rótulo visible y decisión suya.
- No hay documento localizable para algo que el contenido programático nombra. Puede ser una
  pregunta de resultado incierto (§2.3), pero **incluirla o no es decisión pedagógica**: puede
  volverse frustrante si nadie encuentra nada, y entonces hay que enmarcarla en clase como método.
- El argumento de la sesión no está claro en el `README.md` ni en `clase.html`. El entregable
  cuelga del argumento; escribirlo antes es construir sobre nada.
- La carga medida obliga a bajar de tres preguntas. Eso ya no es calibrar: es cambiar el diseño
  del corte, y los entregables cuentan para la nota.
