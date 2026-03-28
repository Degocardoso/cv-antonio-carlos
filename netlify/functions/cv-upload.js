// netlify/functions/cv-upload.js
// Recebe imagem em base64 e faz upload para o Cloudinary
// SENHA VEM NO BODY (não no header) — evita strip pelo Netlify em requisições POST
//
// Variáveis de ambiente necessárias:
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
//   CV_ADMIN_PASSWORD

const https = require('https');
const crypto = require('crypto');

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'POST',
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

function signCloudinary(params, apiSecret) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&') + apiSecret;
  return crypto.createHash('sha256').update(str).digest('hex');
}

function buildMultipart(fields, boundary) {
  let body = '';
  for (const [key, value] of Object.entries(fields)) {
    body += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
  }
  body += `--${boundary}--\r\n`;
  return body;
}

function strip(s) {
  return (s || '').replace(/[\r\n\t\u200b\u00a0\ufeff]/g, '').trim();
}

exports.handler = async (event) => {
  const cors = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Método não permitido.' }) };

  // Check env vars
  const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
  const KEY   = process.env.CLOUDINARY_API_KEY;
  const SEC   = process.env.CLOUDINARY_API_SECRET;
  const PWD   = process.env.CV_ADMIN_PASSWORD;

  if (!CLOUD || !KEY || !SEC || !PWD) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'Variáveis de ambiente faltando.', missing: { CLOUD: !CLOUD, KEY: !KEY, SEC: !SEC, PWD: !PWD } }) };
  }

  // Parse body
  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Body JSON inválido.' }) }; }

  // Validate password from body (not header — avoids Netlify header stripping)
  const submitted = strip(body.password || '');
  const expected  = strip(PWD);

  if (!submitted) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Campo password ausente no body.', hint: 'Sessão expirada — faça logout e login novamente.' }) };
  }
  if (submitted !== expected) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Senha incorreta.', submitted_len: submitted.length, expected_len: expected.length }) };
  }

  const { file, projectIndex } = body;
  if (!file) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Campo file ausente.' }) };

  // Upload to Cloudinary
  const folder    = 'cv-portfolio';
  const timestamp = Math.round(Date.now() / 1000);
  const publicId  = `cv-portfolio/proj-${projectIndex !== undefined ? projectIndex : 'x'}-${timestamp}`;
  const signature = signCloudinary({ folder, public_id: publicId, timestamp }, SEC);

  const boundary = 'CvBoundary' + timestamp;
  const formBody  = buildMultipart({ file, api_key: KEY, timestamp: String(timestamp), folder, public_id: publicId, signature }, boundary);

  try {
    const res  = await httpsRequest(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': Buffer.byteLength(formBody, 'utf8') },
      body: formBody,
    });

    const json = JSON.parse(res.body);
    if (res.status !== 200) return { statusCode: res.status, headers: cors, body: JSON.stringify({ error: 'Cloudinary recusou.', detail: json.error }) };

    return { statusCode: 200, headers: cors, body: JSON.stringify({ url: json.secure_url, publicId: json.public_id }) };
  } catch (err) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: 'Falha ao conectar com Cloudinary.', detail: err.message }) };
  }
};
