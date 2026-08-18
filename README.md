# Florencia Cernuschi — nueva versión

Sitio de Florencia Cernuschi, Coach Ontológica Profesional. Implementado siguiendo
el mockup aprobado para el diseño y el Documento Maestro para los textos, la
jerarquía de encabezados y el SEO.

GitHub Pages lo publica desde la raíz de `main`, en
https://cernuschiflorencia.github.io/coach/

## Archivos

- `index.html` — home completa. Estructura semántica, copy del Documento Maestro,
  metadatos, Schema.org, GTM y Google Ads.
- `styles.css` — diseño responsive mobile-first, con tokens de color en `:root`.
- `script.js` — menú móvil, carrusel de testimonios, validación del newsletter y
  medición de clics en CTA.
- `assets/` — imágenes. Ver `assets/README.md` para lo que falta.
- `politica-de-privacidad.html` y `terminos-y-condiciones.html` — páginas legales.
- `_internos/` — material de trabajo que **no se publica**: el mockup aprobado, el
  Documento Maestro y el Apps Script del newsletter. GitHub Pages corre Jekyll, que
  ignora las carpetas que empiezan con guion bajo.

El sitio anterior quedó guardado en el tag `sitio-v1` y en la rama
`sitio-anterior`. Para recuperar un archivo suyo:
`git checkout sitio-v1 -- index.html`

## Qué está hecho

Secciones de la home, en orden: hero, banda de diferenciadores, situaciones
("¿Sentís que querés avanzar…?"), especialidades, metodología, sobre mí +
formación, testimonios, CTA final, newsletter y footer.

- Un solo `H1`, `H2` por sección y `H3` por subsección, según el Documento Maestro.
- Todo el texto es HTML indexable. Nada de copy dentro de imágenes.
- Iconos como sprite SVG inline: sin dependencias externas ni FontAwesome.
- Schema.org JSON-LD con `WebSite`, `Person` y `ProfessionalService`.
- GTM (`GTM-5N4RTZP9`) y Google Ads (`AW-17258777133`) migrados del sitio
  anterior, con el `noscript` de GTM que antes faltaba.
- Los clics en CTA empujan un evento `cta_click` a `dataLayer`, con la ubicación
  del botón, para configurar la conversión desde GTM.
- Accesibilidad: skip link, `aria-expanded` en el menú, `aria-selected` en los
  dots, foco visible, textos alternativos y soporte de `prefers-reduced-motion`.
- Verificado en 1440px y en 390px: sin scroll horizontal, sin errores de consola,
  sin anchors ni referencias de iconos rotas.
- Un solo color oscuro en toda la página: el token `--navy` (`#16323c`), usado en
  titulares, botones, CTA final y footer. `--navy-2` es su hover.
- El newsletter guarda cada alta en `contactos.txt` dentro de la carpeta
  CONTACTOS COACH del Drive, vía un Apps Script. Ver `_internos/apps-script/README.md`.

## Estado

**El sitio está publicado** en https://cernuschiflorencia.github.io/coach/ desde el
17 de agosto de 2026. Pages sirve desde la raíz de `main`, así que todo lo que se
commitea a `main` sale en vivo en aproximadamente un minuto: no hay entorno de
prueba intermedio.

Resueltos: contacto por WhatsApp, fotos del hero, "Sobre mí" y las cinco
especialidades, newsletter guardando en Drive, páginas legales con los datos de la
responsable, sitemap, y verificación en Google Search Console y Bing.

## Pendiente

1. **Textos de los testimonios** — están firmados por Claudia, Carlos y Romina,
   pero **las tres frases siguen siendo las de ejemplo que se escribieron al armar
   la maqueta**, y ya están publicadas. Reemplazarlas por lo que dijeron realmente
   es lo primero de esta lista: son palabras atribuidas a personas reales.
