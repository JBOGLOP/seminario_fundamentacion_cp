/**
 * ============================================================================
 * MOTOR DEL SEMINARIO — Google Apps Script
 * Seminario de fundamentación en cuidados paliativos · 32264001 · UAN
 * ----------------------------------------------------------------------------
 * Recibe los entregables previos de cada sesión y los sirve al tablero docente.
 *
 * UN SOLO PROYECTO PARA LAS SIETE SESIONES. Una hoja, una pestaña de respuestas
 * por sesión, un token de escritura por sesión. Se instala una vez.
 *
 * ⚠️ ESTE ARCHIVO SÍ PUEDE VIVIR EN EL REPOSITORIO PÚBLICO, y es deliberado:
 *    no contiene ni un secreto. El token de lectura vive en las Propiedades
 *    del script, y los tokens de escritura y las fechas viven en la pestaña
 *    `Config` de la hoja. Aquí solo está la lógica.
 *
 *    Lo que NUNCA puede salir de la hoja es la pestaña `Roster`: son datos
 *    personales (Ley 1581 de 2012). Por eso el cliente nunca la descarga —
 *    ver la nota sobre identidad, abajo.
 *
 * ----------------------------------------------------------------------------
 * CÓMO SE IDENTIFICA UN ESTUDIANTE, Y POR QUÉ ASÍ
 *
 * El estudiante escribe su correo institucional. El servidor lo busca en
 * `Roster` y acepta o rechaza. **El navegador nunca recibe la lista.**
 *
 * La alternativa —mandar el roster al cliente para pintar un selector— es más
 * cómoda y fue lo que se hizo en cursos anteriores, pero aquí el entregable
 * abre días antes de la sesión: la lista quedaría expuesta todo ese tiempo.
 * Un correo que no está en el roster simplemente no entra, y eso basta.
 *
 * ----------------------------------------------------------------------------
 * SEUDÓNIMOS
 *
 * Cada estudiante tiene un seudónimo estable («A», «B», …) que se asigna en el
 * roster. El tablero proyecta el seudónimo, no el nombre: en un seminario donde
 * se pide tomar posición, el anonimato al proyectar sube la honestidad de lo
 * que se escribe. El docente ve la correspondencia en su propio panel.
 * ============================================================================
 */

'use strict';

// ── Pestañas ────────────────────────────────────────────────────────────
var HOJA_ROSTER  = 'Roster';
var HOJA_CONFIG  = 'Config';
var HOJA_EVENTOS = 'Eventos';
var ZONA = 'America/Bogota';

// Encabezados fijos de toda pestaña de respuestas. Las preguntas se añaden
// después, una columna por pregunta, con el id que mande el cliente.
var CABECERA_FIJA = ['Timestamp', 'Correo', 'Nombre', 'Seudonimo', 'Version', 'DeclaracionIA', 'MinutosDedicados'];


/* ══════════════════════════════════════════════════════════════════════
   INSTALACIÓN
   Ejecutar `inicializar()` una vez desde el editor. Es idempotente.
   ══════════════════════════════════════════════════════════════════════ */

