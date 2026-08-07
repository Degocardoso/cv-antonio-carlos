/**
 * View — Index (CV público)
 *
 * Transforma os dados do CV em uma narrativa em capítulos:
 *   Prólogo → Impacto → Credenciais → Origem → Trajetória → Arsenal → Epílogo
 *
 * A ordem vem da posição das seções no HTML: numeração e kicker
 * ("Capítulo dois") são calculados em `applyChapters`. Para reordenar,
 * basta mover os <section> — nada aqui precisa acompanhar.
 *
 * A "Trajetória" funde experiência e formação em uma única linha do tempo
 * ordenada por ano — ela e "Impacto" rolam horizontalmente durante o scroll.
 */
import { getData } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { esc, cc, escAttr } from '../utils.js';
import { icon, iconFromEmoji } from './icons.js';

/* ═══ IDIOMA ═══ */
let _lang = 'pt';
export function setLang(lang) { _lang = lang; }
function isEN() { return _lang === 'en'; }
/** Valor traduzido com fallback para o original em PT. */
function t(enVal, ptVal) { return (enVal && String(enVal).trim()) ? enVal : ptVal; }

/* ═══ TEXTOS DA NARRATIVA ═══ */
const UI = {
  pt: {
    hello: 'Olá, eu sou',
    online: 'ONLINE · São Paulo, BR',
    scrollCue: 'role para começar a história',
    /* Numeração e kicker são calculados pela ordem no DOM — reordenar as
       seções no HTML basta, nada aqui precisa mudar junto. */
    chapterWord: 'Capítulo',
    ordinals: ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito'],
    chapters: {
      work:    { nav: 'Impacto',     title: 'O que eu construí',
                 sub: 'Projetos reais, em produção, com números por trás de cada um.' },
      proof:   { nav: 'Credenciais', title: 'Estudo que não para',
                 sub: 'Certificações e cursos que sustentam a prática do dia a dia.' },
      about:   { nav: 'Origem',      title: 'Quem está por trás',
                 sub: 'O que me move e o tipo de problema que gosto de resolver.' },
      journey: { nav: 'Trajetória',  title: 'A trajetória, ano a ano',
                 sub: 'Formação e carreira avançando lado a lado — continue rolando para percorrer a linha do tempo.' },
      craft:   { nav: 'Arsenal',     title: 'As ferramentas do ofício',
                 sub: 'O que uso para tirar uma ideia do papel e colocá-la em produção.' },
      contact: { nav: 'Contato',     title: 'O próximo capítulo', kicker: 'Epílogo',
                 sub: 'Para onde eu quero levar essa história — e como falar comigo.' }
    },
    skills: 'Habilidades técnicas',
    languages: 'Idiomas',
    allProjects: 'Portfólio completo',
    close: 'Fechar',
    work: 'Trabalho', study: 'Formação',
    journeyEndKind: 'Agora',
    journeyEndTitle: 'E a história continua',
    journeyEndDesc: 'Cada etapa somou uma camada: primeiro o código, depois os dados, hoje a visão de negócio que conecta os dois.',
    journeyEndLink: 'Ver o próximo capítulo',
    results: 'Resultados',
    gallery: 'Ver galeria',
    openGallery: 'Abrir galeria do projeto',
    seeAll: 'Ver tudo',
    seeAllTitle: 'Tem mais história aqui',
    seeAllDesc: 'Estes são os destaques. O portfólio completo traz todos os projetos, com contexto e imagens.',
    featured: 'Destaque',
    projects: 'projetos',
    talk: 'Vamos conversar',
    seeWork: 'Ver os projetos',
    facts: { projects: 'Projetos', education: 'Formações', certs: 'Certificações', tech: 'Tecnologias', where: 'Base' },
    contact: { email: 'E-mail', linkedin: 'LinkedIn', github: 'GitHub', phone: 'Telefone', location: 'Localização', portfolio: 'Portfólio' },
    copyHint: 'clique para copiar',
    downloadCV: 'Baixar CV',
    levels: { advanced: 'Avançado', intermediate: 'Intermediário', basic: 'Básico', language: 'Idiomas' }
  },
  en: {
    hello: "Hi, I'm",
    online: 'ONLINE · São Paulo, BR',
    scrollCue: 'scroll to begin the story',
    chapterWord: 'Chapter',
    ordinals: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'],
    chapters: {
      work:    { nav: 'Impact',      title: 'What I have built',
                 sub: 'Real projects, in production, with numbers behind each one.' },
      proof:   { nav: 'Credentials', title: 'Always learning',
                 sub: 'Certifications and courses that back the day-to-day practice.' },
      about:   { nav: 'Origin',      title: 'Who is behind this',
                 sub: 'What drives me and the kind of problem I like to solve.' },
      journey: { nav: 'Journey',     title: 'The journey, year by year',
                 sub: 'Education and career moving side by side — keep scrolling to walk the timeline.' },
      craft:   { nav: 'Toolkit',     title: 'Tools of the trade',
                 sub: 'What I use to take an idea from paper to production.' },
      contact: { nav: 'Contact',     title: 'The next chapter', kicker: 'Epilogue',
                 sub: 'Where I want to take this story — and how to reach me.' }
    },
    skills: 'Technical skills',
    languages: 'Languages',
    allProjects: 'Full portfolio',
    close: 'Close',
    work: 'Work', study: 'Education',
    journeyEndKind: 'Now',
    journeyEndTitle: 'And the story goes on',
    journeyEndDesc: 'Every step added a layer: first the code, then the data, today the business view that ties both together.',
    journeyEndLink: 'See the next chapter',
    results: 'Results',
    gallery: 'View gallery',
    openGallery: 'Open project gallery',
    seeAll: 'See everything',
    seeAllTitle: 'There is more to this story',
    seeAllDesc: 'These are the highlights. The full portfolio holds every project, with context and images.',
    featured: 'Featured',
    projects: 'projects',
    talk: "Let's talk",
    seeWork: 'See the projects',
    facts: { projects: 'Projects', education: 'Degrees', certs: 'Certifications', tech: 'Technologies', where: 'Based in' },
    contact: { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', phone: 'Phone', location: 'Location', portfolio: 'Portfolio' },
    copyHint: 'click to copy',
    downloadCV: 'Download CV',
    levels: { advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic', language: 'Languages' }
  }
};
function ui() { return isEN() ? UI.en : UI.pt; }

/* Cor do item → variável CSS */
const COLOR_VAR = { g: '--neon', c: '--neon2', o: '--neon3', p: '--neon4' };
function colorVar(v) { return `var(${COLOR_VAR[cc(v)] || '--neon'})`; }

/* ═══ GALERIAS ═══
   Indexadas pela posição do projeto para que o trilho e o portfólio
   completo compartilhem exatamente a mesma lista de imagens. */
let galleries = [];
export function getGallery(idx) { return galleries[idx] || []; }

/* ═══ NÚMEROS ANIMADOS ═══ */
/**
 * Envolve o primeiro número do texto em um contador animado.
 * O valor final já vai no HTML: sem JS (ou ao imprimir) o número
 * continua correto, e a animação apenas parte do zero quando entra em cena.
 */
function withCounter(raw) {
  const safe = esc(raw);
  return safe.replace(/\d+(?:[.,]\d+)?/, (m) =>
    `<span class="num" data-count="${escAttr(m.replace(',', '.'))}">${m}</span>`
  );
}

/* ═══════════════════════════ RENDER PRINCIPAL ═══════════════════════════ */

export function render() {
  const D = getData();
  const p = D.profile || {};
  const sec = D.sections || {};

  galleries = (D.projects || []).map(pr => pr.images || []);

  applyUIStrings(D);

  document.getElementById('hNick').textContent = p.nickname || '';
  document.getElementById('hFull').textContent = p.fullname || '';
  document.getElementById('hRole').textContent = isEN() ? t(D.i18n?.en?.role, p.role) : (p.role || '');
  document.getElementById('topTitle').textContent =
    '~/' + String(p.nickname || 'cv').toLowerCase().replace(/[\s']/g, '-') + '/portfolio';
  document.getElementById('bname').textContent = p.nickname || '';
  document.getElementById('yr').textContent = new Date().getFullYear();
  document.title = (p.nickname || 'CV') + ' — CRM & Data Science';

  renderPhoto(p);
  renderTags(D);
  renderHeroActions(p);
  renderHeroStats(D);
  renderContactStrip(p);
  renderAbout(D);
  renderFacts(D);
  renderJourney(D);
  renderWork(D);
  renderSkills(D);
  renderLanguages(D);
  renderTech(D);
  renderCertifications(D);
  renderEpilogue(D);

  applySectionVisibility(sec);
  applyChapters(); // depois da visibilidade: capítulo oculto não consome número
}

/** Aplica os textos da narrativa (e as traduções do painel admin). */
function applyUIStrings(D) {
  const dict = ui();
  const labels = (isEN() && D.i18n?.en?.labels) || {};
  const merged = { ...dict, ...pick(labels, ['skills', 'languages']) };

  document.querySelectorAll('[data-ui]').forEach(el => {
    const val = merged[el.dataset.ui];
    if (typeof val === 'string') el.textContent = val;
  });
  document.documentElement.lang = isEN() ? 'en' : 'pt-BR';
}

/**
 * Numera e rotula os capítulos pela ordem em que aparecem no DOM,
 * pulando os que estiverem desligados no admin. Reordenar as seções no
 * HTML é suficiente: a numeração se ajusta sozinha.
 */
function applyChapters() {
  const dict = ui();
  const secs = [...document.querySelectorAll('#story .chap[data-key]')]
    .filter(s => s.style.display !== 'none');

  secs.forEach((sec, i) => {
    const c = dict.chapters[sec.dataset.key];
    if (!c) return;
    const set = (sel, txt) => { const el = sec.querySelector(sel); if (el) el.textContent = txt; };
    set('.chap-num', String(i + 1).padStart(2, '0'));
    set('.chap-kicker', c.kicker || `${dict.chapterWord} ${dict.ordinals[i] || i + 1}`);
    set('.chap-title', c.title);
    set('.chap-sub', c.sub);
    sec.dataset.nav = c.nav;
  });
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj[k]) out[k] = obj[k];
  return out;
}

/* ═══════════════════════════ PRÓLOGO ═══════════════════════════ */

function renderPhoto(p) {
  const el = document.getElementById('heroPhoto');
  if (!el) return;
  const src = (p.photo || '').trim();
  if (!src) { el.innerHTML = ''; el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML =
    `<div class="hp-frame" data-parallax="-0.04">
       <img src="${escAttr(src)}" alt="${escAttr(p.fullname || p.nickname || 'Foto de perfil')}" loading="lazy" decoding="async">
     </div>`;
}

function renderTags(D) {
  document.getElementById('htags').innerHTML =
    (D.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
}

function renderHeroActions(p) {
  const u = ui();
  const parts = [];
  if (p.available) {
    parts.push(`<span class="avail"><span class="pulse"></span>${isEN() ? 'Open to opportunities' : 'Disponível para oportunidades'}</span>`);
  }
  parts.push(`<a class="btn-solid" href="#ch-work">${esc(u.seeWork)} ${icon('arrowRight')}</a>`);
  if (p.pdfUrl) {
    parts.push(`<a class="btn-ghost" href="${escAttr(p.pdfUrl)}" target="_blank" rel="noopener" download>${icon('download')} ${esc(u.downloadCV)}</a>`);
  }
  document.getElementById('heroActions').innerHTML = parts.join('');
}

function renderHeroStats(D) {
  const stats = D.heroStats || DEFAULTS.heroStats;
  document.getElementById('hstats').innerHTML = stats.map(s =>
    `<li class="sbox">
       <div>
         <div class="slabel">${esc(s.label)}</div>
         <div class="sval">${esc(s.val)}</div>
       </div>
       <span class="sico">${iconFromEmoji(s.ico)}</span>
     </li>`
  ).join('');
}

function renderContactStrip(p) {
  const u = ui();
  const items = [];
  if (p.email) {
    items.push(`<button class="copy-btn" type="button" data-copy="${escAttr(p.email)}" title="${escAttr(u.copyHint)}">${icon('mail')} ${esc(p.email)} ${icon('copy', 'copy-hint')}</button>`);
  }
  if (p.linkedin) items.push(link(url(p.linkedin), icon('linkedin') + ' LinkedIn'));
  if (p.github) items.push(link(url(p.github), icon('github') + ' GitHub'));
  if (p.portfolio) items.push(link(url(p.portfolio), icon('globe') + ' ' + esc(u.contact.portfolio)));
  if (p.phone) items.push(`<a class="ci" href="tel:${escAttr(p.phone.replace(/\D/g, ''))}">${icon('phone')} ${esc(p.phone)}</a>`);
  if (p.location) items.push(`<span class="ci">${icon('pin')} ${esc(p.location)}</span>`);
  document.getElementById('cstrip').innerHTML = items.join('');
}

function link(href, label) {
  return `<a class="ci" href="${escAttr(href)}" target="_blank" rel="noopener">${label}</a>`;
}
function url(v) {
  const s = String(v || '').trim();
  return /^https?:\/\//i.test(s) ? s : 'https://' + s;
}

/* ═══════════════════════════ CAPÍTULO 01 — ORIGEM ═══════════════════════════ */

function renderAbout(D) {
  const en = D.i18n?.en || {};
  document.getElementById('sobreEl').innerHTML = isEN() ? t(en.objective, D.objective) : (D.objective || '');
}

function renderFacts(D) {
  const f = ui().facts;
  const rows = [
    [f.projects, (D.projects || []).length],
    [f.education, (D.education || []).length],
    [f.certs, (D.certifications || []).length],
    [f.tech, (D.tech || []).length]
  ].filter(([, n]) => n > 0);

  const html = rows.map(([k, n]) =>
    `<li><span class="fact-k">${esc(k)}</span><span class="fact-v"><span class="num" data-count="${n}">${n}</span></span></li>`
  ).join('');

  const where = D.profile?.location
    ? `<li><span class="fact-k">${esc(f.where)}</span><span class="fact-v">${esc(D.profile.location)}</span></li>`
    : '';

  document.getElementById('aboutFacts').innerHTML = html + where;
}

/* ═══════════════════════════ CAPÍTULO 02 — TRAJETÓRIA ═══════════════════════════ */

/** Primeiro ano citado no período ("02/2022 – Presente" → 2022). */
function startYear(period) {
  const m = String(period || '').match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 0;
}

/** Funde experiência + formação em uma linha do tempo única, em ordem crescente. */
function buildTimeline(D) {
  const u = ui();
  const enExp = D.i18n?.en?.experience || [];
  const enEdu = D.i18n?.en?.education || [];
  const sec = D.sections || {};
  const out = [];

  if (sec.education !== false) {
    (D.education || []).forEach((e, i) => {
      const tr = isEN() ? (enEdu[i] || {}) : {};
      out.push({
        kind: 'study', kindLabel: u.study, rank: 0,
        year: startYear(e.period), period: e.period, color: e.color,
        title: isEN() ? t(tr.title, e.title) : e.title,
        org: isEN() ? t(tr.company, e.company) : e.company,
        desc: isEN() ? t(tr.description, e.description) : e.description,
        highlights: []
      });
    });
  }

  if (sec.experience !== false) {
    (D.experience || []).forEach((e, i) => {
      const tr = isEN() ? (enExp[i] || {}) : {};
      // `highlights` e `results` costumam repetir o mesmo conteúdo — deduplica.
      const hl = (isEN() && tr.highlights?.length ? tr.highlights : (e.highlights || []))
        .concat(e.results || [])
        .map(s => String(s).trim())
        .filter(Boolean);
      out.push({
        kind: 'work', kindLabel: u.work, rank: 1,
        year: startYear(e.period), period: e.period, color: e.color,
        title: isEN() ? t(tr.title, e.title) : e.title,
        org: isEN() ? t(tr.company, e.company) : e.company,
        desc: isEN() ? t(tr.description, e.description) : e.description,
        highlights: [...new Set(hl)]
      });
    });
  }

  return out.sort((a, b) => (a.year - b.year) || (a.rank - b.rank));
}

function renderJourney(D) {
  const track = document.getElementById('journeyTrack');
  if (!track) return;
  const u = ui();
  const items = buildTimeline(D);

  const cards = items.map(item => {
    const c = colorVar(item.color);
    const hl = item.highlights.length
      ? `<ul class="jcard-hl">${item.highlights.map(h => `<li>${withCounter(h)}</li>`).join('')}</ul>`
      : '';
    return `<li class="jcard rail-item" style="--c:${c}">
      <div class="jcard-head">
        <span class="jcard-kind">${esc(item.kindLabel)}</span>
        <span class="jcard-year">${esc(item.period)}</span>
      </div>
      <h3 class="jcard-title">${esc(item.title)}</h3>
      <p class="jcard-org">${esc(item.org)}</p>
      <p class="jcard-desc">${esc(item.desc)}</p>
      ${hl}
    </li>`;
  }).join('');

  // Fecha a linha do tempo apontando para o epílogo.
  const closer = items.length ? `<li class="jcard jcard-end rail-item" style="--c:var(--neon2)">
      <div class="jcard-head">
        <span class="jcard-kind">${esc(u.journeyEndKind)}</span>
        <span class="jcard-year">${new Date().getFullYear()} →</span>
      </div>
      <h3 class="jcard-title">${esc(u.journeyEndTitle)}</h3>
      <p class="jcard-desc">${esc(u.journeyEndDesc)}</p>
      <a class="jcard-link" href="#ch-contact">${esc(u.journeyEndLink)} ${icon('arrowRight')}</a>
    </li>` : '';

  track.innerHTML = `<div class="rail-line" aria-hidden="true"></div>` + cards + closer;
}

/* ═══════════════════════════ CAPÍTULO 03 — IMPACTO ═══════════════════════════ */

function renderWork(D) {
  const track = document.getElementById('workTrack');
  if (!track) return;

  const u = ui();
  const all = D.projects || [];
  const enProj = D.i18n?.en?.projects || [];
  const featured = all.filter(pr => pr.featured);
  const shown = featured.length ? featured : all.slice(0, 4);

  const cards = shown.map((pr, i) => {
    const idx = all.indexOf(pr);
    const tr = isEN() ? (enProj[idx] || {}) : {};
    const c = colorVar(pr.color);
    const name = isEN() ? t(tr.name, pr.name) : pr.name;
    const stack = isEN() ? t(tr.stack, pr.stack) : pr.stack;
    const desc = isEN() ? t(tr.description, pr.description) : pr.description;
    const result = isEN() ? t(tr.result, pr.result) : pr.result;
    const imgs = pr.images || [];

    const media = imgs.length
      ? `<button class="wcard-media" type="button" data-gallery="${idx}" data-gallery-start="0"
                 aria-label="${escAttr(u.openGallery + ': ' + name)}">
           <img src="${escAttr(imgs[0])}" alt="" loading="lazy" decoding="async">
           <span class="wcard-gal">${icon('image')} ${esc(u.gallery)}${imgs.length > 1 ? ` · ${imgs.length}` : ''}</span>
         </button>`
      : `<div class="wcard-media is-empty" aria-hidden="true">
           <span class="wcard-glyph">${esc(String(name || '?').charAt(0))}</span>
         </div>`;

    return `<li class="wcard rail-item" style="--c:${c}">
      ${media}
      <div class="wcard-body">
        <span class="wcard-idx">${String(i + 1).padStart(2, '0')} / ${String(shown.length).padStart(2, '0')}</span>
        <h3 class="wcard-title">${esc(name)}</h3>
        <p class="wcard-stack">${esc(stack)}</p>
        ${result ? `<p class="wcard-result">${icon('sparkle')} ${withCounter(result)}</p>` : ''}
        <p class="wcard-desc">${esc(desc)}</p>
        <ul class="pills">${(pr.pills || []).map(pl => `<li class="pill ${cc(pr.color)}">${esc(pl)}</li>`).join('')}</ul>
      </div>
    </li>`;
  }).join('');

  const cta = all.length > shown.length || all.length > 1
    ? `<li class="rail-item">
         <button class="wcard-cta" type="button" id="openPortfolio">
           <b>${esc(u.seeAllTitle)}</b>
           <span>${esc(u.seeAllDesc)}</span>
           <em>${icon('grid')} ${esc(u.seeAll)} · ${all.length} ${esc(u.projects)} ${icon('arrowRight')}</em>
         </button>
       </li>`
    : '';

  track.innerHTML = cards + cta;
}

/* ═══════════════════════════ CAPÍTULO 04 — ARSENAL ═══════════════════════════ */

function renderSkills(D) {
  const catCls = { advanced: 'adv', intermediate: 'int', basic: 'bsc', language: 'lng' };
  const lbl = ui().levels;
  const groups = {};
  (D.skills || []).forEach(s => {
    const c = s.category || 'intermediate';
    (groups[c] = groups[c] || []).push(s.name);
  });

  document.getElementById('skillsEl').innerHTML =
    ['advanced', 'intermediate', 'basic', 'language']
      .filter(k => groups[k]?.length)
      .map(k => `<div class="sg" data-stagger>
          <div class="sg-label ${catCls[k]}">${esc(lbl[k])}</div>
          <div class="stags">${groups[k].map(n => `<span class="stag ${catCls[k]}">${esc(n)}</span>`).join('')}</div>
        </div>`)
      .join('');
}

function renderLanguages(D) {
  const el = document.getElementById('langEl');
  if (!el) return;
  const langs = D.languages || [];
  el.innerHTML = langs.map(l => {
    const pct = Math.max(0, Math.min(100, l.percent || 0));
    const cls = pct >= 70 ? 'high' : pct >= 40 ? 'mid' : 'low';
    return `<div class="lang-item">
      <div class="lang-top">
        <span class="lang-name">${esc(l.name)}</span>
        <span class="lang-level">${esc(l.level)}</span>
        <span class="lang-label">${esc(l.label)}</span>
      </div>
      <div class="lang-bar-wrap"><div class="lang-bar ${cls}" data-w="${pct}%" role="img" aria-label="${escAttr(l.name + ': ' + l.label)}"></div></div>
    </div>`;
  }).join('');
}

function renderTech(D) {
  const el = document.getElementById('techEl');
  if (!el) return;
  const items = D.tech || [];
  const one = items.map(item =>
    `<span class="tgitem">${iconFromEmoji(item.emoji, 'tg-e')}${esc(item.label)}</span>`
  ).join('');
  // Duplicado para a esteira poder repetir sem emenda (a cópia é decorativa).
  el.innerHTML = one + `<span aria-hidden="true" style="display:contents">${one}</span>`;
}

/* ═══════════════════════════ CAPÍTULO 05 — CREDENCIAIS ═══════════════════════════ */

function renderCertifications(D) {
  const el = document.getElementById('certEl');
  if (!el) return;
  el.dataset.stagger = '';
  el.setAttribute('data-reveal', '');
  el.innerHTML = (D.certifications || []).map(cert => {
    const href = (cert.certUrl || '').trim();
    const inner =
      `<span class="cert-badge">${iconFromEmoji(cert.emoji)}</span>
       <span class="cert-body">
         <span class="cert-name">${esc(cert.name)}</span>
         <span class="cert-issuer">${esc(cert.issuer)}</span>
       </span>
       <span class="cert-year">${esc(cert.year)}${href ? icon('arrowRight', 'cert-hint') : ''}</span>`;
    return href
      ? `<a class="cert-item clickable" href="${escAttr(href)}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="cert-item">${inner}</div>`;
  }).join('');
}

/* ═══════════════════════════ EPÍLOGO ═══════════════════════════ */

function renderEpilogue(D) {
  const p = D.profile || {};
  const u = ui();
  const en = D.i18n?.en || {};

  document.getElementById('objetivoEl').innerHTML = isEN() ? t(en.objetivo, D.objetivo) : (D.objetivo || '');

  const cta = [];
  if (p.whatsapp) {
    const msg = encodeURIComponent(isEN() ? 'Hi! I saw your CV and would like to talk.' : 'Olá, vi seu CV e gostaria de conversar!');
    cta.push(`<a class="btn-solid" href="https://wa.me/${escAttr(p.whatsapp)}?text=${msg}" target="_blank" rel="noopener">${icon('chat')} WhatsApp</a>`);
  }
  if (p.email) cta.push(`<button class="btn-ghost" type="button" data-copy="${escAttr(p.email)}">${icon('mail')} ${esc(p.email)}</button>`);
  if (p.pdfUrl) cta.push(`<a class="btn-ghost" href="${escAttr(p.pdfUrl)}" target="_blank" rel="noopener" download>${icon('download')} ${esc(u.downloadCV)}</a>`);
  document.getElementById('ctaEl').innerHTML = cta.join('');

  const c = u.contact;
  const cards = [];
  if (p.linkedin) cards.push(contactCard(c.linkedin, p.linkedin, url(p.linkedin)));
  if (p.github) cards.push(contactCard(c.github, p.github, url(p.github)));
  if (p.phone) cards.push(contactCard(c.phone, p.phone, 'tel:' + p.phone.replace(/\D/g, '')));
  if (p.portfolio) cards.push(contactCard(c.portfolio, p.portfolio, url(p.portfolio)));
  if (p.location) cards.push(`<div class="contact-card"><span class="contact-k">${esc(c.location)}</span><span class="contact-v">${esc(p.location)}</span></div>`);
  document.getElementById('contactEl').innerHTML = cards.join('');
}

function contactCard(key, value, href) {
  const external = !href.startsWith('tel:');
  return `<a class="contact-card" href="${escAttr(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>
    <span class="contact-k">${esc(key)}</span>
    <span class="contact-v">${esc(value)}</span>
  </a>`;
}

/* ═══════════════════════════ VISIBILIDADE DE SEÇÕES ═══════════════════════════ */

function show(el, visible) { if (el) el.style.display = visible ? '' : 'none'; }

function applySectionVisibility(sec) {
  const on = (k) => sec[k] !== false;

  show(document.getElementById('htags'), on('tags'));
  show(document.getElementById('hstats'), on('heroStats'));
  show(document.getElementById('ch-about'), on('about'));
  show(document.getElementById('sec-objective'), on('objective'));
  show(document.getElementById('ch-journey'), on('experience') || on('education'));
  show(document.getElementById('ch-work'), on('projects'));
  show(document.getElementById('sec-skills'), on('skills'));
  show(document.getElementById('sec-languages'), on('languages'));
  show(document.getElementById('sec-tech'), on('tech'));
  show(document.getElementById('ch-craft'), on('skills') || on('languages') || on('tech'));
  show(document.getElementById('ch-proof'), on('certifications'));

  // Uma coluna só quando o par ficou sozinho
  const craft = document.querySelector('.craft-grid');
  if (craft) craft.style.gridTemplateColumns = (on('skills') && on('languages')) ? '' : '1fr';
}

/* ═══════════════════════════ PORTFÓLIO COMPLETO ═══════════════════════════ */

export function renderPortfolio() {
  const D = getData();
  const u = ui();
  const all = D.projects || [];
  const enProj = D.i18n?.en?.projects || [];

  document.getElementById('poCount').textContent = `— ${all.length} ${u.projects}`;
  document.getElementById('poGrid').innerHTML = all.map((pr, idx) => {
    const tr = isEN() ? (enProj[idx] || {}) : {};
    const c = colorVar(pr.color);
    const name = isEN() ? t(tr.name, pr.name) : pr.name;
    const stack = isEN() ? t(tr.stack, pr.stack) : pr.stack;
    const desc = isEN() ? t(tr.description, pr.description) : pr.description;
    const result = isEN() ? t(tr.result, pr.result) : pr.result;
    const imgs = pr.images || [];
    return `<article class="po-card" style="--c:${c}">
      ${pr.featured ? `<span class="po-feat">${icon('sparkle')} ${esc(u.featured)}</span>` : ''}
      <h3 class="po-name">${esc(name)}</h3>
      <p class="po-stack">${esc(stack)}</p>
      ${result ? `<p class="po-result">${icon('sparkle')} ${esc(result)}</p>` : ''}
      <p class="po-desc">${esc(desc)}</p>
      <ul class="pills">${(pr.pills || []).map(pl => `<li class="pill ${cc(pr.color)}">${esc(pl)}</li>`).join('')}</ul>
      ${imgs.length ? `<div class="po-imgs">${imgs.map((src, i) =>
        `<img class="po-img" src="${escAttr(src)}" alt="" loading="lazy" decoding="async"
              data-gallery="${idx}" data-gallery-start="${i}" tabindex="0" role="button"
              aria-label="${escAttr(u.openGallery + ': ' + name)}">`).join('')}</div>` : ''}
    </article>`;
  }).join('');
}
