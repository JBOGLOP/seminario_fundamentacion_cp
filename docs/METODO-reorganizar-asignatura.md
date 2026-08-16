# Método para reorganizar y publicar una asignatura

> **Qué es esto.** El procedimiento que se siguió para reorganizar *Epidemiología del
> Cuidado Paliativo* (37542002) y publicarla en GitHub Pages, escrito para poder repetirlo
> en otra asignatura — por ejemplo **Contexto Histórico**.
>
> No es el `Handoff.md` de aquella asignatura, que es específico de su contenido. Esto es
> el método: qué hacer, en qué orden, qué decidir antes de tocar nada y qué comprobar antes
> de publicar.
>
> **Cómo usarlo.** Copia este archivo a la carpeta de la nueva asignatura y trabaja sobre
> él. Las secciones marcadas 🔧 son las que hay que rellenar con los datos de la asignatura
> nueva.

---

## 0. La lección más importante

**El inventario que creías tener está mal.**

En Epidemiología, el documento de traspaso afirmaba que las sesiones 1 a 5 no existían.
La auditoría de la carpeta encontró material dictado de las sesiones 2, 3, 4 y 5 —incluidas
cuatro estaciones interactivas completas—. Solo la Sesión 1 hubo que construirla de cero.

Eso cambió el plan entero: de *«construir cinco sesiones»* a *«homologar cuatro y construir
una»*. Semanas de diferencia.

> **Regla:** audita la carpeta **antes** de planificar. Y cuando el plan escrito choque con
> lo que hay en el disco, **gana el disco**.

---

## 1. Fase 0 · Auditar (no negociable, va primero)

Recorre la carpeta completa y genera un `INVENTARIO.md` con, para cada archivo: ruta,
tamaño, fecha, a qué sesión pertenece, tipo, y **qué hacer con él**.

Cinco disposiciones posibles:

| Marca | Significado |
|---|---|
| **MIGRAR** | Va al repositorio público |
| **ORIGINAL** | Material fuente (PPTX, PDF) → `recursos/originales/` |
| **PRIVADO** | Se queda fuera del repositorio (datos de estudiantes) |
| **DERECHOS** | Material de terceros → se sustituye por su cita |
| **DESCARTAR** | Versión superada o duplicado |

En Google Drive el `find` con `-printf` es lentísimo (tarda minutos). Lánzalo en segundo
plano y sigue trabajando:

```bash
find . -type f -not -path "./.git/*" -printf "%TY-%Tm-%Td\t%10s\t%p\n" | sort
```

### Lo que la auditoría destapó y no estaba previsto

Esto es lo que hay que buscar activamente, porque nadie lo anota en el plan:

1. **Trabajos de estudiantes con nombre y apellido.** Aparecieron en carpetas llamadas
   `Tareas/`, `Entregas/`, `compromisos/`, `TAREA CLASE 1/`. Y calificaciones nominales en
   la raíz. GitHub Pages es público e indexable.
2. **Nombres de estudiantes escondidos dentro de un HTML docente.** La guía de evaluación
   parecía publicable, y en medio tenía una sección «Conformación de grupos» con los
   nombres completos. **Busca nombres dentro de los archivos, no solo en los títulos.**
3. **Material con derechos de autor.** 95 fotografías de páginas de un libro (390 MB),
   capítulos escaneados, un libro completo en PDF, la traducción íntegra de un capítulo.
4. **Duplicados y versiones.** Sufijos `(1)`, `(2)`, `_v2`, carpetas `papelera/`, zips ya
   extraídos. Ojo: **`_v2` no siempre es la versión más nueva** — en la Sesión 8 el archivo
   sin sufijo era posterior. Fíate de la fecha, no del nombre.

### Comprobación de datos personales

```bash
# nombres conocidos de la lista de clase, dentro del contenido
for n in "Nombre Apellido" "Otro Nombre"; do
  grep -rl "$n" --include=*.html --include=*.md . | sed "s/^/$n → /"
done
```

---

## 2. Fase 1 · Las decisiones que bloquean

**Pregúntalas antes del primer commit.** Lo que entra en el historial de git no sale con un
borrado posterior: hay que reescribir el historial, y las cachés de GitHub ya lo tienen.

