/* ============================================================
   GITHUB-STATS.JS — Cartões de atividade do GitHub
   - Gera os URLs do github-readme-stats/streak-stats com as cores do tema
   - Esconde o cartão se a imagem falhar a carregar (serviço em baixo)
   ============================================================ */

(function () {
  'use strict';

  const USERNAME = 'FranciscoFrontista';
  const images = document.querySelectorAll('[data-gh-stat]');
  if (!images.length) return;

  const COLORS = {
    accent: 'FF3B3B',
    text: 'BEBEBE',
    bg: '00000000' // transparente — o cartão já tem o próprio fundo
  };

  function buildUrl(type) {
    const { accent, text, bg } = COLORS;

    if (type === 'stats') {
      return `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&hide_border=true&hide=contribs&bg_color=${bg}&title_color=${accent}&icon_color=${accent}&text_color=${text}`;
    }
    if (type === 'streak') {
      return `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&hide_border=true&background=${bg}&ring=${accent}&fire=${accent}&currStreakLabel=${accent}&sideLabels=${text}&currStreakNum=${text}&sideNums=${text}&dates=${text}`;
    }
    if (type === 'langs') {
      return `https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&hide_border=true&bg_color=${bg}&title_color=${accent}&text_color=${text}`;
    }
    return '';
  }

  function refresh() {
    images.forEach((img) => {
      img.src = buildUrl(img.dataset.ghStat);
      img.onerror = () => {
        const card = img.closest('.github-stats__card');
        if (card) card.style.display = 'none';
      };
    });
  }

  refresh();
})();
