// netlify/functions/cv-write.js
// Valida senha e grava no JSONBin — credenciais nunca saem do servidor
// Variáveis de ambiente necessárias no Netlify:
//   JSONBIN_BIN_ID
//   JSONBIN_MASTER_KEY
//   CV_ADMIN_PASSWORD   ← senha do painel admin (texto simples, seguro no vault da Netlify)

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const BIN_ID   = process.env.JSONBIN_BIN_ID;
  const KEY      = process.env.JSONBIN_MASTER_KEY;
  const PASSWORD = process.env.CV_ADMIN_PASSWORD;

  if (!BIN_ID || !KEY || !PASSWORD) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Variáveis de ambiente não configuradas no Netlify.' }),
    };
  }

  // Valida senha enviada no header
  const submitted = (event.headers['x-admin-password'] || '').trim();
  if (submitted !== PASSWORD) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Senha incorreta.' }) };
  }

  // GET — apenas valida a senha (usado no login do admin)
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // POST — grava os dados no JSONBin
  if (event.httpMethod === 'POST') {
    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON inválido.' }) };
    }

    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        return { statusCode: res.status, headers, body: JSON.stringify({ error: `JSONBin retornou ${res.status}` }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido.' }) };
};
