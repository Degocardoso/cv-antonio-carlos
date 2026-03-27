// netlify/functions/cv-ping.js
// Função de diagnóstico — acesse /.netlify/functions/cv-ping no browser
// Mostra quais variáveis de ambiente estão configuradas (sem revelar os valores)
exports.handler = async () => {
  const vars = {
    JSONBIN_BIN_ID:       !!process.env.JSONBIN_BIN_ID,
    JSONBIN_MASTER_KEY:   !!process.env.JSONBIN_MASTER_KEY,
    CV_ADMIN_PASSWORD:    !!process.env.CV_ADMIN_PASSWORD,
    NODE_VERSION:         process.version,
  };

  const allOk = vars.JSONBIN_BIN_ID && vars.JSONBIN_MASTER_KEY && vars.CV_ADMIN_PASSWORD;

  return {
    statusCode: allOk ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: allOk ? 'OK — todas as variáveis configuradas' : 'ERRO — variáveis faltando',
      variables: vars,
    }, null, 2),
  };
};
