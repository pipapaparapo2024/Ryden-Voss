'use strict';

/* ─── LOADER ─────────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loader-fill');
  const pctL     = document.getElementById('loader-pct-l');
  const pctR     = document.getElementById('loader-pct-r');
  const flowers  = document.getElementById('loader-flowers');

  let pct = 0;
  const duration = 2200; // ms
  const start    = performance.now();

  function updatePct(p) {
    const str = Math.floor(p) + '%';
    if (pctL) pctL.textContent = str;
    if (pctR) pctR.textContent = str;
    if (fill)  fill.style.width = p + '%';
  }

  function tick(now) {
    const elapsed = now - start;
    pct = Math.min((elapsed / duration) * 100, 100);
    updatePct(pct);

    if (pct < 100) {
      requestAnimationFrame(tick);
    } else {
      // spread cards
      if (flowers) flowers.classList.add('spread');

      setTimeout(() => {
        loader.classList.add('loader--out');
        document.body.classList.add('loaded');
        setTimeout(() => { loader.style.display = 'none'; }, 700);
      }, 600);
    }
  }

  requestAnimationFrame(tick);
})();

/* ─── CUSTOM CURSOR ──────────────────────────────── */
(function initCursor() {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cur-dot';
  ring.className = 'cur-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .project, .pb__item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cur-hover');
      ring.classList.add('cur-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cur-hover');
      ring.classList.remove('cur-hover');
    });
  });

  // dark cursor on dark sections
  const darkSections  = document.querySelectorAll('.about-intro, .about-text, .services, .works');
  const lightSections = document.querySelectorAll('.hero, .what-i-do, .philosophy, .playbook, .footer');

  const darkObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.4)
        document.body.classList.add('cur-dark');
    });
  }, { threshold: 0.4 });

  const lightObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.4)
        document.body.classList.remove('cur-dark');
    });
  }, { threshold: 0.4 });

  darkSections.forEach(s  => darkObs.observe(s));
  lightSections.forEach(s => lightObs.observe(s));
})();

/* ─── NAV ────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');

  // scroll class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // nav color: dark on dark sections
  const dark  = document.querySelectorAll('.about-intro, .about-text, .services, .works');
  const light = document.querySelectorAll('.hero, .what-i-do, .philosophy, .playbook, .footer');

  const dObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.4) nav.classList.add('nav--light'); });
  }, { threshold: 0.4 });

  const lObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.4) nav.classList.remove('nav--light'); });
  }, { threshold: 0.4 });

  dark.forEach(s  => dObs.observe(s));
  light.forEach(s => lObs.observe(s));

  // nav cross spin on scroll
  const cross = document.getElementById('nav-cross');
  let angle = 0;
  window.addEventListener('scroll', () => {
    angle = window.scrollY * 0.1;
    if (cross) cross.style.transform = `rotate(${angle}deg)`;
  }, { passive: true });
})();

/* ─── HERO MARQUEE ───────────────────────────────── */
(function initHeroMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  // Already has 4 copies in HTML — just animate via CSS
  // But also add RAF for smooth speed control
  let offset = 0;
  const speed = 0.4;

  function tick() {
    offset += speed;
    const w = track.scrollWidth / 4;
    if (offset >= w) offset -= w;
    track.style.transform = `translateX(-${offset}px)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─── SERVICES KINETIC TYPE ──────────────────────── */
(function initServices() {
  const track = document.getElementById('services-track');
  if (!track) return;

  // Clone words for infinite loop
  const words = Array.from(track.children);
  words.forEach(w => {
    const clone = w.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let offset = 0;
  const speed = 0.6;
  let halfW = 0;

  function measure() { halfW = track.scrollWidth / 2; }
  measure();
  window.addEventListener('resize', measure);

  function tick() {
    offset += speed;
    if (offset >= halfW) offset -= halfW;
    track.style.transform = `translateX(-${offset}px)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─── SCROLL REVEAL ──────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings
        const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('visible');
        }, idx * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

/* ─── HERO CARD TILT ─────────────────────────────── */
(function initCardTilt() {
  const wrap = document.querySelector('.hero__card-wrap');
  const card = document.querySelector('.hero__card');
  if (!wrap || !card) return;

  wrap.addEventListener('mousemove', e => {
    const r   = wrap.getBoundingClientRect();
    const x   = (e.clientX - r.left) / r.width  - 0.5;
    const y   = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── REDUCED MOTION ─────────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--dur', '0s');
}
