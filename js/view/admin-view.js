/**
 * View — Admin Panel
 * Renderização de todas as tabs do painel admin
 */
import { getData, getDataSource } from '../model/state.js';
import { NARRATIVE, CHAPTER_KEYS, CHAPTER_FIELDS, UI_TEXT_FIELDS } from '../model/narrative.js';
import { esc, escRaw, escAttr } from '../utils.js';
import { CATEGORIAS } from './build-view.js';

/* ═══ HELPERS ═══ */
function v(id) { const e = document.getElementById(id); return e ? e.value : ''; }
export { v };

function cDots(sel, cb) {
  return `<div class="cdots">${['g','c','o','p'].map(c =>
    `<div class="cdot ${c} ${sel === c ? 'on' : ''}" onclick="${cb}('${c}',this)"></div>`
  ).join('')}</div>`;
}

/* ═══ TABS CONFIG ═══ */
export const TABS = [
  { id: 'profile',        label: '👤 Perfil' },
  { id: 'herostats',      label: '📦 Cards' },
  { id: 'objective',      label: '📝 Sobre Mim' },
  { id: 'skills',         label: '⚡ Skills' },
  { id: 'languages',      label: '🌐 Idiomas' },
  { id: 'experience',     label: '💼 Experiência' },
  { id: 'projects',       label: '◈ Projetos' },
  { id: 'story',          label: '🧩 História' },
  { id: 'education',      label: '🎓 Formação' },
  { id: 'certifications', label: '★ Certs' },
  { id: 'tech',           label: '◻ Stack' },
  { id: 'chapters',       label: '📖 Capítulos' },
  { id: 'sections',       label: '👁 Seções' },
  { id: 'i18n',           label: '🌍 i18n' },
  { id: 'theme',          label: '🎨 Tema' },
  { id: 'settings',       label: '⚙ Config' },
];

/* ═══ TAB RENDER FUNCTIONS ═══ */

export function tProfile() {
  const p = getData().profile;
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:20px;">Informações Pessoais</h3>
  <div class="g2f">
    <div class="row"><label class="lbl">Nome / Apelido</label><input class="inp" id="f-nick" value="${esc(p.nickname)}"></div>
    <div class="row"><label class="lbl">Nome Completo</label><input class="inp" id="f-full" value="${esc(p.fullname)}"></div>
    <div class="row"><label class="lbl">Cargo / Título</label><input class="inp" id="f-role" value="${esc(p.role)}"></div>
    <div class="row"><label class="lbl">Localização</label><input class="inp" id="f-loc" value="${esc(p.location)}"></div>
    <div class="row"><label class="lbl">E-mail</label><input class="inp" id="f-email" value="${esc(p.email)}"></div>
    <div class="row"><label class="lbl">Telefone</label><input class="inp" id="f-phone" value="${esc(p.phone)}"></div>
    <div class="row"><label class="lbl">LinkedIn (sem https://)</label><input class="inp" id="f-li" value="${esc(p.linkedin)}"></div>
    <div class="row"><label class="lbl">GitHub (sem https://)</label><input class="inp" id="f-gh" value="${esc(p.github)}"></div>
  </div>
  <div class="row"><label class="lbl">WhatsApp (DDI+DDD+número)</label><input class="inp" id="f-wa" value="${esc(p.whatsapp)}"></div>
  <div class="row"><label class="lbl">Portfólio URL</label><input class="inp" id="f-port" value="${esc(p.portfolio)}"></div>
  <div class="row"><label class="lbl">PDF do Currículo (URL Cloudinary ou externa)</label><input class="inp" id="f-pdfUrl" value="${esc(p.pdfUrl || '')}" placeholder="https://res.cloudinary.com/.../cv.pdf"></div>
  <div style="background:rgba(0,207,255,.06);border:1px solid rgba(0,207,255,.2);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-family:var(--mono);font-size:10px;color:var(--neon2);line-height:1.7;">📄 Faça upload do PDF no Cloudinary (ou qualquer host) e cole a URL aqui. O botão "Download CV" aparecerá no hero.</div>
  <div class="row"><label class="lbl">Tags (separadas por vírgula)</label><input class="inp" id="f-tags" value="${getData().tags.join(', ')}"></div>
  <div class="row"><div class="ck-row"><input type="checkbox" id="f-avail" ${p.available ? 'checked' : ''}><span>Badge "Disponível para oportunidades"</span></div></div>
  <div class="row" style="margin-top:6px;">
    <label class="lbl">📷 Foto de Perfil (hospedada no Cloudinary)</label>
    <div class="ithumb-wrap" id="photo-thumb">${p.photo ? `<div class="ithumb"><img src="${escAttr(p.photo)}" alt=""><button class="ithumb-del" onclick="window.__admin.rmPhoto()">✕</button></div>` : ''}</div>
    <div id="photo-upload-status"></div>
    <div class="izone"><label for="photo-file">📁 Clique para enviar sua foto (JPG, PNG — otimizada automaticamente)</label><input type="file" id="photo-file" accept="image/*" style="display:none;" onchange="window.__admin.handlePhoto(this)"></div>
  </div>
  <div class="sbar"><span class="smsg" id="msg-p"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('profile')">💾 Salvar Perfil</button></div>`;
}

export function tHS() {
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Cards Laterais do Hero</h3>
  <div id="hs-list">${rHS()}</div>
  <div style="margin-top:12px;"><button class="btn btn-g" onclick="window.__admin.addHS()">+ Card</button></div>
  <div class="sbar"><span class="smsg" id="msg-hs"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('herostats')">💾 Salvar</button></div>`;
}

export function rHS() {
  return (getData().heroStats || []).map((s, i) => `
  <div class="card" data-draggable="heroStats" data-index="${i}"><div class="drag-handle" title="Arrastar">⠿</div><div class="g3f">
    <div><label class="lbl">Emoji</label><input class="inp" id="hs-ico-${i}" value="${esc(s.ico)}" style="font-size:18px;text-align:center;"></div>
    <div><label class="lbl">Label</label><input class="inp" id="hs-lbl-${i}" value="${esc(s.label)}"></div>
    <div><label class="lbl">Valor</label><input class="inp" id="hs-val-${i}" value="${esc(s.val)}"></div>
  </div>
  <div style="text-align:right;margin-top:8px;"><button class="btn btn-r" onclick="window.__admin.rmHS(${i})">✕</button></div>
  </div>`).join('');
}

export function tObj() {
  const D = getData();
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Textos Narrativos</h3>
  <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:18px;font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.7;">
    HTML básico aceito: &lt;strong&gt;, &lt;span class='metric'&gt;, &lt;em&gt;<br>
    Estes dois textos aparecem lado a lado no CV em duas colunas.
  </div>
  <div class="g2f" style="gap:20px;align-items:start;">
    <div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:8px;">👤 Sobre Mim</div>
      <div class="row"><textarea class="inp" id="f-obj" style="min-height:200px;" oninput="document.getElementById('obj-prev').innerHTML=this.value">${escRaw(D.objective)}</textarea></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-top:4px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--td);margin-bottom:6px;">PREVIEW</div>
        <p style="font-size:12px;line-height:1.8;color:var(--t);" id="obj-prev">${D.objective}</p>
      </div>
    </div>
    <div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:8px;">🎯 Objetivo</div>
      <div class="row"><textarea class="inp" id="f-objetivo" style="min-height:200px;" oninput="document.getElementById('objetivo-prev').innerHTML=this.value">${escRaw(D.objetivo || '')}</textarea></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-top:4px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--td);margin-bottom:6px;">PREVIEW</div>
        <p style="font-size:12px;line-height:1.8;color:var(--t);" id="objetivo-prev">${D.objetivo || ''}</p>
      </div>
    </div>
  </div>
  <div class="sbar"><span class="smsg" id="msg-obj"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('objective')">💾 Salvar Textos</button></div>`;
}

