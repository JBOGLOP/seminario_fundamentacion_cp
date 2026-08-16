/* ============================================================================
   bitacora.js — Registro de accesos al material del curso
   Contexto Histórico y Legal de los Cuidados Paliativos (37542001) · UAN
   ----------------------------------------------------------------------------
   ⚠️ FUENTE CANÓNICA, NO ENLACE.
   Igual que tokens.css, este archivo se COPIA EN LÍNEA dentro de un <script>
   de cada página. Si se enlazara con <script src>, una página descargada
   suelta dejaría de funcionar y se rompería la regla de portabilidad.

   ────────────────────────────────────────────────────────────────────────
   QUÉ ES Y QUÉ NO ES

   Esto es una BITÁCORA, no un control de acceso. GitHub Pages es estático y
   el repositorio es público: no existe forma de impedir que alguien lea el
   material. Cualquier puerta en JavaScript se salta con Ctrl+U o con la URL
   directa. Lo que esto hace es registrar quién consulta qué, cuando la
   persona acepta identificarse.

   Si hace falta restringir de verdad el acceso, el contenido no va aquí:
   va en un Apps Script con acceso limitado al dominio uan.edu.co, o en el
   aula virtual de la UAN. Ver docs/BITACORA_ACCESOS.md.

   ────────────────────────────────────────────────────────────────────────
   TRES REGLAS DE DISEÑO

   1. NO BLOQUEA. Se puede cerrar el aviso y seguir leyendo. El material
      docente es abierto; el registro es voluntario.
   2. NO ROMPE LA PORTABILIDAD (D7). Sin conexión, el envío falla en
      silencio y la página funciona idéntica. Se puede abrir con doble clic
      y sin red, como todo el curso.
   3. PIDE LOS DATOS UNA SOLA VEZ. Se guardan en localStorage del propio
      navegador; las visitas siguientes se registran sin volver a preguntar.

   ────────────────────────────────────────────────────────────────────────
   PROTECCIÓN DE DATOS (Ley 1581 de 2012 · Decreto 1377 de 2013)

   Se recogen nombre y correo, que son datos personales. Por eso:
   - el aviso de tratamiento se muestra ANTES de pedir nada;
   - el registro es voluntario y revocable desde la propia página;
   - los datos van a una hoja de cálculo PRIVADA del docente;
   - NO se recoge cédula: el receptor antiguo la pedía y no hace falta.
   Ver PROTECCION_DATOS.md y docs/FORMATO_CONSENTIMIENTO_DATOS.md.
   ============================================================================ */
