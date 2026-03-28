// netlify/functions/cv-ping.js
// Diagnóstico — acesse /.netlify/functions/cv-ping
const { stripPassword } = require('./lib/http');

exports.handler = async (event) => {
  const PASSWORD = process.env.CV_ADMIN_PASSWORD || '';

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

  return {
    statusCode: allOk ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    },
    body: JSON.stringify({
      status: allOk ? 'OK' : 'ERRO — variáveis faltando',
      variables: vars,
      password_test: pwdTest || 'Envie o header X-Admin-Password para testar',
    }, null, 2),
  };
};
