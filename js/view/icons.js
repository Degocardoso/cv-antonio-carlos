/**
 * View — Ícones SVG inline
 *
 * Emoji depende da fonte de emoji do sistema: muda de forma entre
 * plataformas, às vezes não carrega e não herda a cor do texto.
 * Aqui todos viram SVG inline (traço em `currentColor`), sem requisição
 * de rede e sempre com a mesma aparência.
 *
 * O painel admin continua guardando emoji nos dados — `iconFromEmoji`
 * traduz para o ícone equivalente e, se não conhecer o emoji, devolve o
 * próprio caractere. Nada quebra ao cadastrar um emoji novo.
 */
import { esc } from '../utils.js';

/* Traçados em viewBox 24×24 */
const PATHS = {
  briefcase: '<rect x="2.5" y="7" width="19" height="12.5" rx="2"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/><path d="M2.5 12h19"/>',
  graduation: '<path d="M12 3.5 22 8.5l-10 5-10-5 10-5Z"/><path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"/>',
  pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  star: '<path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3Z"/>',
  chart: '<path d="M3 21h18"/><path d="M6.5 21V11"/><path d="M11.5 21V5"/><path d="M16.5 21v-6"/><path d="M21 21V9"/>',
  bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"/>',
  refresh: '<path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.4"/><path d="M3.5 12A8.5 8.5 0 0 1 18.1 6.1l2.4 2.5"/><path d="M20.5 4v4.6h-4.6"/><path d="M3.5 20v-4.6h4.6"/>',
  code: '<path d="m8.5 8-5 4 5 4"/><path d="m15.5 8 5 4-5 4"/><path d="m13.5 4-3 16"/>',
  terminal: '<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="m7 10 2.5 2L7 14"/><path d="M13 15h4.5"/>',
  database: '<ellipse cx="12" cy="6" rx="8" ry="3.2"/><path d="M4 6v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6"/><path d="M4 12v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  cloud: '<path d="M6.5 19.5a4.5 4.5 0 0 1-.4-9A6.5 6.5 0 0 1 18.4 10.5a4.5 4.5 0 0 1-.4 9Z"/>',
  cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21"/>',
  clipboard: '<rect x="4.5" y="5" width="15" height="15.5" rx="2"/><rect x="8.5" y="2.5" width="7" height="4" rx="1.5"/><path d="M8.5 11.5h7M8.5 15.5h4.5"/>',
  git: '<circle cx="6.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M6.5 8v8"/><path d="M17.5 11c0 3.6-3.4 4.4-6.4 5"/>',
  certificate: '<circle cx="12" cy="9" r="5.8"/><path d="m8.6 14.2-1.1 6.3L12 18.2l4.5 2.3-1.1-6.3"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  github: '<path d="M9 19.5c-4.5 1.4-4.5-2.3-6.3-2.8m12.6 5.3v-3.6a3.1 3.1 0 0 0-.9-2.4c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.1 1.9 5 2.2 5 2.2a4.8 4.8 0 0 0-.1 3.6A5.1 5.1 0 0 0 3.5 9.4c0 5.1 3.1 6.3 6.1 6.6a3.1 3.1 0 0 0-.9 2.4V22"/>',
  linkedin: '<rect x="2.5" y="8.5" width="4" height="12" rx="1"/><circle cx="4.5" cy="4.2" r="1.9"/><path d="M10 20.5v-12h3.6v1.7a4 4 0 0 1 3.6-1.9c2.5 0 4.3 1.6 4.3 5v7.2h-3.8v-6.8c0-1.6-.6-2.7-2-2.7-1.1 0-1.7.7-2 1.5-.1.3-.1.6-.1 1v7Z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5Z"/>',
  download: '<path d="M12 3.5v12"/><path d="m7.5 11 4.5 4.5 4.5-4.5"/><path d="M4.5 20.5h15"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M4.2 4.2 6 6M18 18l1.8 1.8M2 12h2.6M19.4 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M4.8 15.5a2 2 0 0 1-1.3-1.9V5.5a2 2 0 0 1 2-2h8.1a2 2 0 0 1 1.9 1.3"/>',
  sparkle: '<path d="M12 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  image: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="10" r="1.8"/><path d="m4 17.5 5-4.5 4 3.5 3-2.5 4 3.5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'
};

/* Emoji guardado no admin → ícone equivalente */
const FROM_EMOJI = {
  '💼': 'briefcase', '🎓': 'graduation', '📍': 'pin', '⭐': 'star', '🌟': 'star',
  '📊': 'chart', '📈': 'chart', '⚡': 'bolt', '🔄': 'refresh', '♻️': 'refresh',
  '🐘': 'code', '🐍': 'terminal', '💻': 'terminal', '🗄️': 'database', '🗃️': 'database',
  '🌐': 'globe', '📧': 'mail', '✉️': 'mail', '☁️': 'cloud', '🤖': 'cpu', '🧠': 'cpu',
  '📋': 'clipboard', '📝': 'clipboard', '🔀': 'git', '📜': 'certificate', '🏅': 'certificate',
  '🥇': 'certificate', '📱': 'phone', '🐙': 'github', '💬': 'chat', '🔗': 'globe',
  '⚙️': 'refresh', '🔧': 'refresh', '🎯': 'star', '🚀': 'bolt', '🔍': 'chart'
};

/**
 * Devolve o markup de um ícone.
 * @param {string} name  chave em PATHS
 * @param {string} cls   classes extras
 */
export function icon(name, cls = '') {
  const d = PATHS[name];
  if (!d) return '';
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
}

/**
 * Converte um emoji vindo dos dados no ícone correspondente.
 * Emoji desconhecido volta como texto, para nunca sumir da tela.
 */
export function iconFromEmoji(emoji, cls = '') {
  const key = String(emoji || '').trim();
  const name = FROM_EMOJI[key] || FROM_EMOJI[key.replace(/️/g, '')];
  return name ? icon(name, cls) : `<span class="ico-emoji">${esc(key)}</span>`;
}
