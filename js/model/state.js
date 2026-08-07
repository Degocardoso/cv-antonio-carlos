/**
 * Model — State Management
 * Gerencia o estado da aplicação, merge com cloud, e tema
 */
import { DEFAULTS } from './defaults.js';

/** Estado global da aplicação */
let D = JSON.parse(JSON.stringify(DEFAULTS));
let dataSource = 'defaults'; // 'cloud' | 'defaults'

/** Retorna o estado atual */
export function getData() { return D; }

/** Atualiza o estado */
export function setData(newData) { D = newData; }

/** Retorna a fonte dos dados */
export function getDataSource() { return dataSource; }

/** Define a fonte dos dados */
export function setDataSource(src) { dataSource = src; }

/**
 * Orçamento de bytes para o registro enviado ao JSONBin.
 * O plano free corta em ~100 KB; 80 KB deixa folga para o CV crescer.
 */
export const RECORD_BUDGET = 80 * 1024;

/** Backups mantidos no registro (cada um é uma cópia completa do CV). */
export const MAX_BACKUPS = 3;

/** Tamanho em BYTES (acentos ocupam 2 — `.length` mediria caracteres). */
export function recordBytes(data = D) {
  return new TextEncoder().encode(JSON.stringify(data)).length;
}

/**
 * Cada backup é uma cópia completa do CV guardada dentro do próprio
 * registro, então o payload cresce ~(1 + N) vezes. Poda os backups mais
 * antigos até caber no orçamento — sem isso o registro incha a cada save
 * até o JSONBin recusar a gravação.
 * @returns {{bytes:number, dropped:number, ok:boolean}}
 */
export function pruneBackupsToFit(budget = RECORD_BUDGET, maxCount = MAX_BACKUPS) {
  if (!Array.isArray(D.backups)) D.backups = [];
  let dropped = 0;

  // Teto de quantidade primeiro — vale para qualquer caminho de save,
  // inclusive registros antigos que chegaram da nuvem com 10 backups.
  if (D.backups.length > maxCount) {
    dropped += D.backups.length - maxCount;
    D.backups = D.backups.slice(0, maxCount);
  }

  // Depois o teto de bytes, caso o próprio CV já seja grande.
  // `unshift` põe o mais novo no início: `pop` remove sempre o mais antigo.
  let bytes = recordBytes();
  while (bytes > budget && D.backups.length) {
    D.backups.pop();
    dropped++;
    bytes = recordBytes();
  }
  return { bytes, dropped, ok: bytes <= budget };
}

/** Reseta para os padrões */
export function resetToDefaults() {
  D = JSON.parse(JSON.stringify(DEFAULTS));
}

/**
 * Merge: JSONBin é a ÚNICA fonte da verdade.
 * DEFAULTS só preenchem chaves completamente ausentes.
 */
export function mergeFromCloud(record) {
  const result = JSON.parse(JSON.stringify(record));

  for (const k of Object.keys(DEFAULTS)) {
    if (result[k] === null || result[k] === undefined) {
      result[k] = JSON.parse(JSON.stringify(DEFAULTS[k]));
    } else if (
      typeof DEFAULTS[k] === 'object' && !Array.isArray(DEFAULTS[k]) &&
      typeof result[k]   === 'object' && !Array.isArray(result[k])
    ) {
      for (const sk of Object.keys(DEFAULTS[k])) {
        if (result[k][sk] === null || result[k][sk] === undefined) {
          result[k][sk] = JSON.parse(JSON.stringify(DEFAULTS[k][sk]));
        }
      }
      // Deep merge nested objects like i18n.en
      if (k === 'i18n' && DEFAULTS[k].en && result[k].en) {
        for (const sk2 of Object.keys(DEFAULTS[k].en)) {
          if (result[k].en[sk2] === null || result[k].en[sk2] === undefined) {
            result[k].en[sk2] = DEFAULTS[k].en[sk2];
          }
        }
      }
    }
  }
  return result;
}

/** Aplica tipografia customizada */
export function applyTypography() {
  const typo = D.theme?.typography || {};
  const r = document.documentElement;
  const map = {
    fsHero: '--fs-hero',
    fsSectionTitle: '--fs-section-title',
    fsBody: '--fs-body',
    fsDescription: '--fs-description',
    fsLabel: '--fs-label',
    fsSmall: '--fs-small',
    fsTiny: '--fs-tiny',
    fsItemTitle: '--fs-item-title'
  };
  for (const [key, cssVar] of Object.entries(map)) {
    const val = typo[key];
    if (val && val.trim()) r.style.setProperty(cssVar, val.trim());
    else r.style.removeProperty(cssVar);
  }
  if (typo.fontFamily && typo.fontFamily.trim()) {
    r.style.setProperty('--mono', typo.fontFamily.trim());
  } else {
    r.style.removeProperty('--mono');
  }
}

/** Aplica o tema customizado */
export function applyTheme() {
  const th = D.theme || {};
  const r = document.documentElement;
  const isLight = r.classList.contains('light');
  const mode = isLight ? 'light' : 'dark';
  const colors = th[mode] || {};
  // Fallback to legacy flat fields for backward compatibility
  const tc = colors.textColor || (!th.dark && !th.light ? th.textColor : '');
  const td = colors.textDim || (!th.dark && !th.light ? th.textDim : '');
  const tb = colors.textBright || (!th.dark && !th.light ? th.textBright : '');
  if (tc) r.style.setProperty('--t', tc);
  else r.style.removeProperty('--t');
  if (td) r.style.setProperty('--td', td);
  else r.style.removeProperty('--td');
  if (tb) r.style.setProperty('--tb', tb);
  else r.style.removeProperty('--tb');
}
