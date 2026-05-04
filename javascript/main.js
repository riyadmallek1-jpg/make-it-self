/* ═══════════════════════════════════════════════════════════
   MAKE IT SELF — main.js
   Handles:
     1. Header fade-out on scroll
     2. GSAP entrance animation sequence
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. HEADER: Fade / slide out on scroll
     ───────────────────────────────────────── */
  const header      = document.getElementById('site-header');
  let   lastScrollY = 0;
  let   ticking     = false;

  function handleScroll () {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = scrollY;
    ticking     = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     2. HERO ENTRANCE ANIMATION (GSAP)
     ─────────────────────────────────────────
     Sequence:
       t=0.3  Logo appears in dead center
       t=1.0  Logo slides LEFT to its final position
       t=1.0  Vertical line reveals (scaleY 0→1)
       t=1.0  Greeting slides in from right
       t=1.55 Slogan fades/slides up
       t=1.9  Scroll hint fades in
       t=2.2  Slogan dots pulse in
  ───────────────────────────────────────── */
  window.addEventListener('DOMContentLoaded', function () {

    // Guard: if GSAP failed to load fall back to CSS class reveal
    if (typeof gsap === 'undefined') {
      cssAnimationFallback();
      return;
    }

    const heroLogo  = document.getElementById('hero-logo');
    const logoWrap  = document.getElementById('logo-wrap');
    const vline     = document.getElementById('vline');
    const greeting  = document.getElementById('greeting');
    const slogan    = document.getElementById('slogan');
    const scrollHint = document.getElementById('scroll-hint');
    const dots      = document.querySelectorAll('.slogan-dot');

    /* --------------------------------------------------
       Detect mobile: on narrow screens the divider is
       horizontal, so we animate different properties.
    -------------------------------------------------- */
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    /* ── Initial state setup ──
       Hide everything so GSAP can animate them in.
       (CSS already sets opacity:0 on vline/greeting/slogan,
        but we also need to position the logo in the CENTER.) */

    // Move logo to viewport center (it sits in the left column normally)
    const vpCX   = window.innerWidth / 2;
    const logoRect = logoWrap.getBoundingClientRect();
    const logoCX   = logoRect.left + logoRect.width / 2;
    const logoOffX = vpCX - logoCX;          // pixels to shift right (or left)

    gsap.set(heroLogo, {
      x: logoOffX,          // start centered
      opacity: 0,
      scale: 0.85,
    });

    gsap.set([vline, greeting, slogan, scrollHint], { opacity: 0 });
    gsap.set(vline, {
      [isMobile ? 'scaleX' : 'scaleY']: 0,
      transformOrigin: 'center',
    });
    gsap.set(greeting, { x: isMobile ? 0 : -30, y: isMobile ? -20 : 0 });
    gsap.set(slogan,   { y: 28 });
    gsap.set(dots,     { opacity: 0, scale: 0.4 });

    /* ── Master timeline ── */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    /* Step 1 – Logo fades into center */
    tl.to(heroLogo, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'back.out(1.4)',
    }, 0.3);

    /* Step 2 – Logo slides to its natural left position */
    tl.to(heroLogo, {
      x: 0,
      duration: 1.0,
      ease: 'expo.inOut',
    }, 1.1);

    /* Step 3 – Vertical (or horizontal on mobile) line reveals */
    tl.to(vline, {
      opacity: 1,
      [isMobile ? 'scaleX' : 'scaleY']: 1,
      duration: 0.65,
      ease: 'power2.inOut',
    }, 1.55);

    /* Step 4 – Greeting slides in */
    tl.to(greeting, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
    }, 1.7);

    /* Step 5 – Slogan fades + rises */
    tl.to(slogan, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, 2.15);

    /* Step 6 – Scroll hint */
    tl.to(scrollHint, {
      opacity: 1,
      duration: 0.6,
    }, 2.55);

    /* Step 7 – Dots stagger in */
    tl.to(dots, {
      opacity: 1,
      scale: 1,
      stagger: 0.15,
      duration: 0.4,
      ease: 'back.out(2)',
    }, 2.7);

    /* ── Floating logo idle animation (after entrance) ── */
    tl.add(function () {
      gsap.to(heroLogo, {
        y: '-=8',
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

  }); // end DOMContentLoaded


  /* ─────────────────────────────────────────
     CSS Fallback (no GSAP)
  ───────────────────────────────────────── */
  function cssAnimationFallback () {
    const els = document.querySelectorAll('#vline, .greeting, #slogan, #scroll-hint, #hero-logo');
    els.forEach(function (el, i) {
      el.style.transition = 'opacity 0.8s ease ' + (0.4 + i * 0.3) + 's, transform 0.8s ease ' + (0.4 + i * 0.3) + 's';
      // Trigger
      requestAnimationFrame(function () {
        el.style.opacity   = '1';
        el.style.transform = 'none';
      });
    });
    // vline
    const vl = document.getElementById('vline');
    if (vl) {
      vl.style.transition = 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s';
      requestAnimationFrame(function () {
        vl.style.opacity   = '1';
        vl.style.transform = 'scaleY(1)';
      });
    }
  }
  
})();
