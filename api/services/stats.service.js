const prisma = require("../prisma/prismaClient");

const obterEstatisticasGerais = async () => {
  const totalLivros = await prisma.book.count();
  const totalAutores = await prisma.author.count();
  const livrosDisponiveis = await prisma.book.count({
    where: { available: true }
  });
  const livrosIndisponiveis = await prisma.book.count({
    where: { available: false }
  });

  return {
    totalLivros,
    totalAutores,
    livrosDisponiveis,
    livrosIndisponiveis
  };
};

const obterEstatisticasPorGenero = async () => {
  const resultado = await prisma.book.groupBy({
    by: ["genre"],
    _count: {
      genre: true
    }
  });

  const estatisticas = {};

  for (let i = 0; i < resultado.length; i++) {
    estatisticas[resultado[i].genre] = resultado[i]._count.genre;
  }

  return estatisticas;
};

module.exports = {
  obterEstatisticasGerais,
  obterEstatisticasPorGenero
};
  
  