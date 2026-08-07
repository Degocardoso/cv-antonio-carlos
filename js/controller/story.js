/**
 * Controller — Story Engine
 *
 * Motor de scroll narrativo do CV público, sem dependências externas.
 * Responsabilidades:
 *   · revelação progressiva de elementos ao entrar na viewport
 *   · trilhos horizontais independentes (botões, arrasto, teclado e swipe)
 *   · parallax sutil de camadas de fundo e números de capítulo
 *   · barra de progresso, navegação por capítulos e cor de acento por capítulo
 *   · contadores animados e barras de proficiência
 *
 * Princípios de performance:
 *   · um único listener de scroll (passivo) que apenas agenda um rAF
 *   · leituras de layout agrupadas antes das escritas (evita layout thrash)
 *   · medidas em cache, refeitas só em resize / troca de conteúdo
 *   · só transform e opacity são animados
 *
 * Acessibilidade:
 *   · `prefers-reduced-motion` desliga fixação, parallax e transições
 *   · trilhos horizontais continuam navegáveis por teclado (Tab, setas, botões)
 *   · sem sequestro do scroll nativo — a rolagem da página é sempre livre
 *
 * Os trilhos horizontais NÃO prendem a página: rolar para baixo continua
 * rolando para baixo. O deslocamento lateral é sempre uma ação do
 * visitante (arrastar, swipe, setas ou botões), então cada cartão pode
 * ter a altura que o conteúdo pedir, sem corte.
 */

const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Cores de acento por capítulo (ciclo) */
const ACCENTS = [
  ['--neon', '--halo-g'],
  ['--neon2', '--halo-c'],
  ['--neon4', '--halo-p'],
  ['--neon3', '--halo-o'],
  ['--neon5', '--halo-g']
];

const root = document.documentElement;

let reduced = mqReduced.matches;

let rails = [];
let parallaxEls = [];
let chapters = [];

let revealIO = null;
let fxIO = null;
let chapterIO = null;

let els = {};
let frameQueued = false;
let scrollMax = 1;
let lastY = -1;

/* ═══════════════════════════ API PÚBLICA ═══════════════════════════ */

/** Prepara o motor (uma única vez, antes do primeiro render). */
export function mountStory() {
  els = {
    progress: document.getElementById('pb'),
    aurora: document.getElementById('fxAurora'),
    hud: document.querySelector('.hud'),
    cue: document.getElementById('scrollCue'),
    nav: document.getElementById('chapNav')
  };

  if (!reduced) root.classList.add('anim');

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  mqReduced.addEventListener?.('change', (e) => {
    reduced = e.matches;
    root.classList.toggle('anim', !reduced);
    refreshStory();
  });

  if (document.fonts?.ready) document.fonts.ready.then(() => measureAll());
}

/**
 * Reindexa o DOM depois de um render (ou troca de idioma) e remede tudo.
 * Idempotente — pode ser chamado quantas vezes for preciso.
 */
export function refreshStory() {
  computeMode();
  collectRails();
  collectParallax();
  buildChapterNav();
  observeReveals();
  observeEffects();
  observeChapters();
  measureAll();
  lastY = -1;
  requestFrame();
}

/* ═══════════════════════════ MODO / MEDIDAS ═══════════════════════════ */

function computeMode() {
  reduced = mqReduced.matches;
}

function onResize() {
  computeMode();
  measureAll();
  lastY = -1;
  requestFrame();
}

function measureAll() {
  for (const r of rails) syncRail(r);
  scrollMax = Math.max(1, root.scrollHeight - root.clientHeight);
}

/** Lê a posição atual do trilho e reflete na barra e no cartão ativo. */
function syncRail(r) {
  const max = r.rail.scrollWidth - r.rail.clientWidth;
  r.scrollable = max > 1;
  r.rail.classList.toggle('is-scrollable', r.scrollable);
  paintRail(r, max > 0 ? r.rail.scrollLeft / max : 0);
}

/* ═══════════════════════════ COLETA DE ELEMENTOS ═══════════════════════════ */

