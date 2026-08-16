#!/usr/bin/env node
/**
 * verificar.js — comprobaciones de §7 del método, en una sola pasada.
 *
 *   node scripts/verificar.js [ruta]     (por defecto: la raíz del repo)
 *
 * Comprueba, en este orden:
 *   1. Enlaces locales rotos            (§7.1)
 *   2. Recursos externos que se cargan  (§7.2)
 *   3. Rastros de datos personales      (§7.3)
 *   4. Lenguaje de la asignatura        (§7.4)
 *   5. Portada ↔ manifiesto de sesiones
 *
 * Sale con código 1 si encuentra algo que bloquea la publicación.
 * Lo que NO comprueba: que la página se vea bien. Eso es §7.5 y no
 * tiene sustituto: hay que abrirla en el navegador con el wifi apagado.
 */
'use strict';
const fs = require('fs'), path = require('path');

const RAIZ = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const rojo = s => `\x1b[31m${s}\x1b[0m`, verde = s => `\x1b[32m${s}\x1b[0m`;
const amar = s => `\x1b[33m${s}\x1b[0m`, gris = s => `\x1b[90m${s}\x1b[0m`;

function archivos(dir, filtro, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) archivos(p, filtro, acc);
    else if (filtro.test(e.name)) acc.push(p);
  }
  return acc;
}
const rel = f => path.relative(RAIZ, f).replace(/\\/g, '/');

// El prefijo PRIVADO_ está reservado en el .gitignore para lo que nunca sale
// del disco: el roster, con nombres, códigos y correos. Esos archivos EXISTEN
// en la carpeta —es su sitio— pero no se publican, así que revisarlos aquí
// solo produce un bloqueo permanente por datos que nadie va a ver.
//
// Se omiten, pero se DICE cuáles. Un verificador que calla lo que no mira
// enseña a confiar en él más de lo que merece. Y el resto del árbol se revisa
// igual: un código de estudiante en un archivo sin el prefijo sigue saltando,
// que es justo el error que esto tiene que atrapar.
const esPrivado = f => /^privado_/i.test(path.basename(f));
const omitidos = archivos(RAIZ, /\.(html?|md|txt|js|css|tsv|csv)$/i).filter(esPrivado);

const htmls = archivos(RAIZ, /\.html?$/i).filter(f => !esPrivado(f));
const textos = archivos(RAIZ, /\.(html?|md|txt|js|css)$/i).filter(f => !esPrivado(f));

let bloquea = 0, avisa = 0;
const titulo = t => console.log(`\n${'─'.repeat(66)}\n${t}\n${'─'.repeat(66)}`);

