/**
 * Controller — Index (CV público)
 *
 * Orquestra o carregamento dos dados, o render da narrativa, o motor de
 * scroll (story.js) e as interações: tema, idioma, galeria e portfólio.
 */
import { getData, setData, applyTheme, applyTypography, mergeFromCloud } from '../model/state.js';
import { CV_READ_URL } from './api.js';
import { render, renderPortfolio, setLang, getGallery } from '../view/index-view.js';
import { mountStory, refreshStory } from './story.js';
import { copyEmail } from '../utils.js';

const THEME_KEY = 'cv-theme';

/* Estado da galeria aberta */
let gallery = [];
let galleryIdx = 0;
let lastFocused = null;

/* ═══════════════════════════ INICIALIZAÇÃO ═══════════════════════════ */

export async function init() {
  mountStory();
  bindGlobalEvents();
  startTypewriter();
  startClock();

  // Permite que o painel admin injete dados para o preview em iframe.
  window.__applyPreview = (data) => {
    setData(mergeFromCloud(data));
    applyTheme();
    applyTypography();
    applyDataChrome();
    render();
    afterRender();
  };

  const ldInterval = startLoadingMessages();
  await loadData();
  clearInterval(ldInterval);
}

async function loadData() {
  if (window.__previewData) {
    setData(mergeFromCloud(window.__previewData));
  } else {
    try {
      const res = await fetch(CV_READ_URL, { cache: 'no-cache' });
      if (res.ok) {
        const record = await res.json();
        if (record && Object.keys(record).length > 0) setData(mergeFromCloud(record));
      }
    } catch {
      // Sem rede ou sem functions: segue com o conteúdo de defaults.js
    }
  }

  const D = getData();

  // Tema: preferência salva do visitante > modo definido no admin
  const saved = safeStorage.get(THEME_KEY);
  const mode = saved || D.theme?.mode || 'dark';
  document.documentElement.classList.toggle('light', mode === 'light');
  updateThemeButton();

  applyDataChrome();
  applyTheme();
  applyTypography();
  render();
  afterRender();

  generateQR();
  trackVisit();
  hideLoading();
}

/** Ajustes de interface que dependem do conteúdo carregado. */
function applyDataChrome() {
  const btn = document.getElementById('langToggle');
  if (btn) btn.hidden = !getData().i18n?.enabled;
}

/** Passos que dependem do DOM já renderizado. */
function afterRender() {
  refreshStory();
  initPhotoFx();
}

/* ═══════════════════════════ EVENTOS ═══════════════════════════ */

function bindGlobalEvents() {
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('langToggle')?.addEventListener('click', toggleLang);
  document.getElementById('poClose')?.addEventListener('click', closePortfolio);
  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => navGallery(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => navGallery(1));

  document.getElementById('lb')?.addEventListener('click', (e) => {
    if (e.target.id === 'lb') closeLightbox();
  });

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeyDown);
}

function onDocumentClick(e) {
  const copyTrigger = e.target.closest('[data-copy]');
  if (copyTrigger) { copyEmail(copyTrigger.dataset.copy); return; }

  if (e.target.closest('#openPortfolio')) { openPortfolio(); return; }

  const galleryTrigger = e.target.closest('[data-gallery]');
  if (galleryTrigger) {
    openGallery(
      parseInt(galleryTrigger.dataset.gallery, 10),
      parseInt(galleryTrigger.dataset.galleryStart || '0', 10)
    );
  }
}

function onKeyDown(e) {
  const lb = document.getElementById('lb');
  const po = document.getElementById('po');
  const lbOpen = lb && !lb.hidden;
  const poOpen = po && !po.hidden;

  // Miniaturas do portfólio são acionáveis por teclado
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.matches('img[data-gallery]')) {
    e.preventDefault();
    document.activeElement.click();
    return;
  }

  if (e.key === 'Escape') {
    if (lbOpen) { closeLightbox(); return; }
    if (poOpen) { closePortfolio(); return; }
  }

  if (lbOpen) {
    if (e.key === 'ArrowRight') navGallery(1);
    if (e.key === 'ArrowLeft') navGallery(-1);
    if (e.key === 'Tab') trapFocus(lb, e);
    return;
  }
  if (poOpen && e.key === 'Tab') trapFocus(po, e);
}

/** Mantém o Tab dentro do diálogo aberto. */
function trapFocus(container, e) {
  const focusables = Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), img[tabindex="0"], [tabindex]:not([tabindex="-1"])'
  )).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ═══════════════════════════ GALERIA / LIGHTBOX ═══════════════════════════ */

function openGallery(projectIdx, startIdx) {
  const images = getGallery(projectIdx);
  if (!images.length) return;
  gallery = images;
  galleryIdx = Math.max(0, Math.min(images.length - 1, startIdx || 0));
  lastFocused = document.activeElement;
  showGalleryItem();
}

