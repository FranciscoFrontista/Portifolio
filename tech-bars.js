/* ============================================================
   TECH-BARS.JS — Anima as barras de nível na secção Tecnologias
   Lê o atributo data-level de cada .tech-card e, quando o cartão
   entra no ecrã, enche a barra e conta a percentagem até esse valor.
   Mostra logo o valor final para quem pede menos movimento.
   ============================================================ */

(function () {
  'use strict';

  const cards = document.querySelectorAll('.tech-card[data-level]');
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1000; // ms

  function animateCard(card) {
    const level = parseInt(card.dataset.level, 10) || 0;
    const bar = card.querySelector('.tech-card__bar span');
    const label = card.querySelector('.tech-card__level');

    if (prefersReducedMotion) {
      if (bar) bar.style.width = `${level}%`;
      if (label) label.textContent = `${level}%`;
      return;
    }

    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * level);

      if (bar) bar.style.width = `${eased * level}%`;
      if (label) label.textContent = `${current}%`;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const delay = prefersReducedMotion ? 0 : index * 70;
        window.setTimeout(() => animateCard(card), delay);
        obs.unobserve(card);
      });
    },
    { threshold: 0.4 }
  );

  cards.forEach((card) => observer.observe(card));
})();
