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

/**
 * Comprime/redimensiona uma imagem no navegador antes do upload.
 * Evita estourar o limite de corpo das serverless functions (erro 413)
 * e acelera o envio. Retorna um Data URL (base64) em JPEG.
 * @param {File} file
 * @param {number} maxDim  maior dimensão permitida (px)
 * @param {number} quality qualidade JPEG (0–1)
 * @returns {Promise<string>}
 */
export function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fundo branco para imagens com transparência (PNG → JPEG)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
