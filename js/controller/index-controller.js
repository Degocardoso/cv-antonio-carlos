/**
 * Controller — Index (CV público)
 * Lógica de inicialização, lightbox, PDF, typewriter, etc.
 */
import { getData, setData, applyTheme, mergeFromCloud } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { CV_READ_URL } from './api.js';
import { render, renderPortfolio } from '../view/index-view.js';
import { copyEmail, escAttr } from '../utils.js';

/** Inicializa o CV público */
export async function init() {
  // Expõe funções necessárias para onclick inline
  window.__copyEmail = copyEmail;
  window.__printDesign = printDesign;
  window.__printATS = printATS;

  // Event delegation para lightbox (corrige XSS do onclick inline)
  document.addEventListener('click', (e) => {
    const lbTrigger = e.target.closest('[data-lightbox]');
    if (lbTrigger) {
      e.stopPropagation();
      openLB(lbTrigger.dataset.lightbox);
      return;
    }
    const certItem = e.target.closest('[data-cert-url]');
    if (certItem) {
      openLB(certItem.dataset.certUrl);
      return;
    }
  });

  // Fechar lightbox/portfolio com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLB(); closePO(); }
  });

  // Lightbox close on background click
  document.getElementById('lb').addEventListener('click', function(e) {
    if (e.target === this) closeLB();
  });

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

  applyTheme();
  render();
  hideLoading();
}

function hideLoading() {
  const el = document.getElementById('loading');
  el.classList.add('out');
  setTimeout(() => el.style.display = 'none', 750);
}

/* ═══ LIGHTBOX — seguro contra XSS ═══ */
function openLB(src) {
  const container = document.getElementById('lb-content');
  container.innerHTML = '';

  const isImg = /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(src);
  if (isImg) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    container.appendChild(img);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    container.appendChild(iframe);
  }
  document.getElementById('lb').style.display = 'flex';
}

function closeLB() {
  document.getElementById('lb').style.display = 'none';
  document.getElementById('lb-content').innerHTML = '';
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