export function tSkills() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Skills</h3>
    <button class="btn btn-g" onclick="window.__admin.addSkill()">+ Adicionar</button>
  </div>
  <div style="font-family:var(--mono);font-size:10px;color:var(--td);margin-bottom:14px;"><span style="color:var(--neon);">Avançado</span> · <span style="color:var(--neon2);">Intermediário</span> · <span style="color:var(--neon5);">Básico</span> · <span style="color:var(--neon3);">Idiomas</span></div>
  <div id="sk-list">${rSkills()}</div>
  <div class="sbar"><span class="smsg" id="msg-sk"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('skills')">💾 Salvar</button></div>`;
}

export function rSkills() {
  return (getData().skills || []).map((s, i) => `
  <div class="card" data-draggable="skills" data-index="${i}"><div class="drag-handle" title="Arrastar">⠿</div><div class="g2f" style="align-items:end;">
    <div><label class="lbl">Nome</label><input class="inp" id="sk-n-${i}" value="${esc(s.name)}"></div>
    <div><label class="lbl">Categoria</label>
      <select class="inp" id="sk-c-${i}">
        <option value="advanced" ${s.category === 'advanced' ? 'selected' : ''}>Avançado</option>
        <option value="intermediate" ${s.category === 'intermediate' ? 'selected' : ''}>Intermediário</option>
        <option value="basic" ${s.category === 'basic' ? 'selected' : ''}>Básico</option>
        <option value="language" ${s.category === 'language' ? 'selected' : ''}>Idiomas</option>
      </select>
    </div>
  </div>
  <div style="text-align:right;margin-top:10px;"><button class="btn btn-r" onclick="window.__admin.rmSkill(${i})">✕</button></div>
  </div>`).join('');
}

export function tExp() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Histórico Profissional</h3>
    <button class="btn btn-g" onclick="window.__admin.addExp()">+ Adicionar</button>
  </div>
  <div id="exp-list">${rExp()}</div>
  <div class="sbar"><span class="smsg" id="msg-exp"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('experience')">💾 Salvar</button></div>`;
}

export function rExp() {
  return (getData().experience || []).map((e, i) => `
  <div class="card" data-draggable="experience" data-index="${i}">
    <div class="drag-handle" title="Arrastar para reordenar">⠿</div>
    <div class="card-h"><span class="card-n">#${i + 1}</span><span class="card-t">${esc(e.title || 'Cargo')}</span></div>
    <div class="g2f">
      <div class="row"><label class="lbl">Período</label><input class="inp" id="ex-p-${i}" value="${esc(e.period)}"></div>
      <div class="row"><label class="lbl">Cargo</label><input class="inp" id="ex-t-${i}" value="${esc(e.title)}"></div>
      <div class="row"><label class="lbl">Empresa</label><input class="inp" id="ex-c-${i}" value="${esc(e.company)}"></div>
      <div><div class="crow" style="margin-top:22px;"><label>Cor:</label>${cDots(e.color, 'window.__admin.setExpColor' + i)}</div></div>
    </div>
    <div class="row" style="margin-top:8px;"><label class="lbl">Descrição</label><textarea class="inp" id="ex-d-${i}">${esc(e.description)}</textarea></div>
    <div class="row"><label class="lbl">Destaques (um por linha)</label><textarea class="inp" id="ex-h-${i}" style="min-height:56px;">${(e.highlights || []).join('\n')}</textarea></div>
    <div class="row"><label class="lbl">Resultados Gerais (um por linha) — métricas/KPIs separados</label><textarea class="inp" id="ex-r-${i}" style="min-height:56px;">${(e.results || []).join('\n')}</textarea></div>
    <div style="text-align:right;"><button class="btn btn-r" onclick="window.__admin.rmExp(${i})">✕ Remover</button></div>
  </div>`).join('');
}

export function tProjs() {
  const D = getData();
  const fc = (D.projects || []).filter(p => p.featured).length;
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Projetos</h3>
    <button class="btn btn-g" onclick="window.__admin.addProj()">+ Adicionar</button>
  </div>
  <div style="font-family:var(--mono);font-size:10px;color:var(--neon);margin-bottom:10px;" id="feat-count">✦ ${fc} em destaque na home</div>
  <div style="background:rgba(0,207,255,.06);border:1px solid rgba(0,207,255,.2);border-radius:var(--r);padding:10px 14px;margin-bottom:14px;font-family:var(--mono);font-size:10px;color:var(--neon2);line-height:1.7;">☁ Fotos são enviadas para o <strong>Cloudinary</strong> e ficam visíveis para todos os visitantes.</div>
  <div id="proj-list">${rProjs()}</div>
  <div class="sbar"><span class="smsg" id="msg-proj"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('projects')">💾 Salvar</button></div>`;
}

