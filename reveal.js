/* ============================================
   Lillico Art — Critical reveal + gallery hydration
   Loaded as the FIRST deferred script so it runs before
   (and never waits on) the CDN libraries. Everything the
   visitor must see is handled here; GSAP only decorates.
   ============================================ */
(function () {
  'use strict';

  /* --- Reveal-on-scroll (.reveal → .visible) --- */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* --- Gallery: deferred full-res loading ---
     Only the active piece ships with a real src; the rest carry
     data-src so 9 full-res images don't compete with first paint.
     They start downloading once the first piece has arrived. */
  var deferred = document.querySelectorAll('.gallery-piece img[data-src]');
  if (deferred.length > 0) {
    var hydrate = function (img) {
      if (img && img.getAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
    };

    // navigation.js calls this when a piece is about to be shown
    window.galleryHydrate = hydrate;

    var hydrated = false;
    var hydrateAll = function () {
      if (hydrated) return;
      hydrated = true;
      deferred.forEach(hydrate);
    };

    var first = document.querySelector('.gallery-piece.active img');
    if (first && !first.complete) {
      first.addEventListener('load', hydrateAll, { once: true });
      first.addEventListener('error', hydrateAll, { once: true });
      setTimeout(hydrateAll, 2500); // fallback if the first image stalls
    } else {
      hydrateAll();
    }
  }
})();
