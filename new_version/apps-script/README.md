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

## Ya creado

| | |
|---|---|
| Carpeta | [CONTACTOS COACH](https://drive.google.com/drive/folders/1Pjj7OphD18YmOONx7xgvzn1snw7dtwBT) |
| Archivo | [contactos.txt](https://drive.google.com/file/d/1C8BVMY_souttA36YxpPXSvsiG3VNQgL5/view) |
| ID del archivo | `1C8BVMY_souttA36YxpPXSvsiG3VNQgL5` (ya está en `Codigo.gs`) |

El archivo arranca con una fila de encabezado: `fecha  email  dispositivo`,
separada por tabulaciones. Así se abre directo como tabla en Sheets o Excel.

## Publicar el script (una sola vez)

Esto hay que hacerlo desde la cuenta de Google de Florencia; no se puede
automatizar desde acá.

1. Entrar a [script.google.com](https://script.google.com) y crear un proyecto
   nuevo, llamado por ejemplo **Newsletter Coach**.
2. Borrar el contenido de `Código.gs` y pegar el de `Codigo.gs` de esta carpeta.
3. Guardar.
4. **Implementar → Nueva implementación**, y elegir el tipo **Aplicación web**:
   - *Ejecutar como*: **Yo** (la cuenta dueña del Drive)
   - *Quién tiene acceso*: **Cualquier usuario**
5. Google va a pedir autorización para acceder al Drive. Aceptar. Como el script
   no está verificado, aparece una advertencia: **Configuración avanzada → Ir a
   Newsletter Coach (no seguro)**. Es el propio script de Florencia, no un
   tercero.
6. Copiar la **URL de la aplicación web**. Termina en `/exec`.
7. Pegar esa URL en `script.js`, en la constante del principio:

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
