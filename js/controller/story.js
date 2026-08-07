/**
 * Controller — Story Engine
 *
 * Motor de scroll narrativo do CV público, sem dependências externas.
 * Responsabilidades:
 *   · revelação progressiva de elementos ao entrar na viewport
 *   · seções "fixadas" que rolam horizontalmente durante o scroll vertical
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
 *   · sem sequestro do scroll nativo — a rolagem do navegador é preservada
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

/* Largura/altura mínimas para fixar seções horizontais */
const PIN_MIN_W = 900;
/* Abaixo disso o palco fixado não tem altura para o cabeçalho + trilho +
   controles sem apertar o conteúdo: melhor cair no swipe horizontal nativo. */
const PIN_MIN_H = 640;
/* Deslocamento horizontal mínimo que justifica fixar a seção */
const MIN_TRAVEL = 200;

const root = document.documentElement;

let reduced = mqReduced.matches;
let pinEnabled = false;

let pins = [];
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
  collectPins();
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
  pinEnabled = !reduced
    && window.innerWidth >= PIN_MIN_W
    && window.innerHeight >= PIN_MIN_H;
}

function onResize() {
  computeMode();
  measureAll();
  lastY = -1;
  requestFrame();
}

function measureAll() {
  const vh = window.innerHeight;
  for (const pin of pins) {
    measurePin(pin, vh);
    // Estado inicial do trilho (barra + cartão ativo) sem esperar o primeiro scroll.
    if (!pin.distance) {
      const max = pin.rail.scrollWidth - pin.rail.clientWidth;
      paintRail(pin, max > 0 ? pin.rail.scrollLeft / max : 0);
    }
  }
  scrollMax = Math.max(1, root.scrollHeight - root.clientHeight);
}

function measurePin(pin, vh) {
  // Limpa o estado antes de medir para não medir em cima de si mesmo.
  pin.section.classList.remove('is-pinned');
  pin.section.style.height = '';
  pin.track.style.transform = '';
  pin.stageH = vh;

  if (!pinEnabled) { pin.distance = 0; return; }

  // Mede a distância horizontal real do trilho (track usa width:max-content).
  // Abaixo de MIN_TRAVEL o efeito seria só um solavanco: melhor não fixar.
  const distance = Math.max(0, pin.track.offsetWidth - pin.rail.clientWidth);
  if (distance < MIN_TRAVEL) { pin.distance = 0; return; }

  pin.section.classList.add('is-pinned');
  // Altura do palco fica em cache: o loop de scroll nunca lê layout depois de escrever.
  pin.stageH = pin.shell.offsetHeight || vh;
  pin.distance = distance;
  pin.section.style.height = (pin.stageH + distance) + 'px';
}

/* ═══════════════════════════ COLETA DE ELEMENTOS ═══════════════════════════ */

function collectPins() {
  pins = Array.from(document.querySelectorAll('.chap-pin')).map(section => {
    const rail = section.querySelector('.rail');
    const track = section.querySelector('.rail-track');
    const pin = {
      section,
      shell: section.querySelector('.pin-shell'),
      rail,
      track,
      bar: section.querySelector('.rail-bar span'),
      prev: section.querySelector('[data-rail-prev]'),
      next: section.querySelector('[data-rail-next]'),
      items: Array.from(track ? track.children : []).filter(el => el.classList.contains('rail-item')),
      distance: 0,
      travel: 0,
      active: -1
    };
    if (rail && track) bindRail(pin);
    return pin;
  }).filter(p => p.rail && p.track && p.items.length);
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

function bindRail(pin) {
  pin.prev?.addEventListener('click', () => goToIndex(pin, pin.active - 1));
  pin.next?.addEventListener('click', () => goToIndex(pin, pin.active + 1));

  // Setas do teclado quando o trilho tem foco
  pin.rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goToIndex(pin, pin.active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToIndex(pin, pin.active - 1); }
  });

  // Tab para dentro de um cartão fora da tela: traz o cartão para a viewport.
  pin.rail.addEventListener('focusin', (e) => {
    if (!pin.distance) return;
    const item = e.target.closest('.rail-item');
    if (!item) return;
    // 'instant': com `scroll-behavior: smooth` no html, 'auto' animaria
    // e brigaria com o scroll que o navegador já faz ao focar.
    const idx = pin.items.indexOf(item);
    if (idx >= 0 && idx !== pin.active) goToIndex(pin, idx, 'instant');
  });

  // No modo não-fixado o trilho rola nativamente: acompanha a barra.
  pin.rail.addEventListener('scroll', () => {
    if (pin.distance) return;
    const max = pin.rail.scrollWidth - pin.rail.clientWidth;
    const p = max > 0 ? pin.rail.scrollLeft / max : 0;
    paintRail(pin, p);
  }, { passive: true });
}

/** Move o trilho para o índice pedido (via scroll da página ou do container). */
function goToIndex(pin, idx, behavior) {
  const max = pin.items.length - 1;
  const target = Math.max(0, Math.min(max, idx));
  const smooth = behavior || (reduced ? 'auto' : 'smooth');

  if (pin.distance) {
    const top = pin.section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (target / max) * pin.distance, behavior: smooth });
  } else {
    pin.items[target]?.scrollIntoView({ behavior: smooth, inline: 'start', block: 'nearest' });
  }
}

/** Aplica o estado visual do trilho para um progresso 0–1. */
function paintRail(pin, p) {
  if (pin.bar) pin.bar.style.width = (p * 100).toFixed(2) + '%';

  const idx = Math.round(p * (pin.items.length - 1));
  if (idx !== pin.active) {
    pin.items[pin.active]?.classList.remove('is-active');
    pin.items[idx]?.classList.add('is-active');
    pin.active = idx;
    if (pin.prev) pin.prev.disabled = idx <= 0;
    if (pin.next) pin.next.disabled = idx >= pin.items.length - 1;
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
  const pinRects = pins.map(p => (p.distance ? p.section.getBoundingClientRect() : null));
  const pxRects = parallaxEls.map(p => p.el.getBoundingClientRect());
  scrollMax = Math.max(1, root.scrollHeight - root.clientHeight);

  /* ── FASE DE ESCRITA ── */
  if (els.progress) els.progress.style.width = ((y / scrollMax) * 100).toFixed(2) + '%';
  if (els.aurora) els.aurora.style.transform = `translate3d(0, ${(-y * 0.05).toFixed(1)}px, 0)`;
  els.hud?.classList.toggle('is-stuck', y > 16);
  els.cue?.classList.toggle('is-hidden', y > 120);

  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    const rect = pinRects[i];
    if (!rect) continue;

    const travel = pin.distance; // altura extra da seção == distância horizontal
    const p = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;

    pin.track.style.transform = `translate3d(${(-p * pin.distance).toFixed(2)}px, 0, 0)`;
    paintRail(pin, p);
  }

  for (let i = 0; i < parallaxEls.length; i++) {
    const item = parallaxEls[i];
    const rect = pxRects[i];
    // Fora da viewport (com folga): não vale o custo de repintar.
    if (rect.bottom < -200 || rect.top > vh + 200) continue;
    const fromCenter = rect.top + rect.height / 2 - vh / 2;
    item.el.style.transform = `translate3d(0, ${(-fromCenter * item.speed).toFixed(2)}px, 0)`;
  }
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
