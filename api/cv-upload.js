// api/cv-upload.js — Vercel Serverless Function
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

function strip(s) { return (s || '').replace(/[\r\n\t\u200b\u00a0\ufeff]/g, '').trim(); }

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
  const KEY   = process.env.CLOUDINARY_API_KEY;
  const SEC   = process.env.CLOUDINARY_API_SECRET;
  const PWD   = process.env.CV_ADMIN_PASSWORD;

  if (!CLOUD || !KEY || !SEC || !PWD) {
    return res.status(500).json({ error: 'Variáveis de ambiente faltando.' });
  }

  const body = req.body;
  const submitted = strip(body?.password || '');
  const expected  = strip(PWD);

  if (!submitted || submitted !== expected) {
    return res.status(401).json({ error: 'Senha incorreta.', hint: 'Faça logout e login novamente.' });
  }

  const { file, projectIndex } = body;
  if (!file) return res.status(400).json({ error: 'Campo file ausente.' });

  const folder    = 'cv-portfolio';
  const timestamp = Math.round(Date.now() / 1000);
  const publicId  = `cv-portfolio/proj-${projectIndex !== undefined ? projectIndex : 'x'}-${timestamp}`;
  const signature = signCloudinary({ folder, public_id: publicId, timestamp }, SEC);

  const boundary = 'CvBoundary' + timestamp;
  const formBody = buildMultipart({
    file, api_key: KEY, timestamp: String(timestamp),
    folder, public_id: publicId, signature
  }, boundary);

  try {
    const result = await httpsRequest(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formBody, 'utf8')
      },
      body: formBody,
    });

    const json = JSON.parse(result.body);
    if (result.status !== 200) {
      return res.status(result.status).json({ error: 'Cloudinary recusou.', detail: json.error });
    }
    return res.status(200).json({ url: json.secure_url, publicId: json.public_id });
  } catch (err) {
    return res.status(502).json({ error: 'Falha ao conectar com Cloudinary.', detail: err.message });
  }
};
