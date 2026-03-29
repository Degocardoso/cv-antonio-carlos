/**
 * Controller — Index (CV público)
 * Lógica de inicialização, lightbox, PDF, typewriter, etc.
 */
import { getData, setData, applyTheme, mergeFromCloud } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { CV_READ_URL } from './api.js';
import { render, renderPortfolio } from '../view/index-view.js';
import { copyEmail, escAttr } from '../utils.js';

/* ═══ GALLERY STATE ═══ */
let gallery = [];    // lista de URLs da galeria atual
let galleryIdx = 0;  // índice atual

/** Inicializa o CV público */
export async function init() {
  // Expõe funções necessárias para onclick inline
  window.__copyEmail = copyEmail;
  window.__printDesign = printDesign;
  window.__printATS = printATS;
  window.__toggleTheme = toggleTheme;
  window.__toggleLang = toggleLang;
  window.closeLB = closeLB;

  // Event delegation para lightbox e certificações
  document.addEventListener('click', (e) => {
    // Fechar lightbox pelo X
    if (e.target.closest('.lb-x')) {
      closeLB();
      return;
    }

    // Imagens de projeto — abrir galeria com navegação
    const lbTrigger = e.target.closest('[data-lightbox]');
    if (lbTrigger) {
      e.stopPropagation();
      const container = lbTrigger.closest('.proj-imgs, .po-imgs');
      if (container) {
        const allImgs = Array.from(container.querySelectorAll('[data-lightbox]'));
        gallery = allImgs.map(el => el.dataset.lightbox);
        galleryIdx = allImgs.indexOf(lbTrigger);
        if (galleryIdx < 0) galleryIdx = 0;
      } else {
        gallery = [lbTrigger.dataset.lightbox];
        galleryIdx = 0;
      }
      showGalleryItem();
      return;
    }

    // Certificações — abrir link em nova aba
    const certItem = e.target.closest('[data-cert-url]');
    if (certItem) {
      window.open(certItem.dataset.certUrl, '_blank', 'noopener');
      return;
    }
  });

  // Fechar lightbox/portfolio com Escape, navegar com setas
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLB(); closePO(); }
    if (document.getElementById('lb').style.display === 'flex') {
      if (e.key === 'ArrowRight') navGallery(1);
      if (e.key === 'ArrowLeft') navGallery(-1);
    }
  });

  // Lightbox close on background click
  document.getElementById('lb').addEventListener('click', function(e) {
    if (e.target === this) closeLB();
  });

  // Lightbox nav buttons
  document.getElementById('lbPrev').addEventListener('click', () => navGallery(-1));
  document.getElementById('lbNext').addEventListener('click', () => navGallery(1));

  // Portfolio button
  window.openPO = openPO;
  window.closePO = closePO;

  // Scroll progress
  window.addEventListener('scroll', () => {
    const e = document.documentElement;
    document.getElementById('pb').style.width = ((e.scrollTop / (e.scrollHeight - e.clientHeight)) * 100) + '%';
  }, { passive: true });

  // Typewriter
  startTypewriter();

  // Clock
  startClock();

  // Loading messages
  const ldMsgs = ['Acessando histórico profissional', 'Carregando portfólio', 'Bem-vindo ao meu CV'];
  let ldIdx = 0;
  const ldEl = document.getElementById('ldMsg');
  const ldInterval = setInterval(() => {
    ldIdx = (ldIdx + 1) % ldMsgs.length;
    if (ldEl) ldEl.textContent = ldMsgs[ldIdx];
  }, 1800);

  // Load data
  await loadData();
  clearInterval(ldInterval);
}

async function loadData() {
  try {
    const res = await fetch(CV_READ_URL, { cache: 'no-cache' });
    if (res.ok) {
      const record = await res.json();
      if (record && Object.keys(record).length > 0) {
        setData(mergeFromCloud(record));
      }
    }
  } catch (e) {
    // silently fall back to DEFAULTS
  }

  const D = getData();

  // Apply saved theme mode
  const mode = D.theme?.mode || 'dark';
  if (mode === 'light') document.documentElement.classList.add('light');
  updateThemeToggleBtn();

  // i18n toggle visibility
  if (D.i18n?.enabled) {
    const btn = document.getElementById('langToggle');
    if (btn) btn.style.display = '';
  }

  applyTheme();
  render();
  generateQR();
  trackVisit();
  hideLoading();
}

