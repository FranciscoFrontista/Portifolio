/* ============================================================
   SCROLL.JS — Comportamentos ligados ao scroll
   - Scroll-reveal (IntersectionObserver) para elementos .reveal
   - Indicador de secção ativa (navbar + status bar)
   - Navbar: sombra, esconder ao descer / mostrar ao subir, barra de progresso
   - Botão "voltar ao topo"
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. SCROLL-REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Cada elemento só precisa de aparecer uma vez
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 2. SECÇÃO ATIVA (navbar + status bar) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  const statusbarSection = document.getElementById('statusbarSection');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');

          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });

          if (statusbarSection) {
            statusbarSection.textContent = id;
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' } // "linha" de deteção a meio do ecrã
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- 3. NAVBAR: sombra + esconder ao descer / mostrar ao subir ---------- */
  const navbar = document.getElementById('navbar');
  const navLinksEl = document.getElementById('navLinks');
  const HIDE_THRESHOLD = 160; // só começa a esconder depois de sair da zona do topo
  const MIN_DELTA = 6; // ignora micro-oscilações do scroll (trackpad, etc.)
  let lastScrollY = window.scrollY;

  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  function updateNavbarVisibility() {
    if (!navbar) return;

    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    const menuOpen = navLinksEl && navLinksEl.classList.contains('is-open');

    if (menuOpen || currentY <= HIDE_THRESHOLD) {
      navbar.classList.remove('navbar--hidden');
    } else if (Math.abs(delta) > MIN_DELTA) {
      navbar.classList.toggle('navbar--hidden', delta > 0);
    }

    lastScrollY = currentY;
  }

  /* ---------- 3.1 BARRA DE PROGRESSO DE LEITURA ---------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  /* ---------- 4. BOTÃO VOLTAR AO TOPO ---------- */
  const backToTopBtn = document.getElementById('backToTop');

  function updateBackToTopVisibility() {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle('is-hidden', window.scrollY < 400);
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 5. LISTENER ÚNICO DE SCROLL (com requestAnimationFrame) ---------- */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      updateNavbarShadow();
      updateNavbarVisibility();
      updateScrollProgress();
      updateBackToTopVisibility();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });

  // Estado inicial (caso a página recarregue já com scroll, ex: após F5)
  updateNavbarShadow();
  updateNavbarVisibility();
  updateScrollProgress();
  updateBackToTopVisibility();
})();