// netlify/functions/cv-upload.js
// Recebe uma imagem em base64 do admin e faz upload para o Cloudinary
// As credenciais ficam no servidor — nunca expostas no HTML
//
// Variáveis de ambiente necessárias no Netlify:
//   CLOUDINARY_CLOUD_NAME   → nome do cloud (ex: "meu-cloud")
//   CLOUDINARY_API_KEY      → API Key do Cloudinary
//   CLOUDINARY_API_SECRET   → API Secret do Cloudinary
//   CV_ADMIN_PASSWORD       → mesma senha do admin (valida que só o dono pode fazer upload)

const https = require('https');
const crypto = require('crypto');

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'POST',
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

// Gera assinatura Cloudinary para upload autenticado
function signCloudinary(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const str = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + apiSecret;
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Encode multipart/form-data manualmente (sem dependências)
function buildMultipart(fields, boundary) {
  let body = '';
  for (const [key, value] of Object.entries(fields)) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    body += `${value}\r\n`;
  }
  body += `--${boundary}--\r\n`;
  return body;
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Método não permitido.' }) };
  }

  // Valida variáveis de ambiente
  const CLOUD_NAME  = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY     = process.env.CLOUDINARY_API_KEY;
  const API_SECRET  = process.env.CLOUDINARY_API_SECRET;
  const PASSWORD    = process.env.CV_ADMIN_PASSWORD;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET || !PASSWORD) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Variáveis de ambiente não configuradas.',
        hint: 'Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET no Netlify.',
      }),
    };
  }

  // Valida senha do admin
  const submittedPwd = (event.headers['x-admin-password'] || '').trim();
  if (!submittedPwd || submittedPwd !== PASSWORD) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Não autorizado.' }) };
  }

  // Lê body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Body inválido.' }) };
  }

  const { file, folder = 'cv-portfolio', projectIndex } = body;
  if (!file) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Campo "file" (base64) obrigatório.' }) };
  }

  // Gera assinatura para upload autenticado
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `cv-portfolio/projeto-${projectIndex !== undefined ? projectIndex : 'x'}-${timestamp}`;
  const signParams = { folder, public_id: publicId, timestamp };
  const signature = signCloudinary(signParams, API_SECRET);

  // Monta formulário multipart
  const boundary = '----CloudinaryBoundary' + timestamp;
  const formFields = {
    file,
    api_key: API_KEY,
    timestamp: String(timestamp),
    folder,
    public_id: publicId,
    signature,
  };

  const formBody = buildMultipart(formFields, boundary);
  const contentType = `multipart/form-data; boundary=${boundary}`;

  try {
    const res = await httpsRequest(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'Content-Length': Buffer.byteLength(formBody, 'utf8'),
        },
        body: formBody,
      }
    );

    const json = JSON.parse(res.body);

    if (res.status !== 200) {
      return {
        statusCode: res.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Erro no Cloudinary.', detail: json }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: json.secure_url, publicId: json.public_id }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Falha ao conectar com o Cloudinary.', detail: err.message }),
    };
  }
};