function hideLoading() {
  const el = document.getElementById('loading');
  el.classList.add('out');
  setTimeout(() => el.style.display = 'none', 750);
}

/* ═══ LIGHTBOX com galeria ═══ */
function showGalleryItem() {
  const src = gallery[galleryIdx];
  const container = document.getElementById('lb-content');
  container.innerHTML = '';

  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  container.appendChild(img);

  // Mostrar/esconder nav
  const hasNav = gallery.length > 1;
  document.getElementById('lbPrev').style.display = hasNav ? '' : 'none';
  document.getElementById('lbNext').style.display = hasNav ? '' : 'none';
  const counter = document.getElementById('lbCounter');
  counter.style.display = hasNav ? '' : 'none';
  counter.textContent = `${galleryIdx + 1} / ${gallery.length}`;

  document.getElementById('lb').style.display = 'flex';
}

function navGallery(dir) {
  if (gallery.length <= 1) return;
  galleryIdx = (galleryIdx + dir + gallery.length) % gallery.length;
  showGalleryItem();
}

function closeLB() {
  document.getElementById('lb').style.display = 'none';
  document.getElementById('lb-content').innerHTML = '';
  gallery = [];
  galleryIdx = 0;
}

/* ═══ PORTFOLIO OVERLAY ═══ */
function openPO() {
  document.getElementById('po').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderPortfolio();
}

function closePO() {
  document.getElementById('po').classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══ PDF ═══ */
function printDesign() {
  document.body.classList.add('pm-design');
  window.print();
  setTimeout(() => document.body.classList.remove('pm-design'), 800);
}

function printATS() {
  document.body.classList.add('pm-ats');
  window.print();
  setTimeout(() => document.body.classList.remove('pm-ats'), 800);
}

/* ═══ TYPEWRITER ═══ */
function startTypewriter() {
  const phrases = ['cat perfil.json', 'git log --oneline', 'python analise.py', 'az login --ok'];
  let pi = 0, ci = 0, dl = false;
  const tw = document.getElementById('tw');

  function type() {
    const c = phrases[pi];
    if (!dl) { tw.textContent = c.slice(0, ++ci); if (ci === c.length) { dl = true; setTimeout(type, 1800); return; } }
    else { tw.textContent = c.slice(0, --ci); if (ci === 0) { dl = false; pi = (pi + 1) % phrases.length; } }
    setTimeout(type, dl ? 35 : 70);
  }
  setTimeout(type, 700);
}

/* ═══ CLOCK ═══ */
function startClock() {
  function tick() {
    const e = document.getElementById('clk');
    if (e) e.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

/* ═══ THEME TOGGLE ═══ */
function toggleTheme() {
  document.documentElement.classList.toggle('light');
  updateThemeToggleBtn();
}

function updateThemeToggleBtn() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isLight = document.documentElement.classList.contains('light');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro';
}

/* ═══ I18N TOGGLE ═══ */
let currentLang = 'pt';
function toggleLang() {
  const D = getData();
  if (!D.i18n?.enabled) return;
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = currentLang.toUpperCase();
  render();
}

export function getCurrentLang() { return currentLang; }

/* ═══ QR CODE ═══ */
function generateQR() {
  const container = document.getElementById('qrCode');
  if (!container) return;
  const url = window.location.href.split('?')[0].split('#')[0];
  // Simple QR code via canvas-free SVG approach using a public-domain QR library fallback
  // We'll use a tiny inline QR generation for the print version
  const size = 80;
  container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}" alt="QR Code" width="${size}" height="${size}" style="border:1px solid #ddd;border-radius:4px;">`;
}

/* ═══ VISIT COUNTER ═══ */
async function trackVisit() {
  try {
    const base = document.querySelector('meta[name="api-base"]')?.content || '/.netlify/functions';
    await fetch(`${base}/cv-ping`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  } catch (e) {
    // silent
  }
}
