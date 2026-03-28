/**
 * View — Admin Panel
 * Renderização de todas as tabs do painel admin
 */
import { getData, getDataSource } from '../model/state.js';
import { esc, escRaw, escAttr } from '../utils.js';

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
  { id: 'experience',     label: '💼 Experiência' },
  { id: 'projects',       label: '◈ Projetos' },
  { id: 'education',      label: '🎓 Formação' },
  { id: 'certifications', label: '★ Certs' },
  { id: 'tech',           label: '◻ Stack' },
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
  <div class="row"><label class="lbl">Tags (separadas por vírgula)</label><input class="inp" id="f-tags" value="${getData().tags.join(', ')}"></div>
  <div class="row"><div class="ck-row"><input type="checkbox" id="f-avail" ${p.available ? 'checked' : ''}><span>Badge "Disponível para oportunidades"</span></div></div>
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
  <div class="card"><div class="g3f">
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
  <div class="card"><div class="g2f" style="align-items:end;">
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
  <div class="card">
    <div class="card-h"><span class="card-n">#${i + 1}</span><span class="card-t">${esc(e.title || 'Cargo')}</span></div>
    <div class="g2f">
      <div class="row"><label class="lbl">Período</label><input class="inp" id="ex-p-${i}" value="${esc(e.period)}"></div>
      <div class="row"><label class="lbl">Cargo</label><input class="inp" id="ex-t-${i}" value="${esc(e.title)}"></div>
      <div class="row"><label class="lbl">Empresa</label><input class="inp" id="ex-c-${i}" value="${esc(e.company)}"></div>
      <div><div class="crow" style="margin-top:22px;"><label>Cor:</label>${cDots(e.color, 'window.__admin.setExpColor' + i)}</div></div>
    </div>
    <div class="row" style="margin-top:8px;"><label class="lbl">Descrição</label><textarea class="inp" id="ex-d-${i}">${esc(e.description)}</textarea></div>
    <div class="row"><label class="lbl">Destaques (um por linha)</label><textarea class="inp" id="ex-h-${i}" style="min-height:56px;">${(e.highlights || []).join('\n')}</textarea></div>
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
  <div class="card">
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
    <div style="margin-top:14px;">
      <label class="lbl">📷 Fotos do Projeto (hospedadas no Cloudinary)</label>
      <div class="ithumb-wrap" id="ith-${i}">${(pr.images || []).map((url, j) => `<div class="ithumb"><img src="${escAttr(url)}" alt=""><button class="ithumb-del" onclick="window.__admin.rmImg(${i},${j})">✕</button></div>`).join('')}</div>
      <div id="upload-status-${i}"></div>
      <div class="izone"><label for="if-${i}">📁 Clique para enviar imagens (JPG, PNG — máx. 5MB cada)</label><input type="file" id="if-${i}" accept="image/*" multiple style="display:none;" onchange="window.__admin.handleImgs(${i},this)"></div>
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
  <div class="card">
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
  <div class="card">
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
  <div class="card" style="padding:10px;">
    <div class="row"><label class="lbl">Emoji</label><input class="inp" id="tc-e-${i}" value="${esc(t.emoji)}" style="font-size:18px;text-align:center;"></div>
    <div class="row" style="margin-bottom:8px;"><label class="lbl">Label</label><input class="inp" id="tc-l-${i}" value="${esc(t.label)}"></div>
    <button class="btn btn-r" style="width:100%;font-size:10px;padding:5px;" onclick="window.__admin.rmTech(${i})">✕</button>
  </div>`).join('');
}

export function tTheme() {
  const th = getData().theme || {};
  const tc = th.textColor || '#c9d1d9', td = th.textDim || '#6e7f95', tb = th.textBright || '#e6edf3';
  return `
  <h3 style="font-family:var(--mono);font-size:11px;color:var(--td);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Customização de Cor de Texto</h3>
  <div class="hint" style="margin-bottom:20px;">Apenas cores de texto são ajustáveis.</div>
  ${[['th-tc','th-th','th-prev','--t (texto principal)','#c9d1d9', tc],
     ['th-dc','th-dh','th-dprev','--td (texto suave)','#6e7f95', td],
     ['th-bc','th-bh','th-bprev','--tb (títulos)','#e6edf3', tb]].map(([cid, hid, pid, lbl, def, val]) => `
  <div class="card" style="margin-bottom:16px;">
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:12px;">${lbl} — padrão: <code style="color:var(--neon)">${def}</code></div>
    <div class="color-row">
      <span class="color-lbl">Cor</span>
      <input type="color" id="${cid}" value="${val}" oninput="window.__admin.syncH('${cid}','${hid}','${pid}')">
      <input type="text" class="hex-inp" id="${hid}" value="${val}" maxlength="7" placeholder="${def}" oninput="window.__admin.syncC('${hid}','${cid}','${pid}')">
      <div class="color-swatch" id="${pid}" style="background:${val};"></div>
    </div>
  </div>`).join('')}
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
    <button class="btn btn-c" onclick="window.__admin.prevTheme()">👁 Preview</button>
    <button class="btn btn-r" onclick="window.__admin.rstTheme()">↺ Resetar</button>
  </div>
  <div class="sbar"><span class="smsg" id="msg-th"></span><button class="btn btn-g btn-big" onclick="window.__admin.saveTab('theme')">💾 Salvar Cores</button></div>`;
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
    <div style="font-family:var(--mono);font-size:11px;color:var(--neon2);margin-bottom:10px;">🔄 Sincronização</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:8px;">
      <button class="btn btn-c" onclick="window.__admin.reloadFromCloud()">↺ Recarregar do JSONBin</button>
      <span class="smsg" id="msg-push" style="margin-left:4px;"></span>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--td);margin-top:8px;">
      Dados atuais: <span style="color:var(--neon);font-weight:600;">${getDataSource() === 'cloud' ? 'JSONBin ✓' : 'DEFAULTS ⚠'}</span>
    </div>
  </div>

  <div style="margin-top:36px;padding-top:24px;border-top:1px solid var(--border);">
    <div style="font-family:var(--mono);font-size:11px;color:#ff6b6b;font-weight:600;margin-bottom:8px;">⚠ Zona de Perigo</div>
    <button class="btn btn-r" onclick="window.__admin.resetAll()">⚠ Resetar para padrão</button>
  </div>`;
}

/** Mapa de funções de render por tab */
export const TAB_RENDERERS = {
  profile: tProfile,
  herostats: tHS,
  objective: tObj,
  skills: tSkills,
  experience: tExp,
  projects: tProjs,
  education: tEdu,
  certifications: tCerts,
  tech: tTech,
  theme: tTheme,
  settings: tSettings,
};
