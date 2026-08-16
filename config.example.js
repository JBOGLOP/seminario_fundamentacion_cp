// ═══════════════════════════════════════════════════════════════════
//  config.example.js — PLANTILLA DE CONFIGURACIÓN
//
//  Copia este archivo como  config.js  y rellena los valores reales.
//  ⚠️  config.js está en .gitignore y NUNCA debe subirse al repo público.
//
//      cp config.example.js config.js
//
//  En los HTML que usan estos valores, carga config.js con:
//      <script src="config.js"></script>
//  y referencia  window.CONFIG.<clave>  en lugar de dejar los secretos
//  escritos directamente en el HTML.
// ═══════════════════════════════════════════════════════════════════

window.CONFIG = {
  // URL del despliegue de Google Apps Script (receptor de respuestas).
  // NO la publiques en el repo. Va aquí, en config.js (ignorado por Git).
  appsScriptURL: 'https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec',

  // Correo del docente para el resumen automático (puede ir en el Apps Script).
  teacherEmail: 'TU_CORREO@ejemplo.com',

  // Configuración del examen.
  // ⚠️ IDEALMENTE la contraseña y la clave de respuestas viven en el SERVIDOR
  //    (Apps Script), no en el navegador. Ver docs/ENDURECER_EXAMEN.md.
  //    Si por ahora siguen en el cliente, al menos manténlas SOLO en config.js
  //    (ignorado) y rota la contraseña cada semestre.
  exam: {
    teacherPass: 'CAMBIAR_CADA_SEMESTRE',   // rota este valor
    unlockTime: '08:00',                     // hora de desbloqueo (24h)
    examDuration: 15,                        // minutos
    // La clave de respuestas NO debería estar en el cliente. Si es
    // inevitable temporalmente, déjala aquí y nunca en el HTML público:
    // examCorrectAnswers: { eq1: 'x', eq2: 'x', eq3: 'x', eq4: 'x', eq5: 'x' },
    // ⚠️ Las letras de arriba son marcadores, no la clave. La plantilla
    //    llevaba las respuestas reales del examen de 2026-I escritas como
    //    "ejemplo": ir en un comentario no las hace menos públicas.
  },
};