2. **Revisión legal** — un abogado tendría que leer `politica-de-privacidad.html` y
   `terminos-y-condiciones.html`. Son una base razonable que cubre la Ley 25.326,
   no un documento validado profesionalmente, y si llegan visitas desde Europa
   entra además el GDPR.
3. **Denominación de la formación** — validar contra los certificados la referencia
   a ICF y al programa ACTP (Documento Maestro §12). No se usa la sigla MCC.
4. **Logotipo de ICF** — el hero muestra un lockup tipográfico provisorio.
5. **Fotografías que faltan** — avatares de los testimonios e imagen de Open Graph
   (`og-cover.jpg`, 1200x630; el meta está comentado en el `<head>`). Ver
   `assets/README.md`.
6. **Páginas internas** — las 12 URLs del Documento Maestro. Las cards de
   especialidades ya tienen comentado el `href` definitivo de cada una. Al crearlas
   hay que sumarlas a `sitemap.xml`.
7. **Sitemap en Google** — enviado y verificado, pero al 17/08 figuraba como "no se
   ha podido obtener", que es la cola de Google. Bing ya lo procesó correctamente.
   **No agregar un `robots.txt`**: los rastreadores sólo lo leen en la raíz del
   dominio, y acá el sitio vive en `/coach/`.

## Decisiones que conviene revisar

- **Copy: mockup vs. Documento Maestro.** Los dos difieren en varios textos. Se
  siguió el Documento Maestro, porque es el que fija la jerarquía SEO. Ejemplos:
  el H1 es "Transformá tus objetivos en acciones concretas" (el mockup agrega
  "decisiones y"), y el H2 de situaciones es "¿Sentís que querés avanzar, pero
  algo te está frenando?" (el mockup dice "¿Te sentís identificado con algo de
  esto?"). Si se prefiere el copy del mockup, es un cambio de texto nada más.
- **Secciones §3.3 y §3.5 unificadas.** El Documento Maestro pide dos bloques de
  servicios muy parecidos: cuatro temas genéricos y cinco especialidades con
  nombre. El mockup muestra uno solo, así que se implementó el de las cinco
  especialidades. Si se quiere el otro bloque también, se agrega.
- **"Recursos" en el menú** apunta a la banda de newsletter, porque todavía no
  existe la página de recursos ni el blog.
- **El email aparece sólo en las páginas legales.** `cernuschiflorencia@gmail.com`
  figura como canal para ejercer derechos sobre los datos, que es lo que exige la
  normativa. En la home toda la conversión sigue pasando por WhatsApp, que fue la
  decisión tomada. Si se quiere el correo también ahí, hay que sumarlo al footer y
  al `contactPoint` del JSON-LD.
- **Redes en el footer:** sólo LinkedIn y correo. El Documento Maestro §18 y §19
  pide enlazar únicamente perfiles oficiales verificados, así que no se sumaron
  Instagram ni YouTube aunque aparezcan en el mockup.
- **La foto de Finanzas Personales.** Es un formulario 1040 del fisco de Estados
  Unidos, con calculadora y checklist de documentos impositivos. La card aclara
  que el servicio "no constituye asesoramiento financiero", así que la imagen
  empuja justo en la dirección contraria: sugiere impuestos y contabilidad, y de
  otro país. Funciona igual, pero si aparece una foto más de hábitos y decisiones
  cotidianas con el dinero, conviene cambiarla.
- **Las fotos del hero y "Sobre mí".** El hero usa `banner_test.jpg` (Vitaly Gariev / Unsplash),
  recortada a 4:3 y servida en WebP con fallback JPEG en dos tamaños. El retrato
  de Flor pasó a "Sobre mí": viene del `images/flor.png` del sitio anterior (hoy en el tag `sitio-v1`), tenía fondo blanco
  sólido y se le hizo el recorte a transparencia. Quedó en 428x553 px, que
  alcanza justo, así que conviene el original en alta. Detalle en
  `assets/README.md`.

## Cómo previsualizar

```sh
python3 -m http.server 8788
# abrir http://localhost:8788/
```
