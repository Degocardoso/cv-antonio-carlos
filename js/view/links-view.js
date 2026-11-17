/**
 * View — Ligações entre projetos
 *
 * Cada projeto pode apontar para outros (`links: [{ to: id, why }]`, editado
 * no admin). A ligação vale nos dois sentidos: basta cadastrar em um dos
 * projetos. Aparece em dois lugares:
 *   · no cartão do projeto, como "ligado a" (até 3, o resto no mapa);
 *   · no mapa (#mapOv), com todos os projetos que têm alguma ligação.
 * Projeto sem ligação não aparece no mapa nem ganha o bloco no cartão.
 * Os ids e as ligações são editados no admin (aba ◈ Projetos).
 */
import { casoDoProjeto } from './build-view.js';

const NS = 'http://www.w3.org/2000/svg';
const VISIVEIS_NO_CARTAO = 3;
let dados = null, selecionado = null, montado = false, voltarPara = null;

function esc(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
const curto = p => p.shortName || String(p.name || '').split(' — ')[0];

/** Pares únicos { a, b, why } a partir dos links cadastrados (nos dois sentidos). */
function pares(projetos) {
  const ids = new Set(projetos.map(p => p.id));
  const vistos = new Map();
  projetos.forEach(p => (p.links || []).forEach(l => {
    if (!l.to || l.to === p.id || !ids.has(l.to)) return;
    const k = [p.id, l.to].sort().join('|');
    if (!vistos.has(k)) vistos.set(k, { a: p.id, b: l.to, why: l.why || '' });
  }));
  return [...vistos.values()];
}

/** Ligações de um projeto: [{ projeto, why }], o hub (mais ligações) por último. */
export function ligacoesDe(D, id) {
  const projetos = D.projects || [];
  const porId = Object.fromEntries(projetos.map(p => [p.id, p]));
  const grau = {};
  pares(projetos).forEach(x => { grau[x.a] = (grau[x.a] || 0) + 1; grau[x.b] = (grau[x.b] || 0) + 1; });
  return pares(projetos)
    .filter(x => x.a === id || x.b === id)
    .map(x => ({ projeto: porId[x.a === id ? x.b : x.a], why: x.why }))
    .sort((m, n) => (grau[m.projeto.id] || 0) - (grau[n.projeto.id] || 0));
}

/** Bloco "ligado a" do cartão do projeto ('' se não tem ligação). */
export function blocoLigacoes(D, pr) {
  if (!pr.id) return '';
  const lig = ligacoesDe(D, pr.id);
  if (!lig.length) return '';
  // Vários projetos pelo mesmo motivo (ex.: os módulos de uma plataforma) viram uma linha só.
  const grupos = [];
  lig.forEach(l => { const g = grupos.find(x => x.why === l.why); g ? g.itens.push(l) : grupos.push({ why: l.why, itens: [l] }); });
  const linhas = grupos.map(g => g.itens.length >= 3
    ? { nome: g.itens.slice(0, 2).map(l => curto(l.projeto)).join(', ') + ` e mais ${g.itens.length - 2}`, why: g.why, to: '', k: 'var(--neon2)' }
    : g.itens.map(l => ({ nome: curto(l.projeto), why: l.why, to: l.projeto.id, k: cor(l.projeto) }))).flat();
  const vis = linhas.slice(0, VISIVEIS_NO_CARTAO);
  const resto = linhas.length - vis.length;
  return `<div class="wlinks">
    <p class="wlinks-h">ligado a</p>
    ${vis.map(l => `<button type="button" class="wlink" data-map="${esc(pr.id)}" data-map-to="${esc(l.to)}" style="--k:${l.k}">
        <span class="wlink-n">${esc(l.nome)}</span><span class="wlink-w">${esc(l.why)}</span></button>`).join('')}
    ${resto > 0 ? `<button type="button" class="wlink wlink-mais" data-map="${esc(pr.id)}">+ ${resto} no mapa de conexões</button>` : ''}
  </div>`;
}

function cor(p) { return { c: 'var(--neon2)', o: 'var(--neon3)', p: 'var(--neon4)' }[p.color] || 'var(--neon)'; }

/** Monta o mapa (chamado a cada render). */
export function renderMapa(D) {
  dados = D;
  const svg = document.getElementById('mapSvg');
  if (!svg) return;
  const projetos = (D.projects || []).filter(p => p.id);
  const ps = pares(projetos);
  const grau = {};
  ps.forEach(x => { grau[x.a] = (grau[x.a] || 0) + 1; grau[x.b] = (grau[x.b] || 0) + 1; });
  const nos = projetos.filter(p => grau[p.id]);
  document.getElementById('openMap')?.toggleAttribute('hidden', !nos.length);
  svg.innerHTML = '';
  if (!nos.length) return;

  // Layout: o projeto com mais ligações (se tiver 4+) no centro; os demais em círculo.
  const W = 760, H = 560, cx = W / 2, cy = H / 2, R = 215;
  const hub = [...nos].sort((a, b) => grau[b.id] - grau[a.id])[0];
  const centro = grau[hub.id] >= 4 ? hub : null;
  // Ordem no círculo: quem se liga fica lado a lado (menos linhas cruzando).
  const resto = nos.filter(p => p !== centro);
  const viz = {}; resto.forEach(p => { viz[p.id] = []; });
  ps.forEach(x => { if (viz[x.a] && viz[x.b]) { viz[x.a].push(x.b); viz[x.b].push(x.a); } });
  const usados = new Set(), grupos = [];
  resto.forEach(p => {
    if (usados.has(p.id)) return;
    const comp = []; const pilha = [p.id];
    while (pilha.length) { const v = pilha.pop(); if (usados.has(v)) continue; usados.add(v); comp.push(v); viz[v].forEach(w => pilha.push(w)); }
    // dentro do grupo, começa pela ponta (menos vizinhos) e anda pelos vizinhos
    const ini = comp.sort((a, b) => viz[a].length - viz[b].length)[0];
    const ordem = [], fila = [ini], vis2 = new Set([ini]);
    while (fila.length) { const v = fila.shift(); ordem.push(v); viz[v].forEach(w => { if (!vis2.has(w)) { vis2.add(w); fila.push(w); } }); }
    grupos.push(ordem);
  });
  grupos.sort((a, b) => b.length - a.length);
  const porId = Object.fromEntries(nos.map(p => [p.id, p]));
  const roda = grupos.flat().map(id => porId[id]);
  const pos = {};
  if (centro) pos[centro.id] = { x: cx, y: cy };
  roda.forEach((p, i) => {
    const ang = -Math.PI / 2 + (i / roda.length) * Math.PI * 2;
    pos[p.id] = { x: cx + Math.cos(ang) * R * 1.32, y: cy + Math.sin(ang) * R };
  });

  const el = (tag, at, pai) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); (pai || svg).appendChild(e); return e; };
  const gArestas = el('g', {});
  ps.forEach(x => {
    const A = pos[x.a], B = pos[x.b];
    const mx = (A.x + B.x) / 2 + (cy - (A.y + B.y) / 2) * .12, my = (A.y + B.y) / 2 + ((A.x + B.x) / 2 - cx) * .12;
    const doHub = centro && (x.a === centro.id || x.b === centro.id);
    const p = el('path', { d: `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`, class: 'mlink' + (doHub ? ' hub' : '') }, gArestas);
    p.dataset.a = x.a; p.dataset.b = x.b;
  });
  nos.forEach(p => {
    const { x, y } = pos[p.id], txt = curto(p), w = Math.max(96, txt.length * 7.6 + 34), h = 38;
    const g = el('g', { class: 'mnode' + (p === centro ? ' center' : ''), tabindex: '0', role: 'button', 'aria-label': `${txt}: ver ligações` });
    g.dataset.id = p.id; g.style.setProperty('--c', cor(p));
    el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 19, class: 'mn-box' }, g);
    el('circle', { cx: x - w / 2 + 16, cy: y, r: 4, class: 'mn-dot' }, g);
    el('text', { x: x - w / 2 + 28, y: y + 4.5, class: 'mn-t' }, g).textContent = txt;
    g.addEventListener('click', () => seleciona(p.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seleciona(p.id); } });
    g.addEventListener('mouseenter', () => destaca(p.id));
    g.addEventListener('mouseleave', () => destaca(selecionado));
  });

  if (!montado) {
    montado = true;
    document.getElementById('mapClose')?.addEventListener('click', fechaMapa);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-map]');
      if (b) abreMapa(b.dataset.map, b.dataset.mapTo);
      const s = e.target.closest('[data-map-sel]');
      if (s) seleciona(s.dataset.mapSel);
    });
    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lb'), ov = document.getElementById('mapOv');
      if (e.key === 'Escape' && ov && !ov.hidden && (!lb || lb.hidden)) fechaMapa();
    }, true);
  }
  seleciona(selecionado && pos[selecionado] ? selecionado : (centro || nos[0]).id);
}

