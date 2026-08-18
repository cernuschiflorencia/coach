/* ============================================================
   Florencia Cernuschi — comportamientos de la home
   ============================================================ */

/* ---------- Menú móvil ---------- */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

const closeMenu = () => {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
};

document.querySelectorAll('#main-nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu();
    menuButton?.focus();
  }
});

/* ---------- Enlaces todavía sin destino ---------- */
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});

/* ---------- Año del footer ---------- */
const anio = document.querySelector('#anio');
if (anio) anio.textContent = String(new Date().getFullYear());

/* ---------- Carrusel de testimonios ----------
   En desktop los tres testimonios se ven en grilla y los puntos no hacen falta.
   En móvil la pista scrollea con snap: ahí mostramos los puntos y los
   mantenemos sincronizados con la posición del scroll.                        */
const track = document.querySelector('.testimonial-track');
const dotsBox = document.querySelector('.track-dots');

if (track && dotsBox) {
  const slides = [...track.children];

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonio ${i + 1} de ${slides.length}`);
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dotsBox.append(dot);
  });

  const dots = [...dotsBox.children];

  // Los puntos sólo tienen sentido cuando la pista realmente scrollea.
  const syncVisibility = () => {
    dotsBox.hidden = track.scrollWidth <= track.clientWidth + 1;
  };

  const syncActive = () => {
    // En desktop la pista es una grilla sin scroll: no hay "activo" que marcar.
    if (dotsBox.hidden) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let active = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const mid = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < best) { best = dist; active = i; }
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === active)));
  };

  let queued = false;
  track.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { syncActive(); queued = false; });
  }, { passive: true });

  window.addEventListener('resize', () => { syncVisibility(); syncActive(); });
  syncVisibility();
  syncActive();
}

/* ---------- Newsletter ----------
   Manda la suscripción a un Apps Script que la agrega a contactos.txt en el
   Drive de Florencia. Ver apps-script/README.md para publicarlo y pegar la URL
   acá abajo. Con la constante vacía el formulario funciona igual, pero no
   guarda nada: sirve para probar la interfaz sin fingir que se registró.      */
const NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz_m8bD7RAY8jac5W-eTcIlF-dnXntNVVDlAOEylefUMx9n2Se8FB1LJ-bG6aaKR-4-dA/exec';

/* Sólo Móvil/Escritorio y el sistema operativo si el navegador lo informa.
   A propósito es un dato grueso: no identifica a nadie. */
const detectarDispositivo = () => {
  const ua = navigator.userAgentData;
  if (ua) {
    return (ua.mobile ? 'Móvil' : 'Escritorio') + (ua.platform ? ` · ${ua.platform}` : '');
  }
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio';
};

const newsForm = document.querySelector('.news-form');
const dialogoGracias = document.querySelector('#dialogo-gracias');

document.querySelectorAll('[data-cerrar-dialogo]').forEach(boton => {
  boton.addEventListener('click', () => dialogoGracias?.close());
});

// Clic en el fondo oscuro: el <dialog> ocupa toda la pantalla, así que el
// click cae en el propio dialog sólo cuando es fuera del recuadro.
dialogoGracias?.addEventListener('click', e => {
  if (e.target === dialogoGracias) dialogoGracias.close();
});

newsForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const input = newsForm.querySelector('input[type="email"]');
  const boton = newsForm.querySelector('button[type="submit"]');
  const status = newsForm.querySelector('.form-status');
  if (!input || !status) return;

  const email = input.value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    status.dataset.state = 'error';
    status.textContent = 'Revisá el correo ingresado.';
    input.focus();
    return;
  }

  delete status.dataset.state;
  status.textContent = 'Enviando…';
  boton.disabled = true;

  const exito = () => {
    newsForm.reset();
    status.textContent = '';
    dialogoGracias?.showModal();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'newsletter_alta' });
  };

  if (!NEWSLETTER_ENDPOINT) {
    console.warn('[newsletter] NEWSLETTER_ENDPOINT está vacío: no se guardó nada. Ver apps-script/README.md');
    boton.disabled = false;
    exito();
    return;
  }

  try {
    // Sin cabeceras propias el navegador manda text/plain, que no dispara
    // preflight: Apps Script no responde a las peticiones OPTIONS.
    const r = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ email, dispositivo: detectarDispositivo() })
    });
    const datos = await r.json();
    if (!datos.ok) throw new Error(datos.error || 'respuesta sin ok');
    exito();
  } catch (err) {
    console.error('[newsletter]', err);
    status.dataset.state = 'error';
    status.textContent = 'No pudimos registrarte. Probá de nuevo o escribinos por WhatsApp.';
  } finally {
    boton.disabled = false;
  }
});

/* ---------- Medición de clics en CTA ----------
   El Documento Maestro (§18) pide medir los clics en CTA. GTM ya está en el
   head, así que empujamos un evento con la ubicación del botón.               */
document.querySelectorAll('[data-cta]').forEach(cta => {
  cta.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      cta_ubicacion: cta.dataset.cta,
      cta_texto: cta.textContent.trim()
    });
  });
});
