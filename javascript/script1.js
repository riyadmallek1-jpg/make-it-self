/**
 * services.js  –  MITS Services Section
 * ─────────────────────────────────────
 * Responsibilities:
 *  1. Intersection Observer → triggers entrance animations for the
 *     card column, the services list items, and the card flip sequence.
 *  2. Card entrance flip sequence (front → back → front).
 *  3. Hover flip is handled purely by CSS; JS only manages the
 *     guard that prevents hover from fighting the entrance animation.
 */

(function () {
  'use strict';

  /* ── Element references ──────────────────────────────────────── */
  const section       = document.getElementById('services');
  const card3d        = document.getElementById('card3d');
  const cardScene     = document.getElementById('cardScene');
  const cardCol       = document.querySelector('.services__card-col');
  const serviceItems  = document.querySelectorAll('.service-item');

  if (!section || !card3d) return;   // guard: elements must exist

  /* ── State ───────────────────────────────────────────────────── */
  let entranceDone = false;   // prevents re-triggering on every scroll

  /* ── Utility: run the entrance flip animation ────────────────── */
  function runEntranceFlip() {
    if (entranceDone) return;
    entranceDone = true;

    /*
     * We temporarily disable CSS hover so the hover rule doesn't
     * interfere while the entrance animation is playing.
     * We do this by toggling a class that blocks pointer events.
     */
    cardScene.classList.add('no-hover');

    /* Remove any lingering class first, force reflow, then add */
    card3d.classList.remove('entrance-anim');
    void card3d.offsetWidth;            // reflow trick
    card3d.classList.add('entrance-anim');

    /* Re-enable hover after the entrance animation finishes (2.2 s) */
    const animDuration = 2200;   // must match CSS @keyframes duration
    setTimeout(() => {
      card3d.classList.remove('entrance-anim');
      cardScene.classList.remove('no-hover');
    }, animDuration);
  }

  /* ── Intersection Observer ───────────────────────────────────── */
  const observerOptions = {
    root:       null,
    rootMargin: '0px',
    threshold:  0.25          // trigger when 25 % of section is visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      /* ① Reveal card column */
      if (cardCol) cardCol.classList.add('is-visible');

      /* ② Reveal each service item (CSS stagger via transition-delay) */
      serviceItems.forEach(item => item.classList.add('is-visible'));

      /* ③ Trigger entrance card flip */
      runEntranceFlip();

      /* Once triggered, stop observing */
      sectionObserver.unobserve(entry.target);
    });
  }, observerOptions);

  sectionObserver.observe(section);

  /* ── Inject .no-hover rule dynamically ──────────────────────── */
  /*
   * When .no-hover is on .card-scene, the CSS :hover selector still
   * fires on mouse events.  The cleanest fix is to inject a style rule
   * that overrides the hover transform during the entrance.
   */
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .card-scene.no-hover { pointer-events: none; }
    .card-scene.no-hover .card-3d { transform: none !important; }
  `;
  document.head.appendChild(styleTag);

  /* ── Keyboard accessibility: Space / Enter to flip card ─────── */
  if (cardScene) {
    cardScene.setAttribute('tabindex', '0');
    cardScene.setAttribute('role', 'button');
    cardScene.setAttribute('aria-pressed', 'false');

    let keyFlipped = false;

    cardScene.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();

      if (!entranceDone) return;   // wait for entrance to finish

      keyFlipped = !keyFlipped;
      card3d.style.transform = keyFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
      cardScene.setAttribute('aria-pressed', String(keyFlipped));
    });

    /* Reset when mouse takes over */
    cardScene.addEventListener('mouseenter', () => {
      keyFlipped = false;
      card3d.style.transform = '';   // let CSS :hover take over
    });
    cardScene.addEventListener('mouseleave', () => {
      card3d.style.transform = '';
    });
  }

})();
