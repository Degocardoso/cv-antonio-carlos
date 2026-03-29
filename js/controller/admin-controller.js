/**
 * Controller — Admin Panel
 * Lógica de autenticação, coleta de dados, tabs, upload, etc.
 */
import { getData, setData, setDataSource, getDataSource, resetToDefaults, applyTheme } from '../model/state.js';
import { DEFAULTS } from '../model/defaults.js';
import { loadFromCloud, saveToCloud, uploadImage, validatePassword, CV_READ_URL } from './api.js';
import {
  TABS, TAB_RENDERERS, v,
  rHS, rSkills, rExp, rProjs, rEdu, rCerts, rTech, rLangs
} from '../view/admin-view.js';

let SESSION_PWD = '';
let curTab = 'profile';

/** Inicializa o admin */
export async function init() {
  exposeGlobals();
  await loadFromCloud();
  showLoginForm();
}

function exposeGlobals() {
  window.__admin = {
    saveTab, addHS, rmHS, addSkill, rmSkill,
    addExp, rmExp, addProj, rmProj, togFeat,
    addEdu, rmEdu, addCert, rmCert, addTech, rmTech,
    addLang, rmLang,
    rmImg, handleImgs,
    syncH, syncC, prevTheme, rstTheme,
    setThemeMode,
    reloadFromCloud: reloadFromCloudUI, resetAll, exportDefaults,
    openPreview, refreshVisits, createBackup, showBackups, restoreBackup,
  };

  // Color dot handlers (up to 20 items)
  for (let i = 0; i < 20; i++) {
    window.__admin['setExpColor' + i] = (c, el) => setItemColor('experience', i, c, el);
    window.__admin['setProjColor' + i] = (c, el) => setItemColor('projects', i, c, el);
    window.__admin['setEduColor' + i] = (c, el) => setItemColor('education', i, c, el);
  }
}

/* ═══ UI HELPERS ═══ */
function setBadge(cls, txt) {
  const el = document.getElementById('cloudBadge');
  if (el) { el.className = 'cloud-badge ' + cls; el.textContent = txt; }
}

function flash(msg, err) {
  const el = document.getElementById('gToast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast show' + (err ? ' err' : '');
  setTimeout(() => el.classList.remove('show'), 4500);
}

function showMsg(id, txt) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = txt || '✓ Salvo!';
  e.classList.add('show');
  setTimeout(() => e.classList.remove('show'), 2500);
}

/* ═══ AUTH ═══ */
function showLoginForm() {
  const loading = document.getElementById('loginLoading');
  const pi = document.getElementById('pi');
  const btn = document.getElementById('loginBtn');
  const sub = document.querySelector('.login-sub');

  loading.style.display = 'none';
  pi.style.display = '';
  btn.style.display = '';

  if (getDataSource() === 'cloud') {
    if (sub) sub.innerHTML = 'Painel de edição do CV — acesso restrito<br><span style="color:var(--neon);font-size:10px;">✓ Dados do JSONBin carregados</span>';
  } else {
    if (sub) sub.innerHTML = 'Painel de edição do CV — acesso restrito<br><span style="color:#ff6b6b;font-size:10px;">⚠ JSONBin indisponível — usando DEFAULTS</span>';
  }
  setTimeout(() => pi.focus(), 100);
}

window.doLogin = async function() {
  const val = document.getElementById('pi').value;
  if (!val) return;
  const btn = document.getElementById('loginBtn');
  const errEl = document.getElementById('le');
  btn.disabled = true; btn.textContent = 'Verificando...';
  try {
    const ok = await validatePassword(val);
    if (ok) {
      SESSION_PWD = val;
      document.getElementById('lw').style.display = 'none';
      document.getElementById('aw').classList.add('open');
      buildUI();
    } else {
      errEl.textContent = '❌ Senha incorreta.';
      document.getElementById('pi').value = '';
      document.getElementById('pi').focus();
      setTimeout(() => errEl.textContent = '', 2500);
    }
  } catch (e) {
    errEl.textContent = '⚠ Erro de conexão.';
    setTimeout(() => errEl.textContent = '', 3000);
  }
  btn.disabled = false; btn.textContent = 'Entrar';
};

window.logout = function() {
  SESSION_PWD = '';
  document.getElementById('aw').classList.remove('open');
  document.getElementById('lw').style.display = '';
  document.getElementById('pi').value = '';
  showLoginForm();
};

