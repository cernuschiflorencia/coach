/**
 * Recibe las suscripciones al newsletter y las agrega a contactos.txt,
 * dentro de la carpeta CONTACTOS COACH del Drive de Florencia.
 *
 * Formato de cada línea, separado por tabulaciones:
 *   fecha    email    dispositivo
 *
 * Cómo publicarlo: ver README.md en esta misma carpeta.
 */

// contactos.txt dentro de CONTACTOS COACH
var ARCHIVO_ID = '1C8BVMY_souttA36YxpPXSvsiG3VNQgL5';

var ZONA_HORARIA = 'America/Argentina/Buenos_Aires';

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    var email = String(datos.email || '').trim();

    // Se revalida del lado del servidor: la validación del navegador se puede saltear.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return responder({ ok: false, error: 'email_invalido' });
    }

    var dispositivo = String(datos.dispositivo || 'desconocido').slice(0, 80);
    var fecha = Utilities.formatDate(new Date(), ZONA_HORARIA, 'yyyy-MM-dd HH:mm:ss');

    // Sin el lock, dos suscripciones simultáneas se pisan: las dos leen el mismo
    // contenido y la segunda sobrescribe la línea de la primera.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var archivo = DriveApp.getFileById(ARCHIVO_ID);
      var contenido = archivo.getBlob().getDataAsString('UTF-8');
      var linea = [fecha, email, dispositivo].join('\t');
      archivo.setContent(contenido + linea + '\n');
    } finally {
      lock.releaseLock();
    }

    return responder({ ok: true });

  } catch (err) {
    return responder({ ok: false, error: String(err) });
  }
}

/** Permite probar la publicación abriendo la URL en el navegador. */
function doGet() {
  return responder({ ok: true, mensaje: 'El endpoint está publicado.' });
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