function showGalleryItem() {
  const lb = document.getElementById('lb');
  const content = document.getElementById('lb-content');
  content.innerHTML = '';

  const img = document.createElement('img');
  img.src = gallery[galleryIdx];
  img.alt = '';
  img.decoding = 'async';
  content.appendChild(img);

  const hasNav = gallery.length > 1;
  document.getElementById('lbPrev').hidden = !hasNav;
  document.getElementById('lbNext').hidden = !hasNav;
  const counter = document.getElementById('lbCounter');
  counter.hidden = !hasNav;
  counter.textContent = `${galleryIdx + 1} / ${gallery.length}`;

  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('is-open'));
  lockScroll(true);
  document.getElementById('lbClose').focus();
}

function navGallery(dir) {
  if (gallery.length <= 1) return;
  galleryIdx = (galleryIdx + dir + gallery.length) % gallery.length;
  showGalleryItem();
}

function closeLightbox() {
  const lb = document.getElementById('lb');
  if (!lb || lb.hidden) return;
  lb.classList.remove('is-open');
  lb.hidden = true;
  document.getElementById('lb-content').innerHTML = '';
  gallery = [];
  galleryIdx = 0;
  // Se o portfólio segue aberto, o scroll continua travado por ele.
  lockScroll(!document.getElementById('po').hidden);
  lastFocused?.focus?.();
}

/* ═══════════════════════════ PORTFÓLIO COMPLETO ═══════════════════════════ */

function openPortfolio() {
  const po = document.getElementById('po');
  renderPortfolio();
  lastFocused = document.activeElement;
  po.hidden = false;
  requestAnimationFrame(() => po.classList.add('is-open'));
  lockScroll(true);
  document.getElementById('poClose').focus();
}

function closePortfolio() {
  const po = document.getElementById('po');
  if (!po || po.hidden) return;
  po.classList.remove('is-open');
  po.hidden = true;
  lockScroll(false);
  lastFocused?.focus?.();
}

function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

/* ═══════════════════════════ TEMA E IDIOMA ═══════════════════════════ */

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  safeStorage.set(THEME_KEY, isLight ? 'light' : 'dark');
  updateThemeButton();
  applyTheme();
}

function updateThemeButton() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isLight = document.documentElement.classList.contains('light');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#ffffff' : '#070a0e');
}

let currentLang = 'pt';
function toggleLang() {
  if (!getData().i18n?.enabled) return;
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  setLang(currentLang);
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = currentLang.toUpperCase();
  render();
  afterRender();
}

/* ═══════════════════════════ ABERTURA ═══════════════════════════ */

function startLoadingMessages() {
  const msgs = ['Acessando histórico profissional', 'Carregando portfólio', 'Bem-vindo à minha trajetória'];
  const el = document.getElementById('ldMsg');
  let i = 0;
  return setInterval(() => {
    i = (i + 1) % msgs.length;
    if (el) el.textContent = msgs[i];
  }, 1800);
}

function hideLoading() {
  const el = document.getElementById('loading');
  if (!el) return;
  el.classList.add('out');
  setTimeout(() => { el.style.display = 'none'; }, 750);
}

/* ═══════════════════════════ DETALHES DE INTERFACE ═══════════════════════════ */

/** Sem :hover (touch), a moldura da foto acende ao entrar na viewport. */
let photoObserver = null;
function initPhotoFx() {
  photoObserver?.disconnect();
  const frame = document.querySelector('.hp-frame');
  if (!frame || !window.matchMedia('(hover: none)').matches) return;
  photoObserver = new IntersectionObserver(entries => {
    entries.forEach(e => frame.classList.toggle('in-view', e.isIntersecting));
  }, { threshold: 0.6 });
  photoObserver.observe(frame);
}

function startTypewriter() {
  const el = document.getElementById('tw');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'cat trajetoria.json';
    return;
  }
  const phrases = ['cat trajetoria.json', 'git log --oneline', 'python analise.py', 'az login --ok'];
  let pi = 0, ci = 0, deleting = false;

  (function type() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 1900); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 32 : 68);
  })();
}

function startClock() {
  const el = document.getElementById('clk');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}

/** QR usado apenas na versão impressa. */
function generateQR() {
  const container = document.getElementById('qrCode');
  if (!container) return;
  const url = window.location.href.split('?')[0].split('#')[0];
  container.innerHTML =
    `<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}"
          alt="QR Code" width="80" height="80" loading="lazy">`;
}

async function trackVisit() {
  try {
    const base = document.querySelector('meta[name="api-base"]')?.content || '/.netlify/functions';
    await fetch(`${base}/cv-ping`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  } catch {
    // silencioso
  }
}

/* localStorage pode lançar em modo restrito — encapsula. */
const safeStorage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignora */ } }
};
