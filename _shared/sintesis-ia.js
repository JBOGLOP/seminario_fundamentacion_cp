/* ============================================================================
   sintesis-ia.js — el motor de síntesis local, en un solo sitio
   Seminario de fundamentación en cuidados paliativos · 2026-II
   ----------------------------------------------------------------------------
   Lo usan dos piezas, y por eso vive aparte:

     · _shared/tablero.html        lo carga con <script src="sintesis-ia.js">
     · scripts/resumir-entregas.js lo carga con require()

   Antes los prompts, los lectores y la verificación de citas estaban copiados
   en los dos archivos. Un prompt que se afina en uno y no en el otro produce
   un guion que dice una cosa y un tablero que proyecta otra.

   Es un archivo local, no un recurso externo: el tablero sigue abriendo con
   doble clic y sin conexión (regla 1). Solo el envío a Ollama necesita que
   Ollama esté corriendo en ESTE equipo.

   ── Dos productos, y solo uno se proyecta ───────────────────────────────────

   1. RESUMEN POR RESPUESTA. Siete campos sobre lo que escribió UNA persona.
      Nunca se proyecta: es una paráfrasis de máquina sobre alguien
      identificable, y el modo proyección lo oculta.

   2. SÍNTESIS DEL GRUPO. Todas las respuestas de una pregunta, agrupadas en
      ideas, sin autor. Esta SÍ se puede proyectar —es el patrón del tablero de
      Investigación en CP y Rehabilitación—, con tres condiciones:
        · el docente la genera y la lee ANTES de clase;
        · las citas son literales, verificadas contra los textos, y sin autor;
        · cualquier línea que contenga un nombre propio que aparezca en las
          respuestas (una ciudad, una clínica, un programa) queda marcada y el
          modo proyección la esconde. Es una red, no una garantía: por eso la
          primera condición no es opcional.

   ── Límites medidos el 30 de septiembre de 2026 (qwen3.5:9b, Ollama 0.35) ────
     · Contexto del modelo: 262 144 tokens. La pregunta más larga de la
       sesión 4 (seis respuestas, 1 829 palabras) ocupa 3 102: cabe de sobra.
       Aun así se fija num_ctx, porque el valor por defecto de Ollama puede ser
       menor y, si el texto no cabe, lo que se corta es el PRINCIPIO del prompt,
       que es donde van las instrucciones.
     · La síntesis salía corta porque el prompt pedía «una sola frase de 25
       palabras», no por un límite de Ollama. num_predict es un techo, no un
       objetivo: el modelo escribe lo que el prompt le pide.
     · qwen3.5 razona antes de responder. Sin think:false deja `response`
       vacío. Los modelos que no razonan ignoran el campo.
   ============================================================================ */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SintesisIA = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODELO_POR_DEFECTO = 'qwen3.5:9b';

  function peticion(modelo, prompt, tipo) {
    return {
      model: modelo || MODELO_POR_DEFECTO,
      prompt: prompt,
      stream: false,
      think: false,
      options: tipo === 'grupo'
        ? { temperature: 0.2, num_predict: 1000, num_ctx: 8192 }
        : { temperature: 0.2, num_predict: 900, num_ctx: 4096 }
    };
  }

  /* ── 1 · Resumen por respuesta ──────────────────────────────────────────
     Siete campos pensados para el patrón del seminario, «del juicio al dato»:
     qué sostiene, en qué fuente se apoya, qué dato lo convertiría en evidencia
     y qué no encontró. La ausencia documentada es un hallazgo, no un fallo. */
  var CAMPOS = [
    ['sintesis', 'SINTESIS', 'Síntesis'],
    ['fuente',   'FUENTE',   'Fuente que usa'],
    ['dato',     'DATO',     'Dato que propone o echa en falta'],
    ['vacio',    'VACIO',    'Lo que no encontró'],
    ['tension',  'TENSION',  'Tensión para discutir'],
    ['pregunta', 'PREGUNTA', 'Para devolver al grupo'],
    ['cita',     'CITA',     'Cita']
  ];

  function promptRespuesta(texto, pregunta) {
    return 'Eres asistente de un docente de una maestría en cuidados paliativos. El seminario enseña a pasar ' +
      'del juicio al dato: tomar una posición y preguntar qué dato la convertiría en evidencia y si ese dato existe. ' +
      'Vas a analizar la respuesta escrita por un estudiante (profesional de la salud) a una pregunta de preparación. ' +
      'Responde en español, sin markdown, y devuelve EXACTAMENTE estos siete bloques, cada uno empezando por su etiqueta:\n\n' +
      'SINTESIS: dos o tres frases que digan qué responde y cuál es su posición.\n' +
      'FUENTE: los documentos, normas, artículos o registros que el texto nombra, y de dónde dice sacarlos. Si no nombra ninguno, escribe: no cita fuente.\n' +
      'DATO: el dato que propone, encontró o echa en falta para sostener lo que afirma. Si no lo menciona, escribe: no lo menciona.\n' +
      'VACIO: lo que según el texto no existe, no se registra o no encontró al buscar. Si no lo menciona, escribe: no lo menciona.\n' +
      'TENSION: un punto discutible, una generalización o una contradicción útil para la discusión en clase.\n' +
      'PREGUNTA: una pregunta breve que el docente pueda devolver al grupo a partir de esta respuesta.\n' +
      'CITA: la frase más reveladora, COPIADA LITERALMENTE del texto, sin cambiar ni una palabra ni una tilde.\n\n' +
      'Reglas: en SINTESIS, FUENTE, DATO, VACIO y CITA usa solo lo que está en el texto; no inventes fuentes ni cifras. ' +
      'En TENSION y PREGUNTA puedes razonar, sin atribuir al estudiante algo que no dijo.\n\n' +
      'PREGUNTA DE LA SESIÓN: ' + (pregunta || '(no disponible)') + '\n\n' +
      'RESPUESTA DEL ESTUDIANTE:\n"""\n' + texto + '\n"""';
  }

  var sinTildes = function (x) { return String(x).normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  // Se lee por marcas de etiqueta, no por posición: el modelo a veces
  // reordena, pone asteriscos o repite una etiqueta. Gana la primera.
  function parsearRespuesta(salida) {
    var etiquetas = 'SINTESIS|SÍNTESIS|FUENTE|DATO|VACIO|VACÍO|TENSION|TENSIÓN|PREGUNTA|CITA';
    var re = new RegExp('^[\\s*#-]*(' + etiquetas + ')\\s*\\**\\s*:\\s*', 'gim');
    var marcas = [], m, res = {};
    salida = String(salida || '');
    while ((m = re.exec(salida)) !== null) marcas.push({ etq: m[1], ini: m.index, fin: re.lastIndex });
    marcas.forEach(function (mk, k) {
      var hasta = k + 1 < marcas.length ? marcas[k + 1].ini : salida.length;
      var norm = sinTildes(mk.etq).toUpperCase();
      var campo = CAMPOS.filter(function (c) { return c[1] === norm; })[0];
      if (campo && !res[campo[0]]) res[campo[0]] = salida.slice(mk.fin, hasta).trim();
    });
    return res;
  }

  /* ── La cita se verifica, no se cree ──────────────────────────────────
     Devuelve el fragmento DEL ORIGINAL —con sus tildes y su puntuación— o
     null. Tolera tildes, mayúsculas y espacios de más; nada más. Una cita
     corta pero literal sigue siendo cita («no sé si sirve»); lo que se
     descarta es el fragmento suelto de una o dos palabras. */
  function verificarCita(cita, original) {
    original = String(original || '');
    var limpia = String(cita || '').replace(/^[«"'“\s]+|[»"'”\s.]+$/g, '').trim();
    if (limpia.length < 12 || limpia.split(/\s+/).length < 3) return null;
    if (original.indexOf(limpia) !== -1) return limpia;
    var mapa = [], normal = '';
    for (var i = 0; i < original.length; i++) {
      var c = sinTildes(original[i]).toLowerCase();
      if (/\s/.test(c)) { if (normal.slice(-1) === ' ') continue; normal += ' '; mapa.push(i); }
      else { normal += c; mapa.push(i); }
    }
    var objetivo = sinTildes(limpia).toLowerCase().replace(/\s+/g, ' ').trim();
    var pos = normal.indexOf(objetivo);
    if (pos === -1) return null;
    return original.slice(mapa[pos], mapa[Math.min(pos + objetivo.length - 1, mapa.length - 1)] + 1).trim();
  }

  /* ── 2 · Síntesis del grupo ─────────────────────────────────────────────
     El ejemplo va sobre OTRO tema a propósito, y cada línea es específica de
     ese tema: en la primera prueba, un «vacío» genérico del ejemplo («el costo
     para la familia») apareció copiado en la síntesis real. */
  function promptGrupo(textos, pregunta) {
    var cuerpo = textos.map(function (t, i) {
      return 'RESPUESTA ' + (i + 1) + ':\n"""\n' + t + '\n"""';
    }).join('\n\n');
    return 'Eres asistente de un docente de una maestría en cuidados paliativos. Lees TODAS las respuestas del grupo ' +
      'a una misma pregunta y escribes una síntesis que se PROYECTARÁ en clase.\n\n' +
      'Anonimato (obligatorio): no nombres personas, instituciones, clínicas, hospitales, empresas, programas, ciudades, ' +
      'departamentos ni cargos, aunque aparezcan en las respuestas. Di «un servicio domiciliario», «una IPS privada», ' +
      '«una ciudad intermedia». Escribe en plural e impersonal. No escribas números de respuesta dentro de las frases.\n' +
      'Fidelidad: usa solo lo que está escrito. No inventes datos, fuentes ni normas.\n' +
      'Forma: rellena cada línea con el CONTENIDO REAL. No copies estas instrucciones, no uses paréntesis explicativos, ' +
      'no añadas líneas extra, no uses markdown. Cada bloque va en una sola línea.\n\n' +
      'Líneas que debes devolver, en este orden: cinco líneas IDEA (de la más respaldada a la menos), luego ACUERDO, ' +
      'TENSION, FUENTES, VACIO, PREGUNTAS y hasta tres líneas CITA.\n\n' +
      'Este es un ejemplo de salida BIEN HECHA, sobre otro tema (transporte a radioterapia), solo para que copies la FORMA; ' +
      'no copies su contenido:\n' +
      'IDEA: El traslado a radioterapia lo paga la familia y nadie lo registra como barrera || APOYOS: 1,3,4\n' +
      'IDEA: La EPS autoriza las sesiones de radioterapia pero no el transporte que las hace posibles || APOYOS: 2,4\n' +
      'IDEA: Las sesiones perdidas se anotan como inasistencia y no como abandono del tratamiento || APOYOS: 1,2\n' +
      'IDEA: Solo en un servicio alguien gestiona el traslado al búnker de radioterapia || APOYOS: 3\n' +
      'IDEA: Nadie sabe cuántas personas suspendieron la radioterapia por distancia || APOYOS: 2,3\n' +
      'ACUERDO: Todas describen una barrera de transporte a radioterapia que ningún registro cuenta.\n' +
      'TENSION: Unas culpan a la EPS del transporte; otras, a la falta de una ruta escrita en el propio servicio.\n' +
      'FUENTES: autorizaciones de radioterapia, listas de asistencia del búnker\n' +
      'VACIO: Ninguna menciona cuántas sesiones de radioterapia se reprogramaron por falta de transporte.\n' +
      'PREGUNTAS: ¿Quién debería contar las sesiones perdidas? / ¿Con qué dato se demostraría la barrera de transporte?\n' +
      'CITA: nadie lo registra como barrera || DE: 1\n\n' +
      'Las líneas CITA se COPIAN Y PEGAN: elige un fragmento de entre cuatro y doce palabras que esté literalmente ' +
      'en una respuesta, sin cambiar ni una palabra ni una tilde, y SIN nombres propios. Si no puedes copiar ninguno ' +
      'exacto, no escribas ninguna línea CITA.\n\n' +
      'Ahora hazlo de verdad con las respuestas de abajo. No hables de radioterapia ni de transporte si no aparecen en ellas.\n\n' +
      'PREGUNTA DE LA SESIÓN: ' + (pregunta || '(no disponible)') + '\n\n' + cuerpo;
  }

  // El modelo a veces devuelve la instrucción en vez del contenido.
  function esPlantilla(t) {
    return /^<|^(la idea|una frase|en qu[ée] coinciden|el desacuerdo|algo esperable|dos preguntas|documentos que|n[úu]meros de|una frase copiada)/i
      .test(String(t || '').trim());
  }

  function parsearGrupo(salida, textos) {
    var res = { ideas: [], citas: [] };
    var simples = { ACUERDO: 'acuerdo', TENSION: 'tension', FUENTES: 'fuentes', VACIO: 'vacio', PREGUNTAS: 'preguntas' };
    String(salida || '').split(/\r?\n/).forEach(function (l) {
      l = l.replace(/^[\s*#\-–]+/, '').trim();
      var m = l.match(/^(IDEA|ACUERDO|TENSI[OÓ]N|FUENTES|VAC[IÍ]O|PREGUNTAS|CITA)\s*\**\s*:\s*(.*)$/i);
      if (!m) return;
      var etq = sinTildes(m[1]).toUpperCase(), partes = m[2].trim().split(/\s*\|\|\s*/);
      if (!partes[0] || esPlantilla(partes[0])) return;
      if (etq === 'IDEA') {
        var apoyos = [];
        (partes[1] || '').replace(/APOYOS\s*:?/i, '').split(/[,;\s]+/).forEach(function (x) {
          var k = parseInt(x, 10);
          if (k >= 1 && k <= textos.length && apoyos.indexOf(k) === -1) apoyos.push(k);
        });
        res.ideas.push({ texto: partes[0].replace(/\s*\(?respuestas?[^)]*\)?\s*$/i, '').trim(), apoyos: apoyos.length });
      } else if (etq === 'CITA') {
        var de = parseInt((partes[1] || '').replace(/DE\s*:?/i, ''), 10);
        var orden = (de >= 1 && de <= textos.length) ? [textos[de - 1]].concat(textos) : textos;
        for (var i = 0; i < orden.length; i++) {
          var v = verificarCita(partes[0], orden[i]);
          if (v) { if (res.citas.indexOf(v) === -1) res.citas.push(v); break; }
        }
      } else if (simples[etq] && !res[simples[etq]]) {
        res[simples[etq]] = partes[0];
      }
    });
    return res;
  }

  /* ── Red para la proyección: nombres propios que vienen de las respuestas ──
     Se recogen las palabras que las propias respuestas escriben con mayúscula
     a mitad de oración —una ciudad, una clínica, un programa— y se marcan las
     líneas de la síntesis que las repiten. Se descuenta el vocabulario del
     curso (normas, instrumentos, fuentes públicas) y lo que va seguido de un
     número («Ley 1733»). Es conservador a propósito: esconder una idea buena
     en proyección cuesta poco; proyectar el nombre de la clínica de alguien,
     mucho. */
  var PERMITIDAS = ('Ley Leyes Resolución Resoluciones Decreto Sentencia Corte Constitucional Congreso Colombia ' +
    'Ministerio Minsalud MinSalud Salud Protección Social Observatorio Colombiano Colombiana Nacional Superintendencia ' +
    'Secretaría Departamental Municipal Sistema General Seguridad Social Unidad Servicio Programa Clínica Hospital ' +
    'Fundación Instituto Centro Cuidados Cuidado Paliativos Paliativo Dolor Atención Integral Domiciliaria Domiciliario ' +
    'Enfermería Medicina Oncología Psicología Trabajo Temel Basch Greer PRO-TECT REACH PC PRECIS PRECIS-2 RE-AIM ' +
    'RIPS REPS SISPRO EPS IPS ADRES OCCP OMS OPS WHO ECOG NECPAL CCOMS ICO ESAS PPS Karnofsky Barthel Zarit ENTIC DANE ' +
    'WhatsApp Telexperticia Teleconsulta Teleconcepto Telemonitoreo Telesalud Telemedicina JAMA NEJM Nature Lancet ' +
    'Cochrane ECA SGSSS RIAS PAIS MAITE DVA UAN TIC TICs IA HC CP UCI Art Res Núm Num Parágrafo Anexo ' +
    'Abstract Background Methods Results Discussion Conclusions Introduction Table Figure Supplementary ' +
    // Palabras comunes que a veces llegan con mayúscula tras un encabezado sin
    // puntuación («Población diana Existe…»). Ninguna puede ser un nombre.
    'Existe Existen Hay Tiene Tienen Cuenta Cuentan Según Además También Aunque Pero Cuando Donde Como ' +
    'Este Esta Estos Estas Ese Esa Los Las Una Uno Unos Unas Sin Con Para Por Solo Todo Todos Cada Algunos ' +
    'Otros Otras Sí Ninguna Ninguno Nadie Siempre Nunca Actualmente Finalmente Sin Embargo Respecto ' +
    'I II III IV').split(/\s+/);
  var PERMITIDAS_MAY = PERMITIDAS.map(function (p) { return p.toUpperCase(); });

  // Palabras funcionales del inglés: una mayúscula entre ellas es un título
  // citado («Early Palliative Care for Patients with…»), no un nombre propio.
  var INGLES = /^(for|with|of|the|and|in|to|on|an|vs|versus|from|at|by|or)$/i;

  function nombresDelGrupo(textos) {
    var vistos = {};
    // Un nombre propio nunca aparece en minúscula. Si el grupo escribe
    // «existe» o «consulta» en minúscula en alguna parte, su versión con
    // mayúscula es una palabra común mal puntuada, no una ciudad.
    var minusculas = {};
    (textos || []).forEach(function (t) {
      (String(t).match(/(?<![\wÁÉÍÓÚÜÑáéíóúüñ])[a-záéíóúüñ][\wÁÉÍÓÚÜÑáéíóúüñ\-]*/g) || []).forEach(function (w) {
        minusculas[sinTildes(w).toLowerCase()] = true;
      });
    });
    (textos || []).forEach(function (t) {
      String(t).split(/(?<=[.!?:;])\s+|\n+/).forEach(function (oracion) {
        var re = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][\wÁÉÍÓÚÜÑáéíóúüñ\-]*/g, m, toks = [];
        while ((m = re.exec(oracion)) !== null) toks.push({ t: m[0], i: m.index });
        // Rachas de mayúsculas con alguna palabra funcional inglesa dentro:
        // es un título citado y se ignora entero.
        var enTitulo = {}, k0 = 0;
        while (k0 < toks.length) {
          var k1 = k0, may = 0, ing = 0;
          while (k1 < toks.length && (/^[A-ZÁÉÍÓÚÑ]/.test(toks[k1].t) || INGLES.test(toks[k1].t))) {
            if (INGLES.test(toks[k1].t)) ing++; else may++;
            k1++;
          }
          if (ing && may >= 2) for (var z = k0; z < k1; z++) enTitulo[z] = true;
          k0 = Math.max(k1, k0 + 1);
        }
        toks.forEach(function (x, k) {
          if (enTitulo[k]) return;
          var tk = x.t;
          if (k === 0 || !/^[A-ZÁÉÍÓÚÑ]/.test(tk) || tk.length < 3) return;
          // Lo que va tras «¿», «¡», comillas, paréntesis, viñeta o barra
          // empieza frase aunque no haya punto antes: «… y ¿Qué dato…».
          var antes = oracion.slice(0, x.i).replace(/\s+$/, '').slice(-1);
          if (/[¿¡"«“'(\[\/•\-–—]/.test(antes)) return;
          if (PERMITIDAS_MAY.indexOf(tk.toUpperCase()) !== -1) return;
          if (minusculas[sinTildes(tk).toLowerCase()]) return;
          var resto = oracion.slice(x.i + tk.length);
          if (/^[\s.]*(de\s+)?\d/.test(resto)) return;          // Ley 1733, Res. 1644 de 2026
          vistos[tk] = true;
        });
      });
    });
    return Object.keys(vistos);
  }

  // Qué nombres del grupo aparecen en una frase de la síntesis, en cualquier
  // posición: si el modelo abre una frase con el nombre de una ciudad, esa
  // mayúscula también cuenta. Las palabras comunes («Existe») ya no llegan
  // aquí: nombresDelGrupo las descarta porque el grupo las escribe en minúscula.
  function nombresEn(frase, nombres) {
    frase = String(frase || '');
    return (nombres || []).filter(function (n) {
      return new RegExp('(^|[^\\wÁÉÍÓÚÜÑáéíóúüñ])' + n.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') +
        '($|[^\\wÁÉÍÓÚÜÑáéíóúüñ])').test(frase);
    });
  }

  /* Si el modelo no logra copiar ninguna cita literal, se sacan frases reales
     de los textos que reportan una ausencia: son literales por construcción.
     Pasan por la misma red de nombres. */
  var AUSENCIA = /(?:no\s+(?:encontr\w+|hay|existe\w*|aparece\w*|figura\w*|est[áa]\s+(?:document|registr)\w*|se\s+(?:encontr|report|registr|document|mide)\w*|pude\s+\w+)|sin\s+(?:registro|datos?|informaci[óo]n|evidencia)\w*|ausencia\s+de\s+\w+|no\s+se\s+conoce|nadie)/i;
  function citasDeRespaldo(textos, nombres) {
    var fuera = [];
    (textos || []).forEach(function (t) {
      String(t).split(/(?<=[.;!?])\s+|\n+/).forEach(function (fr) {
        var limpia = fr.trim().replace(/^[-–\s]+/, '').replace(/[.;\s]+$/, '');
        var n = limpia ? limpia.split(/\s+/).length : 0;
        if (n < 4 || n > 18 || !AUSENCIA.test(limpia)) return;
        if (nombresEn(limpia, nombres).length) return;
        if (fuera.indexOf(limpia) === -1) fuera.push(limpia);
      });
    });
    return fuera.sort(function (a, b) { return a.length - b.length; }).slice(0, 3);
  }

  return {
    MODELO_POR_DEFECTO: MODELO_POR_DEFECTO,
    CAMPOS: CAMPOS,
    peticion: peticion,
    promptRespuesta: promptRespuesta,
    parsearRespuesta: parsearRespuesta,
    promptGrupo: promptGrupo,
    parsearGrupo: parsearGrupo,
    verificarCita: verificarCita,
    nombresDelGrupo: nombresDelGrupo,
    nombresEn: nombresEn,
    citasDeRespaldo: citasDeRespaldo
  };
});
