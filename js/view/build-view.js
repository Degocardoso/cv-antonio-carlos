/**
 * View — "Ver como foi construído"
 *
 * Conta a história de um sistema como a montagem de um diagrama: cada etapa
 * acrescenta blocos e ligações. Tudo vem de `D.story`, editado no admin
 * (aba 🧩 História):
 *
 *   story: {
 *     title, subtitle, lead,
 *     steps: [{ label, cat, title, text, before, after, measure, project, code,
 *               blocks: [{ id, name, sub, cat, col, row, links: [idDeOutroBloco] }] }]
 *   }
 *
 * Não fica no fluxo da página: abre numa sobreposição própria (#caseOv)
 * quando o visitante clica em "ver como foi construído" num projeto. O botão
 * aparece nos projetos escolhidos em alguma etapa (`project` = id do projeto)
 * e abre a história já nessa etapa. "Ver a tela" usa a galeria do projeto.
 *
 * Ligações entre blocos valem nos dois sentidos e aparecem na etapa em que o
 * mais novo dos dois blocos nasce. A etapa ativa é a que está no meio da tela
 * (IntersectionObserver); as setas e os blocos também navegam.
 */

export const CATEGORIAS = { crm: 'CRM', atend: 'Atendimento', auto: 'Automação', dados: 'Dados' };
const COR = { crm: 'var(--neon2)', atend: 'var(--neon4)', auto: 'var(--neon3)', dados: 'var(--neon)' };
const COLUNA_X = { 1: 112, 2: 320, 3: 528 };
const linhaY = r => 70 + (r - 1) * 115;
const W = 168, H = 50, NS = 'http://www.w3.org/2000/svg';

let passos = [], nos = {}, arestas = [], passoDe = {};
let atual = -1, io = null, montado = false, voltarPara = null;

function esc(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/** Realce simples para o trecho de código: comentários, textos entre aspas e chamadas. */
function realca(code) {
  return esc(code).split('\n').map(linha => {
    const i = linha.indexOf('//');
    const corpo = i >= 0 ? linha.slice(0, i) : linha;
    const coment = i >= 0 ? `<span class="bc-c">${linha.slice(i)}</span>` : '';
    return corpo
      .replace(/(&#39;|')([^']*?)\1|"([^"]*?)"/g, m => `<span class="bc-s">${m}</span>`)
      .replace(/([A-Za-z_]\w*)(?=\()/g, '<span class="bc-f">$1</span>') + coment;
  }).join('\n');
}

/** Etapa em que um projeto aparece pela primeira vez (-1 se não está na história). */
export function casoDoProjeto(id) {
  if (!id) return -1;
  return passos.findIndex(p => p.project === id);
}

/** Lê a história dos dados e monta cartões e diagrama (a cada render). */
export function renderBuild(D) {
  const st = D.story || {};
  passos = Array.isArray(st.steps) ? st.steps : [];
  const passosEl = document.getElementById('buildSteps');
  const svg = document.getElementById('buildSvg');
  if (!passosEl || !svg) return;

  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt || ''; };
  set('caseName', st.title);
  set('caseSub', st.subtitle);
  set('caseLead', st.lead);

  // blocos e ligações
  nos = {}; passoDe = {}; arestas = [];
  passos.forEach((p, i) => (p.blocks || []).forEach(b => {
    if (!b.id || nos[b.id]) return;
    nos[b.id] = { ...b, x: COLUNA_X[b.col] || COLUNA_X[2], y: linhaY(Math.max(1, +b.row || 1)) };
    passoDe[b.id] = i;
  }));
  const vistas = new Set();
  Object.values(nos).forEach(b => (b.links || []).forEach(o => {
    if (!nos[o] || o === b.id) return;
    const k = [b.id, o].sort().join('|');
    if (vistas.has(k)) return;
    vistas.add(k);
    arestas.push({ a: b.id, b: o, passo: Math.max(passoDe[b.id], passoDe[o]) });
  }));

  const projetos = D.projects || [];
  const ultimo = passos.length - 1;
  passosEl.innerHTML = passos.map((p, i) => {
    const cor = COR[p.cat] || COR.crm;
    const idx = p.project ? projetos.findIndex(pr => pr.id === p.project) : -1;
    const temTela = idx >= 0 && (projetos[idx].images || []).length;
    const temDiff = p.before || p.after;
    return `<article class="bstep" data-i="${i}" id="build-${i}" style="--c:${cor}">
      <div class="bcard">
        ${p.label ? `<p class="bcap"><i></i>${esc(p.label)}</p>` : ''}
        <h3 class="btitle">${esc(p.title)}</h3>
        ${p.text ? `<p class="btext">${esc(p.text)}</p>` : ''}
        ${temDiff ? `<div class="bdiff"><div><small>antes</small><b>${esc(p.before || '—')}</b></div><div><small>depois${p.measure ? ' · ' + esc(p.measure) : ''}</small><b>${esc(p.after || '—')}</b></div></div>` : ''}
        ${p.code ? `<pre class="bcode">${realca(p.code)}</pre>` : ''}
        <div class="bactions">
          ${temTela ? `<button type="button" class="bver" data-gallery="${idx}" data-gallery-start="0">ver a tela</button>` : ''}
          ${i === ultimo ? `<a class="bver bfim" href="#ch-contact" data-case-close>vamos conversar</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');

  // diagrama: altura conforme a última linha usada
  const linhas = Math.max(1, ...Object.values(nos).map(b => +b.row || 1));
  svg.setAttribute('viewBox', `0 0 640 ${linhaY(linhas) + 60}`);
  svg.innerHTML = '';
  const el = (tag, at, pai) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); (pai || svg).appendChild(e); return e; };
  arestas.forEach(a => {
    const A = nos[a.a], B = nos[a.b], mx = (A.x + B.x) / 2;
    const d = (A.x === B.x || A.y === B.y) ? `M${A.x} ${A.y} L${B.x} ${B.y}` : `M${A.x} ${A.y} C${mx} ${A.y} ${mx} ${B.y} ${B.x} ${B.y}`;
    a.el = el('path', { d, class: 'bedge off' });
  });
  Object.values(nos).forEach(n => {
    const g = el('g', { class: 'bnode off', tabindex: '0', role: 'button', 'aria-label': `${n.name}: ir à etapa` });
    g.style.setProperty('--c', COR[n.cat] || COR.crm);
    el('rect', { x: n.x - W / 2, y: n.y - H / 2, width: W, height: H, rx: 12, class: 'bn-box' }, g);
    el('rect', { x: n.x - W / 2 + 11, y: n.y - 7, width: 4, height: 14, rx: 2, class: 'bn-pin' }, g);
    el('text', { x: n.x - W / 2 + 24, y: n.y - 2, class: 'bn-t' }, g).textContent = n.name || '';
    el('text', { x: n.x - W / 2 + 24, y: n.y + 14, class: 'bn-s' }, g).textContent = n.sub || '';
    g.addEventListener('click', () => vaiPara(passoDe[n.id]));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vaiPara(passoDe[n.id]); } });
    n.el = g;
  });

  if (!montado) {
    montado = true;
    document.getElementById('buildPrev')?.addEventListener('click', () => vaiPara(Math.max(0, atual - 1)));
    document.getElementById('buildNext')?.addEventListener('click', () => vaiPara(Math.min(passos.length - 1, atual + 1)));
    document.getElementById('caseClose')?.addEventListener('click', () => fecharCaso());
    document.addEventListener('click', e => {
      const abre = e.target.closest('[data-case]');
      if (abre) { abrirCaso(+abre.dataset.case); return; }
      if (e.target.closest('[data-case-close]')) fecharCaso(false);
    });
    // Em captura: roda antes do Esc da galeria, então com a galeria aberta
    // só ela fecha; a história fica para o próximo Esc.
    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lb');
      if (e.key === 'Escape' && casoAberto() && (!lb || lb.hidden)) fecharCaso();
    }, true);
  }
  io?.disconnect();
  const celular = matchMedia('(max-width: 900px)').matches;
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) mostra(+e.target.dataset.i); }),
    { root: document.getElementById('caseOv'), rootMargin: celular ? '-62% 0px -28% 0px' : '-45% 0px -45% 0px' });
  passosEl.querySelectorAll('.bstep').forEach(s => io.observe(s));
  atual = -1;
  if (passos.length) mostra(0);
}

