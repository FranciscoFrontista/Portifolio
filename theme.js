/* ============================================================
   THEME.JS — Alternância entre modo claro e escuro
   - Lê/grava a preferência em localStorage (chave 'portfolio-theme')
   - O <html> já recebe o tema correto antes da pintura (ver script
     inline no <head> do home.html), aqui só tratamos do toggle
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  function getCurrentTheme() {
    return htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme, persist) {
    htmlEl.setAttribute('data-theme', theme);

    if (persist) {
      localStorage.setItem(STORAGE_KEY, theme);
    }

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(theme === 'light'));
      toggleBtn.setAttribute(
        'aria-label',
        theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'
      );
    }
  }

  function toggleTheme() {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true); // true = escolha manual, guardar preferência
  }

  if (toggleBtn) {
    // Sincroniza o botão com o estado inicial (definido no script do <head>),
    // sem gravar no localStorage — isso só acontece num clique manual.
    applyTheme(getCurrentTheme(), false);
    toggleBtn.addEventListener('click', toggleTheme);
  } else {
    console.warn('[theme.js] Botão #themeToggle não encontrado no HTML.');
  }

  // Se o utilizador nunca escolheu manualmente um tema, segue as
  // alterações do sistema operativo em tempo real.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    const hasManualPreference = localStorage.getItem(STORAGE_KEY);
    if (!hasManualPreference) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();