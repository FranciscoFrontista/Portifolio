/* ============================================================
   TYPING.JS — Efeito de digitação no Hero
   Alterna entre vários textos (cargos), escrevendo e apagando
   letra a letra, de forma cíclica e infinita.
   ============================================================ */

(function () {
  'use strict';

  const target = document.getElementById('typingText');
  if (!target) return;

  // Placeholder: ajusta estes textos aos teus cargos/áreas reais
  const PHRASES = [
    'Desenvolvedor Front-End',
    'UI/UX Designer',
    'Criador de Experiências Web'
  ];

  const TYPE_SPEED = 80;        // ms por carácter ao escrever
  const DELETE_SPEED = 40;      // ms por carácter ao apagar
  const PAUSE_AFTER_TYPE = 1800; // pausa com a frase completa visível
  const PAUSE_AFTER_DELETE = 300; // pausa antes de começar a próxima frase

  // Respeita utilizadores que pediram menos movimento:
  // mostra logo a primeira frase, sem animação de escrita.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = PHRASES[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    target.textContent = currentPhrase.substring(0, charIndex);

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Frase completa: pausa, depois começa a apagar
      isDeleting = true;
      delay = PAUSE_AFTER_TYPE;
    } else if (isDeleting && charIndex === 0) {
      // Frase apagada: avança para a próxima
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      delay = PAUSE_AFTER_DELETE;
    }

    window.setTimeout(tick, delay);
  }

  if (prefersReducedMotion) {
    target.textContent = PHRASES[0];
  } else {
    tick();
  }
})();