function inicializar() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var informe = [];

  // 1 · Roster
  var roster = libro.getSheetByName(HOJA_ROSTER);
  if (!roster) {
    roster = libro.insertSheet(HOJA_ROSTER);
    roster.appendRow(['Correo', 'Nombre', 'Codigo', 'Seudonimo', 'Activo']);
    roster.getRange('A1:E1').setFontWeight('bold');
    roster.setFrozenRows(1);
    informe.push('Creada la pestaña Roster. RELLÉNELA A MANO: sin roster no entra nadie.');
  } else {
    informe.push('Roster ya existía: ' + Math.max(0, roster.getLastRow() - 1) + ' estudiante(s).');
  }

  // 2 · Config — las fechas y los tokens se editan aquí, no en el código
  var config = libro.getSheetByName(HOJA_CONFIG);
  if (!config) {
    config = libro.insertSheet(HOJA_CONFIG);
    config.appendRow(['Sesion', 'Titulo', 'Token', 'Apertura', 'Cierre', 'Activa']);
    config.getRange('A1:F1').setFontWeight('bold');
    config.setFrozenRows(1);
    var sesiones = [
      ['S01', 'Antecedentes históricos y fundamentos filosóficos', '', '', '', 'No'],
      ['S02', 'Lineamientos y políticas: mundo, región, Colombia',  '', '', '', 'No'],
      ['S03', 'Marco legal, enfoque de derechos y barreras',        '', '', '', 'No'],
      ['S04', 'Modelos de atención y telesalud',                    '', '', '', 'No'],
      ['S05', 'Enfoques diferenciales',                             '', '', '', 'No'],
      ['S06', 'Bioética, dilemas y planificación anticipada',       '', '', '', 'No'],
      ['S07', 'Equipo interprofesional, liderazgo y redes',         '', '', '', 'No']
    ];
    // Un token distinto por sesión, generado aquí para que nadie tenga que
    // inventárselo. Se copian a mano al HTML de cada entregable.
    for (var i = 0; i < sesiones.length; i++) {
      sesiones[i][2] = sesiones[i][0] + '_SEM_CP_2026II_' + cadenaAleatoria_(6);
    }
    config.getRange(2, 1, sesiones.length, 6).setValues(sesiones);
    config.getRange('D2:E8').setNumberFormat('yyyy-mm-dd hh:mm');
    informe.push('Creada la pestaña Config con 7 tokens nuevos. Copie el de cada sesión a su HTML.');
  } else {
    informe.push('Config ya existía: no se tocó (los tokens no se regeneran solos).');
  }

  // 3 · Eventos
  if (!libro.getSheetByName(HOJA_EVENTOS)) {
    var ev = libro.insertSheet(HOJA_EVENTOS);
    ev.appendRow(['Timestamp', 'Sesion', 'Correo', 'Evento', 'Detalle']);
    ev.getRange('A1:E1').setFontWeight('bold');
    ev.setFrozenRows(1);
    informe.push('Creada la pestaña Eventos.');
  }

  // 4 · Token de lectura del tablero. Solo en Propiedades del script:
  //     nunca en la hoja, nunca en el repositorio.
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('DASH_TOKEN')) {
    var t = 'DASH_SEM_CP_2026II_' + cadenaAleatoria_(10);
    props.setProperty('DASH_TOKEN', t);
    informe.push('DASH_TOKEN generado: ' + t);
    informe.push('  → cópielo a config.js del tablero. NO va al repositorio.');
  } else {
    informe.push('DASH_TOKEN ya existía. Léalo en Configuración del proyecto → Propiedades.');
  }

  // 5 · Zona horaria
  if (libro.getSpreadsheetTimeZone() !== ZONA) {
    libro.setSpreadsheetTimeZone(ZONA);
    informe.push('Zona horaria fijada en ' + ZONA + '.');
  }

  var texto = informe.join('\n');
  Logger.log(texto);
  return texto;
}

/** Muestra el token de lectura sin tener que buscarlo en los menús. */
function verTokenDelTablero() {
  var t = PropertiesService.getScriptProperties().getProperty('DASH_TOKEN');
  Logger.log(t || 'No hay DASH_TOKEN. Ejecute inicializar().');
  return t;
}

/**
 * Asigna seudónimo a quien no lo tenga. Se puede reejecutar sin daño.
 *
 * ⚠️ BARAJA ANTES DE ASIGNAR, y eso no es un adorno. El roster está en orden
 * alfabético; si las letras se repartieran en orden de fila, «A» sería el
 * primer apellido del curso y cualquiera del grupo —que tiene la lista de
 * clase— desharía el anonimato de la proyección en diez segundos. Una
 * proyección que se descifra ordenando apellidos no es una proyección anónima.
 */
