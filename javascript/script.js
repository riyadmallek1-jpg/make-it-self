/**
 * MITS – script.js
 * Handles:
 *   1. Intro logo animation sequence (logo → phrase reveal)
 *   2. Scroll-triggered animations via IntersectionObserver
 *   3. Contact form → mailto: email client launch
 */

/* ============================================================
   1. INTRO LOGO SEQUENCE
   When the About section enters the viewport:
   - Show the logo overlay for ~2 seconds
   - Fade it out
   - Reveal the hero phrase + subtitle
   ============================================================ */

const introLogo   = document.getElementById('introLogo');
const aboutHero   = document.getElementById('aboutHero');
const phraseLines = document.querySelectorAll('.phrase-line');
const subtitle    = document.querySelector('.hero-subtitle');

/**
 * Triggers the logo-exit → phrase-reveal sequence.
 * Called once when the About section is first observed.
 */
function playIntroSequence() {
  // Step 1: Hold logo visible for 1.8 s, then fade it out
  setTimeout(() => {
    introLogo.classList.add('hidden'); // CSS transition: opacity → 0

    // Step 2: After fade-out transition (0.9 s), hide element from layout
    setTimeout(() => {
      introLogo.classList.add('gone');
    }, 900);

    // Step 3: Reveal hero phrase container
    setTimeout(() => {
      aboutHero.classList.add('visible');

      // Step 4: Stagger each phrase line
      phraseLines.forEach((line) => {
        line.classList.add('visible');
      });

      // Step 5: Reveal subtitle after lines
      setTimeout(() => {
        if (subtitle) subtitle.classList.add('visible');
      }, 500);

    }, 400);

  }, 1800);
}

/* ============================================================
   2. INTERSECTION OBSERVER – Scroll Animations
   ============================================================ */

/**
 * Generic observer that adds `.visible` to elements when they
 * enter the viewport.
 *
 * @param {string} selector  – CSS selector for target elements
 * @param {object} options   – IntersectionObserver options
 * @param {function} [cb]    – Optional callback on first intersection
 */
function observeElements(selector, options = {}, cb = null) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15,
    ...options,
  };

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (cb) {
          cb(entry.target);
        } else {
          entry.target.classList.add('visible');
        }
        obs.unobserve(entry.target); // run once
      }
    });
  }, defaultOptions);

  elements.forEach((el) => observer.observe(el));
}

/* ── About section: trigger intro logo sequence once ── */
let introPlayed = false;

const aboutObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !introPlayed) {
        introPlayed = true;
        playIntroSequence();
        obs.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);

const aboutSection = document.getElementById('about');
if (aboutSection) aboutObserver.observe(aboutSection);

/* ── About two-column content ── */
observeElements('#aboutContent');

/* ── Contact: title + form ── */
observeElements('.contact-title');
observeElements('.contact-form');


/* ============================================================
   3. CONTACT FORM → MAILTO
   Collects form data and opens the user's default email client.
   ============================================================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent default HTML form submission

    /* Collect field values */
    const fullName = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('email').value.trim();
    const message  = document.getElementById('message').value.trim();

    /* Basic validation */
    if (!fullName || !email || !message) {
      alert('يرجى ملء جميع الحقول قبل الإرسال.');
      return;
    }

    /* Email validation (simple regex) */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    /* Build mailto components */
    const recipient = 'makeitselfmits@gmail.com';
    const subject   = encodeURIComponent('طلب جديد من الموقع');

    const body = encodeURIComponent(
      `الإسم الكامل: ${fullName}\n` +
      `البريد الإلكتروني: ${email}\n\n` +
      `الطلب / الرسالة:\n${message}`
    );

    /* Open the user's email client */
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    /* Optional: visual feedback on the button */
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText   = submitBtn.querySelector('.btn-text');
    if (btnText) {
      const original = btnText.textContent;
      btnText.textContent = 'تم الفتح ✓';
      submitBtn.style.background = 'var(--clr-yellow)';
      submitBtn.style.color      = 'var(--clr-black)';
      submitBtn.style.borderColor = 'var(--clr-yellow)';

      /* Reset after 3 seconds */
      setTimeout(() => {
        btnText.textContent         = original;
        submitBtn.style.background  = '';
        submitBtn.style.color       = '';
        submitBtn.style.borderColor = '';
      }, 3000);
    }
  });
}
