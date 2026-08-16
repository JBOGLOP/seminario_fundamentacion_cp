// ═══════════════════════════════════════════════════════════════════
//  config.example.js — PLANTILLA DE CONFIGURACIÓN
//
//  Copia este archivo como  config.js  y rellena los valores reales.
//  ⚠️  config.js está en .gitignore y NUNCA debe subirse al repo público.
//
//      cp config.example.js config.js
//
//  Solo lo usa el TABLERO DOCENTE (_shared/tablero.html). Las páginas de
//  estudiante no cargan este archivo y no necesitan ningún secreto.
// ═══════════════════════════════════════════════════════════════════

window.CONFIG = {

  // ── Motor del seminario ──────────────────────────────────────────
  // URL /exec del despliegue de Apps Script.
  // Ver scripts/apps-script/INSTALACION.md
  appsScriptURL: 'https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec',

  // 🔴 TOKEN DE LECTURA DEL TABLERO. Este sí es un secreto de verdad:
  //    con él se descargan TODAS las entregas, con nombre y correo.
  //
  //    Lo genera `inicializar()` y vive en las Propiedades del script.
  //    Para verlo:  Apps Script → ejecutar `verTokenDelTablero()`.
  //    Para rotarlo: Configuración del proyecto → Propiedades del script
  //    → cambiar DASH_TOKEN → actualizar este archivo.
  //
  //    Si se filtra, rótelo el mismo día.
  dashToken: 'DASH_SEM_CP_2026II_xxxxxxxxxx',

  // Correo del docente, por si alguna página lo necesita.
  teacherEmail: 'jbogoya63@uan.edu.co',
};

// ── Nota sobre los tokens de ESCRITURA ─────────────────────────────
// Los entregables (sesiones/*/preparacion.html) llevan dentro un token
// por sesión, escrito en el propio HTML. Eso es DELIBERADO y no es una
// filtración: ese token solo enruta la entrega a su sesión. No lee nada,
// y quien no esté en el roster no puede entregar aunque lo copie.
//
// La lista del curso nunca sale del servidor: el estudiante escribe su
// correo y el servidor lo valida contra la hoja. Ver Codigo.gs.
