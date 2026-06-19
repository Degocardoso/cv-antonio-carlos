/**
 * Controller — API Communication
 * Gerencia chamadas às serverless functions
 */
import { getData, setData, setDataSource, mergeFromCloud } from '../model/state.js';

/** Detecta base URL das functions (Netlify ou Vercel) */
function getFunctionsBase() {
  // Vercel usa /api/, Netlify usa /.netlify/functions/
  // Tenta detectar pelo hostname ou fallback para Netlify
  if (document.querySelector('meta[name="api-base"]')) {
    return document.querySelector('meta[name="api-base"]').content;
  }
  return '/.netlify/functions';
}

const BASE = getFunctionsBase();
export const CV_READ_URL   = `${BASE}/cv-read`;
export const CV_WRITE_URL  = `${BASE}/cv-write`;
export const CV_UPLOAD_URL = `${BASE}/cv-upload`;

/**
 * Carrega dados do JSONBin via serverless function
 * @returns {boolean} true se carregou com sucesso
 */
export async function loadFromCloud() {
  setDataSource('defaults');
  try {
    const res = await fetch(CV_READ_URL, { cache: 'no-cache' });
    if (res.ok) {
      const record = await res.json();
      if (record && !record.error && Object.keys(record).length > 0) {
        setData(mergeFromCloud(record));
        setDataSource('cloud');
        return true;
      }
    }
  } catch (e) {
    console.error('Falha ao carregar do cloud:', e.message);
  }
  return false;
}

/**
 * Salva dados no JSONBin via serverless function
 * @param {string} password - Senha da sessão
 * @returns {{ ok: boolean, status?: number }}
 */
export async function saveToCloud(password) {
  const D = getData();
  try {
    const res = await fetch(CV_WRITE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Admin-Password': password },
      body: JSON.stringify(D)
    });
    let error, hint;
    if (!res.ok) {
      try { const j = await res.json(); error = j.error; hint = j.hint; } catch (_) { /* sem corpo JSON */ }
    }
    return { ok: res.ok, status: res.status, error, hint };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

/**
 * Valida senha no servidor
 * @param {string} password
 * @returns {boolean}
 */
export async function validatePassword(password) {
  try {
    const res = await fetch(CV_WRITE_URL, {
      method: 'GET',
      headers: { 'X-Admin-Password': password }
    });
    return res.ok;
  } catch (e) {
    throw new Error('Erro de conexão: ' + e.message);
  }
}

/**
 * Upload de imagem para Cloudinary via serverless function
 * @param {string} base64 - Imagem em base64
 * @param {number} projectIndex
 * @param {string} password
 * @returns {{ ok: boolean, url?: string, status?: number, error?: string }}
 */
export async function uploadImage(base64, projectIndex, password) {
  try {
    const res = await fetch(CV_UPLOAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ file: base64, projectIndex, password })
    });
    // A resposta pode não ser JSON (ex.: proxy retorna "Request Entity Too Large")
    const raw = await res.text();
    let result;
    try {
      result = raw ? JSON.parse(raw) : {};
    } catch (_) {
      const msg = res.status === 413
        ? 'Imagem grande demais para o servidor. Tente uma foto menor.'
        : `Resposta inválida do servidor (HTTP ${res.status}).`;
      return { ok: false, status: res.status, error: msg };
    }
    if (res.ok && result.url) {
      return { ok: true, url: result.url };
    }
    return { ok: false, status: res.status, error: result.error, hint: result.hint };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}