/* ═══ BUILD UI ═══ */
function buildUI() {
  document.getElementById('tabsEl').innerHTML = TABS.map(t =>
    `<div class="tab ${t.id === curTab ? 'on' : ''}" onclick="window.__admin.switchTab&&window.__admin.switchTab('${t.id}')" data-tab="${t.id}">${t.label}</div>`
  ).join('');

  // Tab switching
  window.__admin.switchTab = (id) => {
    collectCurrent();
    curTab = id;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    const activeTab = document.querySelector(`.tab[data-tab="${id}"]`);
    if (activeTab) activeTab.classList.add('on');
    renderTab(id);
  };

  // Data source banner
  const existing = document.getElementById('data-source-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'data-source-banner';
  if (getDataSource() === 'cloud') {
    banner.style.cssText = 'background:rgba(0,255,136,.08);border-bottom:1px solid rgba(0,255,136,.2);padding:7px 24px;font-family:var(--mono);font-size:11px;color:var(--neon);display:flex;align-items:center;gap:8px;';
    banner.innerHTML = '✓ Editando dados do <strong>JSONBin</strong> — alterações refletem no CV ao salvar';
  } else {
    banner.style.cssText = 'background:rgba(255,107,53,.08);border-bottom:1px solid rgba(255,107,53,.3);padding:7px 24px;font-family:var(--mono);font-size:11px;color:var(--neon3);';
    banner.innerHTML = '⚠ JSONBin indisponível — editando DEFAULTS locais.';
  }

  const abody = document.getElementById('secEl').parentElement;
  abody.insertBefore(banner, document.getElementById('secEl'));

  setBadge(getDataSource() === 'cloud' ? 'ok' : 'err', getDataSource() === 'cloud' ? '☁ JSONBin' : '☁ Offline');
  renderTab(curTab);
}

function renderTab(id) {
  const fn = TAB_RENDERERS[id] || TAB_RENDERERS.profile;
  document.getElementById('secEl').innerHTML = `<div class="sec on" id="sec-${id}">${fn()}</div>`;
  initDragDrop();
  // Load visit count when settings tab is shown
  if (id === 'settings') refreshVisits();
}

/* ═══ SAVE ═══ */
window.saveAll = async function() {
  collectCurrent();
  setBadge('loading', '☁ Salvando...');
  const result = await saveToCloud(SESSION_PWD);
  if (result.ok) {
    flash('☁ Salvo na nuvem!');
    setBadge('ok', '☁ Salvo');
  } else if (result.status === 401) {
    flash('❌ Sessão expirada.', true);
    setBadge('err', '☁ Não autorizado');
    window.logout();
  } else {
    flash('⚠ Erro ao salvar: ' + result.status, true);
    setBadge('err', '☁ Erro');
  }
};

function saveTab(tabId) {
  collectCurrent();
  // Auto-backup before saving
  createBackupSilent();
  window.saveAll();
  const msgMap = {
    profile: 'msg-p', herostats: 'msg-hs', objective: 'msg-obj',
    skills: 'msg-sk', experience: 'msg-exp', projects: 'msg-proj',
    education: 'msg-edu', certifications: 'msg-cert', tech: 'msg-tech',
    theme: 'msg-th', languages: 'msg-lang', sections: 'msg-sec', i18n: 'msg-i18n'
  };
  if (msgMap[tabId]) showMsg(msgMap[tabId]);
}

/* ═══ COLLECT DATA FROM FORMS ═══ */
function collectCurrent() {
  const fns = {
    profile: cProfile, herostats: cHS, objective: cObj,
    skills: cSkills, experience: cExp, projects: cProjs,
    education: cEdu, certifications: cCerts, tech: cTech, theme: cTheme,
    languages: cLangs, sections: cSections, i18n: cI18n
  };
  if (fns[curTab]) fns[curTab]();
}

function cProfile() {
  const D = getData();
  D.profile.nickname = v('f-nick'); D.profile.fullname = v('f-full');
  D.profile.role = v('f-role'); D.profile.location = v('f-loc');
  D.profile.email = v('f-email'); D.profile.phone = v('f-phone');
  D.profile.linkedin = v('f-li'); D.profile.github = v('f-gh');
  D.profile.whatsapp = v('f-wa'); D.profile.portfolio = v('f-port');
  D.profile.available = !!document.getElementById('f-avail')?.checked;
  D.tags = v('f-tags').split(',').map(s => s.trim()).filter(Boolean);
}

function cHS() {
  const D = getData();
  D.heroStats = (D.heroStats || []).map((_, i) => ({
    ico: v(`hs-ico-${i}`), label: v(`hs-lbl-${i}`), val: v(`hs-val-${i}`)
  }));
}

function cObj() {
  const D = getData();
  if (document.getElementById('f-obj')) D.objective = document.getElementById('f-obj').value;
  if (document.getElementById('f-objetivo')) D.objetivo = document.getElementById('f-objetivo').value;
}

function cSkills() {
  const D = getData();
  D.skills = D.skills.map((_, i) => ({
    name: v(`sk-n-${i}`), category: document.getElementById(`sk-c-${i}`)?.value || 'intermediate'
  }));
}

function cExp() {
  const D = getData();
  D.experience = D.experience.map((e, i) => ({
    period: v(`ex-p-${i}`), color: e.color, title: v(`ex-t-${i}`), company: v(`ex-c-${i}`),
    description: v(`ex-d-${i}`),
    highlights: v(`ex-h-${i}`).split('\n').map(s => s.trim()).filter(Boolean),
    results: v(`ex-r-${i}`).split('\n').map(s => s.trim()).filter(Boolean)
  }));
}

function cProjs() {
  const D = getData();
  D.projects = D.projects.map((p, i) => ({
    name: v(`pr-n-${i}`), stack: v(`pr-s-${i}`), color: p.color,
    featured: !!document.getElementById(`pr-f-${i}`)?.checked,
    description: v(`pr-d-${i}`), result: v(`pr-r-${i}`),
    pills: v(`pr-p-${i}`).split(',').map(s => s.trim()).filter(Boolean),
    images: p.images || []
  }));
}

function cEdu() {
  const D = getData();
  D.education = D.education.map((e, i) => ({
    period: v(`ed-p-${i}`), color: e.color, title: v(`ed-t-${i}`),
    company: v(`ed-c-${i}`), description: v(`ed-d-${i}`)
  }));
}

function cCerts() {
  const D = getData();
  D.certifications = D.certifications.map((_, i) => ({
    emoji: v(`ct-e-${i}`), year: v(`ct-y-${i}`), issuer: v(`ct-i-${i}`),
    name: v(`ct-n-${i}`), certUrl: v(`ct-u-${i}`)
  }));
}

function cTech() {
  const D = getData();
  D.tech = D.tech.map((_, i) => ({ emoji: v(`tc-e-${i}`), label: v(`tc-l-${i}`) }));
}

function cTheme() {
  const D = getData();
  if (!D.theme) D.theme = {};
  const modeRadio = document.querySelector('input[name="themeMode"]:checked');
  if (modeRadio) D.theme.mode = modeRadio.value;

  // Collect dark colors
  const dkTc = v('dk-th').trim() || v('dk-tc').trim();
  const dkTd = v('dk-dh').trim() || v('dk-dc').trim();
  const dkTb = v('dk-bh').trim() || v('dk-bc').trim();
  D.theme.dark = {
    textColor: /^#[0-9a-fA-F]{6}$/.test(dkTc) ? dkTc : '#c9d1d9',
    textDim: /^#[0-9a-fA-F]{6}$/.test(dkTd) ? dkTd : '#6e7f95',
    textBright: /^#[0-9a-fA-F]{6}$/.test(dkTb) ? dkTb : '#e6edf3',
  };

  // Collect light colors
  const ltTc = v('lt-th').trim() || v('lt-tc').trim();
  const ltTd = v('lt-dh').trim() || v('lt-dc').trim();
  const ltTb = v('lt-bh').trim() || v('lt-bc').trim();
  D.theme.light = {
    textColor: /^#[0-9a-fA-F]{6}$/.test(ltTc) ? ltTc : '#1f2328',
    textDim: /^#[0-9a-fA-F]{6}$/.test(ltTd) ? ltTd : '#656d76',
    textBright: /^#[0-9a-fA-F]{6}$/.test(ltTb) ? ltTb : '#1f2328',
  };
}

function cLangs() {
  const D = getData();
  if (!D.languages) D.languages = [];
  D.languages = D.languages.map((_, i) => ({
    name: v(`ln-n-${i}`), level: document.getElementById(`ln-l-${i}`)?.value || 'A1',
    label: v(`ln-lb-${i}`), percent: parseInt(v(`ln-p-${i}`)) || 0
  }));
}

function cSections() {
  const D = getData();
  if (!D.sections) D.sections = {};
  const keys = ['about','objective','heroStats','tags','experience','projects','skills','languages','education','certifications','tech'];
  keys.forEach(k => { D.sections[k] = !!document.getElementById(`sec-v-${k}`)?.checked; });
}

function cI18n() {
  const D = getData();
  if (!D.i18n) D.i18n = { enabled: false, default: 'pt', en: {} };
  D.i18n.enabled = !!document.getElementById('i18n-enabled')?.checked;
  const labelKeys = ['about','objective','experience','projects','skills','education','certifications','tech','languages'];
  const labels = {};
  labelKeys.forEach(k => { labels[k] = v(`i18n-lbl-${k}`); });

  const enExp = (D.experience || []).map((_, i) => ({
    title: v(`i18n-ex-t-${i}`), company: v(`i18n-ex-c-${i}`),
    description: v(`i18n-ex-d-${i}`),
    highlights: v(`i18n-ex-h-${i}`).split('\n').map(s => s.trim()).filter(Boolean)
  }));
  const enProj = (D.projects || []).map((_, i) => ({
    name: v(`i18n-pr-n-${i}`), stack: v(`i18n-pr-s-${i}`),
    description: v(`i18n-pr-d-${i}`), result: v(`i18n-pr-r-${i}`)
  }));
  const enEdu = (D.education || []).map((_, i) => ({
    title: v(`i18n-ed-t-${i}`), description: v(`i18n-ed-d-${i}`)
  }));

  D.i18n.en = {
    objective: document.getElementById('i18n-obj')?.value || '',
    objetivo: document.getElementById('i18n-objetivo')?.value || '',
    role: v('i18n-role'),
    labels,
    experience: enExp,
    projects: enProj,
    education: enEdu,
    certifications: D.i18n.en?.certifications || []
  };
}

/* ═══ ADD / REMOVE ITEMS ═══ */
function addHS() { cHS(); getData().heroStats.push({ ico: '⭐', label: 'Novo Item', val: 'Valor' }); document.getElementById('hs-list').innerHTML = rHS(); initDragDrop(); }
function rmHS(i) { cHS(); getData().heroStats.splice(i, 1); document.getElementById('hs-list').innerHTML = rHS(); initDragDrop(); }

function addSkill() { cSkills(); getData().skills.push({ name: 'Nova Skill', category: 'intermediate' }); document.getElementById('sk-list').innerHTML = rSkills(); initDragDrop(); }
function rmSkill(i) { cSkills(); getData().skills.splice(i, 1); document.getElementById('sk-list').innerHTML = rSkills(); initDragDrop(); }

function addExp() { cExp(); getData().experience.push({ period: '2024', color: 'c', title: 'Novo Cargo', company: 'Empresa', description: '', highlights: [], results: [] }); document.getElementById('exp-list').innerHTML = rExp(); initDragDrop(); }
function rmExp(i) { cExp(); getData().experience.splice(i, 1); document.getElementById('exp-list').innerHTML = rExp(); initDragDrop(); }

function addProj() { cProjs(); getData().projects.push({ name: 'Novo Projeto', stack: 'Tech', color: 'c', featured: false, description: '', result: '', pills: [], images: [] }); document.getElementById('proj-list').innerHTML = rProjs(); initDragDrop(); }
function rmProj(i) { cProjs(); getData().projects.splice(i, 1); document.getElementById('proj-list').innerHTML = rProjs(); initDragDrop(); }

function togFeat(i) {
  const D = getData();
  const cb = document.getElementById(`pr-f-${i}`);
  const lb = document.getElementById(`ft-${i}`);
  if (!cb || !lb) return;
  D.projects[i].featured = !D.projects[i].featured;
  cb.checked = D.projects[i].featured;
  lb.className = `feat-toggle ${D.projects[i].featured ? 'on' : ''}`;
  const fc = D.projects.filter(p => p.featured).length;
  const el = document.getElementById('feat-count');
  if (el) el.textContent = `✦ ${fc} em destaque na home`;
}

function addEdu() { cEdu(); getData().education.push({ period: '2025', color: 'p', title: 'Novo Curso', company: 'Instituição', description: '' }); document.getElementById('edu-list').innerHTML = rEdu(); initDragDrop(); }
function rmEdu(i) { cEdu(); getData().education.splice(i, 1); document.getElementById('edu-list').innerHTML = rEdu(); initDragDrop(); }

function addCert() { cCerts(); getData().certifications.push({ emoji: '📜', name: 'Certificação', issuer: 'Emissor', year: String(new Date().getFullYear()), certUrl: '' }); document.getElementById('cert-list').innerHTML = rCerts(); initDragDrop(); }
function rmCert(i) { cCerts(); getData().certifications.splice(i, 1); document.getElementById('cert-list').innerHTML = rCerts(); initDragDrop(); }

function addTech() { cTech(); getData().tech.push({ emoji: '🔧', label: 'Nova Tech' }); document.getElementById('tech-list').innerHTML = `<div class="g3f">${rTech()}</div>`; initDragDrop(); }
function rmTech(i) { cTech(); getData().tech.splice(i, 1); document.getElementById('tech-list').innerHTML = `<div class="g3f">${rTech()}</div>`; initDragDrop(); }

/* ═══ COLOR DOTS ═══ */
function setItemColor(collection, i, c, el) {
  const D = getData();
  if (D[collection] && D[collection][i]) {
    D[collection][i].color = c;
    el.closest('.cdots').querySelectorAll('.cdot').forEach(d => d.classList.remove('on'));
    el.classList.add('on');
  }
}

/* ═══ IMAGE UPLOAD ═══ */
async function handleImgs(idx, inp) {
  if (!inp.files.length) return;
  const D = getData();

  if (!SESSION_PWD) {
    const statusEl = document.getElementById('upload-status-' + idx);
    if (statusEl) statusEl.innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:#ff6b6b;padding:8px;">❌ Sessão expirada. Faça login novamente.</div>';
    flash('❌ Sessão expirada.', true);
    inp.value = '';
    return;
  }

  if (!D.projects[idx].images) D.projects[idx].images = [];
  const files = Array.from(inp.files);
  inp.value = '';

  const statusEl = document.getElementById('upload-status-' + idx);
  const total = files.length;
  let done = 0, failed = 0;

  if (statusEl) statusEl.innerHTML = `<div style="font-family:var(--mono);font-size:10px;color:var(--neon2);padding:6px 0;">⏳ Enviando 0/${total}...</div>`;

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) { failed++; flash(`⚠ "${file.name}" > 5MB, ignorado.`, true); continue; }

    const base64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

    const result = await uploadImage(base64, idx, SESSION_PWD);
    if (result.ok) {
      D.projects[idx].images.push(result.url);
      done++;
      if (statusEl) statusEl.innerHTML = `<div style="font-family:var(--mono);font-size:10px;color:var(--neon2);padding:6px 0;">⏳ Enviando ${done}/${total}...</div>`;
      rThumbs(idx);
    } else if (result.status === 401) {
      failed++;
      flash('❌ Não autorizado (401)', true);
      break;
    } else {
      failed++;
      flash(`⚠ Erro: ${result.error || result.status}`, true);
    }
  }

  if (statusEl) {
    statusEl.innerHTML = failed === 0
      ? `<div style="font-family:var(--mono);font-size:10px;color:var(--neon);padding:6px 0;">✓ ${done} foto${done > 1 ? 's' : ''} enviada${done > 1 ? 's' : ''}! Clique em 💾 Salvar.</div>`
      : `<div style="font-family:var(--mono);font-size:10px;color:var(--neon3);padding:6px 0;">⚠ ${done} ok, ${failed} com erro.</div>`;
  }
}

