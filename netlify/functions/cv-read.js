// netlify/functions/cv-read.js
// Lê os dados do JSONBin — sem credenciais no HTML público
// Variáveis de ambiente necessárias no Netlify:
//   JSONBIN_BIN_ID
//   JSONBIN_MASTER_KEY

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY    = process.env.JSONBIN_MASTER_KEY;

  if (!BIN_ID || !KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Variáveis de ambiente não configuradas no Netlify.' }),
    };
  }

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': KEY },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { statusCode: res.status, headers, body: JSON.stringify({ error: `JSONBin retornou ${res.status}` }) };
    }

    const json = await res.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(json.record || {}),
    };
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: err.message }) };
  }
};
