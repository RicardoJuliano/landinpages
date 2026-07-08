(function () {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ LENIS SMOOTH SCROLL ============ */
  let lenis;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', () => {
      if (window.ScrollTrigger) ScrollTrigger.update();
    });
  }

  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ============ LOADER ============ */
  const loader = document.getElementById('loader');
  const loaderMark = document.querySelector('.loader-mark');
  const tlLoad = gsap.timeline();
  tlLoad
    .to(loaderMark, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to(loaderMark, { opacity: 1, duration: 0.35 })
    .to(loader, {
      yPercent: -100, duration: 0.8, ease: 'power4.inOut',
      onComplete: () => { loader.style.display = 'none'; }
    })
    .call(playHeroIntro, [], "-=0.4");

  /* ============ HERO INTRO ============ */
  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-content .eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0)
      .from('.reveal-line span', { yPercent: 110, duration: 0.9, stagger: 0.08 }, 0.05)
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.35)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 0.5)
      .to('.scroll-cue', { opacity: 1, duration: 0.8 }, 0.7)
      .to('.hero-bg img, .hero-video', { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
  }
  gsap.set(['.hero-content .eyebrow', '.hero-sub', '.hero-cta', '.scroll-cue'], { y: 14 });

  /* ============ PROGRESS BAR ============ */
  const progressBar = document.getElementById('progressBar');
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { progressBar.style.width = (self.progress * 100) + '%'; }
  });

  /* ============ HEADER ON SCROLL ============ */
  const header = document.getElementById('siteHeader');
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.scroll() > 60);
    }
  });

  /* ============ HERO PARALLAX ============ */
  gsap.to('.hero-bg img, .hero-video', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ============ HERO VIDEO PLAYBACK SAFETY ============ */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) heroVideo.pause();
      else heroVideo.play().catch(() => {});
    });
  }

  /* ============ CUSTOM CURSOR ============ */
  const cursorDot = document.getElementById('cursorDot');
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    let cx = 0, cy = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.classList.add('active');
    });
    gsap.ticker.add(() => {
      dx += (cx - dx) * 0.18;
      dy += (cy - dy) * 0.18;
      gsap.set(cursorDot, { x: dx, y: dy });
    });
    document.querySelectorAll('[data-cursor="link"]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
    });
  }

  /* ============ MOBILE MENU ============ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ============ SCROLL REVEALS ============ */
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      delay: (i % 3) * 0.1,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.reveal-img').forEach((el) => {
    const img = el.querySelector('img');
    gsap.to(el, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
    gsap.to(img, {
      scale: 1, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ============ STATS COUNTER ============ */
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal ? counter.val.toFixed(1) : Math.round(counter.val);
          }
        });
      }
    });
  });

  /* ============ MARQUEE ============ */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const trackWidth = marqueeTrack.scrollWidth / 2;
    gsap.to(marqueeTrack, {
      x: -trackWidth,
      duration: 26,
      ease: 'none',
      repeat: -1
    });
  }

  /* ============ ACCORDION ============ */
  document.querySelectorAll('.accordion-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ============ TESTIMONIAL NAV (subtle feedback) ============ */
  const testPrev = document.getElementById('testPrev');
  const testNext = document.getElementById('testNext');
  [testPrev, testNext].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      gsap.fromTo('.testimonial-text .quote', { opacity: 0.3, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  /* ============ NEWSLETTER FORM ============ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterMsg.textContent = 'Obrigado! Você foi inscrito com sucesso.';
      newsletterForm.reset();
    });
  }

  /* ============ SMOOTH ANCHOR SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -80 });
          else target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

})();
