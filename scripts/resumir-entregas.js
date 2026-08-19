#!/usr/bin/env node
/**
 * resumir-entregas.js — borrador de guion para conducir una sesión.
 *
 *   node scripts/resumir-entregas.js --sesion S01
 *   node scripts/resumir-entregas.js --sesion S01 --modelo llama3.1:8b
 *   node scripts/resumir-entregas.js --sesion S01 --sin-ia     (solo señales)
 *
 * Baja las entregas del Apps Script, pide a un modelo LOCAL (Ollama) una
 * síntesis y una cita por respuesta, y escribe `PRIVADO_guion-SNN.md`.
 *
 * ────────────────────────────────────────────────────────────────────────
 * SE CORRE LA NOCHE ANTES, NUNCA EN CLASE. Dos razones:
 *
 *   · Tiempo. Unos 40 s por respuesta; ocho estudiantes × cinco preguntas
 *     son ~25 minutos. No cabe en el aula.
 *   · Y la que importa: **nada generado por máquina se proyecta sin que el
 *     docente lo haya leído antes.** Este seminario evalúa verificar lo que
 *     se cita; proyectar una paráfrasis automática de lo que escribió un
 *     estudiante contradiría el curso. La salida es un BORRADOR para
 *     preparar, no material de clase.
 *
 * ────────────────────────────────────────────────────────────────────────
 * LA CITA SE VERIFICA, NO SE CREE.
 *
 * Todo lo que el modelo devuelve como cita se busca en el texto original.
 * Si no aparece —aunque sea por una palabra— se descarta y se dice en el
 * guion. Y cuando aparece, se copia el fragmento DEL ORIGINAL, no el que
 * escribió el modelo: así lo que se proyecta son las palabras de la
 * persona, con sus tildes y su puntuación.
 *
 * ────────────────────────────────────────────────────────────────────────
 * DATOS PERSONALES. Ollama corre en este equipo: las respuestas no salen
 * de aquí. Mandarlas a una API en la nube NO estaría cubierto por lo que
 * se les declaró a los estudiantes («no se publican ni se comparten con
 * terceros»), y exigiría avisarles antes.
 *
 * La salida lleva prefijo PRIVADO_ y por tanto no entra a git.
 */
'use strict';
const fs = require('fs'), path = require('path');

const RAIZ = path.join(__dirname, '..');
const rojo = s => `\x1b[31m${s}\x1b[0m`, verde = s => `\x1b[32m${s}\x1b[0m`;
const amar = s => `\x1b[33m${s}\x1b[0m`, gris = s => `\x1b[90m${s}\x1b[0m`;

