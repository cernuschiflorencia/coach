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
   PENDIENTE: conectar a un proveedor de email marketing. Hasta entonces el
   formulario valida en el cliente y avisa que la suscripción no está activa,
   en lugar de recargar la página y simular un envío.                          */
const newsForm = document.querySelector('.news-form');

newsForm?.addEventListener('submit', e => {
  e.preventDefault();
  const input = newsForm.querySelector('input[type="email"]');
  const status = newsForm.querySelector('.form-status');
  if (!input || !status) return;

  const value = input.value.trim();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  if (!looksLikeEmail) {
    status.dataset.state = 'error';
    status.textContent = 'Revisá el correo ingresado.';
    input.focus();
    return;
  }

  delete status.dataset.state;
  status.textContent = 'La suscripción todavía no está conectada. Escribinos por correo mientras tanto.';
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
