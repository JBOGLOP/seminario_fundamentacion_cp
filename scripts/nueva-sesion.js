#!/usr/bin/env node
/**
 * nueva-sesion.js — crea la carpeta de cada sesión que todavía no exista.
 *
 *   node scripts/nueva-sesion.js            crea las que falten
 *   node scripts/nueva-sesion.js --listar   solo dice qué haría, sin escribir
 *
 * Lee la lista canónica de `sesiones/_sesiones.json` y la plantilla de
 * `_shared/plantilla-sesion.html`, y escribe por cada sesión:
 *
 *   sesiones/<slug>/index.html   ficha pública de la sesión
 *   sesiones/<slug>/README.md    nota de trabajo (qué falta, de dónde sale)
 *
 * NUNCA SOBRESCRIBE. Si el archivo ya existe se salta y lo dice. Se puede
 * ejecutar tantas veces como se quiera: en un curso ya empezado, solo crea
 * lo nuevo y deja intacto lo que se editó a mano.
 *
 * Por qué existe: en las dos asignaturas anteriores cada carpeta de sesión
 * nació de copiar y pegar la anterior, y las páginas se fueron pareciendo
 * cada vez menos entre sí. Aquí todas nacen del mismo molde.
 */
'use strict';
const fs = require('fs'), path = require('path');

const RAIZ = path.join(__dirname, '..');
const MANIFIESTO = path.join(RAIZ, 'sesiones', '_sesiones.json');
const PLANTILLA = path.join(RAIZ, '_shared', 'plantilla-sesion.html');
const SIMULAR = process.argv.includes('--listar');

const verde = s => `\x1b[32m${s}\x1b[0m`, gris = s => `\x1b[90m${s}\x1b[0m`;
const rojo = s => `\x1b[31m${s}\x1b[0m`, amar = s => `\x1b[33m${s}\x1b[0m`;

// El contenido del manifiesto acaba dentro de un HTML: se escapa siempre.
// Un título con «&» o unas comillas en un tema no pueden romper la página.
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const manifiesto = JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8'));
const plantilla = fs.readFileSync(PLANTILLA, 'utf8');

let creados = 0, saltados = 0, errores = 0;
console.log(`\n${manifiesto.asignatura} · ${manifiesto.semestre}`);
console.log(gris(`${manifiesto.sesiones.length} sesiones en el manifiesto\n`));

for (const s of manifiesto.sesiones) {
  const unidad = manifiesto.unidades[s.unidad];
  if (!unidad) {
    console.log(rojo('  ERROR ') + `${s.slug} — unidad «${s.unidad}» no existe en el manifiesto`);
    errores++;
    continue;
  }

  const dir = path.join(RAIZ, 'sesiones', s.slug);
  const numPad = String(s.num).padStart(2, '0');

  const valores = {
    NUM: String(s.num),
    NUM_PAD: numPad,
    SLUG: s.slug,
    TITULO: esc(s.titulo),
    FECHA: esc(s.fecha),
    MODALIDAD: esc(s.modalidad),
    CORTE: esc(s.corte),
    UNIDAD_NUM: s.unidad.replace(/\D/g, ''),
    UNIDAD_NOMBRE: esc(unidad.nombre),
    ACENTO: unidad.acento,
    ABSORBE: esc(s.absorbe),
    CHIP_ENTREGA: s.entrega ? `<li class="chip chip--entrega">${esc(s.entrega)}</li>` : '',
    TEMAS_LI: s.temas.map(t => `        <li>${esc(t)}</li>`).join('\n'),
  };

  // Se sustituye con función, no con cadena: así un valor que contenga «$&»
  // o «$1» no se interpreta como referencia de reemplazo.
  let html = plantilla.replace(/\$\{(\w+)\}/g, (coincidencia, clave) =>
    Object.prototype.hasOwnProperty.call(valores, clave) ? valores[clave] : coincidencia);

  const huerfanos = [...html.matchAll(/\$\{(\w+)\}/g)].map(m => m[1]);
  if (huerfanos.length) {
    console.log(rojo('  ERROR ') + `${s.slug} — marcadores sin valor: ${[...new Set(huerfanos)].join(', ')}`);
    errores++;
    continue;
  }

  const readme = `# Sesión ${numPad} · ${s.titulo}

**${s.fecha}** · ${s.modalidad} · 3 horas · ${s.corte}${s.entrega ? ` · ${s.entrega}` : ''}
Unidad ${valores.UNIDAD_NUM} — ${unidad.nombre}

> Nota de trabajo de la sesión. La ficha pública es [\`index.html\`](index.html);
> este archivo es para el docente y no pretende ser bonito.

## Qué se trabaja

${s.temas.map(t => `- ${t}`).join('\n')}

## De dónde sale

${s.absorbe}

## Estado

- [ ] Decidir qué se dicta y qué pasa a lectura previa
- [ ] Construir la clase (\`clase.html\`)
- [ ] Construir el material de estudiante (\`estudiante.html\`)
- [ ] Enlazar desde \`index.html\` de la sesión y desde la portada del seminario
- [ ] Pasar \`node scripts/verificar.js\` en verde

## Pendientes propios

_(sin pendientes registrados)_
`;

  const aEscribir = [
    [path.join(dir, 'index.html'), html],
    [path.join(dir, 'README.md'), readme],
  ];

  for (const [destino, contenido] of aEscribir) {
    const etiqueta = path.relative(RAIZ, destino).replace(/\\/g, '/');
    if (fs.existsSync(destino)) {
      console.log(gris('  ya está  ') + etiqueta);
      saltados++;
      continue;
    }
    if (SIMULAR) {
      console.log(amar('  crearía  ') + etiqueta);
      continue;
    }
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, contenido, 'utf8');
    console.log(verde('  creado   ') + etiqueta);
    creados++;
  }
}

console.log('');
if (SIMULAR) console.log(amar('  --listar: no se escribió nada'));
else console.log(`  ${creados} creado(s) · ${saltados} ya existía(n)`);
if (errores) {
  console.log(rojo(`  ${errores} sesión(es) con error`));
  process.exit(1);
}
console.log(gris('  Recuerde: la portada index.html se mantiene a mano.'));
console.log(gris('  La comprobación 5 de verificar.js avisa si se desincroniza.\n'));