function mostra(i) {
  if (i === atual || !passos.length) return;
  atual = i;
  const ultimo = i === passos.length - 1;
  Object.values(nos).forEach(n => {
    if (!n.el) return;
    n.el.classList.toggle('off', !(passoDe[n.id] <= i || ultimo));
    n.el.classList.toggle('new', passoDe[n.id] === i);
  });
  arestas.forEach(a => { a.el.classList.toggle('off', a.passo > i && !ultimo); a.el.classList.toggle('new', a.passo === i); });
  document.querySelectorAll('.bstep').forEach(s => s.classList.toggle('is-active', +s.dataset.i === i));
  const c = document.getElementById('buildCount'); if (c) c.textContent = `${i + 1} / ${passos.length}`;
  const l = document.getElementById('buildLabel'); if (l) l.textContent = ultimo ? 'o sistema hoje' : 'o sistema até aqui';
  const p = document.getElementById('buildPrev'), n = document.getElementById('buildNext');
  if (p) p.disabled = i === 0;
  if (n) n.disabled = ultimo;
}

function vaiPara(i) {
  const alvo = document.getElementById('build-' + i);
  if (!alvo) return;
  alvo.scrollIntoView({ block: matchMedia('(max-width: 900px)').matches ? 'start' : 'center' });
  mostra(i);
}

function casoAberto() {
  const ov = document.getElementById('caseOv');
  return ov && !ov.hidden;
}

/** Abre a história já na etapa pedida. */
export function abrirCaso(i) {
  const ov = document.getElementById('caseOv');
  if (!ov || !passos.length) return;
  voltarPara = document.activeElement;
  ov.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    ov.classList.add('is-open');
    atual = -1;
    if (i > 0) vaiPara(i); else { ov.scrollTop = 0; mostra(0); }
    document.getElementById('caseClose')?.focus({ preventScroll: true });
  });
}

function fecharCaso(devolverFoco = true) {
  const ov = document.getElementById('caseOv');
  if (!ov || ov.hidden) return;
  ov.classList.remove('is-open');
  ov.hidden = true;
  document.body.style.overflow = '';
  if (devolverFoco) voltarPara?.focus?.({ preventScroll: true });
}
