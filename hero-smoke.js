/* ============================================================
   HERO-SMOKE.JS — Fumo animado no fundo da hero
   Nuvens suaves (gradientes radiais em canvas) que sobem devagar,
   na cor de destaque do site (--accent) — nada de imagem estática.
   Mostra uma única imagem parada para quem pede menos movimento.
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('heroSmoke');
  if (!canvas) return;

  const hero = canvas.closest('.hero');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let particles = [];
  let accentRgb = '255, 59, 59'; // fallback — atualizado a partir do CSS (--accent)

  function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const int = parseInt(full, 16);
    if (Number.isNaN(int)) return null;
    return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
  }

  function readTheme() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    const rgb = hexToRgb(value);
    if (rgb) accentRgb = rgb;
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(startBelow) {
    const radius = height * (0.2 + Math.random() * 0.16);
    return {
      x: Math.random() * width,
      y: startBelow ? height + radius * 0.4 : Math.random() * height,
      radius,
      driftX: (Math.random() - 0.5) * 0.15,
      speedY: 0.08 + Math.random() * 0.14,
      swayAmp: 20 + Math.random() * 40,
      swaySpeed: 0.0006 + Math.random() * 0.0007,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0.16 + Math.random() * 0.16,
    };
  }

  function createParticles() {
    const count = width < 700 ? 7 : 11;
    particles = Array.from({ length: count }, () => makeParticle(false));
  }

  function drawParticle(p, time) {
    const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmp;
    const x = p.x + sway;
    const a = p.alpha;
    const gradient = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.radius);
    gradient.addColorStop(0, `rgba(${accentRgb}, ${a})`);
    gradient.addColorStop(0.6, `rgba(${accentRgb}, ${a * 0.35})`);
    gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStaticFrame() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach((p) => drawParticle(p, 0));
  }

  function step(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.driftX;
      if (p.y + p.radius < 0) Object.assign(p, makeParticle(true));
      drawParticle(p, time);
    });
    requestAnimationFrame(step);
  }

  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
      if (prefersReducedMotion) drawStaticFrame();
    }, 150);
  }

  readTheme();
  resize();
  createParticles();

  if (prefersReducedMotion) {
    drawStaticFrame();
  } else {
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', onResize, { passive: true });
})();