function collectRails() {
  rails = Array.from(document.querySelectorAll('.chap-rail')).map(section => {
    const rail = section.querySelector('.rail');
    const track = section.querySelector('.rail-track');
    const r = {
      section, rail, track,
      bar: section.querySelector('.rail-bar span'),
      prev: section.querySelector('[data-rail-prev]'),
      next: section.querySelector('[data-rail-next]'),
      items: Array.from(track ? track.children : []).filter(el => el.classList.contains('rail-item')),
      scrollable: false,
      active: -1
    };
    if (rail && track && r.items.length && !rail.dataset.bound) {
      rail.dataset.bound = '1';
      bindRail(r);
    }
    return r;
  }).filter(r => r.rail && r.track && r.items.length);
}

function collectParallax() {
  parallaxEls = Array.from(document.querySelectorAll('[data-parallax]')).map(el => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0
  }));
  if (reduced) {
    parallaxEls.forEach(p => { p.el.style.transform = ''; });
    parallaxEls = [];
  }
}

/* ═══════════════════════════ REVELAÇÃO ═══════════════════════════ */

function observeReveals() {
  revealIO?.disconnect();
  const targets = document.querySelectorAll('[data-reveal], [data-stagger]');

  if (reduced) {
    targets.forEach(el => el.classList.add('rv-in'));
    return;
  }

  revealIO = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('rv-in');
      obs.unobserve(entry.target); // uma vez só: mantém o custo baixo
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  targets.forEach(el => {
    if (el.classList.contains('rv-in')) return;
    revealIO.observe(el);
  });
}

/** Contadores animados e barras de proficiência. */
function observeEffects() {
  fxIO?.disconnect();
  const targets = document.querySelectorAll('[data-count], [data-w]');

  if (reduced) {
    targets.forEach(applyEffectInstantly);
    return;
  }

  fxIO = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      runEffect(entry.target);
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.35 });

  targets.forEach(el => fxIO.observe(el));
}

function applyEffectInstantly(el) {
  if (el.dataset.w) el.style.width = el.dataset.w;
  if (el.dataset.count) el.textContent = formatCount(parseFloat(el.dataset.count), decimalsOf(el.dataset.count));
}

function runEffect(el) {
  if (el.dataset.w) { el.style.width = el.dataset.w; return; }
  if (!el.dataset.count) return;

  const to = parseFloat(el.dataset.count);
  if (!isFinite(to)) return;
  const decimals = decimalsOf(el.dataset.count);
  const duration = 1000;
  const start = performance.now();

  (function step(now) {
    const k = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = formatCount(to * eased, decimals);
    if (k < 1) requestAnimationFrame(step);
  })(start);
}

function decimalsOf(str) { return (String(str).split('.')[1] || '').length; }
function formatCount(v, decimals) {
  return v.toFixed(decimals).replace('.', ',');
}

/* ═══════════════════════════ CAPÍTULOS ═══════════════════════════ */

function buildChapterNav() {
  if (!els.nav) return;
  chapters = Array.from(document.querySelectorAll('#story .chap'))
    .filter(el => el.dataset.nav && el.offsetParent !== null);

  els.nav.innerHTML = '';
  chapters.forEach((chap, i) => {
    const a = document.createElement('a');
    a.href = '#' + chap.id;
    a.dataset.idx = String(i);
    a.innerHTML = '<span></span><i></i>';
    a.querySelector('span').textContent = chap.dataset.nav;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      chap.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
    els.nav.appendChild(a);
  });
}

function observeChapters() {
  chapterIO?.disconnect();
  if (!chapters.length) return;

  chapterIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      setActiveChapter(chapters.indexOf(entry.target));
    }
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  chapters.forEach(c => chapterIO.observe(c));
}

let activeChapter = -1;
function setActiveChapter(idx) {
  if (idx < 0 || idx === activeChapter) return;
  activeChapter = idx;

  els.nav?.querySelectorAll('a').forEach((a, i) => {
    a.classList.toggle('is-active', i === idx);
  });

  const [color, halo] = ACCENTS[idx % ACCENTS.length];
  root.style.setProperty('--accent', `var(${color})`);
  root.style.setProperty('--accent-halo', `var(${halo})`);
}

/* ═══════════════════════════ TRILHOS HORIZONTAIS ═══════════════════════════ */