function asignarSeudonimos() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_ROSTER);
  if (!hoja || hoja.getLastRow() < 2) return 'Roster vacío.';
  var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, 5).getValues();

  var usados = {}, pendientes = [];
  filas.forEach(function (f, i) {
    if (f[3]) usados[String(f[3]).trim()] = true;
    else if (f[0]) pendientes.push(i);
  });

  // Fisher-Yates sobre las filas pendientes.
  for (var k = pendientes.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var tmp = pendientes[k]; pendientes[k] = pendientes[j]; pendientes[j] = tmp;
  }

  pendientes.forEach(function (i) {
    var s = siguienteSeudonimo_(usados);
    usados[s] = true;
    hoja.getRange(i + 2, 4).setValue(s);
  });

  return 'Seudónimos asignados: ' + pendientes.length +
         (pendientes.length ? ' (repartidos al azar, no por orden alfabético).' : '.');
}


/* ══════════════════════════════════════════════════════════════════════
   LECTURA — doGet
   ══════════════════════════════════════════════════════════════════════ */

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    switch (p.action) {
      case 'estado':  return json_(estadoSesion_(p.token));
      case 'tablero': return json_(tablero_(p.dash, p.sesion));
      default:        return json_({ ok: true, servicio: 'Motor del Seminario de fundamentación en CP', version: '1.0' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/**
 * Estado de una sesión. Lo consulta el entregable al abrir para saber si
 * está dentro de plazo. No devuelve ningún dato personal.
 */
function estadoSesion_(token) {
  var s = buscarSesionPorToken_(token);
  if (!s) return { ok: false, error: 'token_invalido' };

  var ahora = new Date();
  var abierta = s.activa &&
                (!s.apertura || ahora >= s.apertura) &&
                (!s.cierre   || ahora <= s.cierre);

  return {
    ok: true,
    sesion: s.id,
    titulo: s.titulo,
    abierta: abierta,
    activa: s.activa,
    apertura: s.apertura ? Utilities.formatDate(s.apertura, ZONA, "yyyy-MM-dd HH:mm") : null,
    cierre:   s.cierre   ? Utilities.formatDate(s.cierre,   ZONA, "yyyy-MM-dd HH:mm") : null,
    ahora: Utilities.formatDate(ahora, ZONA, "yyyy-MM-dd HH:mm")
  };
}

/**
 * Todo lo entregado en una sesión, para el tablero docente.
 * Exige DASH_TOKEN — que no es el token de escritura y nunca se publica.
 *
 * Devuelve identidad Y seudónimo: quien tiene este token es el docente y
 * necesita ambas cosas. Es el TABLERO el que decide qué proyecta; el modo
 * proyección oculta los nombres en pantalla, no en el transporte.
 */
function tablero_(dash, sesion) {
  var esperado = PropertiesService.getScriptProperties().getProperty('DASH_TOKEN');
  if (!esperado || dash !== esperado) return { ok: false, error: 'no_autorizado' };

  var s = buscarSesionPorId_(sesion);
  if (!s) return { ok: false, error: 'sesion_desconocida' };

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHojaRespuestas_(s.id));
  var roster = leerRoster_();
  var inscritos = Object.keys(roster).length;

  if (!hoja || hoja.getLastRow() < 2) {
    return { ok: true, sesion: s.id, titulo: s.titulo, inscritos: inscritos,
             entregas: 0, preguntas: [], respuestas: [], faltantes: nombresDe_(roster, {}) };
  }

  var datos = hoja.getDataRange().getValues();
  var cab = datos[0];
  var idsPregunta = cab.slice(CABECERA_FIJA.length);

  var respuestas = [], entregaron = {};
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[1]) continue;
    var correo = String(f[1]).toLowerCase().trim();
    entregaron[correo] = true;

    var porPregunta = {};
    for (var j = 0; j < idsPregunta.length; j++) {
      porPregunta[idsPregunta[j]] = f[CABECERA_FIJA.length + j] || '';
    }
    respuestas.push({
      timestamp: f[0] instanceof Date ? Utilities.formatDate(f[0], ZONA, "yyyy-MM-dd HH:mm") : String(f[0]),
      correo: correo,
      nombre: f[2] || '',
      seudonimo: f[3] || '?',
      version: f[4] || 1,
      declaracionIA: f[5] || '',
      minutos: f[6] || '',
      respuestas: porPregunta
    });
  }

  respuestas.sort(function (a, b) { return String(a.seudonimo).localeCompare(String(b.seudonimo)); });

  return {
    ok: true,
    sesion: s.id,
    titulo: s.titulo,
    inscritos: inscritos,
    entregas: respuestas.length,
    preguntas: idsPregunta,
    respuestas: respuestas,
    faltantes: nombresDe_(roster, entregaron)
  };
}


