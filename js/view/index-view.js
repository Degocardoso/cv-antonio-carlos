/**
 * View — Index (CV público)
 * Todas as funções de renderização do CV público
 */
import { getData } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { esc, cc, escAttr } from '../utils.js';

/** Renderiza todo o CV */
export function render() {
  const D = getData();
  const p = D.profile;
  document.getElementById('hNick').textContent = p.nickname;
  document.getElementById('hFull').textContent = p.fullname;
  document.getElementById('hRole').textContent = p.role;
  document.getElementById('topTitle').textContent = '~/' + p.nickname.toLowerCase().replace(/[\s']/g, '-') + '/portfolio';
  document.getElementById('bname').textContent = p.nickname;
  document.getElementById('yr').textContent = new Date().getFullYear();
  document.title = p.nickname + ' — CRM & Data Science';

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
}

function renderContact(p) {
  const eH = `<button class="copy-btn" onclick="window.__copyEmail('${escAttr(p.email)}')" title="Clique para copiar">✉️ ${esc(p.email)} <span class="copy-hint">⧉</span></button>`;
  const liH = p.linkedin ? `<a class="ci" href="https://${escAttr(p.linkedin)}" target="_blank" rel="noopener">💼 ${esc(p.linkedin)}</a>` : '';
  const ghH = p.github ? `<a class="ci" href="https://${escAttr(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : '';
  const phH = `<a class="ci" href="tel:${p.phone.replace(/\D/g, '')}">📱 ${esc(p.phone)}</a>`;
  const lH = `<span class="ci" style="cursor:default;">📍 ${esc(p.location)}</span>`;
  document.getElementById('cstrip').innerHTML = eH + liH + ghH + phH + lH;
}

function renderTags(D) {
  document.getElementById('htags').innerHTML = (D.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
}

function renderHeroActions(p) {
  const waH = p.whatsapp ? `<a class="wa-btn" href="https://wa.me/${escAttr(p.whatsapp)}?text=${encodeURIComponent('Olá, vi seu CV e gostaria de conversar!')}" target="_blank" rel="noopener">💬 WhatsApp</a>` : '';
  document.getElementById('heroActions').innerHTML =
    (p.available ? '<div class="avail"><span class="pulse"></span>Disponível para oportunidades</div>' : '') +
    `<div class="pdf-group">
      <button class="pdf-btn" onclick="window.__printDesign()" title="Fundo branco, emojis, layout visual">⬇ PDF Design</button>
      <button class="pdf-btn" onclick="window.__printATS()" title="Formato profissional tradicional, sem emojis">⬇ PDF ATS</button>
    </div>` + waH;
}

function renderHeroStats(D) {
  document.getElementById('hstats').innerHTML = (D.heroStats || DEFAULTS.heroStats).map(s =>
    `<div class="sbox"><div><div class="slabel">${esc(s.label)}</div><div class="sval">${esc(s.val)}</div></div><span style="font-size:18px;">${s.ico}</span></div>`
  ).join('');
}

function renderAbout(D) {
  document.getElementById('sobreEl').innerHTML = D.objective || '';
  document.getElementById('objetivoEl').innerHTML = D.objetivo || '';
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
  document.getElementById('expEl').innerHTML = (D.experience || []).map((e, i, a) => {
    const c = cc(e.color);
    return `<div class="ti"><div class="tl"><div class="td2 ${c}"></div>${i < a.length - 1 ? '<div class="tc"></div>' : ''}</div><div><div class="tp ${c}">${esc(e.period)}</div><div class="tt">${esc(e.title)}</div><div class="ts">${esc(e.company)}</div><div class="tdesc">${esc(e.description)}</div>${(e.highlights || []).map(h => `<div class="thl"><span>▸</span><span>${esc(h)}</span></div>`).join('')}</div></div>`;
  }).join('');
}

function renderProjects(D) {
  const featured = (D.projects || []).filter(p => p.featured).slice(0, 3);
  const homeProjs = featured.length ? featured : (D.projects || []).slice(0, 3);
  document.getElementById('projEl').innerHTML = homeProjs.map(pr => {
    const c = cc(pr.color);
    const imgs = pr.images || [];
    return `<div class="proj ${c}"><div class="proj-top"><div class="proj-name">${esc(pr.name)}</div><div class="proj-stack">${esc(pr.stack)}</div></div>${pr.result ? `<div class="result">✦ ${esc(pr.result)}</div>` : ''}<div class="proj-desc">${esc(pr.description)}</div><div class="pills">${(pr.pills || []).map(pl => `<span class="pill ${c}">${esc(pl)}</span>`).join('')}</div>${imgs.length ? `<div class="proj-imgs">${imgs.map(src => `<img class="proj-img" src="${escAttr(src)}" alt="" data-lightbox="${escAttr(src)}">`).join('')}</div>` : ''}</div>`;
  }).join('');
}

function renderEducation(D) {
  document.getElementById('eduEl').innerHTML = (D.education || []).map((e, i, a) => {
    const c = cc(e.color);
    return `<div class="ti"><div class="tl"><div class="td2 ${c}"></div>${i < a.length - 1 ? '<div class="tc"></div>' : ''}</div><div><div class="tp ${c}">${esc(e.period)}</div><div class="tt">${esc(e.title)}</div><div class="ts">${esc(e.company)}</div><div class="tdesc">${esc(e.description)}</div></div></div>`;
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
