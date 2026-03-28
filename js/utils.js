/**
 * Utilitários compartilhados
 */

/** Escapa HTML para prevenção de XSS */
export function esc(s) {
  const d = document.createElement('div');
  d.textContent = String(s || '');
  return d.innerHTML;
}

/** Escapa para uso em atributos HTML */
export function escAttr(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapa para innerHTML de textarea */
export function escRaw(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Mapeia cor para classe CSS */
const CC = { g: 'g', c: 'c', o: 'o', p: 'p', green: 'g', cyan: 'c', orange: 'o', purple: 'p' };
export function cc(v) { return CC[v] || 'g'; }

/** Copia texto para clipboard e mostra toast */
export function copyEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    const t = document.getElementById('copyToast');
    if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }
  });
}