function destaca(id, par) {
  const svg = document.getElementById('mapSvg'); if (!svg) return;
  const viz = new Set([id]);
  svg.querySelectorAll('.mlink').forEach(l => {
    const liga = l.dataset.a === id || l.dataset.b === id;
    if (liga) { viz.add(l.dataset.a); viz.add(l.dataset.b); }
    const foco = par && ((l.dataset.a === id && l.dataset.b === par) || (l.dataset.b === id && l.dataset.a === par));
    l.classList.toggle('on', liga); l.classList.toggle('foco', !!foco);
  });
  svg.querySelectorAll('.mnode').forEach(n => {
    n.classList.toggle('dim', !!id && !viz.has(n.dataset.id));
    n.classList.toggle('sel', n.dataset.id === id);
  });
}

function seleciona(id, par) {
  selecionado = id;
  destaca(id, par);
  const D = dados, projetos = D.projects || [];
  const idx = projetos.findIndex(p => p.id === id), p = projetos[idx];
  const painel = document.getElementById('mapDetail');
  if (!p || !painel) return;
  const lig = ligacoesDe(D, id);
  const caso = casoDoProjeto(p.id);
  painel.style.setProperty('--c', cor(p));
  painel.innerHTML = `
    <p class="md-k">${lig.length} ${lig.length === 1 ? 'ligação' : 'ligações'}</p>
    <h3 class="md-t">${esc(p.name)}</h3>
    ${p.result ? `<p class="md-r">${esc(p.result)}</p>` : ''}
    <ul class="md-list">${lig.map(l => `<li class="${l.projeto.id === par ? 'foco' : ''}"><button type="button" data-map-sel="${esc(l.projeto.id)}">${esc(curto(l.projeto))}</button><span>${esc(l.why)}</span></li>`).join('')}</ul>
    <div class="md-acts">
      ${(p.images || []).length ? `<button type="button" class="bver" data-gallery="${idx}" data-gallery-start="0">ver a tela</button>` : ''}
      ${caso >= 0 ? `<button type="button" class="bver" data-case="${caso}" data-map-close>◈ ver como foi construído</button>` : ''}
    </div>`;
}

export function abreMapa(id, par) {
  const ov = document.getElementById('mapOv'); if (!ov) return;
  voltarPara = document.activeElement;
  ov.hidden = false; document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { ov.classList.add('is-open'); if (id) seleciona(id, par); document.getElementById('mapClose')?.focus({ preventScroll: true }); });
}

function fechaMapa() {
  const ov = document.getElementById('mapOv'); if (!ov || ov.hidden) return;
  ov.classList.remove('is-open'); ov.hidden = true; document.body.style.overflow = '';
  voltarPara?.focus?.({ preventScroll: true });
}

// "ver como foi construído" dentro do mapa: fecha o mapa antes de abrir a história.
document.addEventListener('click', e => { if (e.target.closest('[data-map-close]')) fechaMapa(); }, true);
