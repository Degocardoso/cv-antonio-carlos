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

/** Aplica o tema customizado */
export function applyTheme() {
  const th = D.theme || {};
  const r = document.documentElement;
  if (th.textColor)  r.style.setProperty('--t', th.textColor);
  if (th.textDim)    r.style.setProperty('--td', th.textDim);
  if (th.textBright) r.style.setProperty('--tb', th.textBright);
}