function rmImg(idx, j) {
  const D = getData();
  if (!D.projects[idx]) return;
  D.projects[idx].images = D.projects[idx].images || [];
  D.projects[idx].images.splice(j, 1);
  rThumbs(idx);
}

function rThumbs(idx) {
  const el = document.getElementById('ith-' + idx);
  if (!el) return;
  const D = getData();
  const imgs = D.projects[idx]?.images || [];
  el.innerHTML = imgs.map((url, j) =>
    `<div class="ithumb"><img src="${url}" alt=""><button class="ithumb-del" onclick="window.__admin.rmImg(${idx},${j})">✕</button></div>`
  ).join('');
}

/* ═══ THEME ═══ */
function syncH(cid, hid, pid) {
  const c = document.getElementById(cid)?.value;
  const h = document.getElementById(hid);
  const p = document.getElementById(pid);
  if (h) h.value = c;
  if (p && c) p.style.background = c;
}

function syncC(hid, cid, pid) {
  const h = document.getElementById(hid)?.value;
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return;
  const c = document.getElementById(cid);
  const p = document.getElementById(pid);
  if (c) c.value = h;
  if (p) p.style.background = h;
}

function prevTheme() {
  cTheme();
  applyTheme();
  showMsg('msg-th', '✓ Preview aplicado!');
}

