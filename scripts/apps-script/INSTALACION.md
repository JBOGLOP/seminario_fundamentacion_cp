# Instalación del motor del seminario

> Se hace **una sola vez** para las siete sesiones. Unos quince minutos.
> Después, abrir una sesión nueva es editar dos celdas de la hoja.

---

## 1 · Crear la hoja

Google Sheets → hoja nueva, nombre **`Seminario_CP_2026-II`**.
Propietario: la cuenta desde la que va a desplegar.

## 2 · Pegar el código

En la hoja: **Extensiones → Apps Script**.

1. Borrar el contenido de `Código.gs` y pegar [`Codigo.gs`](Codigo.gs) completo.
2. Icono ⚙️ **Configuración del proyecto** → marcar *«Mostrar el archivo de manifiesto
   `appsscript.json`»*.
3. Abrir `appsscript.json` y pegar [el de esta carpeta](appsscript.json).
4. Guardar (Ctrl+S).

## 3 · Ejecutar `inicializar()`

Seleccionar `inicializar` en el desplegable de funciones → **Ejecutar**.
Google pedirá autorización la primera vez: es normal, el script escribe en su propia hoja.

Crea las pestañas `Roster`, `Config` y `Eventos`, genera **siete tokens de escritura** y un
**token de lectura** (`DASH_TOKEN`). El registro de ejecución los muestra.

> Es idempotente: se puede volver a ejecutar sin miedo. **No regenera los tokens** si ya existen.

## 4 · Rellenar el roster

Pestaña **`Roster`**, una fila por estudiante:

| Correo | Nombre | Codigo | Seudonimo | Activo |
|---|---|---|---|---|
| `…@uan.edu.co` | APELLIDOS Nombres | documento | A, B, C… | Sí |

- **`Correo` es la identidad.** Quien no esté aquí no puede entregar. El código no lo usa el
  motor: está para cuadrar con las actas de la maestría.
- **`Seudonimo`** es la letra con la que la persona sale proyectada en clase. Si se deja vacío,
  `asignarSeudonimos()` lo rellena.
- Para dar de baja a alguien sin borrar su historial: `Activo` = `No`. **No borre filas**: se
  pierde el rastro de lo que ya entregó.

> **Para 2026-II ya está preparado.** El grupo son 8 estudiantes y el roster, con sus seudónimos
> ya repartidos, está en `PRIVADO_roster_2026-II.tsv` — listo para pegar desde la celda **A2**.
> Ese archivo está fuera del repositorio por el prefijo `PRIVADO_` del `.gitignore`.
> Si lo pega, **no** hace falta ejecutar `asignarSeudonimos()`.

> ⚠️ **Las letras no siguen el alfabeto, y es deliberado.** Si «A» fuera el primer apellido del
> curso, cualquiera del grupo desharía el anonimato de la proyección ordenando la lista de clase.
> `asignarSeudonimos()` baraja antes de repartir por esa misma razón.

> 🔴 **Esta pestaña no sale de la hoja jamás.** Son datos personales (Ley 1581 de 2012).
> Nunca al repositorio, nunca a un CSV compartido, nunca al cliente.

## 5 · Abrir la sesión 1

Pestaña **`Config`**, fila `S01`:

| Columna | Valor |
|---|---|
| `Apertura` | `2026-08-15 12:00` |
| `Cierre` | `2026-08-21 07:00` — una hora antes de clase |
| `Activa` | `Sí` |

Las fechas van como fecha y hora reales, no como texto.
**Copie el `Token` de esa fila**: hay que pegarlo en el HTML del entregable (paso 7).

## 6 · Desplegar

**Implementar → Nueva implementación** → tipo **Aplicación web**:

| Campo | Valor |
|---|---|
| Ejecutar como | **Yo** |
| Quién tiene acceso | **Cualquier usuario** |

⚠️ **«Cualquier usuario»**, no «Cualquier usuario con una cuenta de Google»: lo segundo obliga a
iniciar sesión y deja fuera a quien entre desde un equipo compartido.

Copiar la URL `/exec`.

> **Compruébelo desde una ventana de incógnito.** Si redirige a `accounts.google.com`, el acceso
> quedó mal y los estudiantes no van a poder entregar. Editar `appsscript.json` **no** cambia un
> despliegue ya creado: hay que crear uno nuevo.

