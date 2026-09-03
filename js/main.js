/* ─────────────────────────────────────────────────
   MAIN JAVASCRIPT — AK PORTFOLIO  v2
   Author: Ahmed Khaled
   Smart Cursor · Particle Canvas · Typewriter
   ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════
     0.  INTERNATIONALIZATION (i18n)
     ════════════════════════════════════════════════ */
  let currentLang = localStorage.getItem('ak_lang') || 'en';
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const currentLangSpan = document.getElementById('current-lang');
  const langOptions = langDropdown ? langDropdown.querySelectorAll('button') : [];

  const setLanguage = (lang) => {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('ak_lang', lang);
    currentLangSpan.textContent = lang.toUpperCase();
    
    // Set dir and lang on HTML
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });
  };

  // Toggle Dropdown
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });
  }

  // Handle Option Click
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
      langDropdown.classList.remove('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (langDropdown && langDropdown.classList.contains('show')) {
      langDropdown.classList.remove('show');
    }
  });

  // Initialize
  setLanguage(currentLang);

  /* ════════════════════════════════════════════════
     1.  CURSOR — handled via CSS custom SVG
     ════════════════════════════════════════════════ */
  // Custom blue arrow cursor is set in CSS — no JS needed.


  /* ════════════════════════════════════════════════
     1b. SKILL CARD 3D FLIP
     ════════════════════════════════════════════════ */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      const wasFlipped = card.classList.contains('is-flipped');
      // Close all cards
      flipCards.forEach(c => c.classList.remove('is-flipped'));
      // If the clicked card wasn't flipped, open it
      if (!wasFlipped) {
        card.classList.add('is-flipped');
      }
    });
  });



  /* ════════════════════════════════════════════════
     2.  NAVBAR SCROLL
     ════════════════════════════════════════════════ */
  const navbar  = document.getElementById('navbar');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => { if (sec.getBoundingClientRect().top <= 120) current = sec.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  };

  // Mobile nav
  document.getElementById('nav-hamburger')?.addEventListener('click', () => document.getElementById('mobile-nav')?.classList.add('open'));
  document.getElementById('nav-close')?.addEventListener('click', () => document.getElementById('mobile-nav')?.classList.remove('open'));
  document.querySelectorAll('#mobile-nav a').forEach(a => a.addEventListener('click', () => document.getElementById('mobile-nav')?.classList.remove('open')));


  /* ════════════════════════════════════════════════
     3.  TYPEWRITER
     ════════════════════════════════════════════════ */
  const typeEl = document.getElementById('hero-typewriter-text');
  if (typeEl) {
    const phrases = [
      'Fullstack Developer',
      'Desktop App Engineer',
      'E-Commerce Specialist',
      'Web · Desktop · Systems',
      'Building the Future.',
    ];
    let pi = 0, ci = 0, deleting = false, pause = 0;
    const type = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        typeEl.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) { deleting = true; pause = 65; }
        setTimeout(type, 85);
      } else {
        if (pause > 0) { pause--; setTimeout(type, 14); return; }
        typeEl.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        setTimeout(type, 45);
      }
    };
    setTimeout(type, 900);
  }


  /* ════════════════════════════════════════════════
     4.  SCROLL REVEAL
     ════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ════════════════════════════════════════════════
     5.  COUNTER ANIMATION
     ════════════════════════════════════════════════ */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const dur    = 1800;
    const step   = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const v = Math.floor((1 - Math.pow(1 - t, 3)) * target);
      el.textContent = v + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };


  /* ════════════════════════════════════════════════
     6.  PROJECT FILTER
     ════════════════════════════════════════════════ */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = f === 'all' || card.dataset.type === f;
        card.style.opacity = show ? '1' : '0.18';
        card.style.transform = show ? '' : 'scale(0.97)';
        card.style.pointerEvents = show ? '' : 'none';
      });
    });
  });


  /* ════════════════════════════════════════════════
     7.  HERO TEXT ENTRANCE
     ════════════════════════════════════════════════ */
  document.querySelectorAll('.hero-animate').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 130);
  });


  /* ════════════════════════════════════════════════
     8.  CONTACT FORM
     ════════════════════════════════════════════════ */
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #00B37E, #00E564)';
    btn.style.color = '#fff';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; e.target.reset(); }, 3500);
  });


  /* ════════════════════════════════════════════════
     9.  SMOOTH ANCHORS
     ════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* Re-bind not needed — no cursor state to manage */

});
