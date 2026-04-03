// ═══════════ LUMYNEX GA4 EVENT TRACKING ═══════════
// Pushes custom events to GTM dataLayer for GA4
// GTM Container: GTM-M9JDZDLQ | GA4: G-V896DD1LDB
(function () {
  'use strict';

  var DL = (window.dataLayer = window.dataLayer || []);

  function pushEvent(name, params) {
    params = params || {};
    params.event = name;
    params.page_url = location.href;
    params.page_title = document.title;
    DL.push(params);
  }

  function closest(el, sel) {
    while (el && el !== document) {
      if (el.matches && el.matches(sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function getText(el) {
    if (!el) return '';
    var span = el.querySelector('span[data-i18n]') || el.querySelector('span');
    return (span ? span.textContent : el.textContent).trim().replace(/\s+/g, ' ');
  }

  function getSection(el) {
    var s = closest(el, 'section') || closest(el, 'nav');
    if (!s) return 'unknown';
    var c = s.className || '';
    if (c.indexOf('hero') > -1) return 'hero';
    if (c.indexOf('services') > -1) return 'services';
    if (c.indexOf('industries') > -1) return 'industries';
    if (c.indexOf('why') > -1) return 'why_us';
    if (c.indexOf('process') > -1) return 'process';
    if (c.indexOf('affiliate') > -1) return 'affiliate';
    if (c.indexOf('contact') > -1) return 'contact';
    if (c.indexOf('cta') > -1) return 'cta_banner';
    if (c.indexOf('navbar') > -1) return 'navbar';
    return s.id || 'other';
  }

  // ─── A. ENGAGEMENT EVENTS ───────────────────────────

  var ctaTexts = [
    'get started', "let's talk", 'start scaling', 'see what we do',
    'earn with us', 'start earning', 'become an affiliate', 'talk to us'
  ];

  document.addEventListener('click', function (e) {
    var el = closest(e.target, 'a, button') || e.target;
    var text = getText(el).toLowerCase();

    // 1. CTA click
    for (var i = 0; i < ctaTexts.length; i++) {
      if (text.indexOf(ctaTexts[i]) > -1) {
        pushEvent('cta_click', {
          cta_label: getText(el),
          cta_location: getSection(el)
        });
        break;
      }
    }

    // 2. Nav click
    if (closest(e.target, '.navbar-link')) {
      pushEvent('nav_click', { nav_item: getText(closest(e.target, '.navbar-link')) });
    }

    // 3. Service card click
    var card = closest(e.target, '.service-card, .svc-card');
    if (card) {
      var h3 = card.querySelector('h3');
      pushEvent('service_card_click', {
        service_name: h3 ? h3.textContent.trim() : 'unknown'
      });
    }

    // 4. Industry tab click
    var tab = closest(e.target, '.industry-nav a, .ind-nav-item');
    if (tab) {
      pushEvent('industry_tab_click', { industry_name: getText(tab) });
    }

    // 5. Language switch
    var langBtn = closest(e.target, '.lang-btn');
    if (langBtn) {
      pushEvent('language_switch', {
        selected_language: langBtn.getAttribute('data-lang') || getText(langBtn)
      });
    }

    // 8. Affiliate form open
    if (closest(e.target, '[data-open-affiliate]')) {
      pushEvent('affiliate_form_open', {
        cta_label: getText(closest(e.target, '[data-open-affiliate]'))
      });
    }

    // 10. Email click
    var mailto = closest(e.target, 'a[href^="mailto:"]');
    if (mailto) {
      pushEvent('email_click', {
        email_address: mailto.href.replace('mailto:', '')
      });
    }
  });

  // ─── B. CONTACT & LEAD EVENTS ──────────────────────

  // 6. Contact form start
  var contactFormStarted = false;
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('focusin', function () {
      if (!contactFormStarted) {
        contactFormStarted = true;
        pushEvent('contact_form_start', { form_name: 'contact_form' });
      }
    });
    // 7. Contact form submit
    contactForm.addEventListener('submit', function () {
      pushEvent('contact_form_submit', { form_name: 'contact_form' });
      pushEvent('generate_lead', { form_name: 'contact_form', currency: 'USD', value: 1 });
    });
  }

  // 9. Affiliate form submit
  var affForm = document.getElementById('affiliate-form');
  if (affForm) {
    affForm.addEventListener('submit', function () {
      var sel = affForm.querySelector('select');
      pushEvent('affiliate_form_submit', {
        form_name: 'affiliate_form',
        niche_selected: sel ? sel.value : 'not_selected'
      });
      pushEvent('generate_lead', { form_name: 'affiliate_form', currency: 'USD', value: 1 });
    });
  }

  // ─── C. SCROLL & CONTENT EVENTS ────────────────────

  // 11. Scroll depth
  var thresholds = { 25: false, 50: false, 75: false, 90: false };
  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var pct = Math.round(
        ((window.pageYOffset || document.documentElement.scrollTop) /
          (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      [25, 50, 75, 90].forEach(function (t) {
        if (pct >= t && !thresholds[t]) {
          thresholds[t] = true;
          pushEvent('scroll_depth', { scroll_threshold: t });
        }
      });
    }, 150);
  }, { passive: true });

  // 12. Section view (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    var nameMap = {
      hero: 'Hero', 'service-hero': 'Hero', services: 'Services',
      industries: 'Industries', why: 'Why Us', process: 'Process',
      affiliate: 'Affiliate', contact: 'Contact', cta: 'CTA'
    };
    var viewed = {};
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sn = '';
        if (el.id && nameMap[el.id]) sn = nameMap[el.id];
        else {
          for (var k in nameMap) {
            if (el.classList.contains(k)) { sn = nameMap[k]; break; }
          }
        }
        if (sn && !viewed[sn]) {
          viewed[sn] = true;
          pushEvent('section_view', { section_name: sn });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('section, .hero, .service-hero').forEach(function (s) {
      obs.observe(s);
    });
  }

  // ─── D. PAGE LANGUAGE ──────────────────────────────

  // 13. Page view with language
  pushEvent('page_view_language', {
    page_language: document.documentElement.lang || 'en'
  });

  // ─── E. SERVICE / FUNNEL EVENTS ────────────────────

  var path = location.pathname;

  // 14. View service
  if (path.indexOf('/services/') === 0 && path !== '/services/' && path !== '/services') {
    var slug = path.replace('/services/', '').replace(/\/$/, '');
    var svcNames = {
      'igaming-seo': 'iGaming SEO',
      'generative-engine-optimization': 'Generative Engine Optimization',
      'paid-media': 'Paid Media & Automation & CRO',
      'affiliate-marketing': 'Affiliate Marketing',
      'data-analytics': 'Data & Analytics',
      'content-digital-pr': 'Content & Digital PR'
    };
    var svcName = svcNames[slug] || slug;
    pushEvent('view_service', { service_name: svcName });
    pushEvent('view_item', { items: [{ item_name: svcName, item_category: 'service' }] });

    // 15. Request quote start (CTA click on service pages)
    document.addEventListener('click', function (e) {
      var btn = closest(e.target, '.btn-primary');
      if (!btn) return;
      var t = getText(btn).toLowerCase();
      if (t.indexOf('get started') > -1 || t.indexOf("let's talk") > -1) {
        pushEvent('request_quote_start', {
          service_name: svcName,
          source_page: path
        });
      }
    });
  }
})();
