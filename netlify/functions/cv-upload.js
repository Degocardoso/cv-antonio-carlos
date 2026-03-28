// netlify/functions/cv-upload.js
// Upload de imagem para Cloudinary
const crypto = require('crypto');
const { httpsRequest, preflight, respond, stripPassword } = require('./lib/http');

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

exports.handler = async (event) => {
  const cors = preflight(event);
  if (cors) return cors;

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Método não permitido.' });
  }

  const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
  const KEY   = process.env.CLOUDINARY_API_KEY;
  const SEC   = process.env.CLOUDINARY_API_SECRET;
  const PWD   = process.env.CV_ADMIN_PASSWORD;

  if (!CLOUD || !KEY || !SEC || !PWD) {
    return respond(500, { error: 'Variáveis de ambiente faltando.' });
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return respond(400, { error: 'Body JSON inválido.' }); }

  const submitted = stripPassword(body.password || '');
  const expected  = stripPassword(PWD);

  if (!submitted || submitted !== expected) {
    return respond(401, { error: 'Senha incorreta.', hint: 'Faça logout e login novamente.' });
  }

  const { file, projectIndex } = body;
  if (!file) return respond(400, { error: 'Campo file ausente.' });

  const folder    = 'cv-portfolio';
  const timestamp = Math.round(Date.now() / 1000);
  const publicId  = `cv-portfolio/proj-${projectIndex !== undefined ? projectIndex : 'x'}-${timestamp}`;
  const signature = signCloudinary({ folder, public_id: publicId, timestamp }, SEC);

  const boundary  = 'CvBoundary' + timestamp;
  const formBody  = buildMultipart({
    file, api_key: KEY, timestamp: String(timestamp),
    folder, public_id: publicId, signature
  }, boundary);

  try {
    const res = await httpsRequest(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formBody, 'utf8')
      },
      body: formBody,
    });

    const json = JSON.parse(res.body);
    if (res.status !== 200) {
      return respond(res.status, { error: 'Cloudinary recusou.', detail: json.error });
    }
    return respond(200, { url: json.secure_url, publicId: json.public_id });
  } catch (err) {
    return respond(502, { error: 'Falha ao conectar com Cloudinary.', detail: err.message });
  }
};
