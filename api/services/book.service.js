const prisma = require("../prisma/prismaClient");

const listarLivros = async (query) => {
  let pagina = parseInt(query.page) || 1;
  let limite = parseInt(query.limit) || 10;
  const ordenar = query.sort === "year" ? "year" : "title";

  if (pagina < 1){
    pagina = 1;
  }

  if (limite < 1){
    limite = 10;
  }

  return prisma.book.findMany({
    skip: (pagina - 1) * limite,
    take: limite,
    orderBy: { [ordenar]: "asc" },
    include: { author: true }
  });
};

const procurarLivroPorId = async (id) => {
  return prisma.book.findUnique({
    where: { id },
    include: { author: true }
  });
};

const criarLivro = async (dados) => {
  const autor = await prisma.author.findUnique({
    where: { id: dados.authorId }
  });

  if (!autor){
    return "AUTOR_NAO_ENCONTRADO";
  }

  return prisma.book.create({
    data: {
      title: dados.title,
      year: dados.year,
      genre: dados.genre,
      available: dados.available ?? true,
      authorId: dados.authorId
    },
    include: { author: true }
  });
};

const atualizarLivro = async (id, dados) => {
  const livro = await prisma.book.findUnique({
    where: { id }
  });

  if (!livro){
    return "NAO_ENCONTRADO";
  }

  if (dados.authorId !== undefined){
    const autor = await prisma.author.findUnique({
      where: { id: dados.authorId }
    });

    if (!autor){
      return "AUTOR_NAO_ENCONTRADO";
    }
  }

  return prisma.book.update({
    where: { id },
    data: {
      title: dados.title,
      year: dados.year,
      genre: dados.genre,
      available: dados.available,
      authorId: dados.authorId
    },
    include: { author: true }
  });
};

const apagarLivro = async (id) => {
  const livro = await prisma.book.findUnique({
    where: { id }
  });

  if (!livro){
    return "NAO_ENCONTRADO";
  }

  await prisma.book.delete({
    where: { id }
  });

  return true;
};

const pesquisarLivros = async (titulo) => {
  return prisma.book.findMany({
    where: {
      title: {
        contains: titulo,
        mode: "insensitive"
      }
    },
    include: { author: true },
    orderBy: { title: "asc" }
  });
};

module.exports = {
  listarLivros,
  procurarLivroPorId,
  criarLivro,
  atualizarLivro,
  apagarLivro,
  pesquisarLivros
};