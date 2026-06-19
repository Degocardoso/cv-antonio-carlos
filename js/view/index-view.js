/**
 * View — Index (CV público)
 * Todas as funções de renderização do CV público
 */
import { getData } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { esc, cc, escAttr } from '../utils.js';

/** Get translated value (falls back to PT original) */
function t(enVal, ptVal) { return (enVal && enVal.trim()) ? enVal : ptVal; }

/** Get current language from controller */
let _lang = 'pt';
export function setLang(lang) { _lang = lang; }
function isEN() { return _lang === 'en'; }

/** Renderiza todo o CV */
export function render() {
  const D = getData();
  const p = D.profile;
  const sec = D.sections || {};
  const en = (D.i18n?.en) || {};
  const labels = en.labels || {};

  document.getElementById('hNick').textContent = p.nickname;
  document.getElementById('hFull').textContent = p.fullname;
  document.getElementById('hRole').textContent = isEN() ? t(en.role, p.role) : p.role;
  document.getElementById('topTitle').textContent = '~/' + p.nickname.toLowerCase().replace(/[\s']/g, '-') + '/portfolio';
  document.getElementById('bname').textContent = p.nickname;
  document.getElementById('yr').textContent = new Date().getFullYear();
  document.title = p.nickname + ' — CRM & Data Science';

  renderPhoto(p);
  renderContact(p);
  renderTags(D);
  renderHeroActions(p);
  renderHeroStats(D);
  renderAbout(D);
  renderSkills(D);
  renderExperience(D);
  renderProjects(D);
  renderEducation(D);
  renderCertifications(D);
  renderTech(D);
  renderLanguages(D);
  applySectionVisibility(sec);

  // Apply i18n labels if EN
  if (isEN()) {
    const labelMap = {
      'about': '#sec-about .pt',
      'objective': '#sec-objective .pt',
      'experience': '#sec-experience .pt',
      'projects': '#sec-projects .pt',
      'skills': '#sec-skills > .ph .pt',
      'education': '#sec-education > .ph .pt',
      'certifications': '#sec-certifications .pt',
      'languages': '#langSection .pt',
      'tech': '#sec-tech .pt'
    };
    for (const [key, sel] of Object.entries(labelMap)) {
      const el = document.querySelector(sel);
      if (el && labels[key]) el.textContent = labels[key];
    }
  }
}

function renderPhoto(p) {
  const el = document.getElementById('heroPhoto');
  if (!el) return;
  const src = (p.photo || '').trim();
  if (src) {
    const alt = escAttr(p.fullname || p.nickname || 'Foto de perfil');
    el.innerHTML = `<div class="hp-frame"><img src="${escAttr(src)}" alt="${alt}" loading="lazy"></div>`;
    el.style.display = '';
  } else {
    el.innerHTML = '';
    el.style.display = 'none';
  }
}

function renderContact(p) {
  const eH = `<button class="copy-btn" onclick="window.__copyEmail('${escAttr(p.email)}')" title="Clique para copiar">✉️ ${esc(p.email)} <span class="copy-hint">⧉</span></button>`;
  const liH = p.linkedin ? `<a class="ci" href="https://${escAttr(p.linkedin)}" target="_blank" rel="noopener">💼 ${esc(p.linkedin)}</a>` : '';
  const ghH = p.github ? `<a class="ci" href="https://${escAttr(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : '';
  const portH = p.portfolio ? `<a class="ci" href="${escAttr(p.portfolio.startsWith('http') ? p.portfolio : 'https://' + p.portfolio)}" target="_blank" rel="noopener">🌐 Portfólio</a>` : '';
  const phH = `<a class="ci" href="tel:${p.phone.replace(/\D/g, '')}">📱 ${esc(p.phone)}</a>`;
  const lH = `<span class="ci" style="cursor:default;">📍 ${esc(p.location)}</span>`;
  document.getElementById('cstrip').innerHTML = eH + liH + ghH + portH + phH + lH;
}

function renderTags(D) {
  document.getElementById('htags').innerHTML = (D.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
}

function renderHeroActions(p) {
  const waH = p.whatsapp ? `<a class="wa-btn" href="https://wa.me/${escAttr(p.whatsapp)}?text=${encodeURIComponent('Olá, vi seu CV e gostaria de conversar!')}" target="_blank" rel="noopener">💬 WhatsApp</a>` : '';
  const pdfH = p.pdfUrl ? `<a class="pdf-btn" href="${escAttr(p.pdfUrl)}" target="_blank" rel="noopener" download title="Baixar currículo em PDF">⬇ Download CV</a>` : '';
  document.getElementById('heroActions').innerHTML =
    (p.available ? '<div class="avail"><span class="pulse"></span>Disponível para oportunidades</div>' : '') +
    pdfH + waH;
}

function renderHeroStats(D) {
  document.getElementById('hstats').innerHTML = (D.heroStats || DEFAULTS.heroStats).map(s =>
    `<div class="sbox"><div><div class="slabel">${esc(s.label)}</div><div class="sval">${esc(s.val)}</div></div><span style="font-size:18px;">${s.ico}</span></div>`
  ).join('');
}

function renderAbout(D) {
  const en = D.i18n?.en || {};
  document.getElementById('sobreEl').innerHTML = isEN() ? t(en.objective, D.objective) : (D.objective || '');
  document.getElementById('objetivoEl').innerHTML = isEN() ? t(en.objetivo, D.objetivo) : (D.objetivo || '');
}

function renderSkills(D) {
  const catCls = { advanced: 'adv', intermediate: 'int', basic: 'bsc', language: 'lng' };
  const catLbl = { advanced: 'Avançado', intermediate: 'Intermediário', basic: 'Básico', language: 'Idiomas' };
  const grp = {};
  (D.skills || []).forEach(s => { const c = s.category || 'intermediate'; if (!grp[c]) grp[c] = []; grp[c].push(s.name); });
  document.getElementById('skillsEl').innerHTML = ['advanced', 'intermediate', 'basic', 'language']
    .filter(k => grp[k] && grp[k].length)
    .map(k => `<div class="sg"><div class="sg-label ${catCls[k]}">${catLbl[k]}</div><div class="stags">${grp[k].map(n => `<span class="stag ${catCls[k]}">${esc(n)}</span>`).join('')}</div></div>`)
    .join('');
}

function renderExperience(D) {
  const enExp = D.i18n?.en?.experience || [];
  document.getElementById('expEl').innerHTML = (D.experience || []).map((e, i, a) => {
    const c = cc(e.color);
    const tr = isEN() ? (enExp[i] || {}) : {};
    const title = isEN() ? t(tr.title, e.title) : e.title;
    const company = isEN() ? t(tr.company, e.company) : e.company;
    const desc = isEN() ? t(tr.description, e.description) : e.description;
    const highlights = isEN() && tr.highlights?.length ? tr.highlights : (e.highlights || []);
    const results = (e.results || []).filter(r => r.trim());
    const resultsLabel = isEN() ? 'Key Results:' : 'Resultados Gerais:';
    const resultsHtml = results.length ? `<div class="exp-results"><div class="exp-results-label">${resultsLabel}</div>${results.map(r => `<div class="thl"><span>✦</span><span>${esc(r)}</span></div>`).join('')}</div>` : '';
    return `<div class="ti"><div class="tl"><div class="td2 ${c}"></div>${i < a.length - 1 ? '<div class="tc"></div>' : ''}</div><div><div class="tp ${c}">${esc(e.period)}</div><div class="tt">${esc(title)}</div><div class="ts">${esc(company)}</div><div class="tdesc">${esc(desc)}</div>${highlights.map(h => `<div class="thl"><span>▸</span><span>${esc(h)}</span></div>`).join('')}${resultsHtml}</div></div>`;
  }).join('');
}

function renderProjects(D) {
  const featured = (D.projects || []).filter(p => p.featured).slice(0, 3);
  const homeProjs = featured.length ? featured : (D.projects || []).slice(0, 3);
  const enProj = D.i18n?.en?.projects || [];
  const allProjs = D.projects || [];
  document.getElementById('projEl').innerHTML = homeProjs.map(pr => {
    const c = cc(pr.color);
    const imgs = pr.images || [];
    const origIdx = allProjs.indexOf(pr);
    const tr = isEN() ? (enProj[origIdx] || {}) : {};
    const name = isEN() ? t(tr.name, pr.name) : pr.name;
    const stack = isEN() ? t(tr.stack, pr.stack) : pr.stack;
    const desc = isEN() ? t(tr.description, pr.description) : pr.description;
    const result = isEN() ? t(tr.result, pr.result) : pr.result;
    return `<div class="proj ${c}"><div class="proj-top"><div class="proj-name">${esc(name)}</div><div class="proj-stack">${esc(stack)}</div></div>${result ? `<div class="result">✦ ${esc(result)}</div>` : ''}<div class="proj-desc">${esc(desc)}</div><div class="pills">${(pr.pills || []).map(pl => `<span class="pill ${c}">${esc(pl)}</span>`).join('')}</div>${imgs.length ? `<div class="proj-imgs">${imgs.map(src => `<img class="proj-img" src="${escAttr(src)}" alt="" data-lightbox="${escAttr(src)}">`).join('')}</div>` : ''}</div>`;
  }).join('');
}

function renderEducation(D) {
  const enEdu = D.i18n?.en?.education || [];
  document.getElementById('eduEl').innerHTML = (D.education || []).map((e, i, a) => {
    const c = cc(e.color);
    const tr = isEN() ? (enEdu[i] || {}) : {};
    const title = isEN() ? t(tr.title, e.title) : e.title;
    const desc = isEN() ? t(tr.description, e.description) : e.description;
    return `<div class="ti"><div class="tl"><div class="td2 ${c}"></div>${i < a.length - 1 ? '<div class="tc"></div>' : ''}</div><div><div class="tp ${c}">${esc(e.period)}</div><div class="tt">${esc(title)}</div><div class="ts">${esc(e.company)}</div><div class="tdesc">${esc(desc)}</div></div></div>`;
  }).join('');
}

function renderCertifications(D) {
  document.getElementById('certEl').innerHTML = (D.certifications || []).map((cert, i) => {
    const has = cert.certUrl && cert.certUrl.trim();
    return `<div class="cert-item ${has ? 'clickable' : ''}" ${has ? `data-cert-url="${escAttr(cert.certUrl)}"` : ''}><div class="cert-badge">${cert.emoji}</div><div><div class="cert-name">${esc(cert.name)}</div><div class="cert-issuer">${esc(cert.issuer)}</div></div><div class="cert-year">${esc(cert.year)}${has ? '<span class="cert-hint"> ↗</span>' : ''}</div></div>`;
  }).join('');
}

function renderTech(D) {
  document.getElementById('techEl').innerHTML = (D.tech || []).map(t =>
    `<div class="tgitem"><span class="tg-e">${t.emoji}</span><div class="tg-l">${esc(t.label)}</div></div>`
  ).join('');
}

function renderLanguages(D) {
  const el = document.getElementById('langEl');
  if (!el) return;
  const langs = D.languages || [];
  if (!langs.length) { document.getElementById('langSection').style.display = 'none'; return; }
  document.getElementById('langSection').style.display = '';
  el.innerHTML = langs.map(l => {
    const pct = l.percent || 0;
    const cls = pct >= 70 ? 'high' : pct >= 40 ? 'mid' : 'low';
    return `<div class="lang-item"><span class="lang-name">${esc(l.name)}</span><span class="lang-level">${esc(l.level)}</span><div class="lang-bar-wrap"><div class="lang-bar ${cls}" style="width:${pct}%"></div></div><span class="lang-label">${esc(l.label)}</span></div>`;
  }).join('');
}

function applySectionVisibility(sec) {
  const map = {
    about: 'sec-about',
    objective: 'sec-objective',
    experience: 'sec-experience',
    projects: 'sec-projects',
    skills: 'sec-skills',
    education: 'sec-education',
    certifications: 'sec-certifications',
    tech: 'sec-tech',
    languages: 'langSection',
    heroStats: 'hstats',
    tags: 'htags'
  };
  for (const [key, id] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.style.display = sec[key] === false ? 'none' : '';
  }

  // Adjust grid layouts when panels are hidden to avoid gaps
  document.querySelectorAll('.g2, .g3').forEach(grid => {
    const visiblePanels = Array.from(grid.children).filter(
      ch => ch.style.display !== 'none' && ch.classList.contains('panel')
    );
    const totalPanels = Array.from(grid.children).filter(ch => ch.classList.contains('panel'));
    if (visiblePanels.length === 0) {
      grid.style.display = 'none';
    } else {
      grid.style.display = '';
      if (visiblePanels.length === 1) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (visiblePanels.length === 2 && grid.classList.contains('g3')) {
        grid.style.gridTemplateColumns = '1fr 1fr';
      } else {
        grid.style.gridTemplateColumns = '';
      }
    }
  });
}

/** Renderiza overlay do portfólio */
export function renderPortfolio() {
  const D = getData();
  document.getElementById('poCount').textContent = `— ${(D.projects || []).length} projetos`;
  document.getElementById('poGrid').innerHTML = (D.projects || []).map(pr => {
    const c = cc(pr.color);
    const imgs = pr.images || [];
    return `<div class="po-card ${c}">${pr.featured ? '<div class="po-feat">✦ Destaque</div>' : ''}<div class="po-name">${esc(pr.name)}</div><div class="po-stack">${esc(pr.stack)}</div>${pr.result ? `<div class="po-result">✦ ${esc(pr.result)}</div>` : ''}<div class="po-desc">${esc(pr.description)}</div><div class="pills">${(pr.pills || []).map(pl => `<span class="pill ${c}">${esc(pl)}</span>`).join('')}</div>${imgs.length ? `<div class="po-imgs">${imgs.map(src => `<img class="po-img" src="${escAttr(src)}" alt="" data-lightbox="${escAttr(src)}">`).join('')}</div>` : ''}</div>`;
  }).join('');
}
