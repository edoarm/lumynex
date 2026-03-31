// ═══════════ CURSOR GLOW (FULL PAGE) ═══════════
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  let glowX = 0, glowY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    if (!cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => { cursorGlow.classList.remove('active'); });
  function animateGlow() {
    currentX += (glowX - currentX) * 0.15;
    currentY += (glowY - currentY) * 0.15;
    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
    })
    .then(res => {
      const lang = localStorage.getItem('lang') || 'en';
      if (res.ok) {
        alert(translations[lang]['contact.form.success']);
        contactForm.reset();
      } else {
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(() => alert('Network error. Please try again.'))
    .finally(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    });
  });
}

// ═══════════ AFFILIATE MODAL ═══════════
const affiliateModal = document.getElementById('affiliateModal');
const affiliateForm = document.getElementById('affiliate-form');

// Global function — called from onclick in HTML
function closeAffiliateModal() {
  if (!affiliateModal) return;
  affiliateModal.classList.remove('active');
  document.body.style.overflow = '';
}

if (affiliateModal) {
  document.querySelectorAll('[data-open-affiliate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      affiliateModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  affiliateModal.addEventListener('click', (e) => {
    if (e.target === affiliateModal) closeAffiliateModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && affiliateModal.classList.contains('active')) closeAffiliateModal();
  });

  if (affiliateForm) {
    affiliateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = affiliateForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      fetch(affiliateForm.action, {
        method: 'POST',
        body: new FormData(affiliateForm),
      })
      .then(res => {
        const lang = localStorage.getItem('lang') || 'en';
        if (res.ok) {
          alert(translations[lang]['modal.success']);
          affiliateForm.reset();
          closeAffiliateModal();
        } else {
          alert('Something went wrong. Please try again.');
        }
      })
      .catch(() => alert('Network error. Please try again.'))
      .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }
}

// ═══════════ LANGUAGE SWITCHER ═══════════
function applyTranslations(lang) {
  if (typeof translations === 'undefined') return;
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
}

const savedLang = localStorage.getItem('lang') || 'en';
applyTranslations(savedLang);

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.getAttribute('data-lang'));
  });
});
