(function () {
  'use strict';

  var STORAGE_KEY = 'la_consent';
  var GA_ID = 'G-7GD6ZW9TJY';

  function loadGA() {
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function dismissBanner(banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(12px)';
    banner.style.pointerEvents = 'none';
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'la-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>This site uses cookies to understand how visitors engage with the work.</p>' +
      '<div class="la-consent__actions">' +
        '<button id="la-accept">Accept</button>' +
        '<button id="la-decline">Decline</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Trigger fade-in after 1 second
    setTimeout(function () {
      banner.classList.add('la-consent--visible');
    }, 1000);

    document.getElementById('la-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'granted');
      dismissBanner(banner);
      loadGA();
    });

    document.getElementById('la-decline').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'denied');
      dismissBanner(banner);
    });
  }

  function init() {
    var consent = localStorage.getItem(STORAGE_KEY);
    if (consent === 'granted') {
      loadGA();
    } else if (consent === 'denied') {
      // Respect the choice — do nothing
    } else {
      // null or unset — show banner
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
