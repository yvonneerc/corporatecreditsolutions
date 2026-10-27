/* ==========================================================================
   Corporate Credit Solutions — main.js
   Mobile nav, dropdowns, tabs, popup, year stamp
   ========================================================================== */

(function () {
  'use strict';

  /* --- Mobile nav toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  /* --- Mobile submenu toggle: tap parent link to open child menu --- */
  const subParents = document.querySelectorAll('.main-nav .has-sub > a');
  subParents.forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Only intercept on mobile
      if (window.innerWidth <= 768) {
        const sub = link.parentElement.querySelector('.submenu');
        if (sub) {
          // If link is just "#", just toggle. Otherwise allow navigation on second tap.
          const href = link.getAttribute('href');
          if (!sub.classList.contains('open')) {
            e.preventDefault();
            // close siblings
            const siblings = link.parentElement.parentElement.querySelectorAll('.submenu.open');
            siblings.forEach(function (s) { if (s !== sub) s.classList.remove('open'); });
            sub.classList.add('open');
          } else if (href === '#' || href === '') {
            e.preventDefault();
            sub.classList.remove('open');
          }
        }
      }
    });
  });

  /* --- Close mobile nav when clicking outside --- */
  document.addEventListener('click', function (e) {
    if (mainNav && mainNav.classList.contains('open')) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    }
  });

  /* --- Tab system --- */
  const tabGroups = document.querySelectorAll('.tabs');
  tabGroups.forEach(function (group) {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-tab');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        const panel = group.querySelector('#' + target);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* --- Free Guide popup --- */
  const popup = document.getElementById('freeguide-popup');
  const popupClose = popup ? popup.querySelector('.close-btn') : null;

  function showPopup() {
    if (popup && !sessionStorage.getItem('ccs_popup_dismissed')) {
      popup.classList.add('show');
    }
  }

  if (popup) {
    // show after 6 seconds
    setTimeout(showPopup, 6000);

    if (popupClose) {
      popupClose.addEventListener('click', function () {
        popup.classList.remove('show');
        sessionStorage.setItem('ccs_popup_dismissed', '1');
      });
    }

    // simple form submit handler (no backend - just feedback)
    const popupForm = popup.querySelector('form');
    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = popupForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          popup.innerHTML = '<h4 style="color:#0f3a5f;">Thank you!</h4><p style="color:#5a6b7a;">Your free guide is on its way. Check your inbox shortly.</p>';
          sessionStorage.setItem('ccs_popup_dismissed', '1');
          setTimeout(function () { popup.classList.remove('show'); }, 3500);
        }
      });
    }
  }

  /* --- Generic form handler for static placeholders --- */
  const placeholderForms = document.querySelectorAll('form[data-placeholder]');
  placeholderForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.createElement('div');
      msg.style.cssText = 'background:#e8f5ee;border:1px solid #2a9d6e;color:#1a5e44;padding:1rem;border-radius:6px;margin-top:1rem;';
      msg.textContent = 'Thank you! We received your information and will contact you shortly. For immediate assistance, call 800-905-6862.';
      form.appendChild(msg);
      form.reset();
      setTimeout(function () { msg.remove(); }, 6000);
    });
  });

  /* --- Year stamp --- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Smooth scroll for in-page anchors --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href.length > 1 && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

})();