(function () {
  'use strict';

  // ── Configuración ────────────────────────────────────────────────────
  // La URL del despliegue tiene que estar aquí, visible. No hay alternativa:
  // en un sitio estático el navegador necesita conocerla para escribir.
  // El endpoint SOLO ESCRIBE — nunca devuelve datos de la hoja —, así que
  // lo peor que puede pasar es que alguien inserte filas basura, no que se
  // filtre nada. Ver docs/BITACORA_ACCESOS.md.
  var URL_RECEPTOR = '';           // ← pegar aquí la URL del Apps Script
  var CLAVE = 'chlcp.bitacora.v1'; // clave de localStorage
  var CURSO = '37542001';

  if (!URL_RECEPTOR) return;       // sin receptor configurado, no hace nada

  // ── Utilidades ───────────────────────────────────────────────────────
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); }
    catch (e) { return null; }     // modo privado o storage bloqueado
  }
  function guardar(v) {
    try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch (e) {}
  }
  function olvidar() {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
  }
  function correoValido(c) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
  }

  // ── Envío ────────────────────────────────────────────────────────────
  // no-cors + sin header Content-Type: es el patrón que ya usa el receptor
  // del curso y evita el preflight, que Apps Script no responde.
  // keepalive hace que el ping sobreviva si la persona navega enseguida.
  function registrar(persona) {
    var carga = {
      curso: CURSO,
      pagina: location.pathname.replace(/^.*\/([^/]*)$/, '$1') || 'index.html',
      titulo: document.title,
      nombre: persona.nombre,
      correo: persona.correo
      // El timestamp lo pone el servidor: el reloj del navegador se puede
      // cambiar y aquí la hora importa.
    };
    try {
      fetch(URL_RECEPTOR, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        body: JSON.stringify(carga)
      }).catch(function () {});   // sin red: falla en silencio, y ya está
    } catch (e) {}
  }

  // ── Aviso e invitación a registrarse ─────────────────────────────────
  var CSS =
  '.bt-caja{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;' +
  'max-width:30rem;margin-left:auto;background:#FFF;color:#2D2D2D;' +
  'border-radius:12px;box-shadow:0 12px 40px rgba(45,45,45,.22);' +
  'border-left:5px solid #7A8B6F;padding:1.05rem 1.2rem;' +
  "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;" +
  'font-size:.88rem;line-height:1.55}' +
  '.bt-caja h2{margin:0 0 .4rem;font-size:.95rem;color:#5C6E54}' +
  '.bt-caja p{margin:0 0 .7rem;color:#595959;font-size:.83rem}' +
  '.bt-campos{display:grid;gap:.45rem;margin-bottom:.7rem}' +
  '.bt-campos label{display:block;font-size:.76rem;color:#595959;margin-bottom:.15rem}' +
  '.bt-campos input{width:100%;padding:.45rem .6rem;border:1px solid #CFC8BC;' +
  'border-radius:6px;font:inherit;font-size:.87rem;background:#FAF6EF;color:#2D2D2D}' +
  '.bt-campos input:focus-visible{outline:3px solid #7A8B6F;outline-offset:1px}' +
  '.bt-acciones{display:flex;flex-wrap:wrap;gap:.45rem;align-items:center}' +
  '.bt-btn{font:inherit;font-size:.83rem;font-weight:600;cursor:pointer;' +
  'border-radius:999px;padding:.4rem 1rem;border:1px solid #7A8B6F;' +
  'background:#5C6E54;color:#FFF}' +
  '.bt-btn:hover{background:#4A5A44}' +
  '.bt-btn--sec{background:transparent;color:#595959;border-color:#CFC8BC}' +
  '.bt-btn--sec:hover{background:#F2EDE4}' +
  '.bt-btn:focus-visible{outline:3px solid #7A8B6F;outline-offset:2px}' +
  '.bt-error{color:#B54343;font-size:.78rem;margin:.15rem 0 .5rem;display:none}' +
  '.bt-legal{font-size:.72rem;color:#8A8A8A;margin:.55rem 0 0}' +
  '.bt-firma{position:fixed;right:1rem;bottom:1rem;z-index:9998;font-size:.7rem;' +
  "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;" +
  'color:#8A8A8A;background:rgba(250,246,239,.92);border:1px solid #E4DDD1;' +
  'border-radius:999px;padding:.2rem .65rem;cursor:pointer}' +
  '.bt-firma:hover{color:#5C6E54}' +
  '@media print{.bt-caja,.bt-firma{display:none}}' +
  '@media (max-width:26rem){.bt-caja{left:.5rem;right:.5rem;bottom:.5rem}}';

  function estilo() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function firma(persona) {
    // Marca discreta: permite revocar el registro sin buscar en ajustes.
    var b = document.createElement('button');
    b.className = 'bt-firma';
    b.type = 'button';
    b.textContent = 'Registrado como ' + persona.nombre.split(' ')[0] + ' · cambiar';
    b.title = 'Borrar mis datos de este navegador';
    b.addEventListener('click', function () {
      olvidar();
      b.remove();
      preguntar();
    });
    document.body.appendChild(b);
  }

  function preguntar() {
    var caja = document.createElement('section');
    caja.className = 'bt-caja';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-labelledby', 'bt-tit');
    caja.innerHTML =
      '<h2 id="bt-tit">Material del curso · registro de consulta</h2>' +
      '<p>Si quiere, identifíquese para que el docente sepa qué material se está ' +
      'consultando. <strong>Es voluntario</strong>: puede continuar sin registrarse y ' +
      'leerlo todo igual.</p>' +
      '<div class="bt-campos">' +
        '<div><label for="bt-n">Nombre y apellido</label>' +
        '<input id="bt-n" type="text" autocomplete="name" maxlength="80"></div>' +
        '<div><label for="bt-c">Correo electrónico</label>' +
        '<input id="bt-c" type="email" autocomplete="email" maxlength="120"></div>' +
      '</div>' +
      '<p class="bt-error" id="bt-err" role="alert"></p>' +
      '<div class="bt-acciones">' +
        '<button class="bt-btn" type="button" id="bt-ok">Registrarme</button>' +
        '<button class="bt-btn bt-btn--sec" type="button" id="bt-no">Continuar sin registrarme</button>' +
      '</div>' +
      '<p class="bt-legal"><strong>Tratamiento de datos.</strong> Su nombre y correo se usan ' +
      'únicamente para la gestión académica de este curso y se guardan en un archivo privado ' +
      'del docente. Responsable: Jorge Wilhem Bogoya López · ' +
      '<a href="mailto:jbogoya63@uan.edu.co">jbogoya63@uan.edu.co</a>. Puede conocer, ' +
      'actualizar, rectificar o suprimir sus datos escribiéndole. Al registrarse autoriza este ' +
      'tratamiento conforme a la Ley 1581 de 2012.</p>';

    document.body.appendChild(caja);

    var n = caja.querySelector('#bt-n');
    var c = caja.querySelector('#bt-c');
    var err = caja.querySelector('#bt-err');

    caja.querySelector('#bt-no').addEventListener('click', function () {
      // «Sin registrarme» se recuerda para no volver a preguntar en cada página.
      guardar({ omitido: true });
      caja.remove();
    });

    caja.querySelector('#bt-ok').addEventListener('click', function () {
      var nombre = n.value.trim(), correo = c.value.trim();
      if (nombre.length < 3)      { err.textContent = 'Escriba su nombre y apellido.'; err.style.display = 'block'; n.focus(); return; }
      if (!correoValido(correo))  { err.textContent = 'Ese correo no parece válido.';  err.style.display = 'block'; c.focus(); return; }
      var persona = { nombre: nombre, correo: correo };
      guardar(persona);
      registrar(persona);
      caja.remove();
      firma(persona);
    });

    n.focus();
  }

  // ── Arranque ─────────────────────────────────────────────────────────
  function iniciar() {
    estilo();
    var guardado = leer();
    if (!guardado)          { preguntar(); return; }   // primera visita
    if (guardado.omitido)   { return; }                // ya dijo que no
    registrar(guardado);                               // visita conocida
    firma(guardado);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
