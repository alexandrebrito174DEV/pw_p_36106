module.exports = (erro, req, res, next) => {
  console.error(erro);

  return res.status(erro.status || 500).json({
    erro: erro.message || "Erro interno do servidor."
  });
};