/* ══════════════════════════════════════════════════════════════════════
   ESCRITURA — doPost
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Recibe un entregable. Cuerpo esperado (JSON):
 *   { token, correo, nombre, minutos, declaracionIA,
 *     respuestas: { p1: '…', p2: '…' } }
 *
 * Reenviar SOBRESCRIBE la entrega anterior y sube el número de versión: el
 * entregable se puede corregir hasta el cierre. Es deliberado — un seminario
 * premia que se vuelva sobre lo escrito, no que se acierte a la primera.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'ocupado' });
  }

  try {
    var cuerpo = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var s = buscarSesionPorToken_(cuerpo.token);
    if (!s) return json_({ ok: false, error: 'token_invalido' });

    var ahora = new Date();
    if (!s.activa)                          return json_({ ok: false, error: 'sesion_cerrada' });
    if (s.apertura && ahora < s.apertura)   return json_({ ok: false, error: 'aun_no_abre' });
    if (s.cierre   && ahora > s.cierre)     return json_({ ok: false, error: 'plazo_vencido' });

    var correo = String(cuerpo.correo || '').toLowerCase().trim();
    if (!correo) return json_({ ok: false, error: 'falta_correo' });

    var roster = leerRoster_();
    var persona = roster[correo];
    if (!persona) {
      registrarEvento_(s.id, correo, 'correo_no_reconocido', '');
      return json_({ ok: false, error: 'correo_no_reconocido' });
    }

    var respuestas = cuerpo.respuestas || {};
    var ids = Object.keys(respuestas);
    if (!ids.length) return json_({ ok: false, error: 'sin_respuestas' });

    var hoja = hojaRespuestas_(s.id, ids);
    var cab = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];

    // Una pregunta nueva añade su columna sin romper lo ya entregado.
    for (var k = 0; k < ids.length; k++) {
      if (cab.indexOf(ids[k]) === -1) {
        hoja.insertColumnAfter(hoja.getLastColumn());
        hoja.getRange(1, hoja.getLastColumn()).setValue(ids[k]).setFontWeight('bold');
        cab.push(ids[k]);
      }
    }

    // ¿Ya había entregado? Se reescribe su fila.
    var fila = 0, version = 1;
    if (hoja.getLastRow() > 1) {
      var correos = hoja.getRange(2, 2, hoja.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < correos.length; i++) {
        if (String(correos[i][0]).toLowerCase().trim() === correo) {
          fila = i + 2;
          version = Number(hoja.getRange(fila, 5).getValue() || 1) + 1;
          break;
        }
      }
    }
    if (!fila) fila = hoja.getLastRow() + 1;

    var salida = new Array(cab.length).fill('');
    salida[0] = ahora;
    salida[1] = correo;
    salida[2] = persona.nombre;
    salida[3] = persona.seudonimo || asignarSeudonimoA_(correo);
    salida[4] = version;
    salida[5] = String(cuerpo.declaracionIA || '');
    salida[6] = String(cuerpo.minutos || '');
    for (var c = CABECERA_FIJA.length; c < cab.length; c++) {
      salida[c] = String(respuestas[cab[c]] || '');
    }

    hoja.getRange(fila, 1, 1, cab.length).setValues([salida]);
    registrarEvento_(s.id, correo, version > 1 ? 'reenvio' : 'entrega', 'v' + version);

    return json_({
      ok: true,
      mensaje: version > 1
        ? 'Entrega actualizada (versión ' + version + ').'
        : 'Entrega registrada.',
      version: version,
      seudonimo: salida[3],
      nombre: persona.nombre
    });

  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}


/* ══════════════════════════════════════════════════════════════════════
   AUXILIARES
   ══════════════════════════════════════════════════════════════════════ */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function nombreHojaRespuestas_(id) { return id + '_Respuestas'; }

