#!/usr/bin/env node
/**
 * resumir-entregas.js — borrador de guion para conducir una sesión.
 *
 *   node scripts/resumir-entregas.js --sesion S01
 *   node scripts/resumir-entregas.js --sesion S01 --modelo llama3.1:8b
 *   node scripts/resumir-entregas.js --sesion S01 --sin-ia     (solo señales)
 *
 * Baja las entregas del Apps Script y, con un modelo LOCAL (Ollama), escribe
 * `PRIVADO_guion-SNN.md` con dos cosas por pregunta:
 *
 *   · la SÍNTESIS DEL GRUPO —ideas sin autor, acuerdos, tensiones, vacíos y
 *     citas verificadas—, que es exactamente lo que el tablero puede proyectar
 *     con la tecla S. Aquí se lee antes, que es la condición para proyectarla;
 *   · el RESUMEN POR RESPUESTA en siete campos, que no se proyecta nunca.
 *
 * Los prompts, los lectores y la verificación de citas viven en
 * _shared/sintesis-ia.js, compartidos con el tablero: el guion y la pantalla
 * dicen lo mismo porque salen del mismo código.
 *
 * ────────────────────────────────────────────────────────────────────────
 * SE CORRE LA NOCHE ANTES, NUNCA EN CLASE. Dos razones:
 *
 *   · Tiempo. Unos diez segundos por respuesta y quince por síntesis de
 *     grupo con qwen3.5:9b (medido el 30-09-2026): una sesión de 7 × 4 va
 *     en cinco o seis minutos. Lo que no cabe en el aula es LEERLO.
 *   · Y la que manda: **nada generado por máquina se proyecta sin que el
 *     docente lo haya leído antes.** Este seminario evalúa verificar lo
 *     que se cita; proyectar una paráfrasis automática de lo que escribió
 *     un estudiante contradiría el curso. La salida es un BORRADOR para
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
const MODELO = arg('--modelo', 'qwen3.5:9b');
const SIN_IA = process.argv.includes('--sin-ia');
const OLLAMA = arg('--ollama', 'http://localhost:11434');

// ── Motor compartido con el tablero ──────────────────────────────────
const IA = require(path.join(RAIZ, '_shared', 'sintesis-ia.js'));

// Los títulos de las preguntas se leen del propio tablero: una sola fuente.
function titulosDe(sesion) {
  const src = fs.readFileSync(path.join(RAIZ, '_shared', 'tablero.html'), 'utf8');
  const bloque = (src.match(new RegExp(sesion + ':\\s*\\{([\\s\\S]*?)\\}')) || [])[1] || '';
  const t = {};
  bloque.replace(/(p\d+)\s*:\s*'([^']*)'/g, (_, k, v) => { t[k] = v; return ''; });
  return t;
}

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

async function pedir(prompt, tipo) {
  const r = await fetch(`${OLLAMA}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(IA.peticion(MODELO, prompt, tipo))
  });
  if (!r.ok) throw new Error(`Ollama respondió ${r.status}`);
  return (await r.json()).response || '';
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
  out.push(`> el texto original carácter a carácter — lo que no casó se descartó y se dice.`);
  out.push(`>`);
  out.push(`> **Por pregunta hay dos cosas.** Arriba, la **síntesis del grupo**: es lo que el tablero`);
  out.push(`> proyecta con la tecla S, y esta es la lectura que la autoriza. Lo marcado con ⚠️ repite`);
  out.push(`> un nombre propio de las respuestas y el modo proyección lo oculta. Debajo, el **resumen`);
  out.push(`> por respuesta**, que no se proyecta nunca.\n`);

  const TITULOS = titulosDe(SESION);
  const preparada = {};        // síntesis del grupo que el tablero proyectará
  let nCitas = 0, nDescartadas = 0;

  for (const q of datos.preguntas) {
    const conTexto = datos.respuestas.filter(r => String(r.respuestas[q] || '').trim());
    out.push(`\n---\n\n## ${q.toUpperCase()}${TITULOS[q] ? ' · ' + TITULOS[q] : ''}\n`);
    if (!conTexto.length) { out.push('_Nadie respondió esta pregunta._\n'); continue; }

    const textos = conTexto.map(r => String(r.respuestas[q]).trim());
    const aus = textos.filter(t => RE_AUS.test(t)).length;
    const fue = textos.filter(t => RE_FUE.test(t)).length;
    const largos = textos.map(palabras).sort((a, b) => a - b);

    out.push(`**Señales** · ${conTexto.length}/${datos.inscritos} respondieron · ` +
      `**${aus}** reportan que no encontraron el dato · ${fue} se apoyan en fuente · ` +
      `mediana ${largos[Math.floor(largos.length / 2)]} palabras\n`);

    // ── Síntesis del grupo: lo que se puede proyectar ──
    if (!SIN_IA) {
      process.stdout.write(gris(`  ${q} · síntesis del grupo … `));
      const nombres = IA.nombresDelGrupo(textos);
      const aviso = s => { const n = IA.nombresEn(s, nombres); return n.length ? ` ⚠️ _no se proyecta: ${n.join(', ')}_` : ''; };
      try {
        const g = IA.parsearGrupo(await pedir(IA.promptGrupo(textos, TITULOS[q]), 'grupo'), textos);
        console.log(g.ideas.length ? verde(`${g.ideas.length} ideas · ${g.citas.length} citas`) : amar('sin formato'));
        out.push(`### Síntesis del grupo · proyectable tras leerla\n`);
        if (!g.ideas.length) out.push(`_El modelo no devolvió el formato esperado. Genérela desde el tablero._\n`);
        g.ideas.forEach(i => out.push(`- ${i.texto}${i.apoyos ? ` _(≈ ${i.apoyos} de ${textos.length}, estimado)_` : ''}${aviso(i.texto)}`));
        [['acuerdo', 'Coinciden en'], ['tension', 'Tensión para discutir'], ['fuentes', 'Fuentes que citan'],
         ['vacio', 'Nadie menciona'], ['preguntas', 'Para devolver al grupo']]
          .forEach(([k, et]) => { if (g[k]) out.push(`\n**${et}:** ${g[k]}${aviso(g[k])}`); });
        const citasG = g.citas.length ? g.citas : IA.citasDeRespaldo(textos, nombres);
        if (g.ideas.length) preparada[q] = Object.assign({}, g, {
          citas: citasG, citasVerificadas: !!g.citas.length, estado: 'ok', n: textos.length,
          modelo: MODELO, cuando: new Date().toLocaleString('es-CO'), origen: 'guion' });
        if (citasG.length) {
          out.push(`\n**En sus palabras** _(${g.citas.length ? 'verificadas' : 'frases tomadas de los textos'}, sin autor)_:\n`);
          citasG.forEach(c => out.push(`> «${c}»${aviso(c)}\n`));
        }
        out.push('');
      } catch (err) { console.log(rojo('error: ' + err.message)); }
      out.push(`### Resumen por respuesta · no se proyecta\n`);
    }

    for (const r of conTexto) {
      const texto = String(r.respuestas[q]).trim();
      process.stdout.write(gris(`  ${q} · ${r.seudonimo} … `));

      let s = {};
      if (!SIN_IA) {
        try { s = IA.parsearRespuesta(await pedir(IA.promptRespuesta(texto, TITULOS[q]), 'respuesta')); }
        catch (err) { console.log(rojo('error: ' + err.message)); }
      }

      const cita = IA.verificarCita(s.cita, texto);
      if (s.cita && !cita) nDescartadas++;
      if (cita) nCitas++;
      console.log(cita ? verde('ok') : (s.cita ? amar('cita descartada') : gris('—')));

      out.push(`\n#### ${r.seudonimo} · ${palabras(texto)} palabras\n`);
      IA.CAMPOS.forEach(([k, , et]) => { if (k !== 'cita' && s[k]) out.push(`**${et}:** ${s[k]}\n`); });
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

  // La síntesis del grupo que se acaba de escribir en el guion es la que el
  // tablero proyectará: así lo proyectado es exactamente lo que se leyó. Va en
  // _shared/ con prefijo PRIVADO_ —fuera de git y del sitio publicado— y el
  // tablero la carga como carga config.js.
  if (Object.keys(preparada).length) {
    const js = path.join(RAIZ, '_shared', `PRIVADO_sintesis-grupo-${SESION}.js`);
    fs.writeFileSync(js, '/* PRIVADO · generado por scripts/resumir-entregas.js · no se publica */\n' +
      'window.SINTESIS_GRUPO = window.SINTESIS_GRUPO || {};\n' +
      `window.SINTESIS_GRUPO[${JSON.stringify(SESION)}] = ${JSON.stringify(preparada, null, 1)};\n`, 'utf8');
    console.log(`${verde('Escrito:')} _shared/PRIVADO_sintesis-grupo-${SESION}.js ${gris('(la síntesis que proyectará el tablero)')}`);
  }

  console.log(`\n${verde('Escrito:')} PRIVADO_guion-${SESION}.md`);
  console.log(gris(`  ${Math.round((Date.now() - t0) / 1000)} s · citas verificadas ${nCitas} · descartadas ${nDescartadas}`));
  console.log(gris('  Está fuera de git por el prefijo PRIVADO_. Compruébelo: git check-ignore -v el archivo.'));
  console.log(amar('  Léalo antes de la clase. Las síntesis son borrador de máquina.\n'));
})().catch(err => { console.error(rojo('\nFalló: ') + err.message); process.exit(1); });
