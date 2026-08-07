// netlify/functions/cv-ping.js
// Diagnóstico + Contador de visitas
const { stripPassword } = require('./lib/http');

// In-memory visit count (resets on cold start) + JSONBin persistence
let visitCount = null;

async function getVisitCount() {
  if (visitCount !== null) return visitCount;
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY = process.env.JSONBIN_MASTER_KEY;
  if (!BIN_ID || !KEY) { visitCount = 0; return 0; }
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': KEY }
    });
    if (res.ok) {
      const data = await res.json();
      visitCount = data.record?.visitCount || 0;
    } else {
      visitCount = 0;
    }
  } catch (e) { visitCount = 0; }
  return visitCount;
}

async function incrementVisit() {
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY = process.env.JSONBIN_MASTER_KEY;
  if (!BIN_ID || !KEY) return;
  try {
    // Read current data
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': KEY }
    });
    if (!res.ok) return;
    const data = await res.json();
    const record = data.record || {};
    record.visitCount = (record.visitCount || 0) + 1;
    record.lastVisit = new Date().toISOString();
    visitCount = record.visitCount;
    // Write back
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Master-Key': KEY },
      body: JSON.stringify(record)
    });
  } catch (e) { /* silent */ }
}

/**
 * Testa a conexão real com o JSONBin.
 * Só checar se a variável existe não diagnostica nada: a chave pode
 * existir e mesmo assim ser inválida, ser Access Key (só leitura) ou
 * apontar para um bin de outra conta.
 */
async function testJsonbin() {
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY = process.env.JSONBIN_MASTER_KEY;
  if (!BIN_ID || !KEY) return { ok: false, causa: 'JSONBIN_BIN_ID ou JSONBIN_MASTER_KEY ausente' };

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': KEY }
    });
    const texto = await res.text();
    const causas = {
      401: 'Chave rejeitada — confira a JSONBIN_MASTER_KEY.',
      403: 'Acesso negado — a chave é uma Access Key (só leitura), o bin pertence a outra conta, ou a cota do plano estourou.',
      404: 'Bin não encontrado — confira o JSONBIN_BIN_ID.',
      429: 'Limite de requisições atingido no JSONBin.'
    };
    return {
      ok: res.ok,
      leitura_status: res.status,
      causa: res.ok ? undefined : (causas[res.status] || 'Resposta inesperada do JSONBin.'),
      resposta_jsonbin: res.ok ? undefined : texto.slice(0, 300),
      tamanho_registro: res.ok ? texto.length + ' bytes' : undefined
    };
  } catch (e) {
    return { ok: false, causa: 'Falha de rede ao falar com o JSONBin.', detalhe: e.message };
  }
}

exports.handler = async (event) => {
  const PASSWORD = process.env.CV_ADMIN_PASSWORD || '';

  // POST = track visit
  if (event.httpMethod === 'POST') {
    await incrementVisit();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password' },
      body: JSON.stringify({ ok: true, visits: visitCount })
    };
  }

  // OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' },
      body: ''
    };
  }

  // GET = diagnostics (original behavior)
  const vars = {
    JSONBIN_BIN_ID:        !!process.env.JSONBIN_BIN_ID,
    JSONBIN_MASTER_KEY:    !!process.env.JSONBIN_MASTER_KEY,
    CV_ADMIN_PASSWORD:     !!PASSWORD,
    CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:    !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    NODE_VERSION:          process.version,
  };

  const allOk = vars.JSONBIN_BIN_ID && vars.JSONBIN_MASTER_KEY && vars.CV_ADMIN_PASSWORD;

  const submitted = stripPassword(
    event.headers['x-admin-password'] || event.headers['X-Admin-Password'] || ''
  );

  let pwdTest = null;
  if (submitted) {
    const clean = stripPassword(PASSWORD);
    pwdTest = {
      submitted_length: submitted.length,
      expected_length: clean.length,
      match: submitted === clean,
    };
  }

  const count = await getVisitCount();
  const jsonbin = await testJsonbin();

  return {
    statusCode: (allOk && jsonbin.ok) ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    },
    body: JSON.stringify({
      status: !allOk ? 'ERRO — variáveis faltando'
            : jsonbin.ok ? 'OK'
            : 'ERRO — variáveis presentes, mas o JSONBin recusou',
      variables: vars,
      jsonbin,
      visitCount: count,
      password_test: pwdTest || 'Envie o header X-Admin-Password para testar',
    }, null, 2),
  };
};
