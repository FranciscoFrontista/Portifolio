/* ============================================================
   CURSOR.JS — Cursor personalizado: brilho suave a seguir o rato
   Um único halo desfocado (sem anel/ponto duro), com atraso suave
   (lerp) e que cresce sobre elementos interativos.
   Desativado em ecrãs táteis e para quem pede menos movimento.
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.body.classList.add('has-custom-cursor');

  let mouseX = -200, mouseY = -200;
  let glowX = -200, glowY = -200;
  let started = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!started) {
      started = true;
      glowX = mouseX;
      glowY = mouseY;
      glow.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function tick() {
    glowX += (mouseX - glowX) * 0.14;
    glowY += (mouseY - glowY) * 0.14;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const hoverTargets = 'a, button, .btn, input, textarea, summary, .tech-card, .project-card, .service-card, .process-step, .github-stats__card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) glow.classList.add('cursor-glow--active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) glow.classList.remove('cursor-glow--active');
  });
})();
