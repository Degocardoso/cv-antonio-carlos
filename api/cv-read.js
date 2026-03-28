// api/cv-read.js — Vercel Serverless Function
// Lê dados do JSONBin (mesma lógica do Netlify, adaptada para Vercel)
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY    = process.env.JSONBIN_MASTER_KEY;

  if (!BIN_ID || !KEY) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas.' });
  }

  try {
    const result = await httpsRequest(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      { headers: { 'X-Master-Key': KEY } }
    );
    if (result.status !== 200) {
      return res.status(result.status).json({ error: `JSONBin retornou ${result.status}` });
    }
    const json = JSON.parse(result.body);
    return res.status(200).json(json.record || {});
  } catch (err) {
    return res.status(502).json({ error: 'Falha ao conectar com o JSONBin.', detail: err.message });
  }
};