export function rProjs() {
  return (getData().projects || []).map((pr, i) => `
  <div class="card" data-draggable="projects" data-index="${i}">
    <div class="drag-handle" title="Arrastar para reordenar">⠿</div>
    <div class="card-h"><span class="card-n">#${i + 1}</span><span class="card-t">${esc(pr.name || 'Projeto')}</span></div>
    <label class="feat-toggle ${pr.featured ? 'on' : ''}" id="ft-${i}" onclick="window.__admin.togFeat(${i})">
      <input type="checkbox" id="pr-f-${i}" ${pr.featured ? 'checked' : ''} onclick="event.stopPropagation()">
      <span>✦ Destacar na Home</span>
    </label>
    <div class="g2f" style="margin-top:12px;">
      <div class="row"><label class="lbl">Nome</label><input class="inp" id="pr-n-${i}" value="${esc(pr.name)}"></div>
      <div class="row"><label class="lbl">Stack</label><input class="inp" id="pr-s-${i}" value="${esc(pr.stack)}"></div>
    </div>
    <div class="row"><label class="lbl">Descrição</label><textarea class="inp" id="pr-d-${i}">${esc(pr.description)}</textarea></div>
    <div class="row"><label class="lbl">Resultado / Métrica</label><input class="inp" id="pr-r-${i}" value="${esc(pr.result || '')}"></div>
    <div class="row"><label class="lbl">Pills (vírgula)</label><input class="inp" id="pr-p-${i}" value="${(pr.pills || []).join(', ')}"></div>
    <div class="crow"><label>Cor:</label>${cDots(pr.color, 'window.__admin.setProjColor' + i)}</div>
    ${rLinks(pr, i)}
    <div style="margin-top:14px;">
      <label class="lbl">📷 Fotos do Projeto (hospedadas no Cloudinary)</label>
      <div class="ithumb-wrap" id="ith-${i}">${(pr.images || []).map((url, j) => `<div class="ithumb"><img src="${escAttr(url)}" alt=""><button class="ithumb-del" onclick="window.__admin.rmImg(${i},${j})">✕</button></div>`).join('')}</div>
      <div id="upload-status-${i}"></div>
      <div class="izone"><label for="if-${i}">📁 Clique para enviar imagens (JPG, PNG — otimizadas automaticamente)</label><input type="file" id="if-${i}" accept="image/*" multiple style="display:none;" onchange="window.__admin.handleImgs(${i},this)"></div>
    </div>
    <div style="text-align:right;margin-top:10px;"><button class="btn btn-r" onclick="window.__admin.rmProj(${i})">✕ Remover</button></div>
  </div>`).join('');
}

export function tEdu() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Formação Acadêmica</h3>
    <button class="btn btn-g" onclick="window.__admin.addEdu()">+ Adicionar</button>
  </div>
  <div id="edu-list">${rEdu()}</div>
  <div class="sbar"><span class="smsg" id="msg-edu"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('education')">💾 Salvar</button></div>`;
}

export function rEdu() {
  return (getData().education || []).map((e, i) => `
  <div class="card" data-draggable="education" data-index="${i}">
    <div class="drag-handle" title="Arrastar">⠿</div>
    <div class="g2f">
      <div class="row"><label class="lbl">Ano / Período</label><input class="inp" id="ed-p-${i}" value="${esc(e.period)}"></div>
      <div class="row"><label class="lbl">Curso</label><input class="inp" id="ed-t-${i}" value="${esc(e.title)}"></div>
      <div class="row"><label class="lbl">Instituição</label><input class="inp" id="ed-c-${i}" value="${esc(e.company)}"></div>
      <div><div class="crow" style="margin-top:22px;"><label>Cor:</label>${cDots(e.color, 'window.__admin.setEduColor' + i)}</div></div>
    </div>
    <div class="row" style="margin-top:8px;"><label class="lbl">Descrição</label><textarea class="inp" id="ed-d-${i}">${esc(e.description)}</textarea></div>
    <div style="text-align:right;"><button class="btn btn-r" onclick="window.__admin.rmEdu(${i})">✕</button></div>
  </div>`).join('');
}

export function tCerts() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Certificações &amp; Cursos</h3>
    <button class="btn btn-g" onclick="window.__admin.addCert()">+ Adicionar</button>
  </div>
  <div class="hint" style="margin-bottom:14px;">Preencha "URL do Certificado" para tornar o card clicável.</div>
  <div id="cert-list">${rCerts()}</div>
  <div class="sbar"><span class="smsg" id="msg-cert"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('certifications')">💾 Salvar</button></div>`;
}

export function rCerts() {
  return (getData().certifications || []).map((c, i) => `
  <div class="card" data-draggable="certifications" data-index="${i}">
    <div class="drag-handle" title="Arrastar">⠿</div>
    <div class="g4f">
      <div><label class="lbl">Emoji</label><input class="inp" id="ct-e-${i}" value="${esc(c.emoji)}" style="font-size:18px;text-align:center;"></div>
      <div><label class="lbl">Ano</label><input class="inp" id="ct-y-${i}" value="${esc(c.year)}"></div>
      <div><label class="lbl">Emissor</label><input class="inp" id="ct-i-${i}" value="${esc(c.issuer)}"></div>
      <div style="display:flex;align-items:flex-end;padding-bottom:2px;"><span style="font-family:var(--mono);font-size:10px;color:${c.certUrl ? 'var(--neon2)' : 'var(--td)'}">${c.certUrl ? '🔗 Com link' : '🔗 Sem link'}</span></div>
    </div>
    <div class="row" style="margin-top:10px;"><label class="lbl">Nome</label><input class="inp" id="ct-n-${i}" value="${esc(c.name)}"></div>
    <div class="row"><label class="lbl">URL do Certificado (opcional)</label><input class="inp" id="ct-u-${i}" value="${esc(c.certUrl || '')}" placeholder="https://..."></div>
    <div style="text-align:right;"><button class="btn btn-r" onclick="window.__admin.rmCert(${i})">✕</button></div>
  </div>`).join('');
}

export function tTech() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Tech Stack</h3>
    <button class="btn btn-g" onclick="window.__admin.addTech()">+ Adicionar</button>
  </div>
  <div id="tech-list"><div class="g3f">${rTech()}</div></div>
  <div class="sbar"><span class="smsg" id="msg-tech"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('tech')">💾 Salvar</button></div>`;
}

export function rTech() {
  return (getData().tech || []).map((t, i) => `
  <div class="card" style="padding:10px;" data-draggable="tech" data-index="${i}"><div class="drag-handle" title="Arrastar" style="margin-bottom:4px;">⠿</div>
    <div class="row"><label class="lbl">Emoji</label><input class="inp" id="tc-e-${i}" value="${esc(t.emoji)}" style="font-size:18px;text-align:center;"></div>
    <div class="row" style="margin-bottom:8px;"><label class="lbl">Label</label><input class="inp" id="tc-l-${i}" value="${esc(t.label)}"></div>
    <button class="btn btn-r" style="width:100%;font-size:10px;padding:5px;" onclick="window.__admin.rmTech(${i})">✕</button>
  </div>`).join('');
}

