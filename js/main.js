// ═══════════ CURSOR GLOW (FULL PAGE) ═══════════
const cursorGlow = document.getElementById('cursorGlow');
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

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const theme = htmlElement.getAttribute('data-theme');
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Scroll Reveal
const reveals = document.querySelectorAll('.scroll-in');
const reveal = () => {
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', reveal);
reveal();

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    console.log('Form submitted:', data);
    const lang = localStorage.getItem('lang') || 'en';
    alert(translations[lang]['contact.form.success']);
    contactForm.reset();
  });
}

// ═══════════ AFFILIATE MODAL ═══════════
const affiliateModal = document.getElementById('affiliateModal');
const affiliateForm = document.getElementById('affiliate-form');

document.querySelectorAll('[data-open-affiliate]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    affiliateModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeAffiliateModal() {
  affiliateModal.classList.remove('active');
  document.body.style.overflow = '';
}

affiliateModal.addEventListener('click', (e) => {
  if (e.target === affiliateModal) closeAffiliateModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && affiliateModal.classList.contains('active')) closeAffiliateModal();
});

if (affiliateForm) {
  affiliateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(affiliateForm));
    console.log('Affiliate application:', data);
    const lang = localStorage.getItem('lang') || 'en';
    alert(translations[lang]['modal.success']);
    affiliateForm.reset();
    closeAffiliateModal();
  });
}

// ═══════════ LANGUAGE SWITCHER ═══════════
function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Update all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Update select options with data-i18n attribute
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update html lang attribute
  document.documentElement.setAttribute('lang', lang);

  // Update active state on language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
}

// Initialize language on page load
const savedLang = localStorage.getItem('lang') || 'en';
applyTranslations(savedLang);

// Language switcher event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.getAttribute('data-lang'));
  });
});
