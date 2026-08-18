# Newsletter → Google Drive

El formulario de la home manda cada suscripción a un Google Apps Script, y ese
script agrega una línea a `contactos.txt` en el Drive de Florencia.

Hace falta este intermediario porque el sitio es estático: GitHub Pages no puede
escribir en Drive por sí solo, y poner credenciales de Google en el HTML las
dejaría a la vista de cualquiera que abra el código fuente. El Apps Script corre
con la cuenta de Florencia y es lo único que toca el Drive.

```
Formulario (navegador)  ──POST JSON──▶  Apps Script  ──▶  contactos.txt (Drive)
                        ◀──{ ok }─────
```

## Desde qué cuenta

**El script se publica desde `gise.ares@gmail.com`**, que es la cuenta dueña de
la carpeta y del archivo. El script corre con la identidad de quien lo publica,
así que tiene que ser una cuenta con permiso de escritura sobre `contactos.txt`.

Que el repositorio de GitHub esté en la cuenta de Flor no influye: el Apps Script
es un endpoint público independiente. La página le pega por HTTP y no sabe ni le
importa de qué cuenta salió.

> **Pendiente:** compartir la carpeta con Flor como editora, para que pueda ver
> y descargar la lista cuando quiera.

## Ya creado

| | |
|---|---|
| Carpeta | [CONTACTOS COACH](https://drive.google.com/drive/folders/1Pjj7OphD18YmOONx7xgvzn1snw7dtwBT) |
| Archivo | [contactos.txt](https://drive.google.com/file/d/1C8BVMY_souttA36YxpPXSvsiG3VNQgL5/view) |
| ID del archivo | `1C8BVMY_souttA36YxpPXSvsiG3VNQgL5` (ya está en `Codigo.gs`) |
| Dueña | gise.ares@gmail.com |

### Si algún día conviene pasarlo a la cuenta de Flor

La lista son datos personales de la audiencia de Flor, y la responsable de esos
datos es ella. Si en algún momento se termina la colaboración, o simplemente se
quiere ordenar, el traspaso es:

1. En Drive, botón derecho sobre la carpeta → Compartir → junto a Flor, cambiar
   su rol a **Propietario**.
2. Flor vuelve a publicar el script desde su cuenta, siguiendo los pasos de
   abajo. El ID del archivo no cambia.
3. Pegar la nueva URL en `NEWSLETTER_ENDPOINT`, dentro de `script.js`.

El archivo arranca con una fila de encabezado: `fecha  email  dispositivo`,
separada por tabulaciones. Así se abre directo como tabla en Sheets o Excel.

## Publicar el script (una sola vez)

Hay que hacerlo a mano, entrando con **gise.ares@gmail.com**: publicar una
aplicación web requiere aceptar los permisos de la cuenta en el navegador, así
que no se puede automatizar.

1. Entrar a [script.google.com](https://script.google.com) y crear un proyecto
   nuevo, llamado por ejemplo **Newsletter Coach**.
2. Borrar el contenido de `Código.gs` y pegar el de `Codigo.gs` de esta carpeta.
3. Guardar.
4. **Implementar → Nueva implementación**, y elegir el tipo **Aplicación web**:
   - *Ejecutar como*: **Yo** (la cuenta dueña del Drive)
   - *Quién tiene acceso*: **Cualquier usuario**
5. Google va a pedir autorización para acceder al Drive. Aceptar. Como el script
   no está verificado, aparece una advertencia: **Configuración avanzada → Ir a
   Newsletter Coach (no seguro)**. Es un script propio, no de un tercero.
6. Copiar la **URL de la aplicación web**. Termina en `/exec`.
7. Pegar esa URL en `script.js`, que está en la raíz del repositorio, en la constante
del principio:

   ```js
   const NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
   ```

Para comprobar que quedó bien, abrir la URL en el navegador: tiene que responder
`{"ok":true,"mensaje":"El endpoint está publicado."}`.

> Cada vez que se edite `Codigo.gs` hay que hacer **Implementar → Administrar
> implementaciones → editar → Nueva versión**. Si se crea una implementación
> nueva en vez de una versión, cambia la URL y hay que actualizar `script.js`.

## Mientras no esté publicado

`NEWSLETTER_ENDPOINT` viene vacío. Con el valor vacío el formulario valida el
email, muestra el cartel de gracias y avisa por consola que el endpoint no está
configurado, pero no guarda nada. Así se puede probar la interfaz sin tener el
script publicado, sin fingir que la suscripción se registró.

## Qué se guarda

- **fecha** — horario de Buenos Aires, `yyyy-MM-dd HH:mm:ss`.
- **email** — tal como lo escribió la persona. Se valida de nuevo en el servidor,
  porque la validación del navegador se puede saltear.
- **dispositivo** — sólo *Móvil* o *Escritorio*, más el sistema operativo cuando
  el navegador lo informa. Es un dato grueso a propósito: no identifica a nadie
  ni sirve para hacer fingerprinting.

El script toma un `LockService` antes de escribir. Sin eso, dos suscripciones
simultáneas leerían el mismo contenido y la segunda pisaría la línea de la
primera.

## Pendiente legal

Se están guardando datos personales, así que antes de publicar hace falta la
página de **Política de privacidad** que hoy está vacía en el footer, explicando
qué se guarda, para qué y cómo pedir la baja. En Argentina aplica la Ley 25.326,
y si llegan visitas desde Europa, el GDPR. El formulario ya muestra la microcopia
que anticipa el uso de los datos.
