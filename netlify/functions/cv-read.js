// netlify/functions/cv-read.js
// Lê os dados do JSONBin
const { httpsRequest, preflight, respond } = require('./lib/http');

exports.handler = async (event) => {
  const cors = preflight(event);
  if (cors) return cors;

  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY    = process.env.JSONBIN_MASTER_KEY;

  if (!BIN_ID || !KEY) {
    return respond(500, {
      error: 'Variáveis de ambiente não configuradas.',
      hint: 'Configure JSONBIN_BIN_ID e JSONBIN_MASTER_KEY.',
    });
  }

  try {
    const res = await httpsRequest(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      { headers: { 'X-Master-Key': KEY } }
    );

    if (res.status !== 200) {
      return respond(res.status, { error: `JSONBin retornou ${res.status}`, detail: res.body });
    }

    const json = JSON.parse(res.body);
    return respond(200, json.record || {});
  } catch (err) {
    return respond(502, { error: 'Falha ao conectar com o JSONBin.', detail: err.message });
  }
};