function rstTheme() {
  const D = getData();
  D.theme = {
    mode: D.theme?.mode || 'dark',
    dark: { textColor: '#c9d1d9', textDim: '#6e7f95', textBright: '#e6edf3' },
    light: { textColor: '#1f2328', textDim: '#656d76', textBright: '#1f2328' }
  };
  applyTheme();
  renderTab('theme');
  showMsg('msg-th', '✓ Resetado.');
}

/* ═══ SETTINGS ═══ */
async function reloadFromCloudUI() {
  const el = document.getElementById('msg-push');
  if (el) { el.textContent = '⏳ Recarregando...'; el.classList.add('show'); }
  await loadFromCloud();
  buildUI();
  if (el) {
    el.textContent = getDataSource() === 'cloud' ? '✓ Dados do JSONBin carregados!' : '⚠ JSONBin indisponível.';
    setTimeout(() => el.classList.remove('show'), 3000);
  }
}

async function resetAll() {
  if (!confirm('Resetar TUDO para padrão? Não pode ser desfeito.')) return;
  resetToDefaults();
  await window.saveAll();
  buildUI();
  flash('✓ Resetado!');
}

/* ═══ LANGUAGE ADD/REMOVE ═══ */
function addLang() { cLangs(); getData().languages.push({ name: 'Novo Idioma', level: 'A1', label: 'Básico', percent: 10 }); document.getElementById('lang-list').innerHTML = rLangs(); initDragDrop(); }
function rmLang(i) { cLangs(); getData().languages.splice(i, 1); document.getElementById('lang-list').innerHTML = rLangs(); initDragDrop(); }