| # | Decisión | Cómo se resolvió en Epidemiología |
|---|---|---|
| 1 | ¿Qué se hace con los trabajos y calificaciones de estudiantes? | Excluir todo vía `.gitignore`, creado antes del primer commit |
| 2 | ¿Dónde vive el repositorio? | Clonado en `C:\repos\`, **fuera de Google Drive** |
| 3 | ¿Qué se hace con el material de terceros? | Sustituir por su referencia en APA 7 con DOI |
| 4 | ¿Se dictaron todas las sesiones previstas? | No: la 8 y la 9 se fusionaron. El repositorio documenta 8, no 9 |

### 🔧 Por qué no usar git sobre Google Drive

La sincronización de Drive puede corromper `.git`, y cada operación es lenta. El patrón que
funcionó: **Drive es el archivo maestro, el repositorio es el espacio de trabajo.** Se copia
de Drive al repositorio, nunca al revés.

### El `.gitignore` que hay que escribir primero

```gitignore
# Datos personales — NUNCA publicar
**/Tareas/
**/Entregas/
**/entregas/
**/compromisos/
**/TAREA */
**/desarrollo grupos*/
Calificaciones_*.xlsx
*.gsheet

# Material de terceros con derechos
**/Libro/
**/Referencias/
*_libro.pdf

# Versiones superadas
**/papelera/
**/Papelera/
*.zip
* (1).*
* (2).*

# Temporales
~$*.docx
.DS_Store
Thumbs.db
```

---

## 3. Fase 2 · Migrar sin romper enlaces

Si ya compartiste URLs con estudiantes, **ninguna puede morir**.

```bash
git checkout -b hito-0-fundaciones
git tag pre-reorganizacion          # punto de retorno
git mv Archivo_Viejo.html sesiones/sNN-slug/clase.html
```

Usa `git mv`, no `cp` + `rm`: conserva el historial.

Después, en **cada ruta antigua**, deja un stub:

```html
<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<link rel="canonical" href="https://USUARIO.github.io/REPO/sesiones/sNN-slug/clase.html">
<meta http-equiv="refresh" content="0; url=sesiones/sNN-slug/clase.html">
<meta name="robots" content="noindex">
<title>Este material se movió</title></head>
<body><p>Se movió. <a href="sesiones/sNN-slug/clase.html">Continuar</a>.</p></body></html>
```

> **Aviso:** el stub hace que git registre *modificación + añadido* en vez de *renombrado*,
> porque la ruta antigua sigue existiendo. Es el precio de no romper URLs. Asúmelo.
>
> **Los PDF no admiten stub:** un HTML llamado `algo.pdf` se sirve con el tipo MIME
> equivocado y no se abre. Si el PDF estaba enlazado, déjalo donde está o acepta romperlo.

---

## 4. Fase 3 · Ramas apiladas (esto no es obvio)

**Cada sesión toca `index.html`** para marcarse como publicada. Si haces las ramas en
paralelo desde `main`, todas chocan al fusionar.

Solución: **apílalas**.

```
main
 └── hito-0-fundaciones
      └── sesion-04
           └── sesion-01
                └── sesion-02
                     └── portabilidad
                          └── sesion-03
```

Cada rama sale de la anterior:

```bash
git checkout sesion-02 && git checkout -b sesion-03
```

Y se fusionan **en el mismo orden**. Sin conflictos.

---

## 5. Fase 4 · Homologar, no reescribir

La tentación es rehacer el material. **No lo hagas.** El contenido pedagógico es del
docente y funcionó en clase; lo que hay que arreglar son las violaciones técnicas.

El patrón que funcionó, en un archivo de 1.900 líneas:

```css
:root{
  /* 1 · los tokens reales del sistema de diseño */
  --salvia:#7A8B6F; --salvia-dark:#5C6E54; /* … */

  /* 2 · los nombres ANTIGUOS del archivo, apuntando a los tokens.
        Así no hay que tocar las 1.900 líneas de reglas que los usan. */
  --terracotta: var(--salvia-dark);
  --deep-brown: var(--charcoal);
}
```

**Una sola edición** cambia la paleta entera sin riesgo de romper nada.

Cuando los colores están escritos a mano dentro del JavaScript (los gráficos suelen
hacerlo), hace falta además un mapeo hex → hex. Cuidado con no tocar librerías incrustadas,
que traen sus propios colores.

---

## 6. Fase 5 · Portabilidad

🔧 *Adapta esto a las reglas de la asignatura nueva. En Epidemiología la regla era: cada
HTML abre con doble clic, sin servidor y sin conexión.*

Tres problemas típicos y cómo se resolvieron:

| Problema | Solución | Por qué |
|---|---|---|
| **Google Fonts** | Fuentes del sistema | Sin red no cargan. 34 enlaces, 339 menciones en 16 archivos |
| **Librería de gráficos desde CDN** | **Incrustarla en línea** (~200 KB) | Sin red los gráficos quedan en blanco. Incrustar no viola la portabilidad: la cumple |
| **`<iframe>` a una herramienta externa** | Tarjeta con la consigna + enlace | Un iframe deja un hueco blanco sin red |

Para las fuentes, sustituye **solo el nombre de la fuente**, no la pila entera: los
*fallbacks* que ya tenía cada regla completan la declaración.

```
'Fraunces', Georgia, serif   →   Georgia, serif
'DM Sans', 'Segoe UI', sans  →   -apple-system,BlinkMacSystemFont,'Segoe UI', sans
```

**Gráficos estáticos:** conviértelos a SVG en línea, es mejor solución que la librería.
**Gráficos interactivos** (filtros, reordenación): incrusta la librería; reescribirlos sería
rehacer una librería de gráficos sobre material que ya funcionaba.

---

## 7. Fase 6 · Verificar antes de publicar

Cuatro comprobaciones automatizables. Las tres primeras encontraron errores reales.

### 7.1 Enlaces locales rotos

Guarda esto como `enlaces.js` y ejecútalo con `node enlaces.js RUTA_DEL_REPO`:

```js
const fs=require('fs'), path=require('path');
const RAIZ=process.argv[2];
function htmls(dir,acc=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.name==='.git')continue; const p=path.join(dir,e.name);
  if(e.isDirectory())htmls(p,acc); else if(/\.html?$/i.test(e.name))acc.push(p);} return acc;}
