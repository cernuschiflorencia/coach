# Florencia Cernuschi — nueva versión

Home implementada siguiendo el mockup aprobado (`mockup.jpg`) para el diseño y el
Documento Maestro para los textos, la jerarquía de encabezados y el SEO.

## Archivos

- `index.html` — home completa. Estructura semántica, copy del Documento Maestro,
  metadatos, Schema.org, GTM y Google Ads.
- `styles.css` — diseño responsive mobile-first, con tokens de color en `:root`.
- `script.js` — menú móvil, carrusel de testimonios, validación del newsletter y
  medición de clics en CTA.
- `assets/` — imágenes. Ver `assets/README.md` para lo que falta.
- `mockup.jpg` — referencia visual aprobada.
- `Documento_Maestro_...docx` — especificación editorial, UX, SEO y GEO.

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

## Pendiente antes de publicar

1. **Email real** — reemplazar `REEMPLAZAR_EMAIL` (aparece en el CTA final y dos
   veces en el footer). Si se usa WhatsApp o un link de agenda, sumarlo ahí.
2. **Fotografías** — ver `assets/README.md`. El hero, "Sobre mí" y las 5 cards de
   especialidades ya tienen foto real. Quedan los avatares de testimonios y la
   imagen de Open Graph. Los originales suman 14MB en `assets/` y la página no los
   sirve: conviene sacarlos del repo o gitignorearlos.
3. **Logotipo de ICF** — el hero muestra un lockup tipográfico provisorio.
4. **Denominación de la formación** — validar contra los certificados antes de
   publicar la referencia a ICF y al programa ACTP (Documento Maestro §12).
   Recordar que no se usa la sigla MCC.
5. **Testimonios reales y autorizados** — los tres actuales son de ejemplo y
   están marcados como pendientes en pantalla.
6. **Newsletter** — el formulario valida el email pero no envía nada. Falta
   conectar un proveedor de email marketing.
7. **Páginas internas** — las 12 URLs del Documento Maestro. Las cards de
   especialidades ya tienen comentado el `href` definitivo de cada una; hoy
   apuntan a `#contacto` para no dejar links rotos.
8. **Política de privacidad y términos** — los dos links del footer están vacíos.
9. **Open Graph** — falta `og-cover.jpg` de 1200x630; el meta está comentado.
10. **Sitemap, robots y Search Console** — cuando exista la estructura de URLs.

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
  de Flor pasó a "Sobre mí": viene de `images/flor.png`, tenía fondo blanco
  sólido y se le hizo el recorte a transparencia. Quedó en 428x553 px, que
  alcanza justo, así que conviene el original en alta. Detalle en
  `assets/README.md`.

## Cómo previsualizar

```sh
cd new_version && python3 -m http.server 8788
# abrir http://localhost:8788/
```
