module.exports = (err, req, res, next) => {
  console.error("ERRO REAL:", err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
};

//indica os erros