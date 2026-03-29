// api/cv-ping.js — Vercel Serverless Function
// Diagnóstico + Contador de visitas
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
  const KEY = process.env.JSONBIN_MASTER_KEY;
  const PASSWORD = process.env.CV_ADMIN_PASSWORD || '';

  // POST = track visit
  if (req.method === 'POST') {
    if (!BIN_ID || !KEY) return res.status(200).json({ ok: true, visits: 0 });
    try {
      const readRes = await httpsRequest(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        { headers: { 'X-Master-Key': KEY } }
      );
      if (readRes.status !== 200) return res.status(200).json({ ok: true, visits: 0 });
      const json = JSON.parse(readRes.body);
      const record = json.record || {};
      record.visitCount = (record.visitCount || 0) + 1;
      record.lastVisit = new Date().toISOString();
      await httpsRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
        body: JSON.stringify(record)
      });
      return res.status(200).json({ ok: true, visits: record.visitCount });
    } catch (e) {
      return res.status(200).json({ ok: true, visits: 0 });
    }
  }

  // GET = diagnostics
  const vars = {
    JSONBIN_BIN_ID: !!BIN_ID,
    JSONBIN_MASTER_KEY: !!KEY,
    CV_ADMIN_PASSWORD: !!PASSWORD,
    CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    NODE_VERSION: process.version,
  };

  const allOk = vars.JSONBIN_BIN_ID && vars.JSONBIN_MASTER_KEY && vars.CV_ADMIN_PASSWORD;

  let visitCount = 0;
  if (BIN_ID && KEY) {
    try {
      const readRes = await httpsRequest(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        { headers: { 'X-Master-Key': KEY } }
      );
      if (readRes.status === 200) {
        const json = JSON.parse(readRes.body);
        visitCount = json.record?.visitCount || 0;
      }
    } catch (e) { /* silent */ }
  }

  return res.status(allOk ? 200 : 500).json({
    status: allOk ? 'OK' : 'ERRO — variáveis faltando',
    variables: vars,
    visitCount,
  });
};