function typoBlock(typo) {
  const fields = [
    ['fontFamily', 'Fonte Principal', "ex: 'JetBrains Mono', monospace"],
    ['fsHero', 'Nome (Hero)', 'padrão: clamp(32px,4.5vw,58px)'],
    ['fsSectionTitle', 'Títulos de Seção', 'padrão: 10px'],
    ['fsBody', 'Corpo / Sobre Mim', 'padrão: 14px'],
    ['fsItemTitle', 'Títulos de Itens', 'padrão: 13px'],
    ['fsDescription', 'Descrições', 'padrão: 12px'],
    ['fsLabel', 'Labels / Contato', 'padrão: 11px'],
    ['fsSmall', 'Pequeno (pills, tech)', 'padrão: 10px'],
    ['fsTiny', 'Mínimo (badges)', 'padrão: 9px'],
  ];
  return `<div class="card" style="padding:14px;">
    <div class="g2f" style="gap:10px;">
      ${fields.map(([key, label, hint]) => `
        <div class="row"><label class="lbl">${label} <span style="color:var(--td);font-weight:400;">(${hint})</span></label>
        <input class="inp" id="typo-${key}" value="${esc(typo[key] || '')}" placeholder="${hint}"></div>
      `).join('')}
    </div>
  </div>`;
}

export function tTheme() {
  const th = getData().theme || {};
  const mode = th.mode || 'dark';
  const dk = th.dark || {};
  const lt = th.light || {};
  const typo = th.typography || {};
  const dkTc = dk.textColor || '#c9d1d9', dkTd = dk.textDim || '#6e7f95', dkTb = dk.textBright || '#e6edf3';
  const ltTc = lt.textColor || '#1f2328', ltTd = lt.textDim || '#656d76', ltTb = lt.textBright || '#1f2328';

  function colorBlock(prefix, label, defTc, defTd, defTb, tc, td, tb) {
    return [
      [prefix+'-tc', prefix+'-th', prefix+'-prev', '--t (texto principal)', defTc, tc],
      [prefix+'-dc', prefix+'-dh', prefix+'-dprev', '--td (texto suave)', defTd, td],
      [prefix+'-bc', prefix+'-bh', prefix+'-bprev', '--tb (títulos)', defTb, tb]
    ].map(([cid, hid, pid, lbl, def, val]) => `
    <div class="card" style="margin-bottom:10px;padding:12px;">
      <div style="font-family:var(--mono);font-size:10px;color:var(--neon2);margin-bottom:8px;">${lbl} — padrão: <code style="color:var(--neon)">${def}</code></div>
      <div class="color-row">
        <input type="color" id="${cid}" value="${val}" oninput="window.__admin.syncH('${cid}','${hid}','${pid}')">
        <input type="text" class="hex-inp" id="${hid}" value="${val}" maxlength="7" placeholder="${def}" oninput="window.__admin.syncC('${hid}','${cid}','${pid}')">
        <div class="color-swatch" id="${pid}" style="background:${val};"></div>
      </div>
    </div>`).join('');
  }

  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Modo de Tema Padrão</h3>
  <div class="card" style="margin-bottom:20px;padding:14px;">
    <div class="g2f" style="gap:10px;">
      <label class="theme-mode-opt ${mode === 'dark' ? 'active' : ''}" onclick="window.__admin.setThemeMode('dark')">
        <input type="radio" name="themeMode" value="dark" ${mode === 'dark' ? 'checked' : ''}> 🌙 Escuro
      </label>
      <label class="theme-mode-opt ${mode === 'light' ? 'active' : ''}" onclick="window.__admin.setThemeMode('light')">
        <input type="radio" name="themeMode" value="light" ${mode === 'light' ? 'checked' : ''}> ☀️ Claro
      </label>
    </div>
    <div class="hint" style="margin-top:8px;">O visitante pode alternar no topbar. Aqui define o padrão inicial.</div>
  </div>

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">🌙 Cores do Tema Escuro</h3>
  <div class="hint" style="margin-bottom:12px;">Cores de texto para o modo escuro.</div>
  ${colorBlock('dk', 'Escuro', '#c9d1d9', '#6e7f95', '#e6edf3', dkTc, dkTd, dkTb)}

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin:20px 0 8px;">☀️ Cores do Tema Claro</h3>
  <div class="hint" style="margin-bottom:12px;">Cores de texto para o modo claro.</div>
  ${colorBlock('lt', 'Claro', '#1f2328', '#656d76', '#1f2328', ltTc, ltTd, ltTb)}

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin:20px 0 8px;">🔤 Tipografia</h3>
  <div class="hint" style="margin-bottom:12px;">Configure tamanhos de fonte por elemento. Deixe vazio para usar o padrão. Use px, rem, clamp(), etc.</div>
  ${typoBlock(typo)}

  <div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0;">
    <button class="btn btn-c" onclick="window.__admin.prevTheme()">👁 Preview</button>
    <button class="btn btn-r" onclick="window.__admin.rstTheme()">↺ Resetar</button>
  </div>
  <div class="sbar"><span class="smsg" id="msg-th"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('theme')">💾 Salvar Tema</button></div>`;
}