// ── 1 · Enlaces locales rotos ────────────────────────────────────────
titulo('1 · Enlaces locales rotos  (§7.1)');
{
  let ok = 0; const rotos = [];
  for (const f of htmls) {
    // Las plantillas de _shared/ son moldes, no páginas: sus rutas relativas
    // se resuelven desde donde el generador las instancia (sesiones/sNN-slug/),
    // no desde donde el archivo vive. Comprobarlas aquí marcaría como rotos
    // enlaces que en la página generada son correctos — y las páginas
    // generadas sí se comprueban, que es lo que importa.
    // Las comprobaciones 2, 3 y 4 sí las revisan: esas reglas son de contenido.
    if (/^_shared\/plantilla-/.test(rel(f))) continue;
    const src = fs.readFileSync(f, 'utf8');
    const refs = [...src.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
    const metas = [...src.matchAll(/content="\s*0;\s*url=([^"]+)"/gi)].map(m => m[1]);
    for (const r of [...refs, ...metas]) {
      if (/^(https?:|mailto:|#|data:|javascript:)/i.test(r)) continue;
      // plantillas JS (`${...}`) se rellenan en tiempo de ejecución
      if (r.includes('${')) continue;
      // config.js lleva los secretos y está en .gitignore: NUNCA existe en
      // el repositorio, solo en el equipo del docente. El 404 es inofensivo
      // —la página sigue y abre en modo consulta— y que falte es la señal
      // de que los secretos no se publicaron. Ver docs/ENDURECER_EXAMEN.md.
      if (/(^|\/)config(\.local)?\.js$/.test(r)) continue;
      const limpio = r.split('#')[0].split('?')[0];
      if (!limpio) continue;
      let d = path.resolve(path.dirname(f), decodeURIComponent(limpio));
      if (limpio.endsWith('/')) d = path.join(d, 'index.html');
      fs.existsSync(d) ? ok++ : rotos.push(`${rel(f)}  ->  ${r}`);
    }
  }
  rotos.forEach(r => console.log(rojo('  ROTO  ') + r));
  bloquea += rotos.length;
  console.log(rotos.length ? rojo(`\n  ${rotos.length} rotos`) + gris(` · ${ok} válidos`)
                           : verde(`  ✅ ${ok} enlaces válidos, ninguno roto`));
}

// ── 2 · Recursos externos ────────────────────────────────────────────
// Regla innegociable (D7): cada HTML abre con doble clic, sin conexión.
// Los <a href> NO cuentan: son enlaces, no recursos que se carguen.
titulo('2 · Recursos externos que se cargan  (§7.2)');
{
  const PERMITIDOS = [];          // ninguno: portabilidad total
  const porDominio = new Map();
  for (const f of htmls) {
    const src = fs.readFileSync(f, 'utf8');
    const hits = [
      ...src.matchAll(/<(?:script|link|iframe|img|source|video|audio)\b[^>]*\b(?:src|href)="(https?:\/\/[^"]+)"/gi),
      ...src.matchAll(/@import\s+url\(['"]?(https?:\/\/[^)'"]+)/gi),
      ...src.matchAll(/(?:fetch|importScripts)\(\s*['"](https?:\/\/[^'"]+)/gi),
    ];
    for (const m of hits) {
      if (/rel="canonical"/i.test(m[0])) continue;
      const dom = new URL(m[1]).hostname;
      if (PERMITIDOS.includes(dom)) continue;
      if (!porDominio.has(dom)) porDominio.set(dom, new Set());
      porDominio.get(dom).add(rel(f));
    }
  }
  // Un backend NO es un recurso externo: la página no lo carga para poder
  // dibujarse. El entregable se lee y se escribe sin conexión, y solo el envío
  // necesita red. Aun así se listan aquí, porque un verificador que dice «cero
  // recursos externos» mientras hay páginas hablando con un servidor esconde
  // justo lo que hay que vigilar.
  {
    const backends = htmls.filter(f => /script\.google\.com/.test(fs.readFileSync(f, 'utf8')));
    if (backends.length) {
      console.log(gris('  backends declarados (no son recursos de carga):'));
      backends.map(rel).sort().forEach(x => console.log(gris(`      ${x}`)));
    }
  }

  if (!porDominio.size) console.log(verde('  ✅ ningún recurso externo: portabilidad sin conexión intacta'));
  else {
    for (const [dom, fs_] of [...porDominio].sort((a, b) => b[1].size - a[1].size)) {
      console.log(rojo(`  ${dom}`) + gris(`  — ${fs_.size} archivo(s)`));
      [...fs_].sort().forEach(x => console.log(gris(`      ${x}`)));
      bloquea += fs_.size;
    }
  }
}

// ── 3 · Rastros de datos personales ──────────────────────────────────
// El glosario real vive fuera del repo (Drive · PRIVADO). Aquí solo
// van los patrones, nunca los nombres.
titulo('3 · Rastros de datos personales  (§7.3)');
{
  if (omitidos.length) {
    console.log(gris(`  omitidos por el prefijo PRIVADO_ (no se publican): ${omitidos.length}`));
    omitidos.map(rel).sort().forEach(x => console.log(gris(`      ${x}`)));
    // Si alguno dejara de estar ignorado por git, esto se vuelve un agujero.
    console.log(gris('      → compruébelo: git check-ignore -v <archivo>'));
  }
  // duro = bloquea; blando = solo avisa, porque la expresión puede
  // aparecer describiendo el problema en vez de cometiéndolo.
  const PATRONES = [
    [/\b12262\d{6}\b/g,                       'código estudiantil (12262…)', 'duro'],
    [/\b\d{1,2}[.,]\d{1,2}\s*\/\s*5[.,]0\b/g, 'nota sobre 5,0',              'duro'],
    [/app\.tactiq\.io|otter\.ai|fireflies\.ai/gi, 'enlace a transcripción',  'duro'],
    [/Meeting started:|Participants:/g,        'cabecera de transcripción',  'duro'],
    // El correo institucional del docente es público y debe aparecer.
    // Lo que no puede aparecer es el de ningún estudiante.
    // Se excluyen además los dominios de relleno que usan los placeholder
    // de formulario: marcarlos entrena a ignorar los avisos de verdad.
    [/\b(?!jbogoya63@uan\.edu\.co)[\w.%-]+@(?!ejemplo|example|correo\.|dominio|tucorreo|midominio|test\.|mail\.com\b)[\w.-]+\.[a-z]{2,}\b/gi,
     'correo electrónico', 'duro'],
    [/conformaci[oó]n de grupos/gi,           'sección «conformación de grupos»', 'blando'],
    [/integrantes\s*:/gi,                     'lista de integrantes',        'blando'],
  ];
  // Los `placeholder` de formulario son ilustrativos por definición: enseñan
  // el formato que se espera, no el dato de nadie. El de esta asignatura es
  // «nombre@uan.edu.co» —el dominio real, que es lo útil de mostrar— y por
  // eso la lista de dominios de relleno de arriba no lo atrapa.
  // Es el falso positivo del §5.4 del HANDOFF: marcarlo entrena a ignorar los
  // avisos de verdad. Se vacía el valor del atributo antes de buscar; el resto
  // del archivo se revisa igual, así que un correo real fuera de un placeholder
  // sigue saltando.
  const sinPlaceholders = s => s.replace(/placeholder="[^"]*"/gi, 'placeholder=""');

  let n = 0, a = 0;
  for (const f of textos) {
    if (rel(f).startsWith('scripts/')) continue;
    const src = sinPlaceholders(fs.readFileSync(f, 'utf8'));
    for (const [re, etiqueta, sev] of PATRONES) {
      const m = src.match(re);
      if (!m) continue;
      const duro = sev === 'duro';
      console.log((duro ? rojo('  DATO  ') : amar('  ¿?    ')) +
        `${rel(f)}  —  ${etiqueta}  ` + gris(`(${m.length}×, p.ej. «${m[0].slice(0, 40)}»)`));
      if (!duro) console.log(gris('          → revisar a mano: puede describir el problema, no cometerlo'));
      duro ? n++ : a++;
    }
  }
  bloquea += n; avisa += a;
  if (!n && !a) console.log(verde('  ✅ sin rastros de datos personales'));
  else if (!n) console.log(verde('  ✅ sin datos personales duros') + gris(` · ${a} aviso(s)`));
}

// ── 4 · Lenguaje de la asignatura ────────────────────────────────────
// D8: no se designa a una persona por su pronóstico.
// SEÑALA, no sustituye: las citas de normas y jurisprudencia usan el
// término legítimamente y sustituirlas alteraría la cita.
titulo('4 · Lenguaje de la asignatura  (§7.4)');
{
  const REGLA = /\b(pacientes?|enfermos?|sujetos?)\s+terminal(es)?\b/gi;
  // Categorías clínicas y normativas: NO son infracción.
  const EXCEPCIONES = /\b(enfermedad|fase|estado|situaci[oó]n|condici[oó]n)\s+terminal/gi;
  let n = 0;
  for (const f of textos) {
    if (rel(f).startsWith('scripts/')) continue;
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(REGLA)) {
      const limpia = t => t.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      // El texto PREVIO se recorta del original, no se busca dentro del
      // contexto ya normalizado: un término partido por un salto de línea
      // («paciente\n   terminal») deja de coincidir consigo mismo al
      // colapsar los espacios, y entonces indexOf devuelve -1 y el «antes»
      // acaba conteniendo texto de después.
      const antes = limpia(src.slice(Math.max(0, m.index - 160), m.index));
      const ctx   = (antes + limpia(m[0] + src.slice(m.index + m[0].length,
                                                     m.index + m[0].length + 160))).trim();
      const termino = limpia(m[0]).trim();
      if (EXCEPCIONES.test(ctx)) EXCEPCIONES.lastIndex = 0;
      // ¿Es paráfrasis de una norma, sentencia o instrumento? Se conserva.
      // La lista nació corta y dejó pasar dos casos reales: «Art. 10»
      // abreviado, y una recomendación del Consejo de Europa resumida en
      // una celda de tabla. Un detector que no reconoce la voz de la norma
      // empuja a reescribir citas.
      const norma = new RegExp(
        '\\b(Ley|Sentencia|Resoluci[oó]n|Decreto|Circular|Convenci[oó]n|Consenso|Pacto|' +
        'Tratado|Protocolo|Declaraci[oó]n|Recomendaci[oó]n|Rec\\(|Directriz|Lineamiento|' +
        'art[íi]culo|Art\\.|soft ?law|hard ?law|jurisprudencia|Corte|[CT]-\\d)', 'i'
      ).test(ctx);   // sin \b de cierre: tras «Art.» un punto y un espacio
                     // no forman límite de palabra y el patrón nunca casaba.
      // ¿Se está enunciando la propia regla? «X, no Y» / «en vez de Y».
      // Es el falso positivo del §7.4: el término aparece porque se discute
      // la palabra, no porque se use.
      const menciona = /\b(no|nunca|jam[áa]s|en (?:vez|lugar) de|antes que|frente a)\b[^.]{0,40}$/i
                         .test(antes);
      if (menciona) { console.log(gris('  ok    ') + `${rel(f)}  —  «${termino}» enuncia la regla, no la infringe`); continue; }
      console.log((norma ? amar('  CITA  ') : rojo('  TERM  ')) + `${rel(f)}  —  «${termino}»`);
      console.log(gris(`          …${ctx.slice(0, 150)}…`));
      console.log(gris(norma ? '          → parafrasea una norma: CONSERVAR, verificar a mano'
                             : '          → voz del curso: cambiar a «persona con enfermedad avanzada»'));
      norma ? avisa++ : n++;
    }
  }
  bloquea += n;
  if (!n && !avisa) console.log(verde('  ✅ sin infracciones'));
}

// ── 5 · Portada ↔ manifiesto de sesiones ─────────────────────────────
// En las dos asignaturas anteriores la lista de sesiones vivía a la vez en
// el programador, en la portada y en el disco, y las tres se separaron sin
// que nada avisara: quedaron sesiones sin enlazar y enlaces a sesiones que
// no existían. Aquí la lista canónica es sesiones/_sesiones.json y esta
// comprobación exige que la portada la respete exactamente.
titulo('5 · Portada ↔ manifiesto de sesiones');
{
  const manif = path.join(RAIZ, 'sesiones', '_sesiones.json');
  const hub = path.join(RAIZ, 'index.html');

  if (!fs.existsSync(manif) || !fs.existsSync(hub)) {
    // Sin uno de los dos no hay nada que cruzar. No bloquea: un repo recién
    // clonado antes de construir la portada es un estado legítimo.
    console.log(gris('  omitida: falta sesiones/_sesiones.json o index.html'));
  } else {
    let datos = null;
    try { datos = JSON.parse(fs.readFileSync(manif, 'utf8')); }
    catch (e) { console.log(rojo('  ROTO  ') + `sesiones/_sesiones.json no es JSON válido — ${e.message}`); bloquea++; }

    if (datos) {
      const esperadas = datos.sesiones.map(s => s.slug);
      const src = fs.readFileSync(hub, 'utf8');
      const enlazadas = new Set(
        [...src.matchAll(/href="sesiones\/([^/"#?]+)/g)].map(m => decodeURIComponent(m[1]))
      );

      let fallos = 0;
      for (const slug of esperadas) {
        if (!fs.existsSync(path.join(RAIZ, 'sesiones', slug))) {
          console.log(rojo('  FALTA ') + `sesiones/${slug}/ está en el manifiesto pero no en el disco`);
          console.log(gris('          → node scripts/nueva-sesion.js'));
          fallos++;
        } else if (!enlazadas.has(slug)) {
          console.log(rojo('  SUELTA') + ` sesiones/${slug}/ existe pero la portada no la enlaza`);
          console.log(gris('          → añadirla al cronograma de index.html'));
          fallos++;
        }
      }
      for (const slug of enlazadas) {
        if (!esperadas.includes(slug)) {
          console.log(rojo('  EXTRA ') + `index.html enlaza sesiones/${slug}/, que no está en el manifiesto`);
          console.log(gris('          → añadirla a sesiones/_sesiones.json o quitarla de la portada'));
          fallos++;
        }
      }

      bloquea += fallos;
      if (!fallos) console.log(verde(`  ✅ las ${esperadas.length} sesiones del manifiesto existen y están enlazadas`));
    }
  }
}

// ── Resumen ──────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(66)}`);
console.log(bloquea ? rojo(`  ${bloquea} problema(s) que bloquean la publicación`)
                    : verde('  ✅ las cinco comprobaciones automatizables pasan'));
if (avisa) console.log(amar(`  ${avisa} aviso(s) para revisión humana`));
console.log(gris('  Falta §7.5: abrir en el navegador con el wifi apagado.'));
console.log(gris('  Consola sin errores · navegación por teclado · legible a 375 px.'));
console.log('═'.repeat(66));
process.exit(bloquea ? 1 : 0);