// ── Argumentos ───────────────────────────────────────────────────────
const arg = (n, def) => {
  const i = process.argv.indexOf(n);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const SESION = (arg('--sesion', 'S01')).toUpperCase();
const MODELO = arg('--modelo', 'qwen2.5:7b');
const SIN_IA = process.argv.includes('--sin-ia');
const OLLAMA = arg('--ollama', 'http://localhost:11434');

// ── Configuración · los secretos viven en config.js (ignorado) ───────
function leerConfig() {
  const f = path.join(RAIZ, 'config.js');
  if (!fs.existsSync(f)) {
    console.error(rojo('No existe config.js.') + ' Cópielo de config.example.js y rellénelo.');
    process.exit(1);
  }
  // Se extrae con expresión regular a propósito: no hace falta evaluar un
  // archivo que contiene secretos para leer dos cadenas de él.
  const src = fs.readFileSync(f, 'utf8');
  const saca = k => (src.match(new RegExp(k + "\\s*:\\s*'([^']+)'")) || [])[1];
  const cfg = { url: saca('appsScriptURL'), dash: saca('dashToken') };
  if (!cfg.url || !cfg.dash) {
    console.error(rojo('config.js no tiene appsScriptURL o dashToken.'));
    process.exit(1);
  }
  return cfg;
}

// ── Normalización para comparar citas ────────────────────────────────
// Sin tildes, sin dobles espacios y en minúscula. Un modelo puede
// devolver «paliativos.» donde el original dice «paliativos .» y eso no
// debería costar una cita buena.
const quitarTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = s => quitarTildes(String(s)).toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * Busca la cita en el original y devuelve el FRAGMENTO ORIGINAL, no el que
 * escribió el modelo. Devuelve null si no está: entonces se descarta.
 */
function verificarCita(cita, original) {
  const limpia = String(cita || '').replace(/^[«"'\s]+|[»"'\s]+$/g, '').trim();
  if (limpia.length < 20) return null;
  if (original.includes(limpia)) return limpia;               // exacta

  // Comparación normalizada, con mapa de posiciones para recuperar el
  // original: se guarda, por cada carácter de la versión normalizada, de
  // qué posición del texto real vino.
  const mapa = [];
  let normal = '';
  for (let i = 0; i < original.length; i++) {
    const c = quitarTildes(original[i]).toLowerCase();
    if (/\s/.test(c)) {
      if (normal.endsWith(' ')) continue;
      normal += ' '; mapa.push(i);
    } else {
      normal += c; mapa.push(i);
    }
  }
  const objetivo = norm(limpia);
  const i = normal.indexOf(objetivo);
  if (i === -1) return null;
  const desde = mapa[i];
  const hasta = mapa[Math.min(i + objetivo.length - 1, mapa.length - 1)] + 1;
  return original.slice(desde, hasta).trim();
}

// ── Ollama ───────────────────────────────────────────────────────────
const PROMPT = (texto) => `Eres un asistente que prepara material docente. Analiza la respuesta de un estudiante y devuelve EXACTAMENTE tres bloques, sin añadir nada más y sin repetir estas instrucciones.

SINTESIS: una sola frase de máximo 25 palabras que diga qué sostiene la respuesta.
DATOS: hasta tres datos concretos del texto (fechas, cifras, instituciones, fuentes), separados por " · ". Si no hay ninguno, escribe: ninguno
CITA: una frase COPIADA LITERALMENTE del texto, sin cambiar ni una palabra ni una tilde, que sea la más discutible o la más reveladora.

No inventes nada. No interpretes. Si algo no está en el texto, no lo pongas.

TEXTO DEL ESTUDIANTE:
"""
${texto}
"""`;

async function preguntar(texto) {
  const r = await fetch(`${OLLAMA}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO, prompt: PROMPT(texto), stream: false,
      options: { temperature: 0.1, num_predict: 400 }
    })
  });
  if (!r.ok) throw new Error(`Ollama respondió ${r.status}`);
  return (await r.json()).response || '';
}

function parsear(salida) {
  // La etiqueta va agrupada: sin (?:…) la alternancia SINTESIS|SÍNTESIS se
  // come el resto del patrón, casa solo la etiqueta y el grupo 1 queda sin
  // definir. Ese fue el fallo de la primera versión.
  const saca = (etq, sig) => {
    const re = new RegExp('(?:' + etq + ')' + '\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*(?:' + sig + ')\\s*:|$)', 'i');
    const m = salida.match(re);
    return m && m[1] ? m[1].trim().replace(/^\d\.\s*/, '').trim() : '';
  };
  return {
    sintesis: saca('SINTESIS|SÍNTESIS', 'DATOS|CITA'),
    datos: saca('DATOS', 'CITA'),
    cita: saca('CITA', '$^')
  };
}

// ── Señales, las mismas del tablero ──────────────────────────────────
const RE_AUS = /(?:no\s+(?:encontr\w+|hay|existe\w*|aparece\w*|figura\w*|est[áa]\s+(?:document|registr)\w*|se\s+(?:encontr|report|registr|document)\w*|pude\s+\w+)|sin\s+(?:registro|datos?|informaci[óo]n|evidencia)\w*|ausencia\s+de\s+\w+|no\s+se\s+conoce)/i;
const RE_FUE = /(?:seg[úu]n\s+\w+|p[áa]g(?:ina)?\.?\s*\d+|OCCP|OMS|WHO|IAHPC|OPS|WHPCA|Atlas|Ley\s+\d+|Resoluci[óo]n\s+\d+|Sentencia\s+[CT]-\d+|https?:\/\/\S+)/i;
const palabras = t => (t || '').trim() ? t.trim().split(/\s+/).length : 0;

// ── Principal ────────────────────────────────────────────────────────
(async function () {
  const cfg = leerConfig();

  console.log(`\nSesión ${SESION} · modelo ${SIN_IA ? gris('(sin IA)') : MODELO}`);
  const url = `${cfg.url}?action=tablero&dash=${encodeURIComponent(cfg.dash)}&sesion=${SESION}&t=${Date.now()}`;
  const datos = await (await fetch(url)).json();
  if (!datos.ok) {
    console.error(rojo('El servidor rechazó la consulta: ') + datos.error);
    process.exit(1);
  }
  console.log(gris(`${datos.entregas} de ${datos.inscritos} entregas · ${datos.preguntas.length} preguntas`));

  if (!datos.entregas) { console.log(amar('No hay entregas todavía.')); process.exit(0); }

  if (!SIN_IA) {
    try {
      const v = await (await fetch(`${OLLAMA}/api/version`)).json();
      console.log(gris(`Ollama ${v.version} en ${OLLAMA}`));
    } catch (err) {
      console.error(rojo('No responde Ollama en ' + OLLAMA + '.') +
        ' Ábralo, o use --sin-ia para generar solo las señales.');
      process.exit(1);
    }
  }

  const t0 = Date.now();
  const out = [];
  out.push(`# PRIVADO · Guion de la sesión ${SESION}\n`);
  out.push(`> 🔴 **Borrador de máquina y datos personales. No entra al repositorio ni se proyecta sin leer.**`);
  out.push(`>`);
  out.push(`> Generado el ${new Date().toLocaleString('es-CO')} con \`${SIN_IA ? 'sin IA' : MODELO}\` en local.`);
  out.push(`> ${datos.entregas} de ${datos.inscritos} entregas · ${datos.titulo}`);
  out.push(`>`);
  out.push(`> **Las síntesis son de la máquina: revíselas.** Las citas están verificadas contra`);
  out.push(`> el texto original carácter a carácter — lo que no casó se descartó y se dice.\n`);

  let nCitas = 0, nDescartadas = 0;

  for (const q of datos.preguntas) {
    const conTexto = datos.respuestas.filter(r => String(r.respuestas[q] || '').trim());
    out.push(`\n---\n\n## ${q.toUpperCase()}\n`);
    if (!conTexto.length) { out.push('_Nadie respondió esta pregunta._\n'); continue; }

    const textos = conTexto.map(r => String(r.respuestas[q]).trim());
    const aus = textos.filter(t => RE_AUS.test(t)).length;
    const fue = textos.filter(t => RE_FUE.test(t)).length;
    const largos = textos.map(palabras).sort((a, b) => a - b);

    out.push(`**Señales** · ${conTexto.length}/${datos.inscritos} respondieron · ` +
      `**${aus}** reportan que no encontraron el dato · ${fue} se apoyan en fuente · ` +
      `mediana ${largos[Math.floor(largos.length / 2)]} palabras\n`);

    for (const r of conTexto) {
      const texto = String(r.respuestas[q]).trim();
      process.stdout.write(gris(`  ${q} · ${r.seudonimo} … `));

      let s = { sintesis: '', datos: '', cita: '' };
      if (!SIN_IA) {
        try { s = parsear(await preguntar(texto)); }
        catch (err) { console.log(rojo('error: ' + err.message)); }
      }

      const cita = verificarCita(s.cita, texto);
      if (s.cita && !cita) nDescartadas++;
      if (cita) nCitas++;
      console.log(cita ? verde('ok') : (s.cita ? amar('cita descartada') : gris('—')));

      out.push(`\n### ${r.seudonimo} · ${palabras(texto)} palabras\n`);
      if (s.sintesis) out.push(`**Síntesis (máquina):** ${s.sintesis}\n`);
      if (s.datos && !/^ninguno/i.test(s.datos)) out.push(`**Datos:** ${s.datos}\n`);
      if (cita) {
        out.push(`> «${cita}»\n`);
        out.push(`_Cita verificada en el original._\n`);
      } else if (s.cita) {
        out.push(`⚠️ _El modelo propuso una cita que **no aparece literalmente** en el texto. Descartada._\n`);
      }
      out.push(`<details><summary>Respuesta completa de ${r.seudonimo}</summary>\n\n${texto}\n\n</details>\n`);
    }
  }

  out.push(`\n---\n\n_Citas verificadas: ${nCitas} · descartadas por no ser literales: ${nDescartadas}._\n`);

  const destino = path.join(RAIZ, `PRIVADO_guion-${SESION}.md`);
  fs.writeFileSync(destino, out.join('\n'), 'utf8');

  console.log(`\n${verde('Escrito:')} PRIVADO_guion-${SESION}.md`);
  console.log(gris(`  ${Math.round((Date.now() - t0) / 1000)} s · citas verificadas ${nCitas} · descartadas ${nDescartadas}`));
  console.log(gris('  Está fuera de git por el prefijo PRIVADO_. Compruébelo: git check-ignore -v el archivo.'));
  console.log(amar('  Léalo antes de la clase. Las síntesis son borrador de máquina.\n'));
})().catch(err => { console.error(rojo('\nFalló: ') + err.message); process.exit(1); });
