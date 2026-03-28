// netlify/functions/cv-write.js
// Valida senha e grava no JSONBin
const { httpsRequest, preflight, respond, stripPassword } = require('./lib/http');

exports.handler = async (event) => {
  const cors = preflight(event);
  if (cors) return cors;

  const BIN_ID   = process.env.JSONBIN_BIN_ID;
  const KEY      = process.env.JSONBIN_MASTER_KEY;
  const PASSWORD = process.env.CV_ADMIN_PASSWORD;

  if (!BIN_ID || !KEY || !PASSWORD) {
    return respond(500, { error: 'Variáveis de ambiente não configuradas.' });
  }

  const submitted = stripPassword(
    event.headers['x-admin-password'] || event.headers['X-Admin-Password'] || ''
  );
  const expected = stripPassword(PASSWORD);

  if (!submitted || submitted !== expected) {
    return respond(401, { error: 'Senha incorreta ou não informada.' });
  }

  // GET — valida senha (login)
  if (event.httpMethod === 'GET') {
    return respond(200, { ok: true, message: 'Senha válida.' });
  }

  // POST — grava dados
  if (event.httpMethod === 'POST') {
    let data;
    try { data = JSON.parse(event.body); }
    catch { return respond(400, { error: 'Body inválido — JSON esperado.' }); }

    try {
      const body = JSON.stringify(data);
      const res = await httpsRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'X-Master-Key': KEY,
        },
        body,
      });

      if (res.status !== 200) {
        return respond(res.status, { error: `JSONBin retornou ${res.status}`, detail: res.body });
      }
      return respond(200, { ok: true });
    } catch (err) {
      return respond(502, { error: 'Falha ao gravar no JSONBin.', detail: err.message });
    }
  }

  return respond(405, { error: 'Método não permitido.' });
};
