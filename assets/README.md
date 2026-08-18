# Assets — imágenes

## En uso

Todas las fotos se sirven en WebP con fallback JPEG, en dos anchos, vía
`<picture>` + `srcset`. El navegador elige: en las cards de especialidades toma
el de 440px en desktop (la card mide 218px y con DPR 2 necesita ~436px) y el de
800px en móvil (358px × 2).

| Destino | Archivos | Peso WebP |
|---|---|---|
| Hero | `hero-1600.*`, `hero-800.*` | 74KB / 31KB |
| Card Coaching Ejecutivo | `esp-ejecutivo-800.*`, `-440.*` | 28KB / 14KB |
| Card Emprendedores | `esp-emprendedores-800.*`, `-440.*` | 48KB / 19KB |
| Card Vocacional | `esp-vocacional-800.*`, `-440.*` | 52KB / 17KB |
| Card Finanzas | `esp-finanzas-800.*`, `-440.*` | 59KB / 21KB |
| Card Liderazgo | `esp-liderazgo-800.*`, `-440.*` | 14KB / 6KB |
| Sección "Sobre mí" | `florencia-retrato.png` | 277KB, 428×553 |
| Favicon | `favicon-32x32.png` | 1KB |

## Créditos

Los créditos van dentro del `alt` de cada imagen, después de la descripción. La
descripción va primero porque el `alt` es lo que escucha quien usa un lector de
pantalla: sin ella la imagen no comunica nada. Si más adelante se quieren los
créditos visibles, lo habitual es una línea en el pie o un `figcaption`.

| Foto | Autoría |
|---|---|
| Hero | Vitaly Gariev / Unsplash |
| Coaching Ejecutivo | Vitaly Gariev / Unsplash |
| Emprendedores | Vitaly Gariev / Unsplash |
| Vocacional | Jason Hogan / Unsplash |
| Finanzas Personales | Kelly Sikkema / Unsplash |
| Liderazgo | Csaba Veres / Unsplash |

## Originales

Los archivos con el nombre original (`banner_test.jpg`,
`coaching_ejectuvo_vitaly-gariev-unsplash.jpg`, etc.) son las fuentes de los
derivados. **La página no los sirve**: suman unos 14MB contra 740KB de todo lo
que realmente se descarga. Antes de publicar conviene sacarlos del repositorio
o agregarlos a `.gitignore`, para no versionar 14MB que nadie descarga.

### Retrato de "Sobre mí"

Viene de `images/flor.png` del sitio anterior, que ya no está en la raíz: quedó
guardado en el tag `sitio-v1` (`git checkout sitio-v1 -- images/flor.png`). Ese archivo era RGBA pero con el
alpha en 255 en todos los píxeles: el fondo era blanco sólido. Se le hizo el
recorte a transparencia con un flood fill desde los bordes, más una pasada para
los huecos encerrados, y se recortó al bounding box del contenido. Quedó en
428×553, que alcanza justo para cómo se muestra: conviene el original en alta.

## Regenerar derivados

Todos los recortes son 4:3, conservando la altura completa y moviendo el ancla
horizontal para no cortar a la persona de cada foto.

```python
from PIL import Image

trabajos = [
  ('banner_test.jpg',                               'hero',              1.0),
  ('coaching_ejectuvo_vitaly-gariev-unsplash.jpg',  'esp-ejecutivo',     0.5),
  ('emprendedor_vitaly-gariev_unsplash.jpg',        'esp-emprendedores', 1.0),
  ('vocaciona_jason-hogan_unsplash.jpg',            'esp-vocacional',    0.5),
  ('finanzas_kelly-sikkema_unsplash.jpg',           'esp-finanzas',      0.5),
  ('liderazg0_csaba-veres_unsplash.jpg',            'esp-liderazgo',     0.5),
]
anchos = {'hero': (1600, 800)}          # el resto usa (800, 440)

for src, dest, ancla in trabajos:
    im = Image.open(src); w, h = im.size
    nw = int(h * 4 / 3)
    x0 = int((w - nw) * ancla)
    base = im.crop((x0, 0, x0 + nw, h))
    for width in anchos.get(dest, (800, 440)):
        r = base.resize((width, width * 3 // 4), Image.LANCZOS)
        r.save(f'{dest}-{width}.jpg', quality=82, optimize=True, progressive=True)
        r.save(f'{dest}-{width}.webp', quality=80, method=6)
```

## Pendientes

| Archivo a crear | Uso | Recorte | Mínimo |
|---|---|---|---|
| `testimonio-1.jpg` … `-3.jpg` | Avatares de testimonios | Cuadrado 1:1 | 200×200 |
| `og-cover.jpg` | Open Graph / redes | Horizontal 1.91:1 | 1200×630 |
| Logotipo oficial de ICF (SVG) | Hero | — | — |

**Avatares de testimonios** — reemplazar `<span class="avatar">` por un `img` con
la clase `avatar`; el redondeo y el tamaño ya están en el CSS.

## Antes de publicar

- Revisar que la foto de Finanzas Personales sea la que se quiere: es un
  formulario 1040 de impuestos de Estados Unidos, y la card aclara justamente que
  el servicio *no* constituye asesoramiento financiero. Ver la nota en el README
  de la carpeta padre.
- Confirmar la licencia de cada foto en Unsplash antes de publicar.
- El logotipo de ICF se usa según las normas de marca de la International
  Coaching Federation. Hoy el hero muestra un lockup tipográfico provisorio.