/* ═══ THEME MODE ═══ */
function setThemeMode(mode) {
  const D = getData();
  if (!D.theme) D.theme = {};
  D.theme.mode = mode;
  document.querySelectorAll('.theme-mode-opt').forEach(el => {
    el.classList.toggle('active', el.querySelector('input')?.value === mode);
  });
}

/* ═══ PREVIEW ═══ */
function openPreview() {
  collectCurrent();
  const D = getData();
  const modal = document.createElement('div');
  modal.className = 'preview-modal';
  modal.id = 'previewModal';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'preview-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => modal.remove();
  const iframe = document.createElement('iframe');
  iframe.src = 'index.html';
  modal.appendChild(closeBtn);
  modal.appendChild(iframe);
  document.body.appendChild(modal);

  // Inject current data into iframe once loaded
  iframe.onload = () => {
    try {
      const iframeWindow = iframe.contentWindow;
      // Override the fetch to return current data
      const script = iframeWindow.document.createElement('script');
      script.textContent = `
        window.__previewData = ${JSON.stringify(D)};
      `;
      iframeWindow.document.head.appendChild(script);
    } catch (e) {
      // Cross-origin may block, fallback to just showing current saved version
    }
  };
}

/* ═══ VISIT COUNTER ═══ */
async function refreshVisits() {
  const pingUrl = CV_READ_URL.replace('cv-read', 'cv-ping');
  try {
    const res = await fetch(pingUrl, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById('visitCountDisplay');
      if (el) el.textContent = data.visitCount ?? '—';
    }
  } catch (e) {
    flash('⚠ Erro ao carregar visitas', true);
  }
}

