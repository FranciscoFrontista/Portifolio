/* ============================================================
   MAIN.JS — Inicializações gerais
   - Menu mobile (hambúrguer)
   - Contagem animada das estatísticas
   - Validação e envio do formulário de contacto
   - Ano dinâmico no footer
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. MENU MOBILE ---------- */
  const burger = document.getElementById('navBurger');
  const navLinksEl = document.getElementById('navLinks');

  function closeMenu() {
    if (!burger || !navLinksEl) return;
    burger.classList.remove('is-open');
    navLinksEl.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (!burger || !navLinksEl) return;
    const isOpen = navLinksEl.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  }

  if (burger && navLinksEl) {
    burger.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar num link (mobile)
    navLinksEl.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Fecha o menu com a tecla Escape (acessibilidade de teclado)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 2. ESTATÍSTICAS ANIMADAS ---------- */
  const statNumbers = document.querySelectorAll('.stats__number');

  function animateNumber(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutCubic — começa rápido, desacelera no fim (mais natural que linear)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString('pt-PT');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-PT');
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  /* ---------- 3. VALIDAÇÃO E ENVIO DO FORMULÁRIO ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const VALIDATORS = {
    name: (value) => value.trim().length >= 2 || 'Indica o teu nome completo.',
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Indica um email válido.',
    message: (value) => value.trim().length >= 10 || 'A mensagem deve ter pelo menos 10 caracteres.'
  };

  function showFieldError(field, message) {
    const wrapper = field.closest('.form-field');
    const errorEl = document.getElementById(`${field.id}Error`);
    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateField(field) {
    const validator = VALIDATORS[field.name];
    if (!validator) return true;

    const result = validator(field.value);
    const isValid = result === true;

    showFieldError(field, isValid ? '' : result);
    return isValid;
  }

  if (form) {
    // Validação em tempo real ao sair do campo
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = Array.from(form.querySelectorAll('input, textarea'));
      const allValid = fields.map(validateField).every(Boolean);

      if (!allValid) {
        if (formStatus) {
          formStatus.textContent = 'Revê os campos assinalados antes de enviar.';
          formStatus.style.color = '#E5484D';
        }
        return;
      }

      // Não há backend ligado: aqui ficaria a chamada fetch() para o teu
      // serviço de envio de email (ex: Formspree, EmailJS, ou API própria).
      if (formStatus) {
        formStatus.style.color = '';
        formStatus.textContent = 'A enviar...';
      }

      window.setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = 'Mensagem enviada! Responderei em breve.';
        }
        form.reset();
      }, 700);
    });
  }

  /* ---------- 4. ANO DINÂMICO NO FOOTER ---------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 5. FAQ — ABERTURA/FECHO ANIMADOS ---------- */
  // <details> nativo abre/fecha instantaneamente (sem transição possível
  // em altura "auto"), por isso animamos a altura à mão com a Web
  // Animations API. Ver: https://web.dev/articles/details-animate
  const faqItems = document.querySelectorAll('.faq-item');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (faqItems.length && !prefersReducedMotion) {
    const FAQ_DURATION = 320;
    const FAQ_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

    faqItems.forEach((item) => {
      const summary = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');
      let animation = null;
      let isClosing = false;
      let isExpanding = false;

      function onFinish(open) {
        item.open = open;
        animation = null;
        isClosing = false;
        isExpanding = false;
        item.style.height = item.style.overflow = '';
      }

      function shrink() {
        isClosing = true;
        const startHeight = `${item.offsetHeight}px`;
        const endHeight = `${summary.offsetHeight}px`;

        if (animation) animation.cancel();
        animation = item.animate(
          { height: [startHeight, endHeight] },
          { duration: FAQ_DURATION, easing: FAQ_EASING }
        );
        animation.onfinish = () => onFinish(false);
        animation.oncancel = () => { isClosing = false; };
      }

      function expand() {
        isExpanding = true;
        const startHeight = `${item.offsetHeight}px`;
        const endHeight = `${summary.offsetHeight + answer.offsetHeight}px`;

        if (animation) animation.cancel();
        animation = item.animate(
          { height: [startHeight, endHeight] },
          { duration: FAQ_DURATION, easing: FAQ_EASING }
        );
        animation.onfinish = () => onFinish(true);
        animation.oncancel = () => { isExpanding = false; };
      }

      function open() {
        item.style.height = `${item.offsetHeight}px`;
        item.open = true;
        requestAnimationFrame(() => expand());
      }

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        item.style.overflow = 'hidden';

        if (isClosing || !item.open) {
          open();
        } else if (isExpanding || item.open) {
          shrink();
        }
      });
    });
  }
})();