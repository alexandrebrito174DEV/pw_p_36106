const estatisticasService = require("../services/stats.service");

const obterEstatisticasGerais = async (req, res, next) => {
  try{
    const estatisticas = await estatisticasService.obterEstatisticasGerais();
    return res.status(200).json(estatisticas);
  }
  catch (erro){
    next(erro);
  }
};

const obterEstatisticasPorGenero = async (req, res, next) => {
  try{
    const estatisticas = await estatisticasService.obterEstatisticasPorGenero();
    return res.status(200).json(estatisticas);
  }
  catch (erro){
    next(erro);
  }
};

module.exports = {
  obterEstatisticasGerais,
  obterEstatisticasPorGenero
};