function hojaRespuestas_(id, ids) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = nombreHojaRespuestas_(id);
  var hoja = libro.getSheetByName(nombre);
  if (!hoja) {
    hoja = libro.insertSheet(nombre);
    hoja.appendRow(CABECERA_FIJA.concat(ids));
    hoja.getRange(1, 1, 1, CABECERA_FIJA.length + ids.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function leerRoster_() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_ROSTER);
  var mapa = {};
  if (!hoja || hoja.getLastRow() < 2) return mapa;
  var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, 5).getValues();
  filas.forEach(function (f) {
    var correo = String(f[0] || '').toLowerCase().trim();
    if (!correo) return;
    if (String(f[4] || 'Sí').trim().toLowerCase().indexOf('no') === 0) return;  // Activo = No
    mapa[correo] = { nombre: f[1] || '', codigo: f[2] || '', seudonimo: f[3] || '' };
  });
  return mapa;
}

function nombresDe_(roster, entregaron) {
  var faltan = [];
  Object.keys(roster).forEach(function (correo) {
    if (!entregaron[correo]) faltan.push({ correo: correo, nombre: roster[correo].nombre, seudonimo: roster[correo].seudonimo });
  });
  return faltan;
}

function leerConfig_() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CONFIG);
  if (!hoja || hoja.getLastRow() < 2) return [];
  return hoja.getRange(2, 1, hoja.getLastRow() - 1, 6).getValues().map(function (f) {
    return {
      id: String(f[0] || '').trim(),
      titulo: String(f[1] || '').trim(),
      token: String(f[2] || '').trim(),
      apertura: f[3] instanceof Date ? f[3] : null,
      cierre:   f[4] instanceof Date ? f[4] : null,
      activa: String(f[5] || '').trim().toLowerCase().indexOf('s') === 0   // Sí / Si / S
    };
  });
}

function buscarSesionPorToken_(token) {
  token = String(token || '').trim();
  if (!token) return null;
  var todas = leerConfig_();
  for (var i = 0; i < todas.length; i++) if (todas[i].token && todas[i].token === token) return todas[i];
  return null;
}

function buscarSesionPorId_(id) {
  id = String(id || '').trim().toUpperCase();
  var todas = leerConfig_();
  for (var i = 0; i < todas.length; i++) if (todas[i].id.toUpperCase() === id) return todas[i];
  return null;
}

function registrarEvento_(sesion, correo, evento, detalle) {
  try {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_EVENTOS);
    if (hoja) hoja.appendRow([new Date(), sesion, correo, evento, detalle || '']);
  } catch (err) { /* la bitácora nunca puede tumbar una entrega */ }
}

function asignarSeudonimoA_(correo) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_ROSTER);
  if (!hoja || hoja.getLastRow() < 2) return '?';
  var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, 4).getValues();
  var usados = {};
  filas.forEach(function (f) { if (f[3]) usados[String(f[3]).trim()] = true; });
  for (var i = 0; i < filas.length; i++) {
    if (String(filas[i][0]).toLowerCase().trim() === correo) {
      var s = siguienteSeudonimo_(usados);
      hoja.getRange(i + 2, 4).setValue(s);
      return s;
    }
  }
  return '?';
}

/** A, B, … Z, AA, AB … Salta los ya usados. */
function siguienteSeudonimo_(usados) {
  for (var n = 0; n < 700; n++) {
    var s = '', x = n;
    do { s = String.fromCharCode(65 + (x % 26)) + s; x = Math.floor(x / 26) - 1; } while (x >= 0);
    if (!usados[s]) return s;
  }
  return '?';
}

function cadenaAleatoria_(n) {
  var abc = 'abcdefghijkmnpqrstuvwxyz23456789', s = '';
  for (var i = 0; i < n; i++) s += abc.charAt(Math.floor(Math.random() * abc.length));
  return s;
}
