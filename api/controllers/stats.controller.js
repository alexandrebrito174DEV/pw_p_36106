async function obterEstatisticasGerais(req, res, next) {
  try {
    res.json({ message: "Estatísticas gerais OK" });
  } catch (erro) {
    next(erro);
  }
}

async function obterEstatisticasPorGenero(req, res, next) {
  try {
    res.json({ message: "Estatísticas por género OK" });
  } catch (erro) {
    next(erro);
  }
}

module.exports = {
  obterEstatisticasGerais,
  obterEstatisticasPorGenero
};