function bindRail(r) {
  r.prev?.addEventListener('click', () => goToIndex(r, r.active - 1));
  r.next?.addEventListener('click', () => goToIndex(r, r.active + 1));

  // Setas do teclado quando o trilho tem foco
  r.rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goToIndex(r, r.active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToIndex(r, r.active - 1); }
  });

  // O trilho rola nativamente (swipe, trackpad, arrasto): acompanha a barra.
  r.rail.addEventListener('scroll', () => {
    const max = r.rail.scrollWidth - r.rail.clientWidth;
    paintRail(r, max > 0 ? r.rail.scrollLeft / max : 0);
  }, { passive: true });

  bindDrag(r);
}

/**
 * Arrastar com o mouse para percorrer o trilho.
 * Sem isso, quem usa mouse comum (sem trackpad) só teria os botões —
 * o swipe do touch e o scroll horizontal do trackpad já são nativos.
 */
function bindDrag(r) {
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let moved = 0;

  r.rail.addEventListener('pointerdown', (e) => {
    // Só mouse: no touch o scroll nativo é melhor do que qualquer emulação.
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('a, button')) return;
    dragging = true;
    moved = 0;
    startX = e.clientX;
    startLeft = r.rail.scrollLeft;
    r.rail.classList.add('is-dragging');
  });

  r.rail.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 3 && !r.rail.hasPointerCapture(e.pointerId)) {
      r.rail.setPointerCapture(e.pointerId);
    }
    r.rail.scrollLeft = startLeft - dx;
  });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    r.rail.classList.remove('is-dragging');
    if (r.rail.hasPointerCapture?.(e.pointerId)) r.rail.releasePointerCapture(e.pointerId);
    // Um arrasto não deve virar clique no cartão que estava sob o cursor.
    if (moved > 4) {
      r.rail.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); },
        { capture: true, once: true });
    }
  };
  r.rail.addEventListener('pointerup', end);
  r.rail.addEventListener('pointercancel', end);
}

/** Leva o trilho até o cartão pedido, sem mexer no scroll da página. */
function goToIndex(r, idx) {
  const target = Math.max(0, Math.min(r.items.length - 1, idx));
  const item = r.items[target];
  if (!item) return;
  const left = r.rail.scrollLeft + (item.getBoundingClientRect().left - r.rail.getBoundingClientRect().left);
  const gutter = parseFloat(getComputedStyle(r.track).paddingLeft) || 0;
  r.rail.scrollTo({ left: left - gutter, behavior: reduced ? 'auto' : 'smooth' });
}

/** Aplica o estado visual do trilho para um progresso 0–1. */
function paintRail(r, p) {
  if (r.bar) r.bar.style.width = (p * 100).toFixed(2) + '%';

  const idx = Math.round(p * (r.items.length - 1));
  if (idx !== r.active) {
    r.items[r.active]?.classList.remove('is-active');
    r.items[idx]?.classList.add('is-active');
    r.active = idx;
    if (r.prev) r.prev.disabled = idx <= 0;
    if (r.next) r.next.disabled = idx >= r.items.length - 1;
  }
}

/* ═══════════════════════════ LOOP DE SCROLL ═══════════════════════════ */

function requestFrame() {
  if (frameQueued) return;
  frameQueued = true;
  requestAnimationFrame(frame);
}

function frame() {
  frameQueued = false;

  const y = window.scrollY;
  if (y === lastY) return;
  lastY = y;

  const vh = window.innerHeight;

  /* ── FASE DE LEITURA (nenhuma escrita de estilo antes daqui) ── */
  const pxRects = parallaxEls.map(p => p.el.getBoundingClientRect());
  scrollMax = Math.max(1, root.scrollHeight - root.clientHeight);

  /* ── FASE DE ESCRITA ── */
  if (els.progress) els.progress.style.width = ((y / scrollMax) * 100).toFixed(2) + '%';
  if (els.aurora) els.aurora.style.transform = `translate3d(0, ${(-y * 0.05).toFixed(1)}px, 0)`;
  els.hud?.classList.toggle('is-stuck', y > 16);
  els.cue?.classList.toggle('is-hidden', y > 120);

  for (let i = 0; i < parallaxEls.length; i++) {
    const item = parallaxEls[i];
    const rect = pxRects[i];
    // Fora da viewport (com folga): não vale o custo de repintar.
    if (rect.bottom < -200 || rect.top > vh + 200) continue;
    const fromCenter = rect.top + rect.height / 2 - vh / 2;
    item.el.style.transform = `translate3d(0, ${(-fromCenter * item.speed).toFixed(2)}px, 0)`;
  }
}