Prueba rápida: abrir `…/exec` en el navegador. Debe responder
`{"ok":true,"servicio":"Motor del Seminario…"}`.

## 7 · Conectar el entregable

En `sesiones/s01-historia-fundamentos/preparacion.html`, arriba del todo, hay un bloque
`CONFIGURACION`. Rellenar:

```js
ENDPOINT: 'https://script.google.com/macros/s/…/exec',
TOKEN:    'S01_SEM_CP_2026II_xxxxxx',
```

Los dos son **públicos por diseño**: viajan dentro de una página pública. El token solo enruta
—dice a qué sesión pertenece la entrega— y no abre nada. Quien no esté en el roster no entra
aunque los tenga.

## 8 · Conectar el tablero

El tablero **sí** lleva un secreto: el `DASH_TOKEN`, que lee todas las entregas.

```bash
cp config.example.js config.js     # config.js está en .gitignore
```

y rellenar `dashToken` y `appsScriptURL` **en `config.js`**. Abrir `tablero.html` con doble clic.

> 🔴 **El error fácil, y ya pasó una vez.** El 16 de agosto el `DASH_TOKEN` se escribió en
> `config.example.js` en vez de en `config.js`. **La plantilla se versiona; la copia no.** Se
> salvó porque todavía no se había hecho commit — el margen era un `git add -A`.
>
> `verificar.js` ahora lo detecta y bloquea: si en `config.example.js` hay un `dashToken` o un
> `appsScriptURL` con valor real en lugar de un marcador, no deja publicar. Aun así, la regla
> mental es la que vale: **`.example` = plantilla con marcadores; `config.js` = valores reales.**
>
> Si alguna vez se empuja de verdad, no basta con borrarlo del archivo: queda en el historial de
> git. Hay que **rotar el token** ese mismo día (Propiedades del script → `DASH_TOKEN`).

> 🔴 **`config.js` nunca se sube.** Si el `DASH_TOKEN` se filtra, cualquiera descarga las entregas
> con nombre y correo. Para rotarlo: Apps Script → ⚙️ Configuración del proyecto → Propiedades del
> script → cambiar `DASH_TOKEN` → actualizar `config.js`.
>
> El tablero abre sin `config.js`: pide el token por teclado y no lo guarda. Sirve para el aula.

---

## Después: abrir cada sesión siguiente

Sin tocar el código ni volver a desplegar:

1. `Config` → fila de la sesión → poner `Apertura`, `Cierre` y `Activa = Sí`.
2. Copiar el `Token` de esa fila al `preparacion.html` de la sesión.
3. Publicar la página.

## Si cambia `Codigo.gs`

**Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión.**
La URL `/exec` no cambia. Si en vez de eso crea una implementación nueva, la URL sí cambia y hay
que actualizar todos los HTML.

---

## Comprobaciones antes de la primera clase

- [ ] `…/exec` responde el JSON de servicio desde **incógnito**
- [ ] `…/exec?action=estado&token=<token S01>` dice `"abierta": true`
- [ ] Una entrega de prueba con un correo **que no está** en el roster → `correo_no_reconocido`
- [ ] Una entrega de prueba con un correo **que sí está** → aparece en `S01_Respuestas`
- [ ] Reenviar la misma → **actualiza la fila**, no crea otra, y sube `Version`
- [ ] El tablero la muestra, y el **modo proyección** oculta nombre y correo
- [ ] **Borrar la fila de prueba** de `S01_Respuestas` y su rastro en `Eventos`
- [ ] La zona horaria de la hoja es `America/Bogota`

## Errores que devuelve el servidor

| Código | Qué pasó |
|---|---|
| `token_invalido` | El token del HTML no está en `Config` |
| `sesion_cerrada` | `Activa` ≠ `Sí` |
| `aun_no_abre` / `plazo_vencido` | Fuera de la ventana `Apertura`–`Cierre` |
| `correo_no_reconocido` | No está en `Roster`, o tiene `Activo = No` |
| `sin_respuestas` | Llegó el envío vacío |
| `no_autorizado` | `DASH_TOKEN` incorrecto en el tablero |
| `ocupado` | Dos entregas simultáneas; el cliente reintenta |