export function tSettings() {
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:20px;">Configurações</h3>

  <div style="background:rgba(0,207,255,.05);border:1px solid rgba(0,207,255,.2);border-radius:var(--r);padding:16px;margin-bottom:24px;">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">☁ Configurar Cloudinary (fotos dos projetos)</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:12px;">
      1. Crie conta grátis em <a href="https://cloudinary.com" target="_blank" style="color:var(--neon2);">cloudinary.com</a> (25GB grátis)<br>
      2. No painel → Settings → API Keys → copie Cloud Name, API Key e API Secret<br>
      3. Adicione as variáveis de ambiente no seu host (Vercel ou Netlify):
    </div>
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:12px;font-family:var(--mono);font-size:11px;color:var(--neon);line-height:2;">
      CLOUDINARY_CLOUD_NAME = seu-cloud-name<br>
      CLOUDINARY_API_KEY = 123456789012345<br>
      CLOUDINARY_API_SECRET = ••••••••••••••••••••
    </div>
  </div>

  <div style="background:rgba(0,255,136,.05);border:1px solid rgba(0,255,136,.2);border-radius:var(--r);padding:16px;margin-bottom:24px;">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon);margin-bottom:8px;">🔒 Segurança</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;">
      A senha é validada pelo servidor (Serverless Function).<br>
      Nenhuma credencial existe nos arquivos do cliente.<br>
      Para alterar a senha, atualize <code style="color:var(--neon2);">CV_ADMIN_PASSWORD</code> nas variáveis de ambiente.
    </div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">👁 Preview em Tempo Real</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:12px;">
      Abre o CV num iframe lateral com os dados atuais (sem salvar) para ver como ficaria.
    </div>
    <button class="btn btn-c" onclick="window.__admin.openPreview()">👁 Abrir Preview</button>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">📊 Contador de Visitas</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="font-family:var(--mono);font-size:24px;color:var(--neon);font-weight:700;" id="visitCountDisplay">—</div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--td);">visitas totais</div>
      <button class="btn btn-c" style="margin-left:auto;font-size:10px;padding:6px 12px;" onclick="window.__admin.refreshVisits()">↺ Atualizar</button>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);" id="lastVisitDisplay"></div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">📦 Tamanho do registro</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:10px;">
      O JSONBin guarda tudo em um único registro e o plano tem limite de tamanho.
      Estourar o limite faz o salvamento voltar <strong>403</strong>.
    </div>
    <div style="height:6px;background:var(--bg3);border:1px solid var(--border);border-radius:3px;overflow:hidden;margin-bottom:6px;">
      <div id="recordSizeBar" style="height:100%;width:0;background:var(--neon);transition:width .4s;"></div>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);" id="recordSizeDisplay">—</div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">💾 Backup e Restauração</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:12px;">
      Ao salvar, um snapshot automático é criado. Restaure versões anteriores se necessário.
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
      <button class="btn btn-g" onclick="window.__admin.createBackup()">💾 Criar Backup Agora</button>
      <button class="btn btn-c" onclick="window.__admin.showBackups()">📋 Ver Backups</button>
    </div>
    <div id="backupsList"></div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">🔄 Sincronização</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:8px;">
      <button class="btn btn-c" onclick="window.__admin.reloadFromCloud()">↺ Recarregar do JSONBin</button>
      <span class="smsg" id="msg-push" style="margin-left:4px;"></span>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);margin-top:8px;">
      Dados atuais: <span style="color:var(--neon);font-weight:600;">${getDataSource() === 'cloud' ? 'JSONBin ✓' : 'DEFAULTS ⚠'}</span>
    </div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">⬇ Atualizar conteúdo pelo código</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:12px;">
      Traz do <code style="color:var(--neon);">defaults.js</code> publicado: experiência, projetos, habilidades,<br>
      formação, stack, tags, destaques e os textos de "Sobre mim" e "Objetivo".<br>
      Perfil, foto, certificações, idiomas, tema e traduções não mudam; as imagens<br>
      dos projetos ficam com o projeto de mesmo nome, e as novas sobem para o Cloudinary.<br>
      A ordem e o destaque dos projetos que já existem não mudam; os novos entram no fim.<br>
      Cria um backup antes. Depois, confira e clique em "Salvar Tudo".
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-c" onclick="window.__admin.applyDefaultsContent()">⬇ Aplicar conteúdo do código</button>
      <button class="btn btn-g" onclick="window.__admin.uploadPendingImages()">☁ Enviar imagens pendentes</button>
    </div>
  </div>

  <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">📥 Exportar Defaults</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.9;margin-bottom:12px;">
      Baixa os dados atuais do JSONBin como <code style="color:var(--neon);">defaults.js</code>.<br>
      Use para atualizar o arquivo padrão no GitHub.
    </div>
    <button class="btn btn-g" onclick="window.__admin.exportDefaults()">📥 Baixar defaults.js</button>
  </div>

  <div style="margin-top:36px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:#ff6b6b;font-weight:600;margin-bottom:8px;">⚠ Zona de Perigo</div>
    <button class="btn btn-r" onclick="window.__admin.resetAll()">⚠ Resetar para padrão</button>
  </div>`;
}

/* ═══ LANGUAGES TAB ═══ */
export function tLangs() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">Idiomas</h3>
    <button class="btn btn-g" onclick="window.__admin.addLang()">+ Adicionar</button>
  </div>
  <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:14px;font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.7;">
    Níveis CEFR: A1, A2, B1, B2, C1, C2. Porcentagem define a barra de progresso (0-100).
  </div>
  <div id="lang-list">${rLangs()}</div>
  <div class="sbar"><span class="smsg" id="msg-lang"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('languages')">💾 Salvar</button></div>`;
}

export function rLangs() {
  return (getData().languages || []).map((l, i) => `
  <div class="card" data-draggable="languages" data-index="${i}">
    <div class="drag-handle" title="Arrastar para reordenar">⠿</div>
    <div class="g4f">
      <div><label class="lbl">Idioma</label><input class="inp" id="ln-n-${i}" value="${esc(l.name)}"></div>
      <div><label class="lbl">Nível (CEFR)</label>
        <select class="inp" id="ln-l-${i}">
          ${['A1','A2','B1','B2','C1','C2'].map(lv => `<option value="${lv}" ${l.level === lv ? 'selected' : ''}>${lv}</option>`).join('')}
        </select>
      </div>
      <div><label class="lbl">Label</label><input class="inp" id="ln-lb-${i}" value="${esc(l.label)}"></div>
      <div><label class="lbl">% (0-100)</label><input type="number" class="inp" id="ln-p-${i}" value="${l.percent || 0}" min="0" max="100"></div>
    </div>
    <div style="text-align:right;margin-top:10px;"><button class="btn btn-r" onclick="window.__admin.rmLang(${i})">✕</button></div>
  </div>`).join('');
}

/* ═══ SECTIONS VISIBILITY TAB ═══ */
/* ═══ CHAPTERS TAB ═══ */

export function tChapters() {
  const D = getData();
  const base = NARRATIVE.pt;
  const order = (Array.isArray(D.chapterOrder) && D.chapterOrder.length ? D.chapterOrder : CHAPTER_KEYS)
    .filter(k => base.chapters[k]);
  // Garante que nenhum capítulo suma se `chapterOrder` vier incompleto da nuvem
  for (const k of CHAPTER_KEYS) if (!order.includes(k)) order.push(k);

  const ch = D.chapters || {};
  const ui = D.uiText || {};

  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Capítulos da narrativa</h3>
  <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:18px;font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.7;">
    Reordene com ▲▼ — a numeração (01, 02…) e o “Capítulo um” se ajustam sozinhos.<br>
    Deixe um campo <strong>vazio</strong> para usar o texto padrão, que aparece esmaecido dentro dele.
  </div>

  ${order.map((key, i) => {
    const def = base.chapters[key];
    const cur = ch[key] || {};
    return `
    <div class="card" style="padding:14px;margin-bottom:10px;" data-chapter="${key}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--neon);">${String(i + 1).padStart(2, '0')}</span>
        <strong style="font-size:13px;color:var(--tb);">${esc(def.title)}</strong>
        <span style="margin-left:auto;display:flex;gap:4px;">
          <button class="btn" style="padding:4px 10px;font-size:11px;" ${i === 0 ? 'disabled' : ''}
                  onclick="window.__admin.moveChapter('${key}',-1)" title="Subir">▲</button>
          <button class="btn" style="padding:4px 10px;font-size:11px;" ${i === order.length - 1 ? 'disabled' : ''}
                  onclick="window.__admin.moveChapter('${key}',1)" title="Descer">▼</button>
        </span>
      </div>
      ${CHAPTER_FIELDS.map(f => `
        <label class="lbl">${f.label}</label>
        <input class="inp" id="ch-${key}-${f.key}" value="${escAttr(cur[f.key] || '')}"
               placeholder="${escAttr(def[f.key] || '')}">`).join('')}
    </div>`;
  }).join('')}

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin:26px 0 16px;">Outros textos do site</h3>
  <div class="card" style="padding:14px;">
    ${UI_TEXT_FIELDS.map(f => `
      <label class="lbl">${f.label}</label>
      <input class="inp" id="ui-${f.key}" value="${escAttr(ui[f.key] || '')}"
             placeholder="${escAttr(base[f.key] || '')}">`).join('')}
  </div>

  <div class="sbar"><span class="smsg" id="msg-chap"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('chapters')">💾 Salvar</button></div>`;
}

