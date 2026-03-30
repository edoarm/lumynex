// ═══════════ GA4 EVENT TRACKING — LUMYNEX ═══════════
// Depends on gtag being loaded via the GA snippet in index.html.
// All event names match the GA4 schema defined for this project.

(function () {
  'use strict';

  // ── Helper ──
  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params);
  }

  function val(el) { return el ? el.value.trim() : ''; }

  // ════════════════════════════════════════════════════
  // 1. generate_lead — Contact Form Submission
  // ════════════════════════════════════════════════════
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      track('generate_lead', {
        form_name: 'contact_form',
        company_name: val(contactForm.querySelector('[name="company"]')),
        lead_source: 'website'
      });
    });
  }

  // ════════════════════════════════════════════════════
  // 2. affiliate_application_submit — Affiliate Form
  // ════════════════════════════════════════════════════
  var affiliateForm = document.getElementById('affiliate-form');
  if (affiliateForm) {
    affiliateForm.addEventListener('submit', function () {
      var socials = ['instagram', 'tiktok', 'facebook', 'telegram']
        .filter(function (s) { return val(affiliateForm.querySelector('[name="' + s + '"]')); });

      track('affiliate_application_submit', {
        niche: val(affiliateForm.querySelector('[name="industry"]')),
        social_platforms: socials.join(', ') || 'none'
      });
    });
  }

  // ════════════════════════════════════════════════════
  // 3. cta_click — CTA Button Clicks
  // ════════════════════════════════════════════════════
  function getButtonLocation(el) {
    var hero = el.closest('.hero');
    if (hero) return 'hero';
    var nav = el.closest('.navbar');
    if (nav) return 'navbar';
    var footer = el.closest('.footer');
    if (footer) return 'footer';
    return 'mid-page';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-primary, .btn-secondary, .btn-affiliate');
    if (!btn) return;
    track('cta_click', {
      button_text: btn.textContent.trim().replace(/\s*→$/, ''),
      button_location: getButtonLocation(btn)
    });
  });

  // ════════════════════════════════════════════════════
  // 4. service_viewed — Service cards (scroll into view)
  // ════════════════════════════════════════════════════
  var serviceCards = document.querySelectorAll('.service-card');
  var serviceObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var h3 = entry.target.querySelector('h3');
        if (h3) {
          track('service_viewed', {
            service_name: h3.textContent.trim()
          });
        }
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  serviceCards.forEach(function (card) { serviceObserver.observe(card); });

  // ════════════════════════════════════════════════════
  // 5. industry_viewed — Industry cards (scroll into view)
  // ════════════════════════════════════════════════════
  var industryCards = document.querySelectorAll('.industry-card');
  var industryObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var h3 = entry.target.querySelector('h3');
        if (h3) {
          track('industry_viewed', {
            industry_name: h3.textContent.trim()
          });
        }
        industryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  industryCards.forEach(function (card) { industryObserver.observe(card); });

  // ════════════════════════════════════════════════════
  // 6. section_scroll_depth — Page Scroll Milestones
  // ════════════════════════════════════════════════════
  var scrollThresholds = [25, 50, 75, 100];
  var firedThresholds = {};

  var sectionMap = {
    services: 'Services',
    industries: 'Industries',
    why: 'Why Us',
    process: 'Process',
    contact: 'Contact'
  };

  function getVisibleSection() {
    var ids = Object.keys(sectionMap);
    for (var i = ids.length - 1; i >= 0; i--) {
      var el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
        return sectionMap[ids[i]];
      }
    }
    return 'Hero';
  }

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);

    scrollThresholds.forEach(function (threshold) {
      if (pct >= threshold && !firedThresholds[threshold]) {
        firedThresholds[threshold] = true;
        track('section_scroll_depth', {
          percent_scrolled: threshold,
          section_name: getVisibleSection()
        });
      }
    });
  });

  // ════════════════════════════════════════════════════
  // 7. email_click
  // ════════════════════════════════════════════════════
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="mailto:"]');
    if (!link) return;
    track('email_click', {
      email_address: link.getAttribute('href').replace('mailto:', '')
    });
  });

  // ════════════════════════════════════════════════════
  // 8. language_switch
  // ════════════════════════════════════════════════════
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      track('language_switch', {
        language_selected: btn.getAttribute('data-lang')
      });
    });
  });

  // ════════════════════════════════════════════════════
  // 9. theme_toggle
  // ════════════════════════════════════════════════════
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      // Read AFTER the click handler in main.js toggles the value
      setTimeout(function () {
        track('theme_toggle', {
          theme_selected: document.documentElement.getAttribute('data-theme') || 'dark'
        });
      }, 0);
    });
  }

  // ════════════════════════════════════════════════════
  // 10. nav_click — Navbar links
  // ════════════════════════════════════════════════════
  document.querySelectorAll('.navbar-link').forEach(function (link) {
    link.addEventListener('click', function () {
      track('nav_click', {
        nav_item: link.textContent.trim()
      });
    });
  });

  // ════════════════════════════════════════════════════
  // 11. outbound_click
  // ════════════════════════════════════════════════════
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      var url = new URL(href, window.location.origin);
      if (url.hostname === window.location.hostname) return;
      track('outbound_click', {
        link_url: href,
        link_text: link.textContent.trim()
      });
    } catch (_) { /* malformed URL — skip */ }
  });

})();
