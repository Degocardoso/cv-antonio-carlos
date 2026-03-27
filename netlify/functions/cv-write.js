// netlify/functions/cv-write.js
// Valida senha e grava no JSONBin — credenciais nunca saem do servidor
//
// Variáveis de ambiente (configurar no Netlify → Environment variables):
//   JSONBIN_BIN_ID       → ID do bin no JSONBin
//   JSONBIN_MASTER_KEY   → Master Key do JSONBin
//   CV_ADMIN_PASSWORD    → Senha do painel admin

const https = require('https');

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

  const BIN_ID   = process.env.JSONBIN_BIN_ID;
  const KEY      = process.env.JSONBIN_MASTER_KEY;
  const PASSWORD = process.env.CV_ADMIN_PASSWORD;

  if (!BIN_ID || !KEY || !PASSWORD) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Variáveis de ambiente não configuradas.',
        hint: 'Configure JSONBIN_BIN_ID, JSONBIN_MASTER_KEY e CV_ADMIN_PASSWORD no painel do Netlify.',
      }),
    };
  }

  // Valida senha enviada no header X-Admin-Password
  const submitted = (event.headers['x-admin-password'] || '').trim();
  if (!submitted || submitted !== PASSWORD) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Senha incorreta ou não informada.' }),
    };
  }

  // GET — apenas valida a senha (usado no login do admin)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true, message: 'Senha válida.' }),
    };
  }

  // POST — grava os dados no JSONBin
  if (event.httpMethod === 'POST') {
    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Body inválido — JSON esperado.' }),
      };
    }

    try {
      const body = JSON.stringify(data);
      const res = await httpsRequest(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'X-Master-Key': KEY,
          },
          body,
        }
      );

      if (res.status !== 200) {
        return {
          statusCode: res.status,
          headers: corsHeaders,
          body: JSON.stringify({ error: `JSONBin retornou ${res.status}`, detail: res.body }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true }),
      };
    } catch (err) {
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Falha ao gravar no JSONBin.', detail: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Método não permitido.' }),
  };
};