let ok=0; const rotos=[];
for(const f of htmls(RAIZ)){
  const src=fs.readFileSync(f,'utf8');
  const refs=[...src.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
  const metas=[...src.matchAll(/content="\s*0;\s*url=([^"]+)"/gi)].map(m=>m[1]);
  for(const r of [...refs,...metas]){
    if(/^(https?:|mailto:|#|data:|javascript:)/i.test(r))continue;
    const limpio=r.split('#')[0].split('?')[0]; if(!limpio)continue;
    let d=path.resolve(path.dirname(f),decodeURIComponent(limpio));
    if(limpio.endsWith('/'))d=path.join(d,'index.html');
    fs.existsSync(d)?ok++:rotos.push(path.relative(RAIZ,f)+'  ->  '+r);
  }}
rotos.forEach(r=>console.log('  ROTO  '+r));
console.log('\nvalidos: '+ok+'   rotos: '+rotos.length);
```

### 7.2 Recursos externos que aún se cargan

```bash
grep -rohE '<(script|link|iframe|img)[^>]*(src|href)="https?://[^"]+"' --include=*.html . \
  | grep -v 'rel="canonical"' | sed -E 's|.*//([^/"]+).*|  \1|' | sort | uniq -c
```

Debe quedar **solo lo que hayas autorizado explícitamente**.

### 7.3 Datos personales en el índice de git

Antes de commitear:

```bash
git add -A
git diff --cached --name-only | grep -iE 'calificacion|tarea|entrega|compromiso|grupo'
```

### 7.4 Lenguaje y criterios propios de la asignatura

🔧 En Epidemiología se comprobaba «personas vulnerabilizadas, nunca vulnerables». Define el
equivalente para Contexto Histórico y automatízalo:

```bash
grep -rn 'TERMINO_PROHIBIDO' --include=*.html --include=*.md .
```

> **Cuidado con los falsos positivos:** en una sesión el término aparecía porque la clase
> **discutía la palabra**. Revisa el contexto antes de sustituir a ciegas.

### 7.5 Lo que no se puede automatizar

**Abrir los archivos en el navegador con el wifi apagado.** No hay sustituto. Comprueba:
consola sin errores, navegación por teclado, y que se vea bien a 375 px de ancho.

---

## 8. Fase 7 · Publicar

```
.nojekyll                      ← imprescindible si usas carpetas con guion bajo
.github/workflows/pages.yml    ← despliegue desde GitHub Actions
```

**`.nojekyll` no es opcional:** Jekyll descarta silenciosamente toda carpeta que empiece por
`_`, así que `_shared/` desaparecería del sitio sin ningún error visible.

En GitHub: **Settings → Pages → Source: GitHub Actions**. Si está en *Deploy from a branch*,
el workflow falla.

Commits atómicos, en español, imperativo y con ámbito:

```
sesion-04: migrar estaciones a sesiones/s04-medidas/
shared: extraer tokens.css desde la presentacion maestra
portabilidad: quitar Google Fonts e incrustar la libreria de graficos
```

> **`gh` no estaba instalado**, así que los *pull request* hubo que abrirlos a mano desde
> la URL que imprime `git push`. Si quieres automatizarlo: `winget install GitHub.cli`.

---

## 9. Coherencia del contenido: lo que más sorprendió

En una asignatura con hilo narrativo, **los personajes y los conceptos derivan a lo largo
del semestre**. En Epidemiología, dos anclajes narrativos cambiaron entre febrero y mayo:

- Una protagonista cambió de departamento y de diagnóstico entre la Sesión 1 y la 6.
- Otro personaje cambió de región y de enfermedad entre la Sesión 2 y la 7.

Ninguna de las dos derivas estaba documentada. **Se detectan comparando menciones:**

```bash
for t in "Nombre" "Lugar" "Concepto clave"; do
  echo "$t: $(grep -roc "$t" --include=*.html . | grep -v ':0$' | wc -l) archivos"
done
```

Y **son decisión del docente, no del agente.** La pregunta correcta no es «¿cuál es
correcta?» sino «¿armonizamos al canon o respetamos lo dictado?».

> En este caso se armonizó, y el argumento **mejoró**: al mover al personaje a otra región,
> la historia pasó de «pocos servicios, poco acceso» —casi una tautología— a «la ratio más
> alta del país y ningún acceso», que obliga a preguntar qué mide realmente el indicador.

### Contradicciones factuales

Apareció una cifra citada que contradecía la descripción de un personaje. **No la resuelvas
inventando.** Se rotuló `[DATO POR VERIFICAR]`, se documentaron tres hipótesis y se dejó
para que el docente contrastara contra la fuente primaria. La sesión incluso usó la tensión
como material didáctico.

---

## 10. Estimar el esfuerzo de verdad

Tras la auditoría, casi todo resultó ser **homologación**, no construcción:

| Situación | Esfuerzo real |
|---|---|
| Existe HTML dictado | 1–3 h · homologar paleta, fuentes, anclajes, portada y ficha |
| Existe solo PPTX o PDF | media jornada · extraer contenido y construir |
| No existe nada | media jornada larga |

Para extraer el texto de un PPTX (es un zip):

```bash
unzip -q presentacion.pptx -d salida/
for i in $(seq 1 60); do
  f="salida/ppt/slides/slide$i.xml"; [ -f "$f" ] || continue
  echo "── DIAPOSITIVA $i"
  sed -e 's|</a:p>|\n|g' "$f" | sed -e 's|<[^>]*>||g' | grep -v '^\s*$'
done
```

---

## 11. Orden de trabajo recomendado

1. **Auditar** y generar `INVENTARIO.md`. Parar y enseñarlo.
2. **Preguntar** las decisiones bloqueantes (§2). Parar hasta tener respuesta.
3. `.gitignore`, rama, tag de retorno, estructura de carpetas.
4. Migrar lo existente con `git mv` + stubs de redirección.
5. Extraer los componentes compartidos a `_shared/`.
6. Hub `index.html` y `README.md` del curso.
7. `.nojekyll` y workflow de Pages.
8. **Verificar** (§7) y parar antes de publicar.
9. Sesión por sesión, en ramas apiladas: primero la que aporte componentes reutilizables.
10. Una rama aparte para los arreglos transversales (fuentes, librerías): así el PR es
    revisable y no se mezcla con el contenido.

---

## 12. 🔧 Ficha de la asignatura nueva

Rellena esto antes de empezar con Contexto Histórico:

| Campo | Valor |
|---|---|
| Asignatura y código | |
| Programa y facultad | |
| Número de encuentros | |
| Fechas de cada sesión | |
| Docente | |
| Repositorio | |
| URL de publicación | |
| Carpeta de material | |

**Pregunta vertebral del curso** (si la tiene):

**Anclajes narrativos o conceptuales que atraviesan el semestre:**

**Sistema de diseño** — colores por unidad, tipografía, tokens:

**Reglas innegociables** — portabilidad, lenguaje, tratamiento de datos:

---

## 13. Errores que no hay que repetir

1. **Planificar antes de auditar.** El plan escrito describía una realidad que no existía.
2. **Fiarse del nombre del archivo.** `_v2` no siempre es la versión nueva; mira la fecha.
3. **Suponer que un HTML docente no tiene datos personales.** Búscalos dentro.
4. **Hacer las ramas en paralelo.** Todas tocan `index.html`; apílalas.
5. **Olvidar `.nojekyll`.** Las carpetas con `_` desaparecen sin avisar.
6. **Ejecutar git sobre Google Drive.** Lento y arriesgado.
7. **Resolver por tu cuenta las contradicciones del contenido.** Rotúlalas y pregunta.
8. **Dar por verificado lo que no se abrió en un navegador.** Los scripts comprueban
   enlaces y dependencias; no comprueban que la página se vea bien.