/* ═══ BACKUP ═══ */
function createBackupSilent() {
  const D = getData();
  if (!D.backups) D.backups = [];
  const snapshot = JSON.parse(JSON.stringify(D));
  delete snapshot.backups;
  D.backups.unshift({ timestamp: new Date().toISOString(), data: snapshot });
  // Keep max 10 backups
  if (D.backups.length > 10) D.backups = D.backups.slice(0, 10);
}

function createBackup() {
  collectCurrent();
  createBackupSilent();
  flash('💾 Backup criado!');
  showBackups();
}

function showBackups() {
  const el = document.getElementById('backupsList');
  if (!el) return;
  // Toggle: if already visible, hide
  if (el.innerHTML.trim() && el.style.display !== 'none') {
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  const D = getData();
  const backups = D.backups || [];
  if (!backups.length) { el.innerHTML = '<div style="font-family:var(--mono);font-size:10px;color:var(--td);padding:8px 0;">Nenhum backup disponível.</div>'; return; }
  el.innerHTML = backups.map((b, i) => {
    const d = new Date(b.timestamp);
    return `<div class="backup-item"><span class="backup-date">${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR')}</span><button class="btn btn-c" onclick="window.__admin.restoreBackup(${i})">↺ Restaurar</button></div>`;
  }).join('');
}

function restoreBackup(i) {
  const D = getData();
  const backups = D.backups || [];
  if (!backups[i]) return;
  if (!confirm('Restaurar este backup? Os dados atuais serão substituídos.')) return;
  const restored = JSON.parse(JSON.stringify(backups[i].data));
  restored.backups = backups; // Keep backup history
  setData(restored);
  buildUI();
  flash('✓ Backup restaurado! Clique em Salvar para persistir.');
}

/* ═══ DRAG AND DROP ═══ */
function initDragDrop() {
  document.querySelectorAll('[data-draggable]').forEach(card => {
    const handle = card.querySelector('.drag-handle');
    if (!handle) return;
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(card);
    });
    handle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrag(card);
    }, { passive: false });
  });
}

