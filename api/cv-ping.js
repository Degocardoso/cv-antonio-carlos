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
      // setEncoding usa StringDecoder: sem ele, um caractere UTF-8 multibyte
      // partido entre dois chunks vira � (ex.: "Graduação" -> "Gradua��ão").
      res.setEncoding('utf8');
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
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Master-Key': KEY },
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

  /* Testa a conexão real: só checar se a variável existe não diagnostica
     nada — a chave pode existir e ainda assim ser inválida, ser Access Key
     (só leitura) ou apontar para um bin de outra conta. */
  let visitCount = 0;
  let jsonbin = { ok: false, causa: 'JSONBIN_BIN_ID ou JSONBIN_MASTER_KEY ausente' };
  if (BIN_ID && KEY) {
    const causas = {
      401: 'Chave rejeitada — confira a JSONBIN_MASTER_KEY.',
      403: 'Acesso negado — a chave é uma Access Key (só leitura), o bin pertence a outra conta, ou a cota do plano estourou.',
      404: 'Bin não encontrado — confira o JSONBIN_BIN_ID.',
      429: 'Limite de requisições atingido no JSONBin.'
    };
    try {
      const readRes = await httpsRequest(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        { headers: { 'X-Master-Key': KEY } }
      );
      const ok = readRes.status === 200;
      if (ok) {
        const json = JSON.parse(readRes.body);
        visitCount = json.record?.visitCount || 0;
      }
      jsonbin = {
        ok,
        leitura_status: readRes.status,
        causa: ok ? undefined : (causas[readRes.status] || 'Resposta inesperada do JSONBin.'),
        resposta_jsonbin: ok ? undefined : String(readRes.body).slice(0, 300),
        tamanho_registro: ok ? readRes.body.length + ' bytes' : undefined
      };
    } catch (e) {
      jsonbin = { ok: false, causa: 'Falha de rede ao falar com o JSONBin.', detalhe: e.message };
    }
  }

  return res.status(allOk && jsonbin.ok ? 200 : 500).json({
    status: !allOk ? 'ERRO — variáveis faltando'
          : jsonbin.ok ? 'OK'
          : 'ERRO — variáveis presentes, mas o JSONBin recusou',
    variables: vars,
    jsonbin,
    visitCount,
  });
};
