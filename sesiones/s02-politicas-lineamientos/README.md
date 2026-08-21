# Sesión 02 · Lineamientos y políticas: mundo, región, Colombia

**viernes 4 de septiembre de 2026** · Sincrónico · 3 horas · Primer corte
Unidad 1 — Contexto histórico-filosófico y lineamientos sociopolíticos

> Nota de trabajo del docente. Las páginas públicas son [`index.html`](index.html),
> [`clase.html`](clase.html) y [`preparacion.html`](preparacion.html).

---

## Qué cambió respecto de la sesión 1, y por qué

Las dos decisiones salen de **medir** la primera sesión, no de intuición.

| Dato de la sesión 1 | Qué se cambió aquí |
|---|---|
| Carga real **240 min** de mediana frente a 180 anunciados | **Cuatro preguntas, no cinco.** Y se anuncian «3 horas y media», que es honesto |
| **P4**: 7 de 7 se apoyaron en una fuente · **P3**: 0 de 7 | **Todas las preguntas nombran dónde buscar.** La P3 falló porque pedía una posición sin dar ruta al dato |

La sesión abre devolviéndole al grupo ese resultado. No es un adorno motivacional: es el primer
dato del seminario sobre el sistema en el que trabajan, y lo produjeron ellos.

---

## El argumento de la sesión

La sesión 1 dejó **«hay norma y no hay datos»**. Esta pregunta qué es exactamente esa «norma»,
porque no es una sola cosa:

```
Resolución internacional  →  compromete políticamente
Ley nacional              →  crea un derecho
Resolución operativa      →  define una ruta
El servicio               →  existe o no existe
```

Los cuatro se citan como equivalentes. **Solo el último se puede visitar.** «Aquí ya está
resuelto, existe la ley» es saltarse tres peldaños, y esa es la frase que la sesión desmonta.

El cierre entrega la pregunta de la sesión 3: *una política sin registro es indistinguible de una
política que no se cumple.*

---

## Las cuatro preguntas

| # | Pregunta | Ruta que se le da | Qué mide |
|---|---|---|---|
| P1 | ¿La norma llegó a algún papel de su servicio? | Ley 1733/2014 y Res. 3280/2018 + documentos internos | El último peldaño de la cadena, observable por el estudiante |
| P2 | Qué compromete de verdad la WHA67.19 | El documento, en inglés | **Lectura en segunda lengua** + atención al verbo (insta ≠ obliga) |
| P3 | ¿Qué dicen BID, OCDE o CEPAL? | Sus repositorios abiertos | **Método de búsqueda.** El resultado negativo vale igual |
| P4 | De la afirmación a la pregunta | — | La competencia investigativa, ya reconocible del formato |

**La P3 es deliberadamente de resultado incierto.** El contenido programático nombra al BID y a la
OCDE, y el curso no tiene localizado un documento suyo sobre cuidado paliativo. Se dice así en la
diapositiva 10 y en la propia pregunta. Si el grupo encuentra algo, el curso gana una fuente que
le faltaba; si no, queda documentado que el programa cita organismos sin respaldo localizable.
Las dos salidas sirven.

---

## 🔴 Corrección de contenido · la Resolución 3280

Al redactar el acordeón de normas apareció un error de encuadre en el borrador inicial, y se
corrigió antes de publicar.

**La Resolución 3280 de 2018 no es una norma de cuidado paliativo.** Adopta los lineamientos
técnicos y operativos de la *Ruta Integral de Atención para la Promoción y Mantenimiento de la
Salud* y de la *RIAS para la Población Materno Perinatal*. Ninguna de las dos es la ruta paliativa.

La versión inicial la presentaba como «el peldaño operativo» del cuidado paliativo. Eso habría
sido enseñar mal una cita — justo lo que el seminario evalúa.

**Cómo quedó, y por qué mejora la sesión.** La 3280 se conserva como *ejemplo del mecanismo* —
enseña la forma que tiene un peldaño operativo en Colombia— y el peldaño paliativo se convierte
en la pregunta abierta: el tercer escalón de la figura lleva «RIAS · ¿cuál para CP?». En vez de
dar una respuesta cómoda y falsa, la sesión entrega un hueco real.

El acordeón dice además, explícitamente, que citar «la 3280» como respaldo de cualquier cosa
relacionada con rutas es un hábito frecuente y **es el tipo de cita que este seminario enseña a
verificar**.

---

## Rótulos [DATO POR VERIFICAR] en el material

1. **BID** — el programa lo nombra; no hay documento suyo localizado sobre cuidado paliativo
   (diapositiva 10). La P3 lo convierte en tarea.
2. **El instrumento operativo del cuidado paliativo en Colombia** — ruta, lineamiento o guía
   específica, si existe. El curso no lo tiene localizado (diapositiva 17).
3. **PAIS / «Modelo Preventivo y resolutivo»** — el marco de política de atención integral cambió
   de nombre y énfasis varias veces (PAIS, MAITE y sucesivos). **Cuál rige en 2026 está sin
   confirmar** contra fuente oficial.

## Acordeones de normas

Las tres normas citadas —WHA67.19, Ley 1733 de 2014 y Resolución 3280 de 2018— llevan una ficha
desplegable con `<details>` nativo: qué es, qué dice, qué no hace y dónde encontrarla. Sin
JavaScript, navegable con teclado, y **se abre sola al imprimir** (un acordeón cerrado en papel
es texto perdido).

---

## Estado

- [x] Presentación (`clase.html`) · 20 diapositivas, 4 figuras
- [x] Entregable (`preparacion.html`) · 4 preguntas, token S02 verificado contra el servidor
- [x] Guía (`index.html`) · guion sincrónico
- [x] Títulos de las preguntas en `_shared/tablero.html`
- [x] Enlazada desde la portada y el README
- [x] `node scripts/verificar.js` en verde
- [ ] 🔴 **Abrir la ventana** en la pestaña `Config` de la hoja: fila `S02`, `Apertura`
      `2026-08-28 12:00`, `Cierre` `2026-09-04 07:00`, `Activa` `Sí`
- [ ] **Abrir con el wifi apagado** y revisar a 375 px
- [ ] Enviar el correo al grupo (≈ 28 de agosto, para dar una semana)
- [ ] Confirmar el marco PAIS/MAITE vigente y quitar el rótulo si se resuelve

## Pendientes propios

- El contenido programático nombra **SECPAL** y el material solo la menciona de pasada. Si se
  quiere darle peso, hace falta una fuente concreta.
- La **P3 puede volverse frustrante** si nadie encuentra nada. En clase conviene enmarcarla desde
  el principio como método —cómo se documenta una búsqueda— y no como caza del documento.
- Si la carga vuelve a salir por encima de lo anunciado, la sesión 3 debería bajar a tres
  preguntas. El campo «minutos» lo dirá.
