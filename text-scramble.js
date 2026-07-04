/* ============================================================
   TEXT-SCRAMBLE.JS — Efeito de "descodificação" nos títulos
   Quando um título de secção entra no ecrã, o texto aparece a partir
   de caracteres aleatórios até revelar a palavra final.
   Desativado para quem pede menos movimento (mostra o texto normal).
   ============================================================ */

(function () {
  'use strict';

  const titles = document.querySelectorAll('.section__title');
  if (!titles.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&_/[]{}';

  function scrambleReveal(el, text, duration) {
    const length = text.length;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const revealCount = Math.floor(progress * length);
      let output = '';

      for (let i = 0; i < length; i++) {
        if (i < revealCount || text[i] === ' ') {
          output += text[i];
        } else {
          output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      el.textContent = output;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = text;
      }
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        scrambleReveal(el, el.textContent.trim(), 600);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  titles.forEach((el) => observer.observe(el));
})();
