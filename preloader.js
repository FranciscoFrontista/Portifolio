/* ============================================================
   PRELOADER.JS — Ecrã de carregamento inicial
   - Simula progresso até a página carregar de verdade (window load)
   - Garante um tempo mínimo visível para não "piscar" em ligações rápidas
   - Timeout de segurança: nunca fica preso no ecrã, mesmo se algo falhar
   ============================================================ */

(function () {
  'use strict';

  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  if (!preloader || !fill) return;

  const MIN_VISIBLE_MS = 900;
  const SAFETY_TIMEOUT_MS = 6000;
  const startTime = Date.now();

  document.documentElement.classList.add('is-loading');

  let progress = 0;
  const progressTimer = window.setInterval(() => {
    // Avança rápido no início, desacelera perto dos 90% — nunca chega a
    // 100% sozinho, isso só acontece quando a página carrega de verdade.
    progress += (90 - progress) * 0.1;
    fill.style.width = `${Math.min(progress, 90).toFixed(1)}%`;
  }, 180);

  function hidePreloader() {
    window.clearInterval(progressTimer);
    fill.style.width = '100%';

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    window.setTimeout(() => {
      preloader.classList.add('is-done');
      document.documentElement.classList.remove('is-loading');
    }, remaining + 200);
  }

  window.addEventListener('load', hidePreloader, { once: true });

  // Rede de segurança: se por algum motivo o evento 'load' nunca disparar
  // (ex.: um recurso externo a demorar demasiado), não deixa o site preso.
  window.setTimeout(hidePreloader, SAFETY_TIMEOUT_MS);
})();