/* ═══ SECTIONS TAB ═══ */

export function tSections() {
  const sec = getData().sections || {};
  const items = [
    { key: 'about', label: '👤 Sobre Mim' },
    { key: 'objective', label: '🎯 Objetivo' },
    { key: 'heroStats', label: '📦 Cards do Hero' },
    { key: 'tags', label: '🏷 Tags' },
    { key: 'experience', label: '💼 Experiência' },
    { key: 'projects', label: '◈ Projetos' },
    { key: 'skills', label: '⚡ Skills' },
    { key: 'languages', label: '🌐 Idiomas' },
    { key: 'education', label: '🎓 Formação' },
    { key: 'certifications', label: '★ Certificações' },
    { key: 'tech', label: '◻ Tech Stack' },
  ];
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Visibilidade das Seções</h3>
  <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:18px;font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.7;">
    Desmarque uma seção para ocultá-la do CV público. A seção continua editável no admin.
  </div>
  ${items.map(it => `
  <div class="card" style="padding:12px;margin-bottom:8px;">
    <div class="ck-row">
      <input type="checkbox" id="sec-v-${it.key}" ${sec[it.key] !== false ? 'checked' : ''}>
      <span>${it.label}</span>
    </div>
  </div>`).join('')}
  <div class="sbar"><span class="smsg" id="msg-sec"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('sections')">💾 Salvar</button></div>`;
}

/* ═══ I18N TAB ═══ */
export function tI18n() {
  const D = getData();
  const i18n = D.i18n || {};
  const en = i18n.en || {};
  const labels = en.labels || {};
  const enExp = en.experience || [];
  const enProj = en.projects || [];
  const enEdu = en.education || [];
  const enCert = en.certifications || [];

  let expHtml = (D.experience || []).map((e, i) => {
    const t = enExp[i] || {};
    return `<div class="card" style="margin-bottom:8px;padding:12px;">
      <div style="font-family:var(--mono);font-size:10px;color:var(--neon2);margin-bottom:6px;">PT: ${esc(e.title)} — ${esc(e.company)}</div>
      <div class="g2f"><div class="row"><label class="lbl">Title (EN)</label><input class="inp" id="i18n-ex-t-${i}" value="${esc(t.title || '')}"></div>
      <div class="row"><label class="lbl">Company (EN)</label><input class="inp" id="i18n-ex-c-${i}" value="${esc(t.company || '')}"></div></div>
      <div class="row"><label class="lbl">Description (EN)</label><textarea class="inp" id="i18n-ex-d-${i}" style="min-height:50px;">${esc(t.description || '')}</textarea></div>
      <div class="row"><label class="lbl">Highlights (EN, one per line)</label><textarea class="inp" id="i18n-ex-h-${i}" style="min-height:40px;">${(t.highlights || []).join('\n')}</textarea></div>
    </div>`;
  }).join('');

  let projHtml = (D.projects || []).map((p, i) => {
    const t = enProj[i] || {};
    return `<div class="card" style="margin-bottom:8px;padding:12px;">
      <div style="font-family:var(--mono);font-size:10px;color:var(--neon2);margin-bottom:6px;">PT: ${esc(p.name)}</div>
      <div class="g2f"><div class="row"><label class="lbl">Name (EN)</label><input class="inp" id="i18n-pr-n-${i}" value="${esc(t.name || '')}"></div>
      <div class="row"><label class="lbl">Stack (EN)</label><input class="inp" id="i18n-pr-s-${i}" value="${esc(t.stack || '')}"></div></div>
      <div class="row"><label class="lbl">Description (EN)</label><textarea class="inp" id="i18n-pr-d-${i}" style="min-height:40px;">${esc(t.description || '')}</textarea></div>
      <div class="row"><label class="lbl">Result (EN)</label><input class="inp" id="i18n-pr-r-${i}" value="${esc(t.result || '')}"></div>
    </div>`;
  }).join('');

  let eduHtml = (D.education || []).map((e, i) => {
    const t = enEdu[i] || {};
    return `<div class="card" style="margin-bottom:8px;padding:12px;">
      <div style="font-family:var(--mono);font-size:10px;color:var(--neon2);margin-bottom:6px;">PT: ${esc(e.title)}</div>
      <div class="g2f"><div class="row"><label class="lbl">Title (EN)</label><input class="inp" id="i18n-ed-t-${i}" value="${esc(t.title || '')}"></div>
      <div class="row"><label class="lbl">Description (EN)</label><input class="inp" id="i18n-ed-d-${i}" value="${esc(t.description || '')}"></div></div>
    </div>`;
  }).join('');

  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Internacionalização (EN/PT)</h3>
  <div class="card" style="margin-bottom:16px;padding:14px;">
    <div class="ck-row">
      <input type="checkbox" id="i18n-enabled" ${i18n.enabled ? 'checked' : ''}>
      <span>Habilitar toggle EN/PT no CV público</span>
    </div>
  </div>
  <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:18px;font-family:var(--mono);font-size:10px;color:var(--td);line-height:1.7;">
    Preencha os textos em inglês. Campos vazios mantêm o texto em português.<br>
    O visitante alterna com o botão PT/EN no topbar.
  </div>

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);margin-bottom:8px;">Textos Gerais</h3>
  <div class="row"><label class="lbl">Role / Title (EN)</label><input class="inp" id="i18n-role" value="${esc(en.role || '')}"></div>
  <div class="row"><label class="lbl">About Me (EN)</label><textarea class="inp" id="i18n-obj" style="min-height:100px;">${escRaw(en.objective || '')}</textarea></div>
  <div class="row"><label class="lbl">Objective (EN)</label><textarea class="inp" id="i18n-objetivo" style="min-height:100px;">${escRaw(en.objetivo || '')}</textarea></div>

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);margin:16px 0 8px;">Labels das Seções</h3>
  <div class="g2f" style="margin-bottom:16px;">
    <div class="row"><label class="lbl">About Me</label><input class="inp" id="i18n-lbl-about" value="${esc(labels.about || 'About Me')}"></div>
    <div class="row"><label class="lbl">Objective</label><input class="inp" id="i18n-lbl-objective" value="${esc(labels.objective || 'Objective')}"></div>
    <div class="row"><label class="lbl">Experience</label><input class="inp" id="i18n-lbl-experience" value="${esc(labels.experience || 'Professional Experience')}"></div>
    <div class="row"><label class="lbl">Projects</label><input class="inp" id="i18n-lbl-projects" value="${esc(labels.projects || 'Featured Projects')}"></div>
    <div class="row"><label class="lbl">Skills</label><input class="inp" id="i18n-lbl-skills" value="${esc(labels.skills || 'Technical Skills')}"></div>
    <div class="row"><label class="lbl">Education</label><input class="inp" id="i18n-lbl-education" value="${esc(labels.education || 'Education')}"></div>
    <div class="row"><label class="lbl">Certifications</label><input class="inp" id="i18n-lbl-certifications" value="${esc(labels.certifications || 'Certifications & Courses')}"></div>
    <div class="row"><label class="lbl">Tech Stack</label><input class="inp" id="i18n-lbl-tech" value="${esc(labels.tech || 'Tech Stack')}"></div>
    <div class="row"><label class="lbl">Languages</label><input class="inp" id="i18n-lbl-languages" value="${esc(labels.languages || 'Languages')}"></div>
  </div>

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);margin:16px 0 8px;">💼 Experiências (EN)</h3>
  ${expHtml || '<div class="hint">Nenhuma experiência cadastrada.</div>'}

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);margin:16px 0 8px;">◈ Projetos (EN)</h3>
  ${projHtml || '<div class="hint">Nenhum projeto cadastrado.</div>'}

  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);margin:16px 0 8px;">🎓 Formação (EN)</h3>
  ${eduHtml || '<div class="hint">Nenhuma formação cadastrada.</div>'}

  <div class="sbar"><span class="smsg" id="msg-i18n"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('i18n')">💾 Salvar</button></div>`;
}

