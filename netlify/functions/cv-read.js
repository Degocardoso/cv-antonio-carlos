// netlify/functions/cv-read.js
// Lê os dados do JSONBin — as credenciais ficam no servidor, nunca no HTML
//
// Variáveis de ambiente (configurar no Netlify → Environment variables):
//   JSONBIN_BIN_ID       → ID do bin no JSONBin
//   JSONBIN_MASTER_KEY   → Master Key do JSONBin

const https = require('https');

// Helper: faz requisição HTTPS sem depender do fetch nativo
// (compatível com qualquer versão do Node)
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY    = process.env.JSONBIN_MASTER_KEY;

  if (!BIN_ID || !KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Variáveis de ambiente não configuradas.',
        hint: 'Configure JSONBIN_BIN_ID e JSONBIN_MASTER_KEY no painel do Netlify → Environment variables.',
      }),
    };
  }

  try {
    const res = await httpsRequest(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      { headers: { 'X-Master-Key': KEY } }
    );

    if (res.status !== 200) {
      return {
        statusCode: res.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: `JSONBin retornou ${res.status}`, detail: res.body }),
      };
    }

    const json = JSON.parse(res.body);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(json.record || {}),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Falha ao conectar com o JSONBin.', detail: err.message }),
    };
  }
};
