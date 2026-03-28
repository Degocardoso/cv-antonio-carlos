// api/cv-write.js — Vercel Serverless Function
const https = require('https');

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function strip(s) { return (s || '').replace(/[\r\n\t\u200b\u00a0\ufeff]/g, '').trim(); }

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const BIN_ID   = process.env.JSONBIN_BIN_ID;
  const KEY      = process.env.JSONBIN_MASTER_KEY;
  const PASSWORD = process.env.CV_ADMIN_PASSWORD;

  if (!BIN_ID || !KEY || !PASSWORD) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas.' });
  }

  const submitted = strip(req.headers['x-admin-password'] || '');
  const expected  = strip(PASSWORD);

  if (!submitted || submitted !== expected) {
    return res.status(401).json({ error: 'Senha incorreta ou não informada.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'Senha válida.' });
  }

  if (req.method === 'POST') {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Body inválido — JSON esperado.' });
    }

    try {
      const body = JSON.stringify(data);
      const result = await httpsRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'X-Master-Key': KEY,
        },
        body,
      });
      if (result.status !== 200) {
        return res.status(result.status).json({ error: `JSONBin retornou ${result.status}` });
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(502).json({ error: 'Falha ao gravar no JSONBin.', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
};