/** Mapa de funções de render por tab */
export const TAB_RENDERERS = {
  profile: tProfile,
  herostats: tHS,
  objective: tObj,
  skills: tSkills,
  languages: tLangs,
  experience: tExp,
  projects: tProjs,
  story: tStory,
  education: tEdu,
  certifications: tCerts,
  tech: tTech,
  chapters: tChapters,
  sections: tSections,
  i18n: tI18n,
  theme: tTheme,
  settings: tSettings,
};


/* ═══ LIGAÇÕES ENTRE PROJETOS ═══ */
function rLinks(pr, i) {
  const all = getData().projects || [];
  const outros = all.filter((p, j) => j !== i && p.id);
  const opts = sel => `<option value="">escolha um projeto</option>` +
    outros.map(p => `<option value="${escAttr(p.id)}" ${p.id === sel ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
  const vindas = outros.flatMap(p => (p.links || []).filter(l => l.to && l.to === pr.id).map(l => ({ de: p, why: l.why })));
  const padrao = String(pr.name || '').split(' — ')[0];
  return `<div class="links-box">
    <div class="links-h"><span>🔗 Projetos ligados</span><span class="hint">opcional: só quando um projeto usa, alimenta ou faz parte de outro</span></div>
    <div class="row"><label class="lbl">Nome curto (no mapa e nas ligações)</label><input class="inp" id="pr-sn-${i}" value="${escAttr(pr.shortName || '')}" placeholder="${escAttr(padrao)}"></div>
    ${(pr.links || []).map((l, k) => `
      <div class="link-row">
        <select class="inp" id="pr-lk-${i}-${k}" aria-label="Projeto ligado">${opts(l.to)}</select>
        <input class="inp" id="pr-lw-${i}-${k}" value="${escAttr(l.why || '')}" placeholder="Por que estão ligados? Ex.: as réguas enviam os e-mails montados aqui." aria-label="Motivo da ligação">
        <button class="btn btn-r" type="button" title="Remover ligação" onclick="window.__admin.rmLink(${i},${k})">✕</button>
      </div>`).join('')}
    <button class="btn btn-c" type="button" onclick="window.__admin.addLink(${i})">+ Ligar a outro projeto</button>
    ${vindas.length ? `<div class="links-in"><span class="lbl">Cadastradas em outros projetos (aparecem aqui também)</span>
      ${vindas.map(v => `<div class="link-in">↳ <b>${esc(v.de.shortName || v.de.name)}</b>: ${esc(v.why)}</div>`).join('')}</div>` : ''}
    <p class="hint">A ligação aparece nos dois projetos e no mapa “Como os projetos se conectam”. Não precisa cadastrar de volta.</p>
  </div>`;
}

/* ═══ HISTÓRIA: "VER COMO FOI CONSTRUÍDO" ═══ */
const catOpts = sel => Object.entries(CATEGORIAS).map(([k, l]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${l}</option>`).join('');

/** Blocos na ordem em que aparecem: [{ i, j, b }]. */
function blocosEmOrdem(steps) {
  const out = [];
  steps.forEach((st, i) => (st.blocks || []).forEach((b, j) => out.push({ i, j, b })));
  return out;
}

/** Pares ligados, cada um guardado no bloco mais novo dos dois. */
export function normalizarLigacoesDaHistoria(story) {
  const ordem = blocosEmOrdem(story.steps || []);
  const pos = Object.fromEntries(ordem.map((x, k) => [x.b.id, k]));
  const pares = new Set();
  ordem.forEach(x => (x.b.links || []).forEach(o => { if (o in pos && o !== x.b.id) pares.add([x.b.id, o].sort().join('|')); }));
  ordem.forEach(x => { x.b.links = []; });
  pares.forEach(par => {
    const [a, b] = par.split('|');
    const novo = pos[a] > pos[b] ? a : b, velho = novo === a ? b : a;
    ordem[pos[novo]].b.links.push(velho);
  });
  return story;
}

export function tStory() {
  const D = getData();
  if (!D.story) D.story = { title: '', subtitle: '', lead: '', steps: [] };
  const st = normalizarLigacoesDaHistoria(D.story);
  const ocup = {};
  blocosEmOrdem(st.steps).forEach(({ b }) => { const k = `${b.col}-${b.row}`; (ocup[k] = ocup[k] || []).push(b); });
  const linhas = Math.max(5, ...Object.keys(ocup).map(k => +k.split('-')[1]));
  const grade = [];
  for (let r = 1; r <= linhas; r++) for (let c = 1; c <= 3; c++) {
    const lista = ocup[`${c}-${r}`] || [];
    grade.push(`<div class="sg-cell ${lista.length ? 'on k-' + lista[0].cat : ''} ${lista.length > 1 ? 'conflito' : ''}" title="coluna ${c} · linha ${r}">${lista.length ? lista.map(b => esc(b.name)).join(' + ') : `<span>${c}·${r}</span>`}</div>`);
  }
  const conflitos = Object.values(ocup).filter(l => l.length > 1).length;
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;">História: ver como foi construído</h3>
    <button class="btn btn-g" type="button" onclick="window.__admin.addStep()">+ Adicionar etapa</button>
  </div>
  <div class="info-box">
    Abre quando o visitante clica em “◈ ver como foi construído” num projeto. Cada etapa conta um pedaço da história e acrescenta blocos ao diagrama. O botão aparece nos projetos escolhidos nas etapas e abre a história na etapa do projeto.
  </div>
  <div class="card">
    <div class="g2f">
      <div class="row"><label class="lbl">Título da tela</label><input class="inp" id="st-title" value="${escAttr(st.title || '')}"></div>
      <div class="row"><label class="lbl">Subtítulo</label><input class="inp" id="st-sub" value="${escAttr(st.subtitle || '')}"></div>
    </div>
    <div class="row"><label class="lbl">Texto de abertura</label><textarea class="inp" id="st-lead">${esc(st.lead || '')}</textarea></div>
    <label class="lbl" style="margin-top:12px;">Mapa de posições do diagrama (coluna · linha)</label>
    <div class="sg">${grade.join('')}</div>
    <p class="hint">${conflitos ? `<span style="color:#ff6b6b;">⚠ ${conflitos} casa(s) com mais de um bloco: um fica por cima do outro. Mude a posição de um deles.</span><br>` : ''}Cada bloco ocupa uma casa. Escolha a casa no próprio bloco, dentro da etapa em que ele nasce.</p>
  </div>
  <div id="story-list">${rStory()}</div>
  <div class="sbar"><span class="smsg" id="msg-story"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('story')">💾 Salvar</button></div>`;
}

export function rStory() {
  const D = getData();
  const steps = D.story?.steps || [];
  const projetos = (D.projects || []).filter(p => p.id);
  const ordem = blocosEmOrdem(steps);
  return steps.map((p, i) => `
  <div class="card" data-draggable="story" data-index="${i}">
    <div class="drag-handle" title="Arrastar para reordenar">⠿</div>
    <div class="card-h"><span class="card-n">etapa ${i + 1}</span><span class="card-t">${esc(p.title || 'Nova etapa')}</span>
      <select class="inp k-sel" id="sp-k-${i}" title="Cor da etapa">${catOpts(p.cat)}</select></div>
    <div class="g2f">
      <div class="row"><label class="lbl">Etiqueta</label><input class="inp" id="sp-l-${i}" value="${escAttr(p.label || '')}" placeholder="ex.: 2022 · chegada"></div>
      <div class="row"><label class="lbl">Título</label><input class="inp" id="sp-t-${i}" value="${escAttr(p.title || '')}"></div>
    </div>
    <div class="row"><label class="lbl">Texto</label><textarea class="inp" id="sp-x-${i}">${esc(p.text || '')}</textarea></div>
    <div class="g3f">
      <div class="row"><label class="lbl">Antes (opcional)</label><input class="inp" id="sp-b-${i}" value="${escAttr(p.before || '')}" placeholder="ex.: 3 h"></div>
      <div class="row"><label class="lbl">Depois</label><input class="inp" id="sp-a-${i}" value="${escAttr(p.after || '')}" placeholder="ex.: 30 min"></div>
      <div class="row"><label class="lbl">O que foi medido</label><input class="inp" id="sp-m-${i}" value="${escAttr(p.measure || '')}" placeholder="ex.: espera média"></div>
    </div>
    <div class="g2f">
      <div class="row"><label class="lbl">Projeto desta etapa</label>
        <select class="inp" id="sp-p-${i}"><option value="">nenhum</option>${projetos.map(pr => `<option value="${escAttr(pr.id)}" ${pr.id === p.project ? 'selected' : ''}>${esc(pr.name)}</option>`).join('')}</select>
        <p class="hint">Liga o botão “ver como foi construído” desse projeto a esta etapa e mostra o “ver a tela” com as fotos dele.</p></div>
      <div class="row"><label class="lbl">Trecho de código (opcional)</label><textarea class="inp code-inp" id="sp-c-${i}" placeholder="Cole um trecho curto do seu código">${esc(p.code || '')}</textarea></div>
    </div>
    <label class="lbl" style="margin-top:6px;">Blocos que aparecem nesta etapa</label>
    ${(p.blocks || []).map((b, j) => {
      const antes = ordem.filter(x => x.i < i || (x.i === i && x.j < j));
      return `
      <div class="block-row" data-block="${escAttr(b.id)}">
        <input class="inp" id="sb-n-${i}-${j}" value="${escAttr(b.name || '')}" placeholder="Nome do bloco" aria-label="Nome do bloco">
        <input class="inp" id="sb-s-${i}-${j}" value="${escAttr(b.sub || '')}" placeholder="Subtítulo" aria-label="Subtítulo do bloco">
        <select class="inp" id="sb-k-${i}-${j}" aria-label="Categoria">${catOpts(b.cat)}</select>
        <select class="inp" id="sb-p-${i}-${j}" aria-label="Casa no diagrama" onchange="window.__admin.refreshStory()">${[1, 2, 3, 4, 5, 6].flatMap(r => [1, 2, 3].map(c => `<option value="${c}-${r}" ${+b.col === c && +b.row === r ? 'selected' : ''}>coluna ${c} · linha ${r}</option>`)).join('')}</select>
        <button class="btn btn-r" type="button" title="Remover bloco" onclick="window.__admin.rmBlock(${i},${j})">✕</button>
        <div class="block-links">ligado a:
          ${antes.length ? antes.map(x => `<label class="chip"><input type="checkbox" id="sb-l-${i}-${j}-${escAttr(x.b.id)}" ${(b.links || []).includes(x.b.id) ? 'checked' : ''}> ${esc(x.b.name)}</label>`).join('') : '<span class="hint">é o primeiro bloco: não há anteriores</span>'}
        </div>
      </div>`;
    }).join('') || '<p class="hint">Nenhum bloco novo: esta etapa mostra o diagrama como está.</p>'}
    <button class="btn btn-c" type="button" style="margin-top:8px;" onclick="window.__admin.addBlock(${i})">+ Bloco</button>
    <div style="text-align:right;margin-top:10px;"><button class="btn btn-r" type="button" onclick="window.__admin.rmStep(${i})">✕ Remover etapa</button></div>
  </div>`).join('');
}
