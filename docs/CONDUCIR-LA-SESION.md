# Conducir la sesión con el tablero

> Cómo se abre, qué hace cada botón y —lo que más importa— **cómo se lleva la clase** para que
> tres horas de contrastar textos no se vuelvan tres horas de leer textos en voz alta.
>
> Sirve para las siete sesiones. Escrito antes de la primera, así que la parte de conducción es
> una propuesta razonada, no experiencia: revísela después del 21 de agosto.

---

## 1 · Dónde está y cómo se abre

**`_shared/tablero.html`**, en la carpeta del proyecto.

### En clase: ábralo como archivo local

Doble clic sobre el archivo en:

```
G:\Mi unidad\1. UNIVERSIDADES\2026 Maestría\5. Seminario de fundamentación en cuidados paliativos\_shared\tablero.html
```

Así carga `config.js` solo y **no hay que teclear ningún token delante del salón**. Es la forma
recomendada.

> Comprobado el 19 de agosto: el servidor responde `Access-Control-Allow-Origin: *`, así que el
> tablero lee las entregas aunque se abra desde el disco, sin servidor local.

### Desde otro equipo

```
https://jboglop.github.io/seminario_fundamentacion_cp/_shared/tablero.html
```

El sitio publicado **no lleva `config.js`** —está en `.gitignore`— así que pide la URL del
despliegue y el `DASH_TOKEN` por teclado, y no los guarda. Sirve para un apuro; para la clase es
peor, porque teclear un token con el proyector encendido lo expone.

Para abrir directamente en una sesión: `…/tablero.html?sesion=S03`.

---

## 2 · Los controles

| Control | Qué hace |
|---|---|
| **Selector de sesión** | Cambia entre S01 y S07 |
| **Contador** | `entregas / inscritos`. Lo primero que hay que mirar al abrir |
| **Recargar** | Vuelve a leer. Útil si alguien entrega sobre la hora |
| **A− / A+** | Tamaño de letra. Súbalo hasta que se lea **desde la última fila** |
| **Modo proyección** | 🔴 Oculta nombres, correos, pie de tarjeta y el panel de faltantes |
| **← →** | Cambian de pregunta sin tocar el ratón |
| **«marcar»** | Atenúa la tarjeta ya discutida. Se ve de un vistazo qué falta |

Las marcas viven solo en ese navegador: son el rastro de por dónde va la clase, no un dato del
curso. Se borran sin consecuencia.

### 🔴 Antes de compartir pantalla

**Encienda el modo proyección y compruébelo.** El botón queda resaltado y dice
«Proyección ACTIVA». Si no lo hace, proyecta nombres y correos de todo el grupo.

Hágalo **antes** de conectar el proyector o compartir pantalla, no después.

### Cómo sabe quién es quién con la proyección encendida

En modo proyección usted tampoco ve los nombres. Dos salidas:

1. **La tabla «por seudónimo»** de `PRIVADO_roster_2026-II.md`, abierta en otra ventana o
   impresa. Ocho letras, ocho apellidos. Siempre funciona.
2. **Dos ventanas** con pantalla extendida: la proyectada en modo proyección, la del portátil en
   modo docente. Elegante, pero se cae si la sala duplica pantalla en vez de extenderla.

La primera es la fiable.

---

## 3 · Cómo conducir · lo que hace que funcione

### La regla que lo decide todo: no lea las respuestas en voz alta

Leer ocho respuestas seguidas mata la sesión. El grupo desconecta en la tercera.

**Lo que sí funciona:**

1. **Proyecte la pregunta** y deje **dos minutos de lectura en silencio**. Todos leen las ocho
   respuestas a la vez. Nadie recita.
2. **Devuélvale el análisis al grupo**, no la conclusión:
   - *«¿Qué se repite en varias?»*
   - *«¿Qué dice solo una persona?»*
   - *«¿Dónde se contradicen dos?»*
3. **Solo entonces** entre usted, para nombrar lo que el grupo ya vio y ponerle el concepto.

El trabajo intelectual lo hace el grupo. Usted ordena.

### Empiece por donde haya más contraste, no por la P1

Mire las entregas **antes** de la clase y elija con cuál abrir. La mejor primera pregunta es
aquella donde dos personas dicen cosas incompatibles: la discusión arranca sola.

### Los huecos son el mejor material de este seminario

Si cuatro personas no encontraron el dato de su municipio, **proyecte las cuatro juntas y
cuéntelas en voz alta.** Eso no es un problema de las entregas: es el hallazgo, y es exactamente
el hilo del curso —hay norma y no hay datos— apareciendo en el terreno del grupo.

Es el momento de la sesión que más rinde. No lo trate como un tropiezo.

### La letra invita, no obliga

Diga *«A dice que…»*. Quien escribió puede reconocerse si quiere, y muchas veces lo hace sola.
**Nunca pregunte «¿quién es A?»** — rompe justo lo que el anonimato compra.

### Cierre cada bloque con una síntesis escrita y visible

Al terminar cada pregunta, escriba en el tablero físico —o en un documento proyectado— **una
frase** con lo que quedó. Al final de las tres horas hay cinco frases que el grupo construyó.
Eso es «la clase que se va construyendo»: se tiene que poder señalar al final.

### Cinco minutos de cierre, siempre

Qué quedó abierto, qué se lleva a la sesión siguiente. Sin eso, la sesión termina cuando se acaba
la hora, que no es lo mismo que terminar.

---

## 4 · Plan B: si llegan pocas entregas

Puede pasar, sobre todo en la primera. **Decídalo la noche antes, no a las 8:05.**

| Entregas | Qué hacer |
|---|---|
| **6 o más de 8** | El guion funciona tal cual |
| **3 a 5** | Funciona, pero con menos material por pregunta. Junte P1+P2 en un solo bloque y dé más aire a la discusión de cada una |
| **Menos de 3** | Cambie el plan: **la primera hora se trabaja en el aula.** Se responden P1 y P3 ahí mismo, en papel o en el portátil, y se ponen en común. La sesión se salva y el mensaje queda claro sin necesidad de decirlo |

En el tercer caso, no reproche la falta de entregas al empezar. Trabájelo y, al cerrar, diga qué
se perdió la sesión por no tener el material antes. Se entiende mejor así que con un llamado de
atención.

---

## 5 · Lista de comprobación · diez minutos antes

- [ ] Tablero abierto **desde el archivo local**, con la sesión correcta seleccionada
- [ ] El contador muestra las entregas esperadas
- [ ] **Modo proyección ACTIVO**, comprobado en pantalla
- [ ] Tamaño de letra subido y legible **desde la última fila**
- [ ] La tabla letra → apellido a mano (otra ventana o impresa)
- [ ] Decidido con qué pregunta abre
- [ ] Las respuestas leídas por usted antes de entrar