let dragSrc = null;
function startDrag(card) {
  dragSrc = card;
  card.classList.add('dragging');
  const collection = card.dataset.draggable;
  const siblings = Array.from(card.parentElement.querySelectorAll(`[data-draggable="${collection}"]`));

  function onMove(e) {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    siblings.forEach(s => {
      s.classList.remove('drag-over');
      const rect = s.getBoundingClientRect();
      if (s !== card && clientY > rect.top && clientY < rect.bottom) {
        s.classList.add('drag-over');
      }
    });
  }

  function onEnd(e) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    let target = null;
    siblings.forEach(s => {
      s.classList.remove('drag-over');
      const rect = s.getBoundingClientRect();
      if (s !== card && clientY > rect.top && clientY < rect.bottom) {
        target = s;
      }
    });

    card.classList.remove('dragging');
    if (target && target !== card) {
      const fromIdx = parseInt(card.dataset.index);
      const toIdx = parseInt(target.dataset.index);
      reorderCollection(collection, fromIdx, toIdx);
    }
    dragSrc = null;
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

function reorderCollection(collection, from, to) {
  // First collect current form data
  const collectMap = {
    heroStats: cHS, skills: cSkills, experience: cExp,
    projects: cProjs, education: cEdu, certifications: cCerts,
    tech: cTech, languages: cLangs
  };
  if (collectMap[collection]) collectMap[collection]();

  const D = getData();
  const arr = D[collection];
  if (!arr) return;
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);

  // Re-render the list
  const rerenderMap = {
    heroStats: () => { document.getElementById('hs-list').innerHTML = rHS(); },
    skills: () => { document.getElementById('sk-list').innerHTML = rSkills(); },
    experience: () => { document.getElementById('exp-list').innerHTML = rExp(); },
    projects: () => { document.getElementById('proj-list').innerHTML = rProjs(); },
    education: () => { document.getElementById('edu-list').innerHTML = rEdu(); },
    certifications: () => { document.getElementById('cert-list').innerHTML = rCerts(); },
    tech: () => { document.getElementById('tech-list').innerHTML = `<div class="g3f">${rTech()}</div>`; },
    languages: () => { document.getElementById('lang-list').innerHTML = rLangs(); },
  };
  if (rerenderMap[collection]) rerenderMap[collection]();
  initDragDrop();
  flash('✓ Reordenado!');
}

/* ═══ EXPORT DEFAULTS ═══ */
function exportDefaults() {
  collectCurrent();
  const D = getData();
  const clean = JSON.parse(JSON.stringify(D));
  // Remove campos internos que não devem estar no defaults
  delete clean.password;

  const content = `/**
 * Model — Dados padrão do CV (DEFAULTS)
 * Fonte única de verdade — compartilhado entre index e admin
 * Gerado em: ${new Date().toISOString().split('T')[0]}
 */
export const DEFAULTS = ${JSON.stringify(clean, null, 2)};
`;

  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'defaults.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('📥 defaults.js baixado!');
}
