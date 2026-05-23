'use strict';

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE NAV ─── */
const toggle   = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

toggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  toggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─── REVEAL ON SCROLL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ─── COUNTERS ─── */
function counter(el, target, ms = 1600) {
  const ease = t => 1 - Math.pow(1 - t, 3);
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / ms, 1);
    el.textContent = Math.floor(ease(p) * target).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}

let countersRan = false;
const heroBar = document.querySelector('.hero__bar');
if (heroBar) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !countersRan) {
      countersRan = true;
      document.querySelectorAll('.hstat__num[data-target]').forEach(el => {
        counter(el, +el.dataset.target);
      });
    }
  }, { threshold: 0.6 }).observe(heroBar);
}

/* ─── HERO PARALLAX ─── */
const heroBgNum  = document.querySelector('.hero__bg-num');
const heroInner  = document.querySelector('.hero__inner');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy < window.innerHeight) {
    if (heroBgNum)  heroBgNum.style.transform  = `translateY(${sy * 0.12}px)`;
    if (heroInner)  heroInner.style.transform   = `translateY(${sy * 0.06}px)`;
  }
}, { passive: true });

/* ─── ADD-TO-CART ─── */
document.querySelectorAll('.prow__btn').forEach(btn => {
  btn.addEventListener('click', function () {
    if (this.classList.contains('added')) return;
    this.classList.add('added');
    const svg = this.querySelector('svg');
    svg.innerHTML = '<polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    setTimeout(() => {
      this.classList.remove('added');
      svg.innerHTML = '<path d="M12 5v14M5 12h14"/>';
    }, 2000);
  });
});

/* ─── TESTIMONIAL SLIDER ─── */
const items  = Array.from(document.querySelectorAll('.ts__item'));
const dots   = Array.from(document.querySelectorAll('.ts__dot'));
let current  = 0;
let autoPlay;

function goTo(idx) {
  items[current].classList.remove('ts__item--active');
  dots[current].classList.remove('ts__dot--active');
  current = (idx + items.length) % items.length;
  items[current].classList.add('ts__item--active');
  dots[current].classList.add('ts__dot--active');
}

function startAuto() {
  autoPlay = setInterval(() => goTo(current + 1), 6000);
}
function resetAuto() {
  clearInterval(autoPlay);
  startAuto();
}

document.getElementById('tsNext')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
document.getElementById('tsPrev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
dots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.idx); resetAuto(); }));

startAuto();

/* ─── KEYBOARD SLIDER ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
});

/* ─── TOUCH SWIPE (slider) ─── */
const tsStage = document.getElementById('tsStage');
if (tsStage) {
  let startX = 0;
  tsStage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  tsStage.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  }, { passive: true });
}

/* ─── NEWSLETTER FORM ─── */
document.getElementById('nlForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const input = this.querySelector('input');
  const btn   = this.querySelector('button');
  btn.textContent = 'Inscrito ✓';
  btn.style.background = '#2d6a24';
  btn.style.borderColor = '#2d6a24';
  input.value = '';
  input.placeholder = 'Inscrição confirmada!';
  setTimeout(() => {
    btn.textContent = 'Inscrever';
    btn.style.background = '';
    btn.style.borderColor = '';
    input.placeholder = 'seu@email.com';
  }, 3500);
});

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ─── CURSOR GLOW (desktop only) ─── */
const cursorEl = document.getElementById('cursor');
if (cursorEl && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorEl.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
  const lerp = (a, b, t) => a + (b - a) * t;
  (function tick() {
    cx = lerp(cx, mx, 0.09);
    cy = lerp(cy, my, 0.09);
    cursorEl.style.left = `${cx}px`;
    cursorEl.style.top  = `${cy}px`;
    requestAnimationFrame(tick);
  })();
}
