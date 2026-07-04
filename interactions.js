/* ============================================================
   INTERACTIONS.JS — Micro-interações que seguem o rato
   - Spotlight na hero (segue o cursor)
   - Tilt 3D nos cartões de projeto/serviço
   - Botões magnéticos (atraídos ligeiramente pelo cursor)
   Desativado em ecrãs táteis e para quem pede menos movimento.
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  /* ---------- 1. SPOTLIGHT NA HERO ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      hero.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  /* ---------- 2. TILT 3D EM CARTÕES ---------- */
  const TILT_MAX_DEG = 6;

  document.querySelectorAll('.project-card, .service-card, .hero__photo-card').forEach((card) => {
    const lift = card.classList.contains('project-card') ? '-8px' : '-6px';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = (px * TILT_MAX_DEG * 2).toFixed(2);
      const rotateX = (py * -TILT_MAX_DEG * 2).toFixed(2);
      card.style.transform = `perspective(800px) translateY(${lift}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 3. BOTÕES MAGNÉTICOS ---------- */
  const PULL_MAX_PX = 8;

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = `translate(${(px * PULL_MAX_PX).toFixed(1)}px, ${(py * PULL_MAX_PX - 3).toFixed(1